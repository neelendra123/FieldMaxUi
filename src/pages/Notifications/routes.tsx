import { IRouteParams } from '../../interfaces';

import * as Pages from './index';

const Routes: {
  name: string;
  sidebarId: number;
  routes: Record<'list', IRouteParams>;
} = {
  name: 'Notifications',
  sidebarId: 16,
  routes: {
    list: {
      name: 'List',
      key: 'notificationList',
      path: `/notifications`,
      component: Pages.Notifications,
      authRequired: true,
      sideBarId: 16.1,
    },
  },
};

export default Routes;
