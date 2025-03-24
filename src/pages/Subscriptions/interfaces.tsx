import { ICommonResponse, IModuleKind, IProductKind } from '../../interfaces';

import { IMediaKind } from '../Medias/interfaces';

export enum IPlanPaymentInterval {
  Year = 'year',
  Month = 'month',
}

export interface IPlan {
  id: string;

  name: string;
  description: string;

  interval: IPlanPaymentInterval;

  price: number;

  //  Stripe Keys
  productId: string;
  pricingId: string;

  order: number;

  isComingSoon: boolean;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

//////////////////////////
//  CamMax Discriminators
//////////////////////////
export interface ICamMaxPlan extends IPlan {
  kind: IProductKind.camMax;

  limit: {
    [IModuleKind.users]: number;
    [IModuleKind.jobs]: number;
  };

  [IModuleKind.users]: {
    guest: boolean;
  };

  devices: {
    web: boolean;
    android: boolean;
    ios: boolean;
  };

  [IModuleKind.account]: {
    logo: boolean;
  };

  [IModuleKind.jobs]: {
    labels: boolean;
    calendar: boolean;
  };

  [IMediaKind.Photo]: {
    storage: 'Unlimited';
    markup: boolean;
    tags: boolean;
    comments: boolean;
    galleries: boolean;
    uploads: boolean;
    geoTagging: boolean;
    dateTimeUserTagging: boolean;
    autoLabeling: boolean;
    beforeAndAfter: boolean;
  };

  [IMediaKind.Video]: {
    access: boolean;
  };

  [IMediaKind.Doc]: {
    uploads: boolean;
    scanning: boolean;
  };

  // media: {
  //   marketing: boolean;
  // }

  permissionsAndRoles: boolean;
  advancedFiltering: boolean;

  notifications: {
    access: boolean;
  };

  [IModuleKind.properties]: {
    multiFamily: boolean;
  };

  dashboard: {
    multiple: boolean;
    customizableViews: boolean;
  };

  timeline: {
    galleries: boolean;
  };

  advancedAccessManagement: boolean;

  // integration: {
  //   access: boolean;
  // };

  // events: {
  //   access: boolean;
  // }
}

export type IPlanTypes = ICamMaxPlan;

//////////////////////////
//  Api
//////////////////////////
export interface IPlansListingResData extends ICommonResponse {
  data: {
    monthly: IPlanTypes[];
    yearly: IPlanTypes[];
  };
}
