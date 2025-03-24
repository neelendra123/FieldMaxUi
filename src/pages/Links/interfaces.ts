import { ICommonResponse } from '../../interfaces';

import { IConversationsPopulated } from '../Conversations/interfaces';
import { IMediaKind, IJobSubMedia } from '../Medias/interfaces';
import { IUserIdPopulated } from '../Users/interfaces';

export enum ILinkKind {
  Media = 'media',
  Invite = 'invite',
}

export interface IMediaLinkPermission {
  medias: number;
  details: number;
  comments: number;
}

export interface IMediaLink {
  id: string;

  kind: ILinkKind.Media;

  permissions: IMediaLinkPermission;

  // mediaId: string;
  // subMediaId: string;

  token: string;

  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface IMediaLinkAddReqData {
  permissions: IMediaLinkPermission;
}
export interface IMediaLinkAddResData extends ICommonResponse {
  data: {
    data: IMediaLink;
  };
}

export interface IMediaLinkDetails extends Omit<IMediaLink, 'mediaId'> {
  kind: ILinkKind.Media;
  mediaId: {
    kind: IMediaKind.JobPhoto | IMediaKind.JobVideo | IMediaKind.JobDoc;
    id: string;
    name: string;
    creatorId: IUserIdPopulated;
    medias: IJobSubMedia[];
  };
  comments: IConversationsPopulated[];
}

export interface IMediaLinkDetailsResData extends ICommonResponse {
  data: {
    data: IMediaLinkDetails;
  };
}
