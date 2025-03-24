import { IRouteParams } from '../../interfaces';

import * as Pages from './index';

const Routes: {
  name: string;
  sidebarId: number;
  routes: Record<'viewProfile', IRouteParams>;
} = {
  name: 'Profile',
  sidebarId: 1,
  routes: {
    viewProfile: {
      name: 'Profile',
      key: 'viewProfile',
      path: '/profile',
      component: Pages.ViewProfile,
      authRequired: true,
      sideBarId: 1.1,
    },
  },
};

export default Routes;
