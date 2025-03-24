import Joi from 'joi';

import { apiURLV1, baseURL } from '../../config';
import { emailValSchema } from '../../constants';
import { OrgPermsValsSchema } from '../Orgs/constants';

import * as interfaces from './interfaces';

export const Themes: interfaces.ITheme[] = [
  {
    primary: '#4FD44C',
    primaryLight: '#4fd44c4d',
  },
  {
    primary: '#5F4CD4',
    primaryLight: '#5f4cd44d',
  },
  {
    primary: '#C295CC',
    primaryLight: '#C295CC4d',
  },
  {
    primary: '#FF5959',
    primaryLight: '#FF59594d',
  },
  {
    primary: '#FFD5A7',
    primaryLight: '#FFD5A74d',
  },
  {
    primary: '#4D3670',
    primaryLight: '#4D36704d',
  },
];

export const DefaultUserPic = `${baseURL}assets/images/defaultUserImage.png`;

export const Messages = {};

export const UserApiRoutes = {
  base: `${apiURLV1}/user`,

  listAll: `${apiURLV1}/user/listAll`,

  emailUnique: `${apiURLV1}/user/emailUnique`,

  user: `user/:userId`,

  blockUnblock: 'user/:userId/block',
};

export const UserAddValsScheme = Joi.object().keys({
  firstName: Joi.string().trim().required().label('First Name'),
  lastName: Joi.string().trim().optional().allow('').label('Last Name'),
  email: emailValSchema.required(),
  permissions: Joi.object().keys(OrgPermsValsSchema).required(),
});

export const UserEditValsScheme = Joi.object().keys({
  permissions: Joi.object().keys(OrgPermsValsSchema).required(),
});

export const ThemeJoiSchema = Joi.object().keys({
  primary: Joi.string().required(),
  primaryLight: Joi.string().required(),
});
