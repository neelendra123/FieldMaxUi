import Joi from 'joi';

import { apiURLV1 } from '../../config';
import { emailValSchema, passwordSchema } from '../../constants';

export const InviteApiRoutes = {
  inviteBase: `common/invite/:token`,

  inviteRegister: `${apiURLV1}/user/inviteRegister`,
};

export const InviteMessages = {
  inviteExpired: 'Sorry, this invite link has expired',

  userInviteExpired: 'Sorry, this user invite link has expired',
  jobInviteExpired: 'Sorry, this job invite link has expired',
};

export const InviteNewUserJoiScheme = Joi.object().keys({
  token: Joi.string().required(),

  firstName: Joi.string().required(),
  lastName: Joi.string().allow('').optional(),

  companyName: Joi.string()
    .allow('')
    .default('')
    .optional()
    .label('Company Name'),

  password: passwordSchema.required(),
  passwordConfirm: Joi.any()
    .equal(Joi.ref('password'))
    .required()
    .label('Confirm Password')
    .options({ messages: { 'any.only': '{{#label}} does not match' } }),
});

export const InviteOldUserJoiScheme = Joi.object().keys({
  token: Joi.string().required(),

  email: emailValSchema.required(),
  password: passwordSchema.required(),
});
