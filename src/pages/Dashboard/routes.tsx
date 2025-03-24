import { IRouteParams } from '../../interfaces';

import * as Pages from './index';

const Routes: {
  name: string;
  sidebarId: number;
  routes: Record<'home', IRouteParams>;
} = {
  name: 'Dashboard',
  sidebarId: 3,
  routes: {
    home: {
      name: 'Dashboard',
      key: 'dashboard',
      path: '/',
      component: Pages.DashboardHome,
      authRequired: true,
      sideBarId: 3.1,
      access: true,
    },
  },
};

export default Routes;
