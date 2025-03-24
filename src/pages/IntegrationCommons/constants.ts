import Joi from 'joi';

import { apiURLV1 } from '../../config';
import { IOption } from '../../interfaces';

import { IIntegrationCommonSubModuleTypes } from '../Orgs/interfaces';

import * as interfaces from './interfaces';

export const fontStyleOptions: IOption[] = [
  { value: 'bold', label: 'Bold' },
  { value: 'italic', label: 'Italic' },
  { value: 'underline', label: 'Underline' },
];

export const IntegrationCommonApiRoutes = {
  listAll: `${apiURLV1}/integrationCommons/listAll`,
  list: `integrationCommons/:kind`,
  add: `integrationCommons/:kind`,
  edit: `integrationCommons/:kind/:integrationCommonId`,
  delete: `integrationCommons/:kind/:integrationCommonId`,
  blockUnblock: `integrationCommons/:kind/:integrationCommonId/block`,
};

export const AddEditJoiScheme = Joi.object().keys({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  color: Joi.string().trim().optional(),

  bold: Joi.boolean().optional(),
  italic: Joi.boolean().optional(),
  underline: Joi.boolean().optional(),
});

export const DefaultIntegrationCommonOptions: Record<
  IIntegrationCommonSubModuleTypes,
  interfaces.IIntegrationCommon[]
> = {
  base: [],

  propertyTypes: [],
  addressTypes: [],
  chargeTypes: [],

  unitTypes: [],

  serviceManagerCategories: [],
  serviceManagerPriorities: [],
  serviceManagerStatuses: [],
};
