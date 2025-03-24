import Joi from 'joi';
import moment from 'moment';

import { apiURLV1 } from '../../config';
import { emailValSchema } from '../../constants';

import { DefaultCommonAddress } from '../Address/constants';
import { generateCommonAddressJoiSchema } from '../Address/utils';

import { generateDefaultInvite } from '../Invites/utils';

import { JobSubModulePermsValsSchema } from '../Orgs/constants';
import { generateJobSubModulePerms } from '../Orgs/utils';

import * as interfaces from './interfaces';

export const JobApiRoutes = {
  base: `${apiURLV1}/jobs`,
  details: 'jobs/:jobId',
  members: 'jobs/:jobId/members',
  medias: 'jobs/:jobId/medias',

  memberInvite: 'jobs/:jobId/memberInvite',
  memberDelete: 'jobs/:jobId/memberDelete',
  memberEdit: 'jobs/:jobId/memberEdit',
  membersAdd: 'jobs/:jobId/membersAdd',

  jobMediaDetails: 'jobs/:jobId/medias/:mediaId',
  jobMedias: 'jobs/:jobId/medias',

  timelines: 'jobs/:jobId/timelines',
  workorders: 'jobs/workorder/:issueId',
  billdetails: 'jobs/billdetails/:billid',
  updatestatusissue: 'jobs/updateissuestatus/:issueId/:status',
};
export const BillApiRoutes = {
  base: `${apiURLV1}/bills`,
  details: 'job/billdetails/:billid',
}
export const Messages = {
  inviteSelfErrorMsg: 'Sorry, you cannot invite youself for a job',
  inviteEmailAlreadyMember:
    'Sorry, this email is already a member of this account',

  inviteEmailAlreadyAdded: 'Sorry, this email is already added',
  inviteEmailAlreadyRegistered:
    'Sorry, this email is already a member of this account, kindly add it in Add Members',

  missingEditPerms: 'Sorry, you are not authorized to edit this job',
};

export const DefaultUserJobDetail: interfaces.IUserJobDetail = {
  mediaPhotosCount: 0,
  mediaVideosCount: 0,
  mediaDocsCount: 0,

  contributionCount: 0,
};

const DefaultJobDetails: interfaces.IJobDetails = {
  mediaPhotosCount: 0,
  mediaVideosCount: 0,
  mediaDocsCount: 0,
  conversationCount: 0,
  notesCount: 0,
  commentsCount: 0,
billCount: 0
};

const DefaultServiceID: interfaces.IServiceIssuesPerm = {
  ServiceManagerIssueID: 0,
};

export const DefaultJob: interfaces.IJobPopulated = {
  id: '',
  primaryUserId: '',
  propertyId: '',
  propertyUnitId: '',
  title: '',
  googlePath: '',
  users: [],
  serviceIssues:DefaultServiceID,
  medias: [],
  // mediaPhotos: [],
  // mediaVideos: [],
  // mediaDocs: [],
  startDt: moment().startOf('day').utc().format(),
  endDt: moment().add(7, 'days').endOf('day').utc().format(),

  details: DefaultJobDetails,

  creatorId: '',

  currentUserJobPerm: {
    userId: '',
    primaryUserId: '',
    createdAt: '',
    updatedAt: '',
    details: DefaultUserJobDetail,
    permissions: { ...generateJobSubModulePerms() },
    invite: generateDefaultInvite(),
  },

  address: { ...DefaultCommonAddress },

  createdAt: '2021-03-18T12:49:07.963Z',
  updatedAt: '2021-03-18T12:49:07.963Z',
  isActive: true,
  isDeleted: false,

  contributors: [],
  mostContributorIndex: -1,
  mostRecentContributorIndex: -1,
};

//    //      //      //    Add or Edit
export const AddJobJoiScheme = Joi.object().keys({
  propertyId: Joi.string().allow('').optional(),
  propertyUnitId: Joi.string().allow('').optional(),

  title: Joi.string().trim().required(),
  description: Joi.string().trim().optional().allow(''),
  startDt: Joi.date().iso().required(),
  endDt: Joi.date().iso().min(Joi.ref('startDt')).required(),
  address: generateCommonAddressJoiSchema({}).required(),

  users: Joi.array()
    .items(
      Joi.object().keys({
        name: Joi.string().allow('').required(),
        email: emailValSchema.required(),
        permissions: Joi.object().keys(JobSubModulePermsValsSchema).required(),
      })
    )
    .required()
    .unique('email'),
});

export const AddEditMapDefaultErrors = {
  title: '',
  address: '',
};
export const AddEditMapJoiScheme = Joi.object().keys({
  title: Joi.string().trim().allow('').optional(),
  address: Joi.string().trim().required().label('Address'),
});

export const AddEditDetailsDefaultErrors = {
  propertyId: '',
  propertyUnitId: '',
  title: '',
  formatted: '',
  city: '',
  state: '',
  startDt: '',
  endDt: '',
  users: '',
};
export const JobEditDetailsJoiScheme = Joi.object().keys({
  propertyId: Joi.string().allow('').optional(),
  propertyUnitId: Joi.string().allow('').optional(),

  title: Joi.string().trim().required(),
  description: Joi.string().trim().optional().allow(''),
  startDt: Joi.date().iso().required(),
  endDt: Joi.date().iso().min(Joi.ref('startDt')).required(),
  address: generateCommonAddressJoiSchema({}).required(),
});

export const AddEditInviteMemberJoiScheme = Joi.object().keys({
  name: Joi.string().trim().required(),
  email: emailValSchema.required(),
});

export const ContributorColorClasses = [
  'green-btn',
  'lightblue-btn',
  'blue-btn',
  'red-btn',
];

export const InviteMemberJoiScheme = Joi.object().keys({
  name: Joi.string().trim().required(),
  email: emailValSchema.required(),
  permissions: Joi.object().keys(JobSubModulePermsValsSchema).required(),
});

//  Time Line
export const DefaultJobDetailTimelineItemFilters: interfaces.IJobDetailTimelineItemFilters =
  {
    base: true,
    mediaPhotos: true,
    mediaVideos: true,
    documents: true,
    conversations: true,
    comments: true,
    notes: true,
  };

export const DefaultJobDetailTimelineUserUpdateFilters: interfaces.IJobDetailTimelineUserUpdateFilters =
  {
    base: true,
    permissions: true,
    invitation: true,
    termination: true,
  };
