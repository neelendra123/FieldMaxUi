import Joi from 'joi';

import { apiURLV1 } from '../../config';

import {
  AccountSubModulePermsValsSchema,
  JobSubModulePermsValsSchema,
} from '../Orgs/constants';

import * as interfaces from './interfaces';

export const RoleApiRoutes = {
  base: `${apiURLV1}/roles`,
};

export const RolePermSchema = Joi.when(Joi.ref('kind'), {
  is: interfaces.IRoleKinds.accountRole,
  then: Joi.object().keys(AccountSubModulePermsValsSchema).required(),
})
  .when(Joi.ref('kind'), {
    is: interfaces.IRoleKinds.jobRole,
    then: Joi.object().keys(JobSubModulePermsValsSchema).required(),
  })
  // .when(Joi.ref('kind'), {
  //   is: interfaces.IRoleKinds.jobMediaRole,
  //   then: Joi.object().keys(JobMediaUserPermJoiKeys).required(),
  // })
  .required();

export const RoleAddJoiScheme = Joi.object().keys({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().optional().allow(''),
  permissions: RolePermSchema.required(),
});
export const UpdateJoiSchema = RoleAddJoiScheme.keys({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().optional().allow(''),
  permissions: RolePermSchema.required(),
  isActive: Joi.boolean().required(),
});
