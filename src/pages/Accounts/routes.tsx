import { CommonPerms } from '../../constants';
import { IModuleKind, IRouteParams } from '../../interfaces';

import * as Pages from './index';

const Routes: {
  name: string;
  sidebarId: number;
  routes: Record<'editAccount' | 'settings', IRouteParams>;
} = {
  name: 'Accounts',
  sidebarId: 2,
  routes: {
    editAccount: {
      name: 'Setup',
      key: 'editAccount',
      path: '/account/:accountIndex/edit',
      component: Pages.EditAccount,
      authRequired: true,
      sideBarId: 2.1,
      aclCheck: {
        moduleKind: IModuleKind.account,
        requiredPermission: CommonPerms.all | CommonPerms.edit,
      },
    },
    settings: {
      name: 'Settings',
      key: 'settings',
      path: '/account/:accountIndex/settings',
      authRequired: true,
      sideBarId: 2.2,
      component: Pages.Settings,
      aclCheck: {
        moduleKind: IModuleKind.account,
        requiredPermission:
          CommonPerms.all | CommonPerms.view | CommonPerms.edit,
      },
    },
  },
};

export default Routes;
