import Joi from 'joi';

import { apiURLV1, deviceType } from '../../config';
import { emailValSchema, passwordSchema } from '../../constants';
import { IServiceType } from '../../interfaces';

import { DefaultUserPic, Themes } from '../Users/constants';
import { IUserType } from '../Users/interfaces';

import { generateDefaultOrgPerms } from '../Orgs/utils';

import { DefaultAccountPic } from '../Accounts/constants';

import { generateDefaultInvite } from '../Invites/utils';
import { IInviteStatusKind } from '../Invites/interfaces';

import { DefaultCommonAddress } from '../Address/constants';

import * as interfaces from './interfaces';

export const AuthApiRoutes = {
  login: `${apiURLV1}/user/login`,
  register: `${apiURLV1}/user/register`,
  passwordForgot: `${apiURLV1}/user/passwordForgot`,
  passwordReset: `${apiURLV1}/user/passwordReset`,

  logout: `${apiURLV1}/user/logout`,
};

export const LoginJoiScheme = Joi.object().keys({
  email: emailValSchema.required(),
  password: passwordSchema.required(),
});

export const PasswordForgotJoiScheme = Joi.object().keys({
  email: emailValSchema.required(),
});

export const PasswordResetJoiScheme = Joi.object().keys({
  newPassword: passwordSchema.label('New Password').required(),
  newPasswordConfirm: Joi.any()
    .equal(Joi.ref('newPassword'))
    .required()
    .label('Confirm Password')
    .options({ messages: { 'any.only': '{{#label}} does not match' } }),
});

export const RegisterJoiScheme = Joi.object().keys({
  productKind: Joi.number().required(),
  deviceType: Joi.string().default(deviceType).optional(),
  firstName: Joi.string().required().label('First Name'),
  lastName: Joi.string().optional().allow('').label('Last Name'),
  email: emailValSchema.required(),
  password: passwordSchema.required(),
  passwordConfirm: Joi.any()
    .equal(Joi.ref('password'))
    .required()
    .label('Confirm Password')
    .options({ messages: { 'any.only': '{{#label}} does not match' } }),
  companyName: Joi.string()
    .allow('')
    .default('')
    .optional()
    .label('Company Name'),
});

export const DefaultUser: interfaces.IAuthUser = {
  firstName: '',
  lastName: '',
  createdAt: '2021-03-18T12:49:07.963Z',
  updatedAt: '2021-03-18T12:49:07.963Z',
  id: '0',
  email: '',
  name: '',
  pic: '',
  picURL: DefaultUserPic,
  primaryUserId: '',

  theme: Themes[0],

  accounts: [
    {
      primaryUserId: {
        account: {
          name: '',
          address: { ...DefaultCommonAddress },
          phone: '',
          primaryEmail: '',
          logo: '',
          logoURL: DefaultAccountPic,
        },
        id: '0',
      },
      permissions: generateDefaultOrgPerms(),
      userType: IUserType.user,
      isDefault: true,
      isBlocked: false,
      // productKind: IProductKind.camMax,

      invite: generateDefaultInvite(IInviteStatusKind.notRequired),
    },
  ],

  userType: IUserType.basic,
  serviceType: IServiceType.organization,

  isActive: true,
  isDeleted: false,
};
