import { CommonPerms } from '../../constants';
import { IModuleKind, IRouteParams } from '../../interfaces';

import * as Pages from './index';

const Routes: {
  name: string;
  sidebarId: number;
  routes: Record<'list' | 'add' | 'details' | 'edit', IRouteParams>;
} = {
  name: 'Properties',
  sidebarId: 11,
  routes: {
    list: {
      name: 'List',
      key: 'propertiesList',
      path: `/properties/list`,
      component: Pages.PropertiesList,
      sideBarId: 11.1,

      authRequired: true,
      aclCheck: {
        moduleKind: IModuleKind.properties,
        requiredPermission: CommonPerms.all | CommonPerms.view,
      },
    },
    add: {
      name: 'Add',
      key: 'propertiesAdd',
      path: `/properties/add`,
      component: Pages.PropertiesAdd,
      sideBarId: 11.2,

      authRequired: true,
      aclCheck: {
        moduleKind: IModuleKind.properties,
        requiredPermission: CommonPerms.all | CommonPerms.add,
      },
    },
    details: {
      name: 'Detail',
      key: 'PropertiesDetails',
      path: '/properties/:propertyId',
      component: Pages.PropertyDetails,
      sideBarId: 11.3,

      authRequired: true,
      aclCheck: {
        moduleKind: IModuleKind.properties,
        requiredPermission:
          CommonPerms.all | CommonPerms.edit | CommonPerms.view,
      },
    },
    edit: {
      name: 'Edit',
      key: 'PropertyEdit',
      path: '/properties/:propertyId/edit',
      component: Pages.PropertyEdit,
      sideBarId: 11.4,

      authRequired: true,
      aclCheck: {
        moduleKind: IModuleKind.properties,
        requiredPermission: CommonPerms.all | CommonPerms.edit,
      },
    },
  },
};

export default Routes;
