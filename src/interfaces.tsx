export enum IProductKind {
  camMax = 2, //1 << 1, // (1 << x) Equivlent Math.pow(2, x)
  fieldMax = 4, //1 << 2,
  inspectMax = 8, //1 << 3,
  propertyMax = 16, //1 << 4,
}

export type ICommonPermTypes =
  | 'none'
  | 'all'
  | 'view'
  | 'add'
  | 'edit'
  | 'delete'
  | 'timeline'
  | 'invite';

export enum IModuleKind {
  account = 'account',

  users = 'users',
  userOwners = 'userOwners',
  residents = 'residents',

  jobs = 'jobs',

  products = 'products',

  roles = 'roles',

  properties = 'properties',

  integrationCommons = 'integrationCommons',
}

export enum IServiceType {
  organization = 1 << 1,
  independant = 1 << 2,
}

export interface IOption {
  label: string;
  value: any;
}

export interface IACLCheckParams {
  moduleKind?: IModuleKind | null;
  subModuleKind?: string;

  requiredPermission?: number;
  requiredUserType?: number;
}

export interface IRouteParams {
  name: string;
  key: string;
  path: string;
  component: any;
  exact?: boolean;
  icon?: string;

  authRequired?: boolean;

  aclCheck?: IACLCheckParams;

  props?: object;

  sideBarId: number;
  access?: boolean;
}

export interface ICommonResponse {
  statusCode: number;
  message: string;
  data: any;
}

export interface ICommonListingParams {
  skip?: number;
  limit?: number;
  search?: string;
  sort?: ICommonSort;

  isActiveFilter?: boolean | null;
  isDeletedFilter?: boolean | null;
}

export type ICommonSort = Record<string, 1 | -1>;

export interface ICommonSelectOption {
  label: string;
  value: any;
}

export interface IProductDetails {
  productKind: number;
  gearURL?: string;
  logoURL?: string;
  name?: string;
}

export interface IStatusFilterOptions {
  value: number;
  label: string;
}
export interface IStatusWorkOrderFilterOptions {
  value: string;
  label: string;
}
export interface ICommonPreSignedURL {
  url: string;
  key: string;
}

export interface ICommonMediaUpload {
  default?: string;
  mediaURL: string;
  type: string;
  name: string;
}

export interface ICommonAddress {
  formatted: string;
  name: string;
  line1: string;
  line2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  location: {
    type: 'Point';
    coordinates: number[];
  };
  // isDefault?: boolean;
}
