import { ICommonResponse } from '../../interfaces';

import { IConversationKinds } from '../Conversations/interfaces';
import { IInvite } from '../Invites/interfaces';
import { ILinkKind } from '../Links/interfaces';
import { IMediaKind, IPhotoSubKinds } from '../Medias/interfaces';
import { INoteKind } from '../Notes/interfaces';

export enum INotificationKind {
  // New Job notify admin
  JobCreate = 'JobCreate', //
  // Invited to job notify member
  JobInvite = 'JobInvite',
  // Change start end date notify all members
  JobDetailEdit = 'JobDetailEdit', //

  //New media notify members
  VideoCreate = 'VideoCreate',
  PhotoCreate = 'PhotoCreate',
  DocCreate = 'DocCreate',

  // New comment notify members
  CommentCreate = 'CommentCreate',
  // New conversation notify members
  ConversationCreate = 'ConversationCreate',

  // Notify job owner of all above
}

interface INotificationCreatorIdPopulated {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  pic?: string;
  picURL?: string;
}

interface INotificationUserIdPopulated {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  pic?: string;
  picURL?: string;
}

interface INotificationUserOwnerIdPopulated {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  pic?: string;
  picURL?: string;
}

interface INotificationMediaIdPopulated {
  kind: IMediaKind;
  subKind?: IPhotoSubKinds | undefined;
  name: string;
  medias: {
    name: string;
    media: string;
    mediaURL: string;

    thumbnail?: string;
    thumbnailURL?: string;
    id: string;
  }[];
  id: string;
}

interface INotificationPropertyIdPopulated {
  name: string;
  shortName: string;
  id: string;
}
interface INotificationPropertyUnitIdPopulated {
  name: string;
  pic?: string;
  picURL?: string;
  id: string;
}

interface INotificationJobIdPopulated {
  title: string;
  startDt: string;
  endDt: string;
  users: {
    userId: string;
    invite: IInvite;
  }[];
  id: string;
}

interface INotificationConversationIdPopulated {
  kind: IConversationKinds;
  message: string;
  id: string;
}

interface INotificationLinkIdPopulated {
  kind: ILinkKind;
  token: string;
  id: string;
}

interface INotificationNoteIdPopulated {
  kind: INoteKind;
  note: string;
  id: string;
}

export interface INotification {
  id: string;

  primaryUserId: string;
  receivers: string[];
  creatorId: INotificationCreatorIdPopulated;

  reqId: string;

  kind: INotificationKind;

  userId?: INotificationUserIdPopulated;
  userOwnerId?: INotificationUserOwnerIdPopulated;

  mediaId?: INotificationMediaIdPopulated;
  subMediaId?: string;

  propertyId?: INotificationPropertyIdPopulated;
  propertyUnitId?: INotificationPropertyUnitIdPopulated;

  jobId?: INotificationJobIdPopulated;
  conversationId?: INotificationConversationIdPopulated;

  linkId?: INotificationLinkIdPopulated;

  noteId?: INotificationNoteIdPopulated;

  message?: string;

  readUsers: string[];

  isRead: boolean;
  isGlobal: boolean;
  isDeleted: boolean;

  metadata: Record<string, any>;

  createdAt: string;
  updatedAt: string;
}

//  List
export interface INotificationsListParams {
  skip?: number;
  limit?: number;

  userId?: string;
  userOwnerId?: string;

  mediaId?: string;
  subMediaId?: string;

  propertyId?: string;
  propertyUnitId?: string;

  jobId?: string;
  conversationId?: string;

  linkId?: string;

  noteId?: string;
}

export interface INotificationListData {
  count: number;
  unreadCount: number;
  records: INotification[];
}

export interface INotificationsListResData extends ICommonResponse {
  data: INotificationListData;
}
