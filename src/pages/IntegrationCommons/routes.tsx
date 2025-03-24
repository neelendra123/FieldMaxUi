import { IRouteParams } from '../../interfaces';

import * as Pages from './index';

const Routes: {
  name: string;
  sidebarId: number;
  routes: Record<'integrationCommonList', IRouteParams>;
} = {
  name: 'Property Types',
  sidebarId: 10,
  routes: {
    integrationCommonList: {
      name: 'Property Types',
      key: 'integrationCommons',
      path: '/integrationCommons',
      component: Pages.IntegrationCommonList,
      authRequired: true,
      sideBarId: 10.1,
    },
  },
};

export default Routes;
