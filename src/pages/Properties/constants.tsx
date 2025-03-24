import Joi from 'joi';

import { apiURLV1 } from '../../config';
import { DefaultCommonMediaUpload } from '../../constants';
import { DefaultCommonAddress } from '../Address/constants';

import { generateCommonAddressJoiSchema } from '../Address/utils';
import {
  CommonAccessValSchema,
  DefaultCommonAccess,
} from '../Common/constants';

import * as interfaces from './interfaces';

export const PropertyApiRoutes = {
  base: `${apiURLV1}/property`,
  listAll: `${apiURLV1}/property/listAll`,
  blockUnblock: 'property/:propertyId/block',
  details: 'property/:propertyId',
  delete: 'property/:propertyId',
};

const PropertyRMIntegrationValsSchema = Joi.object()
  .keys({
    enabled: Joi.boolean().default(false).required(),
  })
  .default({
    enabled: false,
  });

const PropertyCreateEditCommonValsSchema = {
  name: Joi.string().trim().required(),
  shortName: Joi.string().trim().required(),
  pic: Joi.string().trim().optional().allow(''),
  taxId: Joi.string().trim().optional().allow(''),
  squareFootage: Joi.number().optional().default(0),
  comments: Joi.string().trim().optional().allow(''),
  propertyTypes: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .max(1)
    .required(),
  chargeTypes: Joi.array().items(Joi.string().required()).min(1).required(),
  //  Tab General Info
  billingAddress: generateCommonAddressJoiSchema({
    formattedLabel: 'billingAddress',
  }).optional(),
  addresses: Joi.array()
    .items(generateCommonAddressJoiSchema({}))
    .default([])
    .optional(),
  //  Tab Units
  propertyUnits: Joi.array().items(Joi.string()).default([]).optional(),
  //  Tab Owners
  userOwners: Joi.array().items(Joi.string()).default([]).optional(),
  //  Tab Access
  access: CommonAccessValSchema.optional(),
  //  Tab Integrations
  rm: PropertyRMIntegrationValsSchema.optional(),
};

export const PropertyAddValsScheme = Joi.object().keys({
  ...PropertyCreateEditCommonValsSchema,
  //  Tab General Info
  primaryAddress: generateCommonAddressJoiSchema({
    formattedLabel: 'primaryAddress',
    formattedRequired: true,
  }).required(),
  //  Tab Notes & History
  notes: Joi.array().items(Joi.string()).default([]).optional(),
});

export const PropertyEditValsScheme = Joi.object().keys({
  ...PropertyCreateEditCommonValsSchema,
  //  Tab General Info
  primaryAddress: generateCommonAddressJoiSchema({
    formattedLabel: 'primaryAddress',
    formattedRequired: true,
  }).optional(),
});

export const DefaultUserOwnerCreateEdit: interfaces.IProperty = {
  id: '',
  primaryUserId: '',
  creatorId: '',
  name: '',
  shortName: '',
  squareFootage: 0,
  comments: '',
  taxId: '',
  propertyTypes: [],
  chargeTypes: [],
  jobs: [],
  // pic: '',
  //  Tab General Info
  primaryAddress: { ...DefaultCommonAddress, name: 'Primary' },
  billingAddress: { ...DefaultCommonAddress, name: 'Billing' },
  addresses: [
    { ...DefaultCommonAddress, name: 'Primary' },
    { ...DefaultCommonAddress, name: 'Billing' },
  ],
  //  Tab UserOwners
  userOwners: [],
  //  Tab Units
  propertyUnits: [],
  //  Tab Notes & History
  notes: [],
  //  Tab Access
  access: { ...DefaultCommonAccess },
  //  Tab Integrations
  rm: {
    enabled: false,

    PropertyID: -1,
    LocationID: -1,
    updatedAt: null,
  },

  isActive: true,
  isDeleted: false,
  createdAt: '2021-03-18T12:49:07.963Z',
  updatedAt: '2021-03-18T12:49:07.963Z',
};

//  Creating
export const DefaultPropertyCreateEditBackup: interfaces.IPropertyCreateEditBackup =
  {
    activeTab: interfaces.IPropertyCreateUpdateTabsType.generalInfo,

    id: '',
    pic: DefaultCommonMediaUpload,
    name: '',
    shortName: '',
    squareFootage: 0,
    comments: '',
    propertyTypes: [],
    chargeTypes: [],
    taxId: '',
    //  Tab General Info
    addresses: [
      { ...DefaultCommonAddress, name: 'Primary' },
      { ...DefaultCommonAddress, name: 'Billing' },
    ],
    //  Tab UserOwners
    userOwners: [],
    //  Tab Units
    propertyUnits: [],
    //  Tab Notes & History
    notes: [],
    //  Tab Access
    access: { ...DefaultCommonAccess },
    //  Tab Integrations
    rm: {
      enabled: false,

      PropertyID: -1,
      LocationID: -1,
      updatedAt: null,
    },
  };
