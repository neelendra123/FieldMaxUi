import { IRouteParams } from '../../interfaces';

import * as Pages from './index';

type RouteType = 'invite';

const Routes: Record<RouteType, IRouteParams> = {
  invite: {
    name: 'Invite',
    key: 'invite',
    path: '/invite/:token',
    component: Pages.InviteAuth,
    sideBarId: 0,
  },
};

export default Routes;
