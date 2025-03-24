import { lazy } from 'react';

const JobList = lazy(() => import('./List/JobList'));
const JobAdd = lazy(() => import('./Add/JobAdd'));
const JobDetails = lazy(() => import('./Details/JobDetails'));

const JobInfoEdit = lazy(() => import('./EditInfo/JobInfoEdit'));

const JobMembersEdit = lazy(() => import('./EditMembers/JobMembersEdit'));
const Bills = lazy(()=>import('./Bills/Bills'))
export { JobList, JobAdd, JobDetails, JobInfoEdit, JobMembersEdit, Bills };
