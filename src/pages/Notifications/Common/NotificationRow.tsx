import { Fragment, useState } from 'react';
import TimeAgo from 'react-timeago';
// import { useMountedState } from 'react-use';
import { useHistory } from 'react-router-dom';

import { successToast } from '../../../utils/toast';
import { generateDynamicPath } from '../../../utils/common';

import { ChatIcon, ShieldIcon, MediaIcon } from '../../../components/Icons';

import { IInviteStatusKind } from '../../Invites/interfaces';
import { inviteStatusUpdateService } from '../../Invites/services';

import { DefaultUserPic } from '../../Users/constants';
import { formatUserName } from '../../Users/utils';

import JobRoutes from '../../Jobs/routes';

import * as interfaces from '../interfaces';

interface NotificationRowComponentProps {
  full?: boolean;
  record: interfaces.INotification;
}

const JobEventComponent = ({
  record,
  full,
  userName,
}: {
  full?: boolean;
  record: interfaces.INotification;
  userName: string;
}) => {
  // const isMounted = useMountedState();
  const history = useHistory();

  const { kind, jobId: job } = record;

  const [isFetching, setIsFetching] = useState(false);

  const acceptInvite = async (
    status: IInviteStatusKind.accepted | IInviteStatusKind.rejected
  ) => {
    try {
      setIsFetching(true);

      const result = await inviteStatusUpdateService({
        status,
        token: record.jobId?.users[0]?.invite?.token || ('' as string),
      });

      successToast(result.message);
    } catch (error) {
      console.error(error);
      setIsFetching(false);
    }
  };

  if (!job?.id) {
    return null;
  }

  const jobDetailsRedirect = () => {
    const path = generateDynamicPath(JobRoutes.routes.details.path, {
      jobId: job.id,
    });

    history.push(path);
  };

  return (
    <Fragment>
      <div className="d-flex mt-3">
        <div className="notification-row">
          <img
            src={record.creatorId.picURL || DefaultUserPic}
            alt={userName}
            title={userName}
          />
          <div className="float-icon">
            <ShieldIcon />
          </div>
        </div>

        <div className="ml-3">
          <p className="mb-1" style={{ width: full ? '100%' : 250 }}>
            {kind === interfaces.INotificationKind.JobCreate && (
              <>
                <b>{userName}</b> created a new job:{' '}
                <b onClick={jobDetailsRedirect}>{job.title}</b>
              </>
            )}
            {kind === interfaces.INotificationKind.JobDetailEdit && (
              <>
                <b>{userName}</b> edited the job:{' '}
                <b onClick={jobDetailsRedirect}>{job.title}</b>
              </>
            )}
            {kind === interfaces.INotificationKind.JobInvite && (
              <>
                <b>{userName}</b> invited you to the job:{' '}
                <b onClick={jobDetailsRedirect}>{job.title}</b>
              </>
            )}
          </p>
          <p className="mb-0 fz-12 text-muted">
            <TimeAgo date={record.createdAt} />
          </p>

          {job.users[0]?.invite?.status === IInviteStatusKind.pending && (
            <div className="d-flex mt-2">
              <button
                className="btn btn-sm btn-outline-primary rounded w-50 mr-2 font-weight-bold"
                onClick={() => acceptInvite(IInviteStatusKind.rejected)}
                disabled={isFetching}
              >
                Reject
              </button>
              <button
                className="btn btn-sm btn-primary rounded w-50"
                style={{ fontWeight: 700 }}
                onClick={() => acceptInvite(IInviteStatusKind.accepted)}
                disabled={isFetching}
              >
                Accept
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="divider" />
    </Fragment>
  );
};

const PhotoEventComponent = ({
  record,
  full,
  userName,
}: {
  full?: boolean;
  record: interfaces.INotification;
  userName: string;
}) => {
  const history = useHistory();

  const { kind, jobId, mediaId: media } = record;

  if (!media?.id) {
    return null;
  }

  const mediaDetailsRedirect = () => {
    const path = generateDynamicPath(JobRoutes.routes.jobPhotoDetails.path, {
      jobId: jobId?.id || 'jobId',
      mediaId: media.id,
    });

    history.push(path);
  };

  return (
    <Fragment>
      <div className="d-flex mt-3">
        <div className="notification-row">
          <img
            src={record.creatorId.picURL || DefaultUserPic}
            alt={userName}
            title={userName}
          />
          <div className="float-icon">
            <MediaIcon />
          </div>
        </div>

        <div className="ml-3">
          <p className="mb-1" style={{ width: full ? '100%' : 250 }}>
            {kind === interfaces.INotificationKind.PhotoCreate && (
              <>
                <b>{userName}</b> added a <b>{media.subKind} Photo</b>:{' '}
                <b onClick={mediaDetailsRedirect}>{media.name}</b>
              </>
            )}
          </p>
          <p className="mb-0 fz-12 text-muted">
            <TimeAgo date={record.createdAt} />
          </p>
        </div>
      </div>
      <div className="divider" />
    </Fragment>
  );
};

const VideoEventComponent = ({
  record,
  full,
  userName,
}: {
  full?: boolean;
  record: interfaces.INotification;
  userName: string;
}) => {
  const history = useHistory();

  const { kind, jobId, mediaId: media } = record;

  if (!media?.id) {
    return null;
  }

  const mediaDetailsRedirect = () => {
    const path = generateDynamicPath(JobRoutes.routes.jobPhotoDetails.path, {
      jobId: jobId?.id || 'jobId',
      mediaId: media.id,
    });

    history.push(path);
  };

  return (
    <Fragment>
      <div className="d-flex mt-3">
        <div className="notification-row">
          <img
            src={record.creatorId.picURL || DefaultUserPic}
            alt={userName}
            title={userName}
          />
          <div className="float-icon">
            <MediaIcon />
          </div>
        </div>

        <div className="ml-3">
          <p className="mb-1" style={{ width: full ? '100%' : 250 }}>
            {kind === interfaces.INotificationKind.VideoCreate && (
              <>
                <b>{userName}</b> added a <b>Video</b>:{' '}
                <b onClick={mediaDetailsRedirect}>{media.name}</b>
              </>
            )}
          </p>
          <p className="mb-0 fz-12 text-muted">
            <TimeAgo date={record.createdAt} />
          </p>
        </div>
      </div>
      <div className="divider" />
    </Fragment>
  );
};

const DocEventComponent = ({
  record,
  full,
  userName,
}: {
  full?: boolean;
  record: interfaces.INotification;
  userName: string;
}) => {
  const history = useHistory();

  const { kind, jobId, mediaId: media } = record;

  if (!media?.id) {
    return null;
  }

  const mediaDetailsRedirect = () => {
    const path = generateDynamicPath(JobRoutes.routes.jobPhotoDetails.path, {
      jobId: jobId?.id || 'jobId',
      mediaId: media.id,
    });

    history.push(path);
  };

  return (
    <Fragment>
      <div className="d-flex mt-3">
        <div className="notification-row">
          <img
            src={record.creatorId.picURL || DefaultUserPic}
            alt={userName}
            title={userName}
          />
          <div className="float-icon">
            <MediaIcon />
          </div>
        </div>

        <div className="ml-3">
          <p className="mb-1" style={{ width: full ? '100%' : 250 }}>
            {kind === interfaces.INotificationKind.DocCreate && (
              <>
                <b>{userName}</b> added a <b>Document</b>:{' '}
                <b onClick={mediaDetailsRedirect}>{media.name}</b>
              </>
            )}
          </p>
          <p className="mb-0 fz-12 text-muted">
            <TimeAgo date={record.createdAt} />
          </p>
        </div>
      </div>
      <div className="divider" />
    </Fragment>
  );
};

const ConversationEventComponent = ({
  record,
  full,
  userName,
}: {
  full?: boolean;
  record: interfaces.INotification;
  userName: string;
}) => {
  const { kind, conversationId: conversation } = record;

  if (!conversation?.id) {
    return null;
  }

  return (
    <Fragment>
      <div className="d-flex mt-3">
        <div className="notification-row">
          <img
            src={record.creatorId.picURL || DefaultUserPic}
            alt={userName}
            title={userName}
          />
          <div className="float-icon">
            <ChatIcon />
          </div>
        </div>

        <div className="ml-3">
          <p className="mb-1" style={{ width: full ? '100%' : 250 }}>
            {kind === interfaces.INotificationKind.CommentCreate && (
              <>
                <b>{userName}</b> added a <b>Comment</b>:{' '}
                {conversation?.message}
              </>
            )}

            {kind === interfaces.INotificationKind.ConversationCreate && (
              <>
                <b>{userName}</b> added a <b>Conversation</b>:{' '}
                {conversation?.message}
              </>
            )}
          </p>
          <p className="mb-0 fz-12 text-muted">
            <TimeAgo date={record.createdAt} />
          </p>
        </div>
      </div>
      <div className="divider" />
    </Fragment>
  );
};

// const DefaultComponent = ({
//   userName,
//   record,
//   full,
// }: {
//   full?: boolean;
//   record: interfaces.INotification;
//   userName: string;
// }) => {
//   return (
//     <Fragment>
//       <div className="d-flex mt-3">
//         <div className="notification-row">
//           <img
//             src={''}
//             //require('../../assets/images/media-blog-img.png').default
//             alt="media blog img"
//           />
//           <div className="float-icon">
//             <MediaIcon />
//             {/* <InviteIcon /> */}
//             {/* <ShieldIcon /> */}
//             {/* <MediaIcon /> */}
//             {/* <MessageIcon/> */}
//           </div>
//         </div>

//         <div className="ml-3">
//           <p className="mb-1" style={{ width: full ? '100%' : 250 }}>
//             BMW invited you to join thier organisation.
//           </p>
//           <p className="mb-0 fz-12 text-muted">24 hrs ago</p>

//           <div className="d-flex mt-2">
//             <button className="btn btn-sm btn-outline-primary rounded w-50 mr-2 font-weight-bold">
//               Reject
//             </button>
//             <button
//               className="btn btn-sm btn-primary rounded w-50"
//               style={{ fontWeight: 700 }}
//             >
//               Accept
//             </button>
//           </div>
//         </div>
//       </div>
//       <div className="divider" />
//     </Fragment>
//   );
// };

const getType = ({
  record,
  full,
}: {
  full: boolean;
  record: interfaces.INotification;
}) => {
  // const time = toLocaleDTString(record.createdAt);
  const userName = formatUserName(
    record.creatorId.firstName,
    record.creatorId.lastName
  );

  switch (record.kind) {
    //@ts-ignore
    case interfaces.INotificationKind.JobCreate: {
    }
    //@ts-ignore
    case interfaces.INotificationKind.JobDetailEdit: {
    }
    case interfaces.INotificationKind.JobInvite: {
      return (
        <JobEventComponent userName={userName} record={record} full={full} />
      );
    }

    case interfaces.INotificationKind.PhotoCreate: {
      return (
        <PhotoEventComponent userName={userName} record={record} full={full} />
      );
    }

    case interfaces.INotificationKind.VideoCreate: {
      return (
        <VideoEventComponent userName={userName} record={record} full={full} />
      );
    }

    case interfaces.INotificationKind.DocCreate: {
      return (
        <DocEventComponent userName={userName} record={record} full={full} />
      );
    }

    //@ts-ignore
    case interfaces.INotificationKind.CommentCreate: {
    }
    case interfaces.INotificationKind.ConversationCreate: {
      return (
        <ConversationEventComponent
          userName={userName}
          record={record}
          full={full}
        />
      );
    }

    // default: {
    //   return (
    //     <DefaultComponent userName={userName} record={record} full={full} />
    //   );
    // }
  }
};

export default function NotificationRowComp({
  record,
  full = false,
}: NotificationRowComponentProps) {
  return <Fragment>{getType({ record, full })}</Fragment>;
}
