import { IRouteParams } from '../../interfaces';

import MediaLinkView from '../Medias/MediaLinks/MediaLinkView';

import * as interfaces from './interfaces';

const Routes: {
  name: string;
  sidebarId: number;
  routes: Record<'mediaLinkView', IRouteParams>;
} = {
  name: 'Link',
  sidebarId: 11,
  routes: {
    mediaLinkView: {
      name: 'mediaLinkView',
      key: 'mediaLinkView',
      path: `/links/${interfaces.ILinkKind.Media}/:token`,
      component: MediaLinkView,
      sideBarId: 11.1,
    },
  },
};

export default Routes;
