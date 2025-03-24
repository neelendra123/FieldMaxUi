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
  INotesPopulated,
  IConvPopulatedTypes,
} from '../../Conversations/interfaces';
import { ConversationsSkeleton } from '../../Conversations/skeletons';
import ConversationAdd from '../../Conversations/Common/ConversationAdd';
import { notesListService } from '../../Conversations/services';

import { IJobSubModulePerms } from '../../Orgs/interfaces';

import * as interfaces from '../interfaces';

export default function TabNotepad({
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

  const [notes, setNotes] = useState<INotesPopulated[]>([]);

  const fetchData = async () => {
    let notesCount = 0;

    try {
      //  Only Loading the Notes if have permissions
      if (!!(userJobPerm.notes & (CommonPerms.all | CommonPerms.view))) {
        const result = await notesListService(job.id, search, true);

        if (!isMounted()) {
          return;
        }

        notesCount = result.length;

        setNotes(result);
      }

      setJob({
        ...job,
        details: {
          ...job.details,
          notesCount,
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

  const addEffect = (note: IConvPopulatedTypes, msg: string) => {
    if (!isMounted()) {
      return;
    }

    setNotes([
      ...notes,
      {
        ...note,
        kind: IConversationKinds.note,
      },
    ]);

    //  Updating parent Job Details
    setJob({
      ...job,
      details: {
        ...job.details,
        notesCount: ++job.details.notesCount,
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
      id="pills-notpad"
      role="tabpanel"
      aria-labelledby="pills-notpad-tab"
    >
      {!isLoaded ? (
        <ConversationsSkeleton kind={IConversationKinds.note} keys={[1, 2]} />
      ) : (
        <Fragment>
          {notes.map((note) => {
            const name = formatUserName(
              note.creatorId.firstName,
              note.creatorId.lastName
            );

            const picURL = note.creatorId.picURL || DefaultUserPic;

            return (
              <div className="plumbing-tab-profile-wrap" key={note.id}>
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

          {!!(userJobPerm.notes & (CommonPerms.all | CommonPerms.add)) && (
            <ConversationAdd
              kind={IConversationKinds.note}
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
