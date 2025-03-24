import { ICommonResponse } from '../../interfaces';

import { IJobPopulated } from '../Jobs/interfaces';
import { IUserIdPopulated } from '../Users/interfaces';

export enum IMediaKind {
  Photo = 'photo',
  Video = 'video',
  Doc = 'doc',

  JobPhoto = 'jobPhoto',
  JobVideo = 'jobVideo',
  JobDoc = 'jobDoc',
}

export type IMediaTypes =
  | IMediaKind.Photo
  | IMediaKind.Video
  | IMediaKind.Doc
  | IMediaKind.JobPhoto
  | IMediaKind.JobVideo
  | IMediaKind.JobDoc;

export enum IPhotoSubKinds {
  Simple = 'simple',
  Dual = 'dual',
}

export enum IPhotoSubMediaKinds {
  Simple = 'simple',
  Before = 'before',
  After = 'after',
}

export interface IMediaKey {
  key: string;
  size: string;
  mimetype: string;
  type?: string;
  metadata?: object;
}

export interface IMedia {
  id: string;

  kind: IMediaKind;
  subKind?: IPhotoSubKinds | undefined;

  primaryUserId: string;
  creatorId: string;

  name: string;
  tags: string[];

  medias: IJobSubMedia[];

  isActive: boolean;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

//////////////////////////
//  Parent Media
//////////////////////////
export enum ISubMediaUserPermTypes {
  base = 'base',
  comments = 'comments',
  members = 'members',

  //  Not at backend
  parent = 'parent',
}

export type ISubMediaUserPerms = Record<ISubMediaUserPermTypes, number>;

export interface ISubMediaUser {
  userId: string;
  primaryUserId: string;
  permissions: ISubMediaUserPerms;
}

export interface ISubMediaPopulatedUser {
  userId: IUserIdPopulated;
  primaryUserId: string;
  permissions: ISubMediaUserPerms;
}

export interface IMediaPopulated extends Omit<IMedia, 'creatorId'> {
  creatorId: IUserIdPopulated;
}

//  User inside Sub Media
export interface IAddEditSubMediaUser {
  id: string;
  primaryUserId: string;

  skip: boolean;
  selected: boolean;
  // isLocal?: boolean;
  expand: boolean;

  name: string;

  email: string;
  picURL?: string;
  permissions: ISubMediaUserPerms;
}

export type IMediaPopulatedTypes =
  | IJobPhotoPopulated
  | IJobVideoPopulated
  | IJobDocPopulated;

export interface IMediaDetailResData extends ICommonResponse {
  data: {
    media: IMediaPopulatedTypes;
  };
}

//////////////////////////
//  Video Common
//////////////////////////
export interface IVideoAddSubMedia {
  id: string;
  name: string;
  tags: string[];
  duration: number;
  media: string;
  contentType: string;
  thumbnail: string;
  users: IAddEditSubMediaUser[];

  mediaPath: string;
  thumbnailPath: string;
}

export interface IVideoAddMedia {
  id: string;

  kind: IMediaKind.Video | IMediaKind.JobVideo;

  creatorId: IUserIdPopulated;

  type: 'Recording' | 'Uploaded';

  name: string;
  tags: string[];

  medias: IVideoAddSubMedia[];
}

export type IInterval = null | number | ReturnType<typeof setInterval>;

export type ICameraStatus =
  | 'ready'
  | 'failed'
  | 'stopped'
  | 'idle'
  | 'paused'
  | 'recording'
  | 'stopping'
  | 'acquiring_media';

//////////////////////////
//  Document Common
//////////////////////////
export interface IDocAddSubMedia {
  id: string;
  name: string;
  tags: string[];
  media: string;
  users: IAddEditSubMediaUser[];

  numPages: number;

  mediaPath: string;
}

export interface IDocAddMedia {
  id: string;

  kind: IMediaKind.Doc | IMediaKind.JobDoc;

  creatorId: IUserIdPopulated;

  name: string;
  tags: string[];

  medias: IDocAddSubMedia[];
}

//////////////////////////
//  Photo Common
//////////////////////////
export interface IPhotoAddSubMedia {
  id: string;

  subKind: IPhotoSubMediaKinds;

  isDummy: boolean;

  name: string;
  tags: string[];
  media: string;
  contentType: string;
  users: IAddEditSubMediaUser[];

  mediaPath: string;
}



export interface IPhotoAddMedia {
  id: string;

  kind: IMediaKind.Photo | IMediaKind.JobPhoto;

  subKind: IPhotoSubKinds;

  creatorId: IUserIdPopulated;

  type: 'Recording' | 'Uploaded';

  name: string;
  tags: string[];

  medias: IPhotoAddSubMedia[];
}
//
export interface IPhotoAddMediaName {
  name: string;
}


//////////////////////////
//  Job Media Common
//////////////////////////
export interface IJobSubMedia {
  id: string;
  name: string;
  tags: string[];

  subKind?: IPhotoSubMediaKinds;

  media: string;
  mediaURL: string;

  thumbnail?: string;
  thumbnailURL?: string;

  users: ISubMediaUser[];

  createdAt: string;
  updatedAt: string;
}

//////////////////////////
//  Job Photo Discriminators
//////////////////////////
export interface IJobPhoto extends Omit<IMedia, 'medias'> {
  kind: IMediaKind.JobPhoto;

  jobId: string;

  medias: IJobSubMedia[];
}

export interface IJobPhotoPopulated extends Omit<IJobPhoto, 'creatorId'> {
  creatorId: IUserIdPopulated;

  //  These are added in the utils
  currentUserPerm: Record<string, ISubMediaUserPerms>;

  selected?: boolean;
}

export interface IJobPhotoAddHistoryState {
  job?: IJobPopulated;
}

//////////////////////////
//  Job Video Discriminators
//////////////////////////
export interface IJobVideo extends Omit<IMedia, 'medias'> {
  kind: IMediaKind.JobVideo;

  jobId: string;

  medias: IJobSubMedia[];
}

export interface IJobVideoPopulated extends Omit<IJobVideo, 'creatorId'> {
  creatorId: IUserIdPopulated;

  //  These are added in the utils
  currentUserPerm: Record<string, ISubMediaUserPerms>;

  selected?: boolean;
}

export interface IJobVideoAddHistoryState {
  job?: IJobPopulated;
}

export interface IVideosPreSignedURLReqData {
  medias: {
    kind: IMediaKind.JobVideo | IMediaKind.Video;
    contentType: string; //'video/mp4';
  }[];
}
export interface IVideoPreSignedURLResData {
  kind: IMediaKind.JobVideo;
  video: string;
  videoURL: string;
  thumbnail: string;
  thumbnailURL: string;
}

export interface IJobVideosAddReqData {
  kind: IMediaKind.JobVideo;

  medias: {
    name: string;
    tags: string[];
    subMedias: {
      name: string;
      tags: string[];
      media: string;
      thumbnail: string;
      users: {
        userId: string;
        primaryUserId: string;
        permissions: ISubMediaUserPerms;
      }[];
    }[];
  }[];
}
export interface IJobVideosAddResData extends ICommonResponse {
  data: {
    medias: IJobVideoPopulated[];
  };
}

//////////////////////////
//  Job Document Discriminators
//////////////////////////
export interface IJobDoc extends Omit<IMedia, 'medias'> {
  kind: IMediaKind.JobDoc;

  tags: string[];

  jobId: string;

  medias: IJobSubMedia[];
}

export interface IJobDocPopulated extends Omit<IJobDoc, 'creatorId'> {
  creatorId: IUserIdPopulated;

  //  These are added in the utils
  currentUserPerm: Record<string, ISubMediaUserPerms>;

  selected?: boolean;
}

export interface IDocsPreSignedURLReqData {
  medias: {
    kind: IMediaKind.JobDoc | IMediaKind.Doc;
    contentType: 'application/pdf';
  }[];
}
export interface IDocPreSignedURLResData {
  kind: IMediaKind.JobDoc | IMediaKind.Doc;
  doc: string;
  docURL: string;
}

export interface IJobDocsAddReqData {
  kind: IMediaKind.JobDoc;

  medias: {
    name: string;
    tags: string[];
    subMedias: {
      name: string;
      tags: string[];
      media: string;
      users: {
        userId: string;
        primaryUserId: string;
        permissions: ISubMediaUserPerms;
      }[];
    }[];
  }[];
}
export interface IJobDocsAddResData extends ICommonResponse {
  data: {
    medias: IJobDocPopulated[];
  };
}

//////////////////////////
//  Job Photos Discriminators
//////////////////////////

export interface IPhotoPreSignedURLReqData {
  medias: (
    | {
        kind: IMediaKind.Photo | IMediaKind.JobPhoto;
        subKind: IPhotoSubKinds.Simple;
        contentType: string; //"image/png"
      }
    | {
        kind: IMediaKind.Photo | IMediaKind.JobPhoto;
        subKind: IPhotoSubKinds.Dual;
        contentType: string;
        afterContentType: string;
      }
  )[];
}

//  Response of Pre Signed URL
export interface IPhotoSimplePreSignedURLMediaResData {
  kind: IMediaKind.Photo | IMediaKind.JobPhoto;
  simpleImage: string;
  simpleImageURL: string;
}

export interface IPhotoDualPreSignedURLMediaResData {
  kind: IMediaKind.Photo | IMediaKind.JobPhoto;
  beforeImage: string;
  beforeImageURL: string;
  afterImage: string;
  afterImageURL: string;
}

export type IPhotoPreSignedURLResData =
  | IPhotoSimplePreSignedURLMediaResData
  | IPhotoDualPreSignedURLMediaResData;

export interface IAddEditPhotoPaths {
  base: string;
  visibility: string;
  edit: string;
}

export interface IJobPhotosAddReqData {
  kind: IMediaKind.JobPhoto;

  medias: {
    name: string;
    tags: string[];
    subKind: IPhotoSubKinds;
    subMedias: {
      name: string;
      tags: string[];
      media: string;
      subKind: IPhotoSubMediaKinds;
      users: {
        userId: string;
        primaryUserId: string;
        permissions: ISubMediaUserPerms;
      }[];
    }[];
  }[];
}

export interface IJobPhotosAddResData extends ICommonResponse {
  data: {
    medias: IJobPhotoPopulated[];
  };
}

export interface IJobMediasListAllResData extends ICommonResponse {
  data: {
    list: IMediaPopulatedTypes[];
  };
}

