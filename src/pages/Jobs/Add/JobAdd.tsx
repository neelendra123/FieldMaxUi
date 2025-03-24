import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useMountedState } from 'react-use';

import { ICommonAddress, IModuleKind } from '../../../interfaces';

import { useQuery } from '../../../utils/hooks';

import { IAppReduxState } from '../../../redux/reducer';
import { redirectAction } from '../../../redux/redirects/redirects.actions';
import { jobCreateBackupUpdateAction } from '../../../redux/jobs/jobs.actions';
import { propertyCreateBackupUpdateAction } from '../../../redux/properties/properties.actions';
import { redirectResetAction } from '../../../redux/redirects/redirects.actions';

import Main from '../../../components/Layouts/Main';
import { IsFetching } from '../../../components/Common';

import { userListAllService } from '../../Users/services';
import { getUserTypes, formatUserName } from '../../Users/utils';

import { generateDefaultInvite } from '../../Invites/utils';

import { generateJobSubModulePerms } from '../../Orgs/utils';

import PropertyRoutes from '../../Properties/routes';
import { DefaultPropertyCreateEditBackup } from '../../Properties/constants';

import JobRoutes from '../routes';
import * as interfaces from '../interfaces';
import * as constants from '../constants';
import * as utils from '../utils';

import { Details, Map, EditMember, AddMembers, InviteMember } from '.';

export default function JobAdd() {
  const isMounted = useMountedState();

  let query = useQuery();
  const history = useHistory();
  const { pathname } = useLocation();

  const {
    auth: { authUser, accountIndex },
    job: { createBackup },
    redirect: { redirectCreated },
  } = useSelector((state: IAppReduxState) => state);
  const reduxActionDispatch = useDispatch();

  const primaryUserId = authUser.accounts[accountIndex].primaryUserId.id;

  const [paths] = useState(utils.generateAddPaths(JobRoutes.routes.add.path));

  const [isFetching, setIsFetching] = useState(false);

  const [job, setJob] = useState<interfaces.IJobPopulated>({
    // ...constants.DefaultJob,
    ...createBackup,
    primaryUserId,
    creatorId: authUser.id,
    currentUserJobPerm: {
      ...constants.DefaultJob.currentUserJobPerm,
      userId: authUser.id,
      primaryUserId,
    },
  });
  const [accountUsers, setAccountUsers] = useState<interfaces.IAddJobUser[]>(
    []
  );
  const [selectedUser, setSelectedUser] = useState<interfaces.IAddJobUser>(
    utils.addJobDefaultUserGenerate()
  );

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const allAccountUsers = await userListAllService({
        moduleKind: IModuleKind.jobs,
      });
      if (!isMounted()) {
        return;
      }

      ///
      //  This is to make the job users listing with their permissions as per account level
      ///
      const accountUsers: interfaces.IAddJobUser[] = [];
      for (let allAccountUser of allAccountUsers) {
        let skip = false;
        //  Iterating if super admin or admin or owner of the organization
        const userType = getUserTypes(
          allAccountUser.userType,
          allAccountUser.accounts[0].userType
        );
        if (
          userType.isSuperAdmin ||
          userType.isAdmin ||
          userType.isOwner ||
          allAccountUser.id === authUser.id //  Iterating if the current user
        ) {
          skip = true;
        }

        accountUsers.push({
          uid: allAccountUser.id,
          id: allAccountUser.id,
          name: formatUserName(
            allAccountUser.firstName,
            allAccountUser.lastName
          ),
          picURL: allAccountUser.picURL,
          email: allAccountUser.email,
          selected: false,
          skip,
          permissions: {
            ...generateJobSubModulePerms(),
            ...allAccountUser.accounts[0].permissions.jobs,
          },
          invite: generateDefaultInvite(),
        });
      }

      setAccountUsers(accountUsers);

      //  This is incase of refreshing and user was on some other page
      if (!job.address.formatted) {
        history.push(paths.map);
      }

      if (redirectCreated.kind) {
        //  If redirected back after creating a property then setting the job data
        if (
          redirectCreated.kind === IModuleKind.properties &&
          redirectCreated.propertyId
        ) {
          setJob({
            ...job,
            propertyId: redirectCreated.propertyId,
            address: redirectCreated.address.formatted
              ? { ...redirectCreated.address }
              : { ...job.address },
          });
        }

        //Reseting the created redirect data
        reduxActionDispatch(redirectResetAction());
      }
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

    //  Creating Backup of Job Create Data
    reduxActionDispatch(
      jobCreateBackupUpdateAction({
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
    if (isFetching) {
      return null;
    }

    switch (query.get('type') || 'Map') {
      case 'Details':
        return (
          <Details
            paths={paths}
            job={job}
            setJob={setJob}
            accountUsers={accountUsers}
            setAccountUsers={setAccountUsers}
            setSelectedUser={setSelectedUser}
          />
        );
      case 'AddMembers':
        return (
          <AddMembers
            paths={paths}
            job={job}
            accountUsers={accountUsers}
            setAccountUsers={setAccountUsers}
            setSelectedUser={setSelectedUser}
          />
        );
      case 'InviteMember':
        return (
          <InviteMember
            currentUser={{
              email: authUser.email,
            }}
            paths={paths}
            accountUsers={accountUsers}
            setAccountUsers={setAccountUsers}
            selectedUser={selectedUser}
          />
        );
      case 'EditMember':
        return (
          <EditMember
            paths={paths}
            accountUsers={accountUsers}
            setAccountUsers={setAccountUsers}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        );
      default:
        return (
          <Map
            job={job}
            setJob={setJob}
            paths={paths}
            backupData={backupData}
          />
        );
    }
  };
  return (
    <Main sideBarId={JobRoutes.routes.details.sideBarId}>
      {isFetching && <IsFetching />}

      <div className="mx-4">{getType()}</div>
    </Main>
  );
}
