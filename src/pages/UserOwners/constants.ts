import Joi from 'joi';

import { apiURLV1, baseURL } from '../../config';
import { DefaultCommonMediaUpload, emailValSchema } from '../../constants';
import { DefaultCommonAddress } from '../Address/constants';

import { generateCommonAddressJoiSchema } from '../Address/utils';

import {
  CommonAccessValSchema,
  CommonEmailsSchema,
  CommonPhoneNumbersSchema,
  DefaultCommonAccess,
  DefaultCommonEmail,
  DefaultCommonPhoneNumber,
} from '../Common/constants';

import * as interfaces from './interfaces';

export const UserOwnerApiRoutes = {
  base: `${apiURLV1}/userOwners`,
  details: 'userOwners/:userOwnerId',
  listAll: `${apiURLV1}/userOwners/listAll`,
  blockUnblock: 'userOwners/:userOwnerId/block',
  delete: 'userOwners/:userOwnerId',
  invite: 'userOwners/:userOwnerId/invite',
  edit: 'userOwners/:userOwnerId',
};

export const DefaultUserOwnerPic = `${baseURL}assets/images/defaultUserImage.png`;

//  Creating
export const DefaultUserOwnerCreateEditBackup: interfaces.IUserOwnerCreateEditBackup =
  {
    activeTab: interfaces.IOwnerCreateUpdateTabsType.generalInfo,

    id: '',
    pic: DefaultCommonMediaUpload,
    firstName: '',
    lastName: '',
    email: '',
    taxId: '',
    comments: '',
    //  Tab General Info
    emails: [{ ...DefaultCommonEmail }],
    phoneNumbers: [{ ...DefaultCommonPhoneNumber }],
    addresses: [
      { ...DefaultCommonAddress, name: 'Primary' },
      { ...DefaultCommonAddress, name: 'Billing' },
    ],
    //  Tab Properties
    properties: [],
    //  Tab Notes & History
    notes: [],
    //  Tab Access
    access: { ...DefaultCommonAccess },
    //  Tab Integrations
    rm: {
      enabled: false,

      displayName: '',

      OwnerID: -1,
      LocationID: -1,
      updatedAt: null,
    },
  };

const UserOwnerPropertiesValSchema = Joi.array()
  .items(
    Joi.object().keys({
      propertyId: Joi.string().default(null),
      propertyUnitId: Joi.array().items(Joi.string()).default([]),
    })
  )
  .default([]);

const UserOwnerRMIntegrationValsSchema = Joi.object()
  .keys({
    enabled: Joi.boolean().default(false).required(),
    displayName: Joi.when('enabled', {
      is: Joi.equal(true),
      then: Joi.string().required(),
      otherwise: Joi.string().allow('').default('').optional(),
    }).label('RM Display Name'),
  })
  .default({
    enabled: false,
    displayName: '',
  });

export const UserOwnerCreateValsScheme = Joi.object().keys({
  firstName: Joi.string().trim().required().label('First name'),
  lastName: Joi.string().trim().allow('').optional().label('Last name'),
  email: emailValSchema.required(),
  taxId: Joi.string().trim().allow('').optional(),
  comments: Joi.string().trim().optional().allow(''),
  //  Tab General Info
  emails: CommonEmailsSchema.optional(),
  phoneNumbers: CommonPhoneNumbersSchema.optional(),
  primaryAddress: generateCommonAddressJoiSchema({
    formattedLabel: 'primaryAddress',
    formattedRequired: true,
  }).required(),
  billingAddress: generateCommonAddressJoiSchema({
    formattedLabel: 'billingAddress',
  }).optional(),
  addresses: Joi.array()
    .items(generateCommonAddressJoiSchema({}))
    .default([])
    .optional(),
  //  Tab Properties
  properties: UserOwnerPropertiesValSchema.optional(),
  //  Tab Access
  access: CommonAccessValSchema.optional(),
  //  Tab Integrations
  rm: UserOwnerRMIntegrationValsSchema.optional(),

  //  Tab Notes & History
  notes: Joi.array().items(Joi.string()).default([]).optional(),

  sendInvite: Joi.boolean().default(false).optional(),
});

//  Details
export const DefaultUserOwnerCreateEdit: Omit<
  interfaces.IUserOwner,
  | 'primaryUserId'
  | 'userId'
  | 'creatorId'
  | 'isActive'
  | 'isDeleted'
  | 'createdAt'
  | 'updatedAt'
> = {
  id: '',

  firstName: '',
  lastName: '',
  email: '',
  taxId: '',
  comments: '',
  //  Tab General Info
  emails: [{ ...DefaultCommonEmail }],
  phoneNumbers: [{ ...DefaultCommonPhoneNumber }],

  primaryAddress: { ...DefaultCommonAddress, name: 'Primary' },
  billingAddress: { ...DefaultCommonAddress, name: 'Billing' },
  addresses: [],
  //  Tab Properties
  properties: [],

  //  Tab Access
  access: { ...DefaultCommonAccess },
  //  Tab Integrations
  rm: {
    enabled: false,

    displayName: '',

    OwnerID: -1,
    LocationID: -1,
    updatedAt: null,
  },
};

export const UserOwnerEditValsScheme = Joi.object().keys({
  firstName: Joi.string().trim().required().label('First name'),
  lastName: Joi.string().trim().allow('').optional().label('Last name'),
  taxId: Joi.string().trim().allow('').optional(),
  comments: Joi.string().trim().optional().allow(''),
  //  Tab General Info
  emails: CommonEmailsSchema.optional(),
  phoneNumbers: CommonPhoneNumbersSchema.optional(),
  primaryAddress: generateCommonAddressJoiSchema({
    formattedLabel: 'primaryAddress',
    formattedRequired: true,
  }).optional(),
  billingAddress: generateCommonAddressJoiSchema({
    formattedLabel: 'billingAddress',
  }).optional(),
  addresses: Joi.array()
    .items(generateCommonAddressJoiSchema({}))
    .default([])
    .optional(),
  //  Tab Properties
  properties: UserOwnerPropertiesValSchema.optional(),
  //  Tab Access
  access: CommonAccessValSchema.optional(),
  //  Tab Integrations
  rm: UserOwnerRMIntegrationValsSchema.optional(),
});
