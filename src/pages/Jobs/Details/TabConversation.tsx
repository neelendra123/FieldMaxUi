import { useState, useEffect, Fragment } from 'react';
import { useMountedState } from 'react-use';

import { CommonPerms } from '../../../constants';

import { toLocaleDTString } from '../../../utils/common';
import { successToast } from '../../../utils/toast';

import { IAuthUser } from '../../Auth/interfaces';

import { DefaultUserPic } from '../../Users/constants';
import { formatUserName } from '../../Users/utils';

import {
  IConversationKinds,
  IConversationsPopulated,
  IConvPopulatedTypes,
} from '../../Conversations/interfaces';
import { ConversationsSkeleton } from '../../Conversations/skeletons';
import ConversationAdd from '../../Conversations/Common/ConversationAdd';
import { conversationsListService } from '../../Conversations/services';

import { IJobSubModulePerms } from '../../Orgs/interfaces';

import * as interfaces from '../interfaces';

export default function TabConversation({
  job,
  setJob,

  userJobPerm,
  user,

  search,
}: {
  job: interfaces.IJobPopulated;
  setJob: (job: interfaces.IJobPopulated) => void;

  userJobPerm: IJobSubModulePerms;
  user: IAuthUser;

  search?: string;
}) {
  const isMounted = useMountedState();

  const [isLoaded, setIsLoaded] = useState(false); // For Skeleton

  const [convs, setConvs] = useState<IConversationsPopulated[]>([]);

  const fetchData = async () => {
    let conversationCount = 0;

    try {
      //  Only Loading the Notes if have permissions
      if (
        !!(userJobPerm.conversations & (CommonPerms.all | CommonPerms.view))
      ) {
        const result = await conversationsListService(job.id, search, true);

        if (!isMounted()) {
          return;
        }

        conversationCount = result.length;

        setConvs(result);
      }

      setJob({
        ...job,
        details: {
          ...job.details,
          conversationCount,
        },
      });
    } catch (error) {
      console.error(error);
    }

    if (!isMounted()) {
      return;
    }
    setIsLoaded(true);
  };

  const addEffect = (conversation: IConvPopulatedTypes, msg: string) => {
    if (!isMounted()) {
      return;
    }

    setConvs([
      ...convs,
      {
        ...conversation,
        kind: IConversationKinds.conversation,
      },
    ]);

    //  Updating parent Job Details
    setJob({
      ...job,
      details: {
        ...job.details,
        conversationCount: ++job.details.conversationCount,
      },
    });

    successToast(msg);
  };

  useEffect(() => {
    if (!isMounted()) {
      return;
    }

    fetchData();
  }, [search]);

  return (
    <div
      className="tab-pane fade show active"
      id="pills-converstation"
      role="tabpanel"
      aria-labelledby="pills-converstation-tab"
    >
      {!isLoaded ? (
        <ConversationsSkeleton
          kind={IConversationKinds.conversation}
          keys={[1, 2]}
        />
      ) : (
        <Fragment>
          {convs.map((note, index) => {
            const name = formatUserName(
              note.creatorId.firstName,
              note.creatorId.lastName
            );

            const picURL = note.creatorId.picURL || DefaultUserPic;

            return (
              <div
                className={
                  index % 2
                    ? 'plumbing-tab-profile-wrap mb-4 direction-right'
                    : 'plumbing-tab-profile-wrap mb-4'
                }
                key={note.id}
              >
                <div className="flex-content-start">
                  <div className="image-wrap">
                    <img src={picURL} alt={name} title={name} />
                  </div>
                  <div className="tab-profile-content">
                    <h6 className="title">{name}</h6>
                    <p className="mb-1">{note.message}</p>
                    <span className="date-text">
                      {toLocaleDTString(note.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {!!(
            userJobPerm.conversations &
            (CommonPerms.all | CommonPerms.add)
          ) && (
            <ConversationAdd
              kind={IConversationKinds.conversation}
              jobId={job.id}
              user={user}
              addEffect={addEffect}
            />
          )}
        </Fragment>
      )}
    </div>
  );
}
