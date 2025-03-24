import { IRouteParams } from '../../interfaces';

import * as Pages from './index';
import { IMediaKind } from './interfaces';

const Routes: {
  name: string;
  sidebarId: number;
  routes: Record<'videoAdd' | 'docAdd' | 'photoAdd', IRouteParams>;
} = {
  name: 'Media',
  sidebarId: 7,
  routes: {
    videoAdd: {
      name: 'Add',
      key: 'videoAdd',
      path: `/media/${IMediaKind.Video}/add`,
      component: Pages.VideoAdd,
      authRequired: true,
      sideBarId: 7.1,
    },
    docAdd: {
      name: 'Add',
      key: 'docAdd',
      path: `/media/${IMediaKind.Doc}/add`,
      component: Pages.DocumentAdd,
      authRequired: true,
      sideBarId: 7.2,
    },
    photoAdd: {
      name: 'Add',
      key: 'photoAdd',
      path: `/media/${IMediaKind.Photo}/add`,
      component: Pages.DocumentAdd,
      authRequired: true,
      sideBarId: 7.3,
    },
  },
};

export default Routes;
