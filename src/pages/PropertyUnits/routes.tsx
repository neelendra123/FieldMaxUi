import { CommonPerms } from '../../constants';
import { IModuleKind, IRouteParams } from '../../interfaces';

import * as Pages from './index';

const Routes: {
  name: string;
  sidebarId: number;
  routes: Record<'add' | 'detail' | 'edit', IRouteParams>;
} = {
  name: 'Units',
  sidebarId: 12,
  routes: {
    add: {
      name: 'Add',
      key: 'propertyUnitsAdd',
      path: `/property/:propertyId/propertyUnits`,
      component: Pages.PropertyUnitAdd,
      sideBarId: 12.2,

      authRequired: true,
      aclCheck: {
        moduleKind: IModuleKind.properties,
        subModuleKind: 'propertyUnits',
        requiredPermission: CommonPerms.all | CommonPerms.add,
      },
    },

    detail: {
      name: 'Details',
      key: 'propertyUnitDetails',
      path: `/property/:propertyId/propertyUnits/:propertyUnitId`,
      component: Pages.PropertyUnitDetails,
      sideBarId: 12.3,

      authRequired: true,
      aclCheck: {
        moduleKind: IModuleKind.properties,
        subModuleKind: 'propertyUnits',
        requiredPermission:
          CommonPerms.all | CommonPerms.edit | CommonPerms.view,
      },
    },

    edit: {
      name: 'Edit',
      key: 'propertyUnitsEdit',
      path: `/property/:propertyId/propertyUnits/:propertyUnitId/edit`,
      component: Pages.PropertyUnitEdit,
      sideBarId: 12.4,

      authRequired: true,
      aclCheck: {
        moduleKind: IModuleKind.properties,
        subModuleKind: 'propertyUnits',
        requiredPermission: CommonPerms.all | CommonPerms.edit,
      },
    },
  },
};

export default Routes;
