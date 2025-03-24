import * as interfaces from './interfaces';

export const LinkApiRoutes = {
  mediaLinkAdd: 'medias/:mediaKind/:subMediaId/links',
  mediaLinkDetails: `links/${interfaces.ILinkKind.Media}/:token`,
};

export const Messages = {};
