import { ICommonResponse, IModuleKind } from '../../interfaces';

import { IMediaKind } from '../Medias/interfaces';
import { IUserIdPopulated } from '../Users/interfaces';

//////////////////////////
//  Model Level
//////////////////////////
export type INoteKind =
  | IModuleKind.users
  | IModuleKind.userOwners
  | IModuleKind.jobs
  | IModuleKind.properties;

export type INoteSubKind = 'propertyUnits';

export type INoteMediaKind =
  | IMediaKind.Photo
  | IMediaKind.Video
  | IMediaKind.Doc;

export interface INoteMedia {
  id: string;
  kind: INoteMediaKind;
  name: string;
  media: string;
  thumbnail?: string;

  mediaURL?: string;
  thumbnailURL?: string;
}

export interface INote {
  id: string;

  kind: INoteKind;
  subKind?: INoteSubKind;

  primaryUserId: string;

  creatorId: string;

  userId?: string;
  userOwnerId?: string;
  jobId?: string;
  propertyId?: string;

  note: string;

  medias: INoteMedia[];

  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface INotePopulated extends Omit<INote, 'creatorId'> {
  creatorId: IUserIdPopulated;
}

export interface IMediaUpload {
  kind: INoteMediaKind;
  name: string;
  mediaURL: string;
  contentType: string;
  thumbnailURL?: string;
}

//  Add
export interface INoteAddReqData {
  kind: INoteKind;
  subKind?: INoteSubKind;

  userId?: string;
  userOwnerId?: string;
  jobId?: string;
  propertyId?: string;
  propertyUnitId?: string;

  note: string;

  medias: Omit<INoteMedia, 'id'>[];
}
export interface INoteAddResData extends ICommonResponse {
  data: {
    record: INotePopulated;
  };
}

//  Pre Signed URL
export interface INoteMediaPreSignedURLsAddParams {
  kind: INoteKind;
  subKind?: INoteSubKind;

  medias: {
    kind: INoteMediaKind;
    contentType: string;
  }[];
}
export interface INoteMediaPreSignedURLsResData extends ICommonResponse {
  data: {
    data: {
      kind: INoteMediaKind;
      media: string;
      mediaURL: string;
      thumbnail: string;
      thumbnailURL: string;
    }[];
  };
}

//  List
export interface INotesListReqData {
  kind: INoteKind;
  subKind?: INoteSubKind;

  userId?: string;
  userOwnerId?: string;
  jobId?: string;
  propertyId?: string;
  propertyUnitId?: string;

  search?: string;
}
export interface INotesListResData extends ICommonResponse {
  data: {
    records: INotePopulated[];
  };
}
