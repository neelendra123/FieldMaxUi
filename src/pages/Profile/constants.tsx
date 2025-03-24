import Joi from 'joi';

import { apiURLV1 } from '../../config';
import { passwordSchema } from '../../constants';

export const Routes = {
  profileGet: `${apiURLV1}/user/authProfileGet`,
  passwordUpdate: `${apiURLV1}/user/passwordUpdate`,
  profileUpdate: `${apiURLV1}/user/profileUpdate`,
};

export const PasswordUpdateFormError = {
  oldPassword: undefined,
  newPassword: undefined,
  newPasswordConfirm: undefined,
};
export const PasswordUpdateJoiScheme = Joi.object().keys({
  oldPassword: passwordSchema.required().label('Old Password'),
  newPassword: passwordSchema.required().label('New Password'),
  // .disallow(Joi.ref('oldPassword'))
  // .messages({
  //   'string.disallow': `"New password" cannot be same as old Password`,
  // }),
  newPasswordConfirm: Joi.any()
    .equal(Joi.ref('newPassword'))
    .required()
    .label('Confirm Password')
    .options({ messages: { 'any.only': '{{#label}} does not match' } }),
});

export const ProfileUpdateFormError = {
  firstName: undefined,
  lastName: undefined,
  pic: undefined,
};
export const ProfileUpdateJoiScheme = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().optional().allow(''),
  pic: Joi.string().optional().allow(''),
});
