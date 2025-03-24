import Joi from 'joi';

import { apiURLV1, baseURL } from '../../config';
import { emailValSchema } from '../../constants';

import { generateCommonAddressJoiSchema } from '../Address/utils';

import { ThemeJoiSchema } from '../Users/constants';

export const DefaultAccountPic = `${baseURL}assets/images/defaultAccountLogo.png`;

export const AccountApiRoutes = {
  base: `${apiURLV1}/accounts`,

  accountEdit: 'accounts/:accountId',
  accountDetails: 'accounts/:accountId',
};

export const AccountMessages = {
  editNoPerm: 'Sorry, you are not permitted to edit this account details',
};

export const AccountEditJoiScheme = Joi.object().keys({
  name: Joi.string().required(),
  address: generateCommonAddressJoiSchema({}).required(),
  phone: Joi.string().optional().allow(''),
  primaryEmail: emailValSchema.required().label('Primary Email'),
  theme: ThemeJoiSchema.required(),
});
