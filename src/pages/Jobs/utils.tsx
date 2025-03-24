import moment from 'moment';

import { CommonPerms } from '../../constants';

import { googleDirectionPath } from '../Address/utils';
import {
  generateDynamicPath,
  generateUniqueId,
  toLocaleDateString,
} from '../../utils/common';

import { IAuthUser } from '../Auth/interfaces';

import { generateJobSubModulePerms } from '../Orgs/utils';

import {
  IJobPhotoPopulated,
  IJobVideoPopulated,
  IJobDocPopulated,
  IMediaKind,
  IMediaPopulatedTypes,
} from '../Medias/interfaces';

import { IInviteStatusKind } from '../Invites/interfaces';
import { generateDefaultInvite } from '../Invites/utils';

import { getUserTypes, formatUserName } from '../Users/utils';

import {
  IJobDetailsTabTimelineList,
  IJobTimelineEvent,
} from '../Timelines/interfaces';

import * as interfaces from './interfaces';
import * as constants from './constants';
import JobRoutes from './routes';

export const generateAddPaths = (basePath: string): interfaces.IJobAddPaths => {
  return {
    map: `${basePath}?type=Map`,
    details: `${basePath}?type=Details`,
    addMembers: `${basePath}?type=AddMembers`,
    editMember: `${basePath}?type=EditMember`,
    inviteMember: `${basePath}?type=InviteMember`,
  };
};

export const generateEditInfoPaths = (
  basePath: string
): interfaces.IJobEditInfoPaths => {
  return {
    map: `${basePath}?type=Map`,
    details: `${basePath}?type=Details`,
  };
};

export const generateEditMembersPaths = (
  basePath: string
): interfaces.IJobEditMembersPaths => {
  return {
    base: basePath,
    addMembers: `${basePath}?type=AddMembers`,
    editMember: `${basePath}?type=EditMember`,
    inviteMember: `${basePath}?type=InviteMember`,
  };
};

export const addJobDefaultUserGenerate = (): interfaces.IAddJobUser => {
  const user: interfaces.IAddJobUser = {
    uid: generateUniqueId(),
    id: '',
    name: '',
    picURL: '',
    email: '',
    selected: false,
    skip: false,
    permissions: {
      ...generateJobSubModulePerms(),
    },
    invite: {
      ...generateDefaultInvite(),
    },
  };

  return user;
};

export const editJobDefaultUserGenerate = (): interfaces.IEditJobUser => {
  const user: interfaces.IEditJobUser = {
    id: '',
    name: '',
    picURL: '',
    email: '',
    selected: false,
    skip: false,
    permissions: {
      ...generateJobSubModulePerms(),
    },
    invite: {
      ...generateDefaultInvite(),
    },
  };

  return user;
};

export const generateDefaultJob = (
  user: IAuthUser,
  accountIndex: number,
  jobId: string = ''
) => {
  const primaryUserId = user.accounts[accountIndex].primaryUserId.id;

  const job: interfaces.IJobPopulated = {
    ...constants.DefaultJob,
    id: jobId,
    primaryUserId,
    creatorId: '',
    currentUserJobPerm: {
      ...constants.DefaultJob.currentUserJobPerm,
      userId: user.id,
      primaryUserId,
    },
  };

  return job;
};

export const parsePopulatedJob = (
  job: interfaces.IJobPopulated,
  user: {
    userId: string;
    baseUserType: number;
    accountUserType: number;
  },
  parseContributors: boolean = true
) => {
  const { address, users } = job;

  job.googlePath = googleDirectionPath(
    address.location.coordinates[0],
    address.location.coordinates[1],
    address.formatted
  );

  //  Adding default Job Permissions of current user
  job.currentUserJobPerm = {
    userId: user.userId,
    primaryUserId: job.primaryUserId,
    permissions: generateJobSubModulePerms(),

    createdAt: '',
    updatedAt: '',

    details: constants.DefaultUserJobDetail,

    invite: {
      token: '',
      status: IInviteStatusKind.notRequired,
    },
  };

  const currentUserType = getUserTypes(user.baseUserType, user.accountUserType);
  if (
    currentUserType.isSuperAdmin ||
    currentUserType.isAdmin ||
    currentUserType.isOwner
  ) {
    //  If super admin or admin or owner then adding all perm to current user -> Job Perms
    job.currentUserJobPerm.permissions = generateJobSubModulePerms(
      CommonPerms.all
    );
  } else {
    job.users.forEach((jobUser) => {
      if (jobUser.userId.id === user.userId) {
        job.currentUserJobPerm.permissions = { ...jobUser.permissions };
        job.currentUserJobPerm.details = { ...jobUser.details };
      }
    });
  }

  ////////////////////
  //  Contributors, Most Contributed Index, Most Recent Contributed Index
  ////////////////////
  let contributors: interfaces.IJobUserPopulated[] = [];
  let mostRecentContributorIndex: number = -1;

  // //  Sorting users based on latest contributions to get most recent contribution
  // job.users = users.sort(function (a, b) {
  //   return new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf();
  // });

  //  If Contributors parsing is not required(Eg :Job Details Screen)
  if (!parseContributors) {
    return { ...job };
  }

  //  Sorting users on based of most contibutions
  job.users = users.sort(function (a, b) {
    return b.details.contributionCount - a.details.contributionCount;
  });

  for (let jobUser of job.users) {
    if (!jobUser.details.contributionCount) {
      continue;
    }

    contributors.push(jobUser);

    //  Finding most recent contribution updatedAt value by comparing each user most recent contribution DT
    const currentJobUserMostRecentContribution =
      jobUser.details.contributionUpdatedAt;
    if (currentJobUserMostRecentContribution) {
      if (mostRecentContributorIndex === -1) {
        mostRecentContributorIndex = contributors.length - 1;
      } else {
        const prevMostRecentCountribution =
          contributors[mostRecentContributorIndex].details
            .contributionUpdatedAt;

        if (prevMostRecentCountribution) {
          const prevDT = moment(prevMostRecentCountribution);
          const currentJobUserDt = moment(currentJobUserMostRecentContribution);

          if (prevDT.isBefore(currentJobUserDt)) {
            mostRecentContributorIndex = contributors.length - 1;
          }
        }
      }
    }
  }

  job.contributors = contributors;
  job.mostContributorIndex = contributors.length ? 0 : -1;
  job.mostRecentContributorIndex = mostRecentContributorIndex;

  return { ...job };
};

export const groupJobMedias = (medias: IMediaPopulatedTypes[]) => {
  let mediaPhotos: IJobPhotoPopulated[] = [];
  let mediaVideos: IJobVideoPopulated[] = [];
  let mediaDocs: IJobDocPopulated[] = [];

  if (medias?.[0]?.id) {
    medias.forEach((jobMedia) => {
      if (jobMedia.kind === IMediaKind.JobPhoto) {
        // @ts-ignore
        mediaPhotos = [...mediaPhotos, jobMedia];
      } else if (jobMedia.kind === IMediaKind.JobVideo) {
        //@ts-ignore
        mediaVideos = [...mediaVideos, jobMedia];
      } else if (jobMedia.kind === IMediaKind.JobDoc) {
        //@ts-ignore
        mediaDocs = [...mediaDocs, jobMedia];
      }
    });
    //TODO: Add sorting on media at top to prevent sub sorting on these 3 bottoms
    mediaPhotos = mediaPhotos.sort(function (a, b) {
      return new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf();
    });
    mediaVideos = mediaVideos.sort(function (a, b) {
      return new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf();
    });
    mediaDocs = mediaDocs.sort(function (a, b) {
      return new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf();
    });
  }

  return {
    mediaPhotos,
    mediaVideos,
    mediaDocs,
  };
};

export const filterJobMembers = (
  searchFilter: string,
  sortOrder: interfaces.IAddEditMembersSortFilter | null,
  users: (interfaces.IAddJobUser | interfaces.IEditJobUser)[],
  searchUserEmail = ''
) => {
  let searchUserIndex = -1;
  let filteredMembers = users.map((user, index) => {
    if (user.email === searchUserEmail) {
      searchUserIndex = index;
    }

    return { ...user };
  });

  const search = searchFilter?.trim().toLowerCase();
  if (search) {
    const filtered = filteredMembers.filter(function (filteredMember) {
      const email = filteredMember.email.toLowerCase();
      const name = filteredMember.name.toLowerCase();

      return email.indexOf(search) > -1 || name.indexOf(search) > -1;
    });

    filteredMembers = [...filtered];
  }

  if (sortOrder) {
    filteredMembers = filteredMembers.sort((filteredMember, newUser) => {
      const compareName =
        sortOrder.name < 1
          ? newUser.name.localeCompare(filteredMember.name)
          : filteredMember.name.localeCompare(newUser.name);

      const compareEmail =
        sortOrder.email < 1
          ? newUser.email.localeCompare(filteredMember.email)
          : filteredMember.email.localeCompare(newUser.email);

      return compareName || compareEmail;
    });
  }

  return { filteredMembers, searchUserIndex };
};
export const filterBillWorkOrders = (
  searchFilter: string,
  // sortOrder: interfaces.IAddEditMembersSortFilter | null,
  bills: (interfaces.IBill)[],
  searchBill = ''
) => {
  let searchBillIndex = -1;
  let filteredBills = bills.map((bill, index) => {
    if (bill.Comment === searchBill) {
      searchBillIndex = index;
    }

    return { ...bill };
  });

  const search = searchFilter?.trim().toLowerCase();
  if (search) {
    const filtered = filteredBills.filter(function (filteredBill) {
      const comment = filteredBill.Comment.toLowerCase();

      return comment.indexOf(search) > -1;
    });

    filteredBills = [...filtered];
  }

  // if (sortOrder) {
  //   filteredMembers = filteredMembers.sort((filteredMember, newUser) => {
  //     const compareName =
  //       sortOrder.name < 1
  //         ? newUser.name.localeCompare(filteredMember.name)
  //         : filteredMember.name.localeCompare(newUser.name);

  //     const compareEmail =
  //       sortOrder.email < 1
  //         ? newUser.email.localeCompare(filteredMember.email)
  //         : filteredMember.email.localeCompare(newUser.email);

  //     return compareName || compareEmail;
  //   });
  // }

  return { filteredBills, searchBillIndex };
};
export const parseJobDetailsTabMedias = (
  groupBy: 'date' | 'contributor' = 'date',
  groupOptions: interfaces.IJobDetailsTabMediaGroupOptions = {},
  selectedMedias: Record<string, boolean> = {},
  medias: IMediaPopulatedTypes[]
): interfaces.IJobDetailsTabMediaList[] => {
  const cache: Record<string, interfaces.IJobDetailsTabMediaList> = {};

  const DefaultGroupOptionValue = {
    selected: false,
    sort: 1,
  };

  medias.forEach((media) => {
    let key = '';

    if (groupBy === 'date') {
      key = toLocaleDateString(media.createdAt, undefined);
    } else {
      key = media.creatorId.id;
    }

    //  Setting user name to creatorId
    media.creatorId.name = formatUserName(
      media.creatorId.firstName,
      media.creatorId.lastName
    );

    //  Setting the group option in the parent for later sorting
    if (!groupOptions[key]) {
      groupOptions = {
        ...groupOptions,
        [key]: { ...DefaultGroupOptionValue },
      };
    }
    const mediaGroupOption = groupOptions[key];

    if (cache[key]) {
      cache[key].medias.push(media);
    } else {
      let value = '';

      if (groupBy === 'date') {
        value = toLocaleDateString(media.createdAt, undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      } else {
        value = media.creatorId.name;
      }

      cache[key] = {
        sort: mediaGroupOption.sort,
        selected: mediaGroupOption.selected,
        key,
        value,
        medias: [
          {
            ...media,

            selected: selectedMedias[media.id] ?? false,
          },
        ],
      };
    }
  });

  let result: interfaces.IJobDetailsTabMediaList[] = Object.values(cache);

  //  Sorting Group Based on groupBy
  if (groupBy === 'date') {
    //  Here Key will be the date
    result = result.sort(function (a, b) {
      return new Date(b.key).valueOf() - new Date(a.key).valueOf();
    });
  } else {
    //  Here Key will be the username
    result = result.sort((a, b) =>
      a.key > b.key ? 1 : b.key > a.key ? -1 : 0
    );
  }

  //  Sorting the medias inside each group
  result.forEach((formattedGroup, index) => {
    const { key, medias } = formattedGroup;

    const mediaSortOrder = groupOptions[key].sort;

    //  Sorting Medias Based on Asc Created At By Default
    let newMedias = medias.sort(function (a, b) {
      return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
    });
    if (mediaSortOrder === -1) {
      //  If Descending then reversing array
      newMedias = medias.reverse();
    }

    formattedGroup.medias = newMedias;
  });

  return result;
};

export const parseJobDetailsTimelines = (timelines: IJobTimelineEvent[]) => {
  const result: IJobDetailsTabTimelineList[] = [];

  const cache: Record<string, number> = {};

  timelines.forEach((timeline) => {
    const key = toLocaleDateString(timeline.createdAt);

    if (cache[key] !== undefined) {
      result[cache[key]].events.push(timeline);
    } else {
      cache[key] = result.length;

      result[cache[key]] = {
        key,
        events: [timeline],
      };
    }
  });

  return result;
};

export const generateJobDetailsPath = (jobId: string): string => {
  const jobDetailsPath = generateDynamicPath(JobRoutes.routes.details.path, {
    jobId,
  });

  return jobDetailsPath;
};
