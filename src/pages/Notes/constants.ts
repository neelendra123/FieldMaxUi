import Joi from 'joi';

import { apiURLV1 } from '../../config';
import { IModuleKind } from '../../interfaces';

import { IMediaKind } from '../Medias/interfaces';

export const NotesApiRoutes = {
  base: `${apiURLV1}/notes`,
  preSignedURLs: `${apiURLV1}/notes/preSignedURLs`,
};

export const NoteMediaValSchema = Joi.array()
  .items(
    Joi.object().keys({
      kind: Joi.string()
        .valid(IMediaKind.Photo, IMediaKind.Video, IMediaKind.Doc)
        .required(),
      name: Joi.string().required(),
      media: Joi.string().required(),
      thumbnail: Joi.when(Joi.ref('kind'), {
        is: IMediaKind.Video,
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
      }),
    })
  )
  .default([]);

export const NoteCreateValSchema = Joi.object().keys({
  kind: Joi.string()
    .valid(
      IModuleKind.userOwners,
      IModuleKind.users,
      IModuleKind.jobs,
      IModuleKind.properties,
      'propertyUnits'
    )
    .required(),

  userId: Joi.string().allow(null).optional(),
  userOwnerId: Joi.string().allow(null).optional(),
  jobId: Joi.string().allow(null).optional(),
  propertyId: Joi.string().allow(null).optional(),

  note: Joi.string().trim().optional(),
  medias: NoteMediaValSchema.optional(),
});

export const MESSAGES = {
  created: 'Note created successfully',
  updated: 'Note updated successfully',
  notFound: 'Note not found',
  deleted: 'Note deleted successfully',
};
