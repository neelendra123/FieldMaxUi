import { IRouteParams } from '../../interfaces';

import CalendarsList from './List/CalendarsList';

export const Routes: {
  name: string;
  icon: string;
  sidebarId: number;
  routes: Record<'list', IRouteParams>;
} = {
  name: 'Calendar',
  icon: '',
  sidebarId: 12,
  routes: {
    list: {
      name: 'Calendar',
      key: 'CalendarsList',
      path: `/calendar`,
      component: CalendarsList,

      authRequired: true,

      aclCheck: {},
      sideBarId: 9.1,
    },
  },
};

export default Routes;
