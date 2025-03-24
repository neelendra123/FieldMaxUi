import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMountedState } from 'react-use';

import { IModuleKind } from '../../../interfaces';

import { generateDynamicPath } from '../../../utils/common';
import { useQuery } from '../../../utils/hooks';

import { IAppReduxState } from '../../../redux/reducer';

import Main from '../../../components/Layouts/Main';

import { generateJobSubModulePerms } from '../../Orgs/utils';

import { generateDefaultInvite } from '../../Invites/utils';

import { userListAllService } from '../../Users/services';
import { getUserTypes, formatUserName } from '../../Users/utils';

import AddMembers from './AddMembers';
import EditMember from './EditMember';
import InviteMember from './InviteMember';
import EditMembers from './EditMembers';

import JobRoutes from '../routes';
import * as interfaces from '../interfaces';
import * as constants from '../constants';
import * as utils from '../utils';
import * as services from '../services';
import { JobsTableRowSkeletonComponent } from '../skeletons';

export default function JobMembersEdit() {
  const isMounted = useMountedState();

  let query = useQuery();
  const params: { jobId: string } = useParams();
  const { authUser, accountIndex } = useSelector(
    (state: IAppReduxState) => state.auth
  );

  const primaryUserId = authUser.accounts[accountIndex].primaryUserId.id;

  const [isFetching, setIsFetching] = useState(false);

  const [paths] = useState(
    utils.generateEditMembersPaths(
      generateDynamicPath(JobRoutes.routes.membersEdit.path, {
        jobId: params.jobId,
      })
    )
  );

  const [job, setJob] = useState<interfaces.IJobPopulated>({
    ...constants.DefaultJob,
    id: params.jobId,
    primaryUserId,
    creatorId: '',
    currentUserJobPerm: {
      ...constants.DefaultJob.currentUserJobPerm,
      userId: authUser.id,
      primaryUserId,
    },
  });
  const [accountUsers, setAccountUsers] = useState<interfaces.IEditJobUser[]>(
    []
  );
  const [selectedUser, setSelectedUser] = useState<interfaces.IEditJobUser>(
    utils.editJobDefaultUserGenerate()
  );

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const [jobDetail, allAccountUsers] = await Promise.all([
        services.jobDetailService(job.id, {
          userPopulate: true,
        }),
        userListAllService({
          moduleKind: IModuleKind.jobs,
        }),
      ]);

      if (!isMounted()) {
        return;
      }

      //  Job Details Format
      const formatedJob = utils.parsePopulatedJob(
        jobDetail,
        {
          userId: authUser.id,
          baseUserType: authUser.userType,
          accountUserType: authUser.accounts[accountIndex].userType,
        },
        false
      );
      setJob(formatedJob);

      ///
      //  This is to make the job users listing with their permissions
      ///
      //  Making Cache of All Account Users with their access, details and permissions in the current job
      const jobUsersCache: Record<string, interfaces.IEditJobUser> = {};
      formatedJob.users.forEach((jobUser) => {
        jobUsersCache[jobUser.userId.id] = {
          id: jobUser.userId.id,
          selected: true,
          skip: false,
          name: formatUserName(
            jobUser.userId.firstName,
            jobUser.userId.lastName
          ),
          email: jobUser.userId.email,
          picURL: jobUser.userId.picURL,
          permissions: jobUser.permissions,
          invite: jobUser.invite,
        };
      });

      const accountUsers: interfaces.IEditJobUser[] = [];
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

        let selected = jobUsersCache[allAccountUser.id]?.selected ?? false;

        const userJobPerms = allAccountUser.accounts[0].permissions.jobs;

        accountUsers.push({
          id: allAccountUser.id,
          name: formatUserName(
            allAccountUser.firstName,
            allAccountUser.lastName
          ),
          picURL: allAccountUser.picURL,
          email: allAccountUser.email,
          selected,
          skip,
          // skip: false,
          permissions: {
            ...generateJobSubModulePerms(),
            ...(jobUsersCache[allAccountUser.id]?.permissions || userJobPerms),
          },
          invite: {
            ...generateDefaultInvite(),
            ...jobUsersCache[allAccountUser.id]?.invite,
          },
        });
      }

      setAccountUsers(accountUsers);
    } catch (error) {
      console.error(error);
    }

    if (!isMounted()) {
      return;
    }
    setIsFetching(false);
  };

  const fetchDataEffect = async () => {
    await fetchData();
  };

  useEffect(() => {
    fetchDataEffect();
  }, []);

  const getType = () => {
    if (isFetching) {
      return <JobsTableRowSkeletonComponent rows={5} />;
    }

    switch (query.get('type') || 'EditMembers') {
      case 'AddMembers':
        return (
          <AddMembers
            paths={paths}
            job={job}
            // Only sending those members who are not member
            accountUsers={accountUsers.filter((accountUser) => {
              return accountUser.skip || accountUser.selected ? false : true;
            })}
            setSelectedUser={setSelectedUser}
            currentUser={{
              id: authUser.id,
              email: authUser.email,
            }}
            fetchDataEffect={fetchDataEffect}
          />
        );
      case 'EditMember':
        return (
          <EditMember
            jobId={params.jobId}
            paths={paths}
            selectedUser={selectedUser}
            fetchDataEffect={fetchDataEffect}
          />
        );
      case 'InviteMember':
        return (
          <InviteMember
            jobId={params.jobId}
            currentUser={{
              id: authUser.id,
              email: authUser.email,
            }}
            paths={paths}
            fetchDataEffect={fetchDataEffect}
          />
        );
      default:
        return (
          <EditMembers
            jobId={params.jobId}
            paths={paths}
            job={job}
            fetchDataEffect={fetchDataEffect}
            accountUsers={accountUsers}
            setSelectedUser={setSelectedUser}
            currentUser={{
              id: authUser.id,
              email: authUser.email,
            }}
          />
        );
    }
  };
  return (
    <Main sideBarId={JobRoutes.routes.details.sideBarId}>
      <div className="mx-4">{getType()}</div>
    </Main>
  );
}
