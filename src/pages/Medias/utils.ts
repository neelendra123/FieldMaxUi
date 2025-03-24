import { GeoLocationSensorState } from 'react-use/lib/useGeolocation';
//@ts-ignore
import VideoToThumb from 'video-thumb-generator';

import { CommonPerms } from '../../constants';
import { IModuleKind } from '../../interfaces';

import { generateDynamicPath, toLocaleDTString } from '../../utils/common';

import { IInvite } from '../Invites/interfaces';

import { IUserIdPopulated, IUserListAllRes } from '../Users/interfaces';
import { getUserTypes, formatUserName } from '../Users/utils';

import JobRoutes from '../Jobs/routes';

import * as interfaces from './interfaces';

export const noop = () => {};

export const generateDefaultSubMediaPerm = (
  defaultValue = CommonPerms.none
): interfaces.ISubMediaUserPerms => {
  return {
    parent: defaultValue,
    base: defaultValue,
    comments: defaultValue,
    members: defaultValue,
  };
};

export const generateDefaultMedia = (
  kind: interfaces.IMediaKind,
  jobId: string = '',
  mediaId: string = '',
  subKind: interfaces.IPhotoSubKinds | undefined = undefined,
  currentUserPerm: Record<string, interfaces.ISubMediaUserPerms> = {},
  subMediaId: string | undefined = undefined
) => {
  let medias: interfaces.IJobSubMedia[] = [];
  if (
    kind === interfaces.IMediaKind.JobVideo ||
    kind === interfaces.IMediaKind.JobDoc
  ) {
    medias = [{ ...generateDefaultSubMedia() }];
  } else {
    if (subKind === interfaces.IPhotoSubKinds.Simple) {
      medias = [
        {
          ...generateDefaultSubMedia(
            interfaces.IPhotoSubMediaKinds.Simple,
            subMediaId
          ),
        },
      ];
    } else {
      medias = [
        {
          ...generateDefaultSubMedia(
            interfaces.IPhotoSubMediaKinds.Before,
            subMediaId
          ),
        },
        {
          ...generateDefaultSubMedia(
            interfaces.IPhotoSubMediaKinds.After,
            subMediaId
          ),
        },
      ];
    }
  }

  const DefaultMediaDetails: interfaces.IMediaPopulatedTypes = {
    id: mediaId,
    jobId,
    //@ts-ignore
    kind,
    name: '',
    tags: [],
    primaryUserId: '',
    currentUserPerm,
    creatorId: {
      id: '',
      name: '',
      firstName: '',
      lastName: '',
      email: '',
    },
    medias,
    createdAt: '',
    updatedAt: '',
    isActive: true,
    isDeleted: false,
  };

  return DefaultMediaDetails;
};

export const generateDefaultSubMedia = (
  subKind: interfaces.IPhotoSubMediaKinds | undefined = undefined,
  subMediaId: string = ''
): interfaces.IJobSubMedia => {
  return {
    id: subMediaId,
    name: '',
    tags: [],

    subKind,

    media: '',
    mediaURL: '',

    users: [],

    createdAt: '',
    updatedAt: '',
  };
};

export const parsePopulatedMedia = (
  media: interfaces.IMediaPopulatedTypes,
  user: {
    userId: string;
    baseUserType: number;
    accountUserType: number;
  }
) => {
  const { medias } = media;

  // Adding default Media Permissions of current user
  let currentUserPerm: Record<string, interfaces.ISubMediaUserPerms> = {};

  //  Setting user name to creatorId
  media.creatorId.name = formatUserName(
    media.creatorId.firstName,
    media.creatorId.lastName
  );

  //Sub Medias Loop
  medias.forEach((media) => {
    //  Setting Default Value for each media to none
    currentUserPerm = {
      ...currentUserPerm,
      [media.id]: generateDefaultSubMediaPerm(CommonPerms.none),
    };

    const currentUserType = getUserTypes(
      user.baseUserType,
      user.accountUserType
    );
    if (
      currentUserType.isSuperAdmin ||
      currentUserType.isAdmin ||
      currentUserType.isOwner
    ) {
      //  If super admin or admin or owner then adding all perm to current user -> Media Perms
      currentUserPerm = {
        ...currentUserPerm,
        [media.id]: generateDefaultSubMediaPerm(CommonPerms.all),
      };
    } else {
      media.users.forEach((mediaUser) => {
        //This is ignored because the user of medias may or may not be populated

        //@ts-ignore
        let currentUserId = (mediaUser.userId?.['id'] ||
          mediaUser.userId) as string;

        if (currentUserId === user.userId) {
          currentUserPerm = {
            ...currentUserPerm,
            [media.id]: mediaUser.permissions,
          };
        }
      });
    }
  });

  media.currentUserPerm = currentUserPerm;

  return media;
};

export function fileToDataURL(file: any) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.addEventListener('load', (event: any) => {
      const result = event.target.result;
      // Do something with result
      return resolve(result);
    });
    reader.onerror = function (error) {
      reject(error);
    };
    // reader.addEventListener('progress', (event) => {
    //   if (event.loaded && event.total) {
    //     const percent = Math.round((event.loaded / event.total) * 100);
    //   }
    // });
    reader.readAsDataURL(file);
  });
}

// export function dataURItoBlob(dataURI: string) {
//   var binary = atob(dataURI.split(',')[1]);
//   const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
//   var array = [];
//   for (var i = 0; i < binary.length; i++) {
//     array.push(binary.charCodeAt(i));
//   }
//   return new Blob([new Uint8Array(array)], { type: mimeString });
// }

export const cameraFilterCSSGenerator = (
  blurValue: string,
  brigtnessValue: string,
  filter: string
) => {
  let filterCSS = `blur(${blurValue}px) brightness(${brigtnessValue}%)`;

  if (filter === 'grayscale') {
    filterCSS = `${filterCSS} grayscale(1)`;
  } else if (filter === 'invert') {
    filterCSS = `${filterCSS} invert(1)`;
  } else if (filter === 'sepia') {
    filterCSS = `${filterCSS} sepia(1)`;
  }

  return filterCSS;
};

export const fileGenerateThumb = (file: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const thumb = new VideoToThumb(file);
    thumb
      .load()
      .xy([0, 0])
      .size([480, 360])
      .type('base64')
      .error(reject)
      .done(function (imgs: any) {
        return resolve(imgs[0]);
      });
  });
};

export const fileNameExtractFromURL = (url: string) => {
  const splitted = url.split('/');

  return splitted[splitted.length - 1];
};

export const parseSubMediaUsersPermsForReq = (
  users: interfaces.IAddEditSubMediaUser[]
) => {
  const reqUsers: {
    userId: string;
    primaryUserId: string;
    permissions: interfaces.ISubMediaUserPerms;
  }[] = [];
  users.forEach((user) => {
    if (user.skip) {
      return;
    }
    reqUsers.push({
      userId: user.id,
      primaryUserId: user.primaryUserId,
      permissions: user.permissions,
    });
  });

  return reqUsers;
};

export const videoKindGenerate = (jobId: string | undefined) => {
  return jobId ? interfaces.IMediaKind.JobVideo : interfaces.IMediaKind.Video;
};

export const documentKindGenerate = (jobId: string | undefined) => {
  return jobId ? interfaces.IMediaKind.JobDoc : interfaces.IMediaKind.Doc;
};

export const filterUsersToAddNewMedias = (
  currentUserId: string,
  users: IUserListAllRes[],
  moduleKind: IModuleKind
): interfaces.IAddEditSubMediaUser[] => {
  const accountUsers: interfaces.IAddEditSubMediaUser[] = [];
  const defaultSubMediaPermissions = generateDefaultSubMediaPerm();
  for (let accountUser of users) {
    let skip = false;
    //  Iterating if super admin or admin or owner of the organization
    const userType = getUserTypes(
      accountUser.userType,
      accountUser.accounts[0].userType
    );
    if (
      userType.isSuperAdmin ||
      userType.isAdmin ||
      userType.isOwner ||
      accountUser.id === currentUserId //  Iterating if the current user
    ) {
      skip = true;
    }

    //  Sub Media Permissions
    const parent = defaultSubMediaPermissions.parent;
    const base =
      accountUser.accounts[0].permissions[moduleKind]?.base ??
      defaultSubMediaPermissions.base;

    const comments =
      //@ts-ignore
      accountUser.accounts[0].permissions[moduleKind]?.comments ??
      defaultSubMediaPermissions.comments;
    const members =
      //@ts-ignore
      accountUser.accounts[0].permissions[moduleKind]?.members ??
      defaultSubMediaPermissions.members;

    accountUsers.push({
      id: accountUser.id,
      primaryUserId: accountUser.id,
      name: formatUserName(accountUser.firstName, accountUser.lastName),
      picURL: accountUser.picURL,
      email: accountUser.email,
      selected: true,
      skip,
      expand: true,
      permissions: {
        parent,
        base,
        comments,
        members,
      },
    });
  }

  return accountUsers;
};

export const filterUsersToEditSubMedia = (
  currentUserId: string,
  users: {
    userId: IUserIdPopulated;
    primaryUserId: string;
    permissions: interfaces.ISubMediaUserPerms;
    invite: IInvite;
  }[]
): interfaces.IAddEditSubMediaUser[] => {
  const accountUsers: interfaces.IAddEditSubMediaUser[] = [];

  for (let user of users) {
    const userId = user.userId.id;
    // const inviteStatus = user.invite.status;

    let skip = false;
    // if (
    //   inviteStatus === IInviteStatusKind.rejected ||
    //   inviteStatus === IInviteStatusKind.pending
    // ) {
    //   skip = true;
    // }

    if (
      userId === currentUserId //  Iterating if the current user
    ) {
      skip = true;
    }

    accountUsers.push({
      id: userId,
      primaryUserId: user.primaryUserId,
      name: formatUserName(user.userId.firstName, user.userId.lastName),
      picURL: user.userId.picURL,
      email: user.userId.email,
      selected: true,
      skip,
      expand: true,
      permissions: {
        ...user.permissions,
        //This is for All Checkbox
        parent: CommonPerms.none,
      },
    });
  }

  return accountUsers;
};

export const generateAddEditMediaPaths = (
  basePath: string
): interfaces.IAddEditPhotoPaths => {
  return {
    base: `${basePath}`,
    visibility: `${basePath}?type=Visibility`,
    edit: `${basePath}?type=Edit`,
  };
};

export const ctxDrawGridLines = (ctx: any, width: number, height: number) => {
  for (let x = 0, y = 0; x < width; x += width / 3, y += height / 3) {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
};

export const cameraOptionsPhotoProcess = (
  {
    canvasRef,
    videoPreviewRef,
  }: {
    canvasRef: React.RefObject<any>;
    videoPreviewRef: React.MutableRefObject<any>;
  },
  {
    stampDT,
    stampLocation,
    showGrid,
    location,
  }: {
    stampDT: boolean;
    stampLocation: boolean;
    showGrid: boolean;
    location: GeoLocationSensorState;
  }
) => {
  const width = 1366;
  const height = 768;
  const quality = 0.75;
  const contentType = 'image/jpeg';

  // Get the context object of hidden canvas.
  const ctx = canvasRef.current.getContext('2d');

  canvasRef.current.width = width;
  canvasRef.current.height = height;

  ctx.drawImage(videoPreviewRef.current, 0, 0, width, height);

  //  Adding on stamp Dt
  ctx.filter = 'none';
  ctx.fillStyle = 'white';
  ctx.font = '25px Arial';

  //  Stamping the Date Time
  if (stampDT) {
    let textString = toLocaleDTString(),
      textWidth = ctx.measureText(textString).width;
    ctx.fillText(textString, width / 2 - textWidth / 2, 25);
  }

  //  Stamping the Location
  if (stampLocation && location.latitude && location.longitude) {
    const top = stampDT ? 50 : 25;

    let textString = `${location.latitude.toFixed(
        5
      )}, ${location.longitude.toFixed(5)}`,
      textWidth = ctx.measureText(textString).width;
    ctx.fillText(textString, width / 2 - textWidth / 2, top);
  }

  if (showGrid) {
    //  Showing GridLines
    ctxDrawGridLines(ctx, width, height);
  }

  const media = canvasRef.current.toDataURL(contentType, quality);

  return {
    media,
    contentType,
  };
};

export const photoCameraLevelEffect = function (
  levelCanvasRef: React.RefObject<any>,
  {
    bettaAngle = 90,
    gammaAngle = 0,
  }: {
    bettaAngle?: number;
    gammaAngle?: number;
  }
) {
  // var canvas = document.getElementById('orientCanvasEle');
  if (!levelCanvasRef.current) {
    return;
  }

  const canvas = levelCanvasRef.current;

  //@ts-ignore
  const gctx = canvas.getContext('2d');

  let betta = bettaAngle;

  if (betta > 179) {
    betta = 179;
  } else if (betta < 0) {
    betta = 0;
  }

  if (betta < 90) {
    betta = 179 - betta;
  } else if (betta > 90) {
    betta = 90 - (betta - 90);
  }

  const { width, height } = canvas.getBoundingClientRect();

  gctx.clearRect(0, 0, width, height);

  gctx.setTransform(1, 0, 0, 1, 0, 0);

  //  Rectangle Mover Down and Top
  gctx.beginPath();
  gctx.transform(1, 0, 0, 1, 0, 0);
  gctx.lineWidth = 2;
  gctx.strokeStyle = 'white'; //'#00ff00';
  gctx.rect(37, betta / 2, 25, 10);
  gctx.stroke();

  //  Static Line at center
  gctx.beginPath();
  gctx.strokeStyle = 'white';
  gctx.moveTo(0, height / 2);
  gctx.lineTo(width, height / 2);
  gctx.stroke();

  //  Gamma Angle (Left Right Tilting and showing Angle)
  //  Starting from center of square, then calculate ping for two sides
  if (gammaAngle > 90) {
    gammaAngle = 90;
  }
  if (gammaAngle < -90) {
    gammaAngle = -90;
  }

  const length = width / 2;

  const x1 = height / 2 + Math.cos((Math.PI * gammaAngle) / 180) * length;
  const y1 = width / 2 + Math.sin((Math.PI * gammaAngle) / 180) * length;

  const x2 = height / 2 - Math.cos((Math.PI * gammaAngle) / 180) * length;
  const y2 = width / 2 - Math.sin((Math.PI * gammaAngle) / 180) * length;

  gctx.beginPath();
  gctx.strokeStyle = 'green';
  gctx.moveTo(x1, y1);
  gctx.lineTo(x2, y2);
  gctx.stroke();
};

//  This is for Dynamically creating paths regarding a media in job.
export const mediaPathsGenerator = (
  jobId: string = 'jobId',
  mediaId: string = 'mediaId',
  kind?: interfaces.IMediaKind,
  subMediaId: string = 'subMediaId'
) => {
  const videoDetailsPath = generateDynamicPath(
    JobRoutes.routes.jobVideoDetails.path,
    {
      jobId,
      mediaId,
    }
  );
  const videoAddPath = generateDynamicPath(JobRoutes.routes.jobVideoAdd.path, {
    jobId,
  });
  const videoEditPath = generateDynamicPath(
    JobRoutes.routes.jobVideoEdit.path,
    {
      jobId,
      mediaId,
      subMediaId,
    }
  );

  const photoDetailsPath = generateDynamicPath(
    JobRoutes.routes.jobPhotoDetails.path,
    {
      jobId,
      mediaId,
    }
  );
  const photoAddPath = generateDynamicPath(JobRoutes.routes.jobPhotoAdd.path, {
    jobId,
  });
  const photoEditPath = generateDynamicPath(
    JobRoutes.routes.jobPhotoEdit.path,
    {
      jobId,
      mediaId,
      subMediaId,
    }
  );

  const docDetailsPath = generateDynamicPath(
    JobRoutes.routes.jobDocDetails.path,
    {
      jobId,
      mediaId,
    }
  );
  const docAddPath = generateDynamicPath(JobRoutes.routes.jobDocAdd.path, {
    jobId,
  });
  const docEditPath = generateDynamicPath(JobRoutes.routes.jobDocEdit.path, {
    jobId,
    mediaId,
    subMediaId,
  });

  const mediasVisibilityPath = generateDynamicPath(
    JobRoutes.routes.jobMediasVisibility.path,
    {
      jobId,
    }
  );

  let mediaDetailsPath = '';
  let mediaAddPath = '';
  let mediaEditPath = '';
  switch (kind) {
    case interfaces.IMediaKind.JobPhoto: {
      mediaDetailsPath = photoDetailsPath;
      mediaAddPath = photoAddPath;
      mediaEditPath = photoEditPath;
      break;
    }
    case interfaces.IMediaKind.JobVideo: {
      mediaDetailsPath = videoDetailsPath;
      mediaAddPath = videoAddPath;
      mediaEditPath = videoEditPath;
      break;
    }
    default: {
      mediaDetailsPath = docDetailsPath;
      mediaAddPath = docAddPath;
      mediaEditPath = docEditPath;
    }
  }

  return {
    videoDetailsPath,
    videoAddPath,
    videoEditPath,

    docDetailsPath,
    docAddPath,
    docEditPath,

    photoDetailsPath,
    photoAddPath,
    photoEditPath,

    mediaDetailsPath,
    mediaAddPath,
    mediaEditPath,

    mediasVisibilityPath,
  };
};
