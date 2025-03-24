import Joi from 'joi';

import { apiURLV1 } from '../../config';

import * as interfaces from './interfaces';

export const CommonApiRoutes = {
  preSignedURLs: `${apiURLV1}/common/preSignedURLs`,
};

export const DefaultCommonEmail: interfaces.ICommonEmail = {
  email: '',
  type: '',
};
export const CommonEmailsSchema = Joi.array()
  .items(
    Joi.object()
      .keys({
        type: Joi.string().required().allow('').default(''),
        email: Joi.string().required().allow('').default(''),
      })
      .with('email', ['type'])
  )
  .default([])
  .unique('type')
  .unique('email');

export const DefaultCommonPhoneNumber: interfaces.ICommonPhoneNumber = {
  name: '',
  extension: '',
  phoneNumber: '',
  default: false,
  textMessage: false,
};
export const CommonPhoneNumbersSchema = Joi.array()
  .items(
    Joi.object()
      .keys({
        name: Joi.string().required().allow('').default(''),
        extension: Joi.string().optional().allow('').default(''),
        phoneNumber: Joi.string().required().allow('').default(''),
        default: Joi.boolean().default(false).optional(),
        textMessage: Joi.boolean().default(false).optional(),
      })
      .with('name', ['phoneNumber'])
  )
  .default([])
  .unique('name')
  .unique('phoneNumber');

//  Common Access Schema
export const DefaultCommonAccess: interfaces.ICommonAccess = {
  all: true,
  users: [],
};

export const CommonAccessValSchema = Joi.object()
  .keys({
    all: Joi.boolean().required(),
    users: Joi.array().items(Joi.string()).default([]).optional(),
    userOwners: Joi.array().items(Joi.string()).default([]).optional(),
  })
  .default(DefaultCommonAccess);
