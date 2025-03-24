import { IRouteParams, IModuleKind } from '../../interfaces';
import { CommonPerms } from '../../constants';

import { IMediaKind } from '../Medias/interfaces';
import * as MediaPages from '../Medias';

import * as Pages from './index';

import { PhotoDetails, VideoDetails, DocDetails } from '../Medias';

const Routes: {
  name: string;
  sidebarId: number;
  routes: Record<
    | 'list'
    | 'add'
    | 'infoEdit'
    | 'membersEdit'
    | 'details'
    | 'jobVideoDetails'
    | 'jobVideoAdd'
    | 'jobVideoEdit'
    | 'jobPhotoDetails'
    | 'jobPhotoAdd'
    | 'jobPhotoEdit'
    | 'jobDocDetails'
    | 'jobDocAdd'
    | 'jobDocEdit'
    | 'jobMediasVisibility'
    | 'jobMediasVisibilityNew'
    | 'bills',
    IRouteParams
  >;
} = {
  name: 'Jobs',
  sidebarId: 4,
  routes: {
    list: {
      name: 'List',
      key: 'jobList',
      path: `/jobs/list`,
      component: Pages.JobList,

      authRequired: true,

      aclCheck: {
        moduleKind: IModuleKind.jobs,
        requiredPermission: CommonPerms.all | CommonPerms.view,
      },
      sideBarId: 4.1,
    },
    add: {
      name: 'Add',
      key: 'jobAdd',
      path: `/jobs/add`,
      component: Pages.JobAdd,

      authRequired: true,

      aclCheck: {
        moduleKind: IModuleKind.jobs,
        requiredPermission: CommonPerms.all | CommonPerms.add,
      },
      sideBarId: 4.2,
    },
    details: {
      name: 'Detail',
      key: 'JobDetails',
      path: '/jobs/:jobId',
      component: Pages.JobDetails,

      authRequired: true,

      aclCheck: {
        moduleKind: IModuleKind.jobs,
        requiredPermission: CommonPerms.all | CommonPerms.view,
      },
      sideBarId: 4.3,
    },

    infoEdit: {
      name: 'Edit',
      key: 'EditJobs',
      path: `/jobs/:jobId/info`,
      component: Pages.JobInfoEdit,

      authRequired: true,

      aclCheck: {
        moduleKind: IModuleKind.jobs,
        requiredPermission: CommonPerms.all | CommonPerms.edit,
      },
      sideBarId: 4.4,
    },

    membersEdit: {
      name: 'MembersEdit',
      key: 'MembersEdit',
      path: `/jobs/:jobId/members`,
      component: Pages.JobMembersEdit,

      authRequired: true,

      aclCheck: {
        moduleKind: IModuleKind.jobs,
        requiredPermission: CommonPerms.all | CommonPerms.edit,
      },
      sideBarId: 4.5,
    },

    jobVideoDetails: {
      name: 'Job Video Details',
      key: 'jobVideoDetails',
      path: `/jobs/:jobId/${IMediaKind.JobVideo}/:mediaId/details`,
      component: VideoDetails,
      authRequired: true,
      sideBarId: 4.71,
    },
    jobVideoAdd: {
      name: 'Job Video Add',
      key: 'jobVideoAdd',
      path: `/jobs/:jobId/${IMediaKind.JobVideo}/add`,
      component: MediaPages.VideoAdd,
      authRequired: true,
      sideBarId: 4.72,
    },
    jobVideoEdit: {
      name: 'Job Video Edit',
      key: 'jobVideoEdit',
      path: `/jobs/:jobId/${IMediaKind.JobVideo}/:mediaId/subMedia/:subMediaId/edit`,
      component: MediaPages.VideoEdit,
      authRequired: true,
      sideBarId: 4.73,
    },

    jobPhotoDetails: {
      name: 'Job Photo Details',
      key: 'jobPhotoDetails',
      path: `/jobs/:jobId/${IMediaKind.JobPhoto}/:mediaId/details`,
      component: PhotoDetails,
      authRequired: true,
      sideBarId: 4.81,
    },
    jobPhotoAdd: {
      name: 'Job Photo Add',
      key: 'jobPhotoAdd',
      path: `/jobs/:jobId/${IMediaKind.JobPhoto}/add`,
      component: MediaPages.PhotoAdd,
      authRequired: true,
      sideBarId: 4.82,
    },
    jobPhotoEdit: {
      name: 'Job Photo Edit',
      key: 'jobPhotoEdit',
      path: `/jobs/:jobId/${IMediaKind.JobPhoto}/:mediaId/subMedia/:subMediaId/edit`,
      component: MediaPages.PhotoEdit,
      authRequired: true,
      sideBarId: 4.83,
    },

    jobDocDetails: {
      name: 'Job Doc Details',
      key: 'jobDocDetails',
      path: `/jobs/:jobId/${IMediaKind.JobDoc}/:mediaId/details`,
      component: DocDetails,
      authRequired: true,
      sideBarId: 4.91,
    },
    jobDocAdd: {
      name: 'Document',
      key: 'jobDocAdd',
      path: `/jobs/:jobId/${IMediaKind.JobDoc}/add`,
      component: MediaPages.DocumentAdd,
      authRequired: true,
      sideBarId: 4.92,
    },
    jobDocEdit: {
      name: 'Document Edit',
      key: 'jobDocEdit',
      path: `/jobs/:jobId/${IMediaKind.JobDoc}/:mediaId/subMedia/:subMediaId/edit`,
      component: MediaPages.DocumentEdit,
      authRequired: true,
      sideBarId: 4.93,
    },

    jobMediasVisibility: {
      name: 'Visibility',
      key: 'jobMediasVisibility',
      path: `/jobs/:jobId/medias/visibility`,
      component: MediaPages.MediasVisibility,
      authRequired: true,
      sideBarId: 4.6,
    },

    jobMediasVisibilityNew: {
      name: 'Visibility',
      key: 'jobMediasVisibility',
      path: `/jobs/:jobId/medias/visibilityNew`,
      component: MediaPages.MediasVisibilityNew,
      authRequired: true,
      sideBarId: 4.61,
    },
    bills: {
      name: 'Bills',
      key: 'bills',
      path: `/jobs/:jobId/bills`,
      component: Pages.Bills,
      authRequired: true,
      aclCheck: {
        moduleKind: IModuleKind.jobs,
        requiredPermission: CommonPerms.all | CommonPerms.edit,
      },
      sideBarId: 4.7,
    },
  },
};

export default Routes;
