import { CommonPerms } from '../../constants';
import { IModuleKind, IRouteParams } from '../../interfaces';

import * as Pages from './index';

const Routes: {
  name: string;
  sidebarId: number;
  routes: Record<'list' | 'add' | 'edit' | 'details', IRouteParams>;
} = {
  name: 'Owners',
  sidebarId: 13,
  routes: {
    list: {
      name: 'List',
      key: 'UserOwnerList',
      path: `/userOwner/list`,
      component: Pages.UserOwnerList,
      sideBarId: 13.1,

      authRequired: true,
      aclCheck: {
        moduleKind: IModuleKind.userOwners,
        requiredPermission: CommonPerms.all | CommonPerms.view,
      },
    },
    add: {
      name: 'Add',
      key: 'UserOwnerAdd',
      path: `/userOwner`,
      component: Pages.UserOwnerAdd,
      sideBarId: 13.2,

      authRequired: true,
      aclCheck: {
        moduleKind: IModuleKind.userOwners,
        requiredPermission: CommonPerms.all | CommonPerms.add,
      },
    },
    edit: {
      name: 'Edit',
      key: 'UserOwnerEdit',
      exact: true,
      path: `/userOwner/:userOwnerId/edit`,
      component: Pages.UserOwnerEdit,
      sideBarId: 13.3,

      authRequired: true,
      aclCheck: {
        moduleKind: IModuleKind.userOwners,
        requiredPermission: CommonPerms.all | CommonPerms.edit,
      },
    },
    details: {
      name: 'Detail',
      key: 'UserOwnerDetails',
      path: `/userOwner/:userOwnerId`,
      component: Pages.UserOwnerDetails,
      sideBarId: 13.4,
      exact: true,

      authRequired: true,
      aclCheck: {
        moduleKind: IModuleKind.userOwners,
        requiredPermission:
          CommonPerms.all | CommonPerms.edit | CommonPerms.view,
      },
    },
  },
};

export default Routes;
