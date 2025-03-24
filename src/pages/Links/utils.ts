import { baseURL } from '../../config';
import { generateDynamicPath, generateUniqueId } from '../../utils/common';

import { CommonPerms, DummyPhotoBase64 } from '../../constants';

import { IMediaKind } from '../Medias/interfaces';

import LinkRoutes from './routes';
import * as interfaces from './interfaces';

export const generateMediaLinkPath = (token: string): string => {
  const mediaLinkPath = generateDynamicPath(
    LinkRoutes.routes.mediaLinkView.path,
    {
      token,
    }
  );

  return `${baseURL}${mediaLinkPath.substring(1)}`;
};

export const generateDefaultMediaLinkDetails =
  (): interfaces.IMediaLinkDetails => {
    const id = generateUniqueId();

    return {
      id,

      kind: interfaces.ILinkKind.Media,

      permissions: {
        medias: CommonPerms.none,
        details: CommonPerms.none,
        comments: CommonPerms.none,
      },

      token: id,

      isDeleted: false,

      createdAt: '',
      updatedAt: '',

      mediaId: {
        kind: IMediaKind.JobPhoto,
        id,
        name: '',
        creatorId: {
          id: '',
          name: '',
          firstName: '',
          lastName: '',
          email: '',
        },
        medias: [
          {
            id,
            name: '',
            tags: [],
            users: [],
            media: '',
            mediaURL: DummyPhotoBase64,
            createdAt: '',
            updatedAt: '',
          },
        ],
      },

      comments: [],
    };
  };

// IMediaLinkDetails>();
