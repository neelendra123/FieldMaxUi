import { ICommonResponse } from '../../interfaces';

export interface ILocation {
  id: string;
  LocationID: number;
  name?: string;
  friendlyName?: string;
  isMainLocation: boolean;
}

export interface IRMIntegration {
  dbId: string;
  username: string;
  password: string;
  locations: ILocation[];
  isActive: boolean;
  updatedAt?: Date;
}

export interface IIntegrations {
  rm: IRMIntegration;
}

export interface IIntegrationResData extends ICommonResponse {
  data: {
    integrations: IIntegrations;
  };
}

export interface IRMCredentialsUpdateReqData {
  dbId: string;
  username: string;
  password: string;
}
