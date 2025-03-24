import { ICommonResponse, IModuleKind } from '../../interfaces';

export type ImageContentType = 'image/png' | 'image/jpg' | 'image/jpeg';

export interface IPreSignedURLReqData {
  moduleKind:
    | IModuleKind.users
    | IModuleKind.account
    | IModuleKind.properties
    | IModuleKind.userOwners
    | 'propertyUnits';
  contentType: ImageContentType;
}

export interface IPreSignedURLResData extends ICommonResponse {
  data: {
    data: {
      media: string;
      mediaURL: string;
    };
  };
}

export interface ICommonEmail {
  type: string;
  email: string;
}

export interface ICommonPhoneNumber {
  name: string;
  extension: string;
  phoneNumber: string;
  default: boolean;
  textMessage: boolean;
}

export interface ICommonAccess {
  all: boolean;
  users: string[];
}
