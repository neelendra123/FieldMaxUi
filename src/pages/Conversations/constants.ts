import Joi from 'joi';

import { apiURLV1 } from '../../config';

import * as interfaces from './interfaces';

export const ConversationsApiRoutes = {
  base: `${apiURLV1}/conversations`,

  jobComments: `jobs/:jobId/comments`,
};

//  //  //  //  //  //  Conversations
export const AddConversationJoiScheme = Joi.object().keys({
  kind: Joi.string()
    .valid(...Object.values(interfaces.IConversationKinds))
    .required(),

  message: Joi.string().required(),

  jobId: Joi.string().required(),

  mediaId: Joi.string().optional(),

  subMediaId: Joi.when(Joi.ref('kind'), {
    is: interfaces.IConversationKinds.comments,
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
});
