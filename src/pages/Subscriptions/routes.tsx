import { IRouteParams } from '../../interfaces';

import * as Pages from './index';

const Routes: {
  name: string;
  sidebarId: number;
  routes: Record<'listPlans', IRouteParams>;
} = {
  name: 'Subscriptions',
  sidebarId: 8,
  routes: {
    listPlans: {
      name: 'Profile',
      key: 'viewProfile',
      path: '/subscriptions/plans',
      component: Pages.ListPlans,
      authRequired: true,
      sideBarId: 8.1,
    },
  },
};

export default Routes;
