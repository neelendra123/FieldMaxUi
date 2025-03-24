import { CommonPerms } from '../../constants';
import { IRouteParams, IModuleKind } from '../../interfaces';

// import * as Pages from './index';

const Routes: {
  name: string;
  sidebarId: number;
  routes: Record<'list' | 'add', IRouteParams>;
} = {
  name: 'Jobs',
  sidebarId: 5,
  routes: {
    list: {
      name: 'List',
      key: 'roleList',
      path: `/role/list`,
      component: undefined,

      authRequired: true,

      aclCheck: {
        moduleKind: IModuleKind.roles,
        requiredPermission: CommonPerms.all | CommonPerms.view,
      },
      sideBarId: 5.1,
    },
    add: {
      name: 'Add',
      key: 'roleAdd',
      path: `/role/add`,
      component: undefined, //Pages.RoleCreate,

      authRequired: true,

      aclCheck: {
        moduleKind: IModuleKind.roles,
        requiredPermission: CommonPerms.all | CommonPerms.add,
      },
      sideBarId: 5.2,
    },
  },
};

export default Routes;
