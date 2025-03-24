import Joi from 'joi';

import { apiURLV1, baseURL } from '../../config';
import { DefaultCommonMediaUpload } from '../../constants';

import { DefaultCommonAddress } from '../Address/constants';
import { generateCommonAddressJoiSchema } from '../Address/utils';

import {
  CommonAccessValSchema,
  DefaultCommonAccess,
} from '../Common/constants';

import * as interfaces from './interfaces';

export const PropertyUnitApiRoutes = {
  base: `${apiURLV1}/propertyUnits`,
  details: 'propertyUnits/:propertyUnitId',
  listAll: `${apiURLV1}/propertyUnits/listAll`,
  blockUnblock: 'propertyUnits/:propertyUnitId/block',
  delete: 'propertyUnits/:propertyUnitId',
  edit: 'propertyUnits/:propertyUnitId',
};

export const DefaultUserOwnerPic = `${baseURL}assets/images/defaultUserImage.png`;

const PropertyUnitRMIntegrationValsSchema = Joi.object()
  .keys({
    enabled: Joi.boolean().default(false).required(),
  })
  .default({
    enabled: false,
  });

const PropertyCreateEditCommonValsSchema = {
  pic: Joi.string().trim().default('').optional(),
  name: Joi.string().trim().required(),
  // taxId: Joi.string().trim().optional().allow(''),
  unitTypes: Joi.array().items(Joi.required()).default([]).required(),
  bedrooms: Joi.number().optional().default(0),
  bathrooms: Joi.number().optional().default(0),
  squareFootage: Joi.number().optional().default(0),
  comments: Joi.string().trim().optional().allow(''),
  //  Tab General Info
  addresses: Joi.array()
    .items(generateCommonAddressJoiSchema({}))
    .default([])
    .optional(),
  //  Tab Access
  access: CommonAccessValSchema.optional(),
  //  Tab Integrations
  rm: PropertyUnitRMIntegrationValsSchema.optional(),
};

//  Creating
export const PropertyUnitCreateValsScheme = Joi.object().keys({
  ...PropertyCreateEditCommonValsSchema,
  //  Tab General Info
  primaryAddress: generateCommonAddressJoiSchema({
    formattedLabel: 'primaryAddress',
    formattedRequired: true,
  }).required(),
  //  Tab Notes & History
  notes: Joi.array().items(Joi.string()).default([]).optional(),
});

//  Edit
export const PropertyUnitEditValsScheme = Joi.object().keys({
  ...PropertyCreateEditCommonValsSchema,
  //  Tab General Info
  primaryAddress: generateCommonAddressJoiSchema({
    formattedLabel: 'primaryAddress',
    formattedRequired: true,
  }).optional(),
});

//  Creating & Editing
export const DefaultPropertyUnitCreateEdit: interfaces.IPropertyUnitCreateEditBackup =
  {
    activeTab: interfaces.IPropertyUnitCreateUpdateTabsType.generalInfo,

    id: '',
    pic: DefaultCommonMediaUpload,
    name: '',
    unitTypes: [],
    bedrooms: 0,
    bathrooms: 0,
    squareFootage: 0,
    comments: '',
    taxId: '',
    //  Tab General Info
    addresses: [{ ...DefaultCommonAddress, name: 'Primary' }],
    //  Tab Notes & History
    notes: [],
    //  Tab Access
    access: { ...DefaultCommonAccess },
    //  Tab Integrations
    rm: {
      enabled: false,

      PropertyID: -1,
      UnitID: -1,
      LocationID: -1,
      updatedAt: null,
    },
  };
