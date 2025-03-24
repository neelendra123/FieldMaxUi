import { apiURLV1 } from '../../config';

import * as interfaces from './interfaces';

export const DashboardApiRoutes = {
  home: `${apiURLV1}/dashboard/home`,
};

export const defaultDashboardCount: interfaces.IDashboardHomeCountData = {
  users: 0,
  userOwners: 0,
  properties: 0,
  propertyUnits: 0,
  jobs: 0,
  medias: 0,
};
