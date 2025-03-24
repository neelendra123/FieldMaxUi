import { useEffect, useState } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useMountedState } from 'react-use';

import { ICommonAddress, IModuleKind } from '../../../interfaces';

import { useQuery } from '../../../utils/hooks';

import { IAppReduxState } from '../../../redux/reducer';
import { redirectAction } from '../../../redux/redirects/redirects.actions';
import { jobEditBackupUpdateAction } from '../../../redux/jobs/jobs.actions';
import { propertyCreateBackupUpdateAction } from '../../../redux/properties/properties.actions';
import { redirectResetAction } from '../../../redux/redirects/redirects.actions';

import Main from '../../../components/Layouts/Main';
import { IsFetching } from '../../../components/Common';

import PropertyRoutes from '../../Properties/routes';
import { DefaultPropertyCreateEditBackup } from '../../Properties/constants';

import Details from './Details';
import Map from './Map';

import JobRoutes from '../routes';
import * as interfaces from '../interfaces';
import * as constants from '../constants';
import * as utils from '../utils';
import * as services from '../services';

export default function JobEdit() {
  const isMounted = useMountedState();

  const query = useQuery();
  const history = useHistory();
  const { pathname } = useLocation();
  const params: { jobId: string } = useParams();

  const {
    auth: { authUser, accountIndex },
    job: { editBackup },
    redirect: { redirectCreated },
  } = useSelector((state: IAppReduxState) => state);
  const reduxActionDispatch = useDispatch();

  const primaryUserId = authUser.accounts[accountIndex].primaryUserId.id;

  const [isFetching, setIsFetching] = useState(false);

  const [paths] = useState<interfaces.IJobEditInfoPaths>(
    utils.generateEditInfoPaths(history.location.pathname)
  );

  const [job, setJob] = useState<interfaces.IJobPopulated>({
    // ...constants.DefaultJob,
    ...editBackup,
    id: params.jobId,
    primaryUserId,
    creatorId: '',
    currentUserJobPerm: {
      ...constants.DefaultJob.currentUserJobPerm,
      userId: authUser.id,
      primaryUserId,
    },
  });

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const jobDetail = await services.jobDetailService(job.id, {
        userPopulate: true,
      });
      if (!isMounted()) {
        return;
      }

      //  Job Details Format
      let formatedJob = utils.parsePopulatedJob(
        jobDetail,
        {
          userId: authUser.id,
          baseUserType: authUser.userType,
          accountUserType: authUser.accounts[accountIndex].userType,
        },
        false
      );

      if (redirectCreated.kind) {
        //  If redirected back after creating a property then setting the job data
        if (
          redirectCreated.kind === IModuleKind.properties &&
          redirectCreated.propertyId &&
          formatedJob.id === params.jobId
        ) {
          formatedJob = {
            ...formatedJob,
            propertyId: redirectCreated.propertyId,
            address: redirectCreated.address.formatted
              ? { ...redirectCreated.address }
              : { ...formatedJob.address },
          };
        }

        //Reseting the created redirect data
        reduxActionDispatch(redirectResetAction());

        console.log({
          msg: 'formatedJob-formatedJob',
          formatedJob,
        });
      }

      console.log({
        msg: 'redirectCreated-redirectCreated',
        redirectCreated,
      });

      setJob(formatedJob);
    } catch (error) {
      console.error(error);
    }

    if (!isMounted()) {
      return;
    }
    setIsFetching(false);
  };

  //  This is for Property Create Redirect
  const backupData = (address: ICommonAddress) => {
    console.log({
      address,
      job,
    });

    //  Adding on Redux Redirect path for redirecting back after creation
    reduxActionDispatch(
      redirectAction({
        redirectPath: pathname,
        kind: IModuleKind.jobs,
      })
    );

    //  Creating Backup of Job Edit Data
    reduxActionDispatch(
      jobEditBackupUpdateAction({
        ...job,
        address,
      })
    );

    //  Updating the default Primary Address for Property Create
    reduxActionDispatch(
      propertyCreateBackupUpdateAction({
        ...DefaultPropertyCreateEditBackup,
        addresses: DefaultPropertyCreateEditBackup.addresses.map(
          (propAddress, index) => {
            if (!index) {
              //  0 is the index for the primary address
              return address;
            }
            return propAddress;
          }
        ),
      })
    );

    history.push(PropertyRoutes.routes.add.path);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getType = () => {
    switch (query.get('type') || 'Details') {
      case 'Map':
        return (
          <Map
            job={job}
            setJob={setJob}
            paths={paths}
            backupData={backupData}
          />
        );
      default:
        return <Details paths={paths} job={job} setJob={setJob} />;
    }
  };
  return (
    <Main sideBarId={JobRoutes.routes.details.sideBarId}>
      {isFetching && <IsFetching />}
      {!isFetching && !!job.id && getType()}
    </Main>
  );
}
