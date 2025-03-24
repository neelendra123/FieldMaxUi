import { CommonPerms } from '../../constants';
import { IModuleKind, IRouteParams } from '../../interfaces';

import * as Pages from './index';

const Routes: {
  name: string;
  sidebarId: number;
  routes: Record<'list' | 'add' | 'edit', IRouteParams>;
} = {
  name: 'Users',
  sidebarId: 6,
  routes: {
    list: {
      name: 'List',
      key: 'UserList',
      path: `/users/list`,
      component: Pages.UserList,
      sideBarId: 6.1,

      authRequired: true,

      aclCheck: {
        moduleKind: IModuleKind.users,
        requiredPermission: CommonPerms.all | CommonPerms.view,
      },
    },
    add: {
      name: 'Add',
      key: 'UserAdd',
      path: `/users/add`,
      component: Pages.AddUser,
      sideBarId: 6.2,

      authRequired: true,

      aclCheck: {
        moduleKind: IModuleKind.users,
        requiredPermission: CommonPerms.all | CommonPerms.add,
      },
    },
    edit: {
      name: 'Edit',
      key: 'UserEdit',
      path: `/users/:userId/edit`,
      component: Pages.UserEdit,
      sideBarId: 6.3,

      authRequired: true,

      aclCheck: {
        moduleKind: IModuleKind.users,
        requiredPermission: CommonPerms.all | CommonPerms.edit,
      },
    },
  },
};

export default Routes;
