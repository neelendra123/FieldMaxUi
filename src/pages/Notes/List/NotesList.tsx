import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMountedState } from 'react-use';

import { IAppReduxState } from '../../../redux/reducer';

import { toLocaleDTString } from '../../../utils/common';

import SearchComp from '../../../components/Forms/SearchComp';
import { PlayIcon, DocIcon } from '../../../components/Icons';
import { IsFetching } from '../../../components/Common';

import NoteAdd from '../Add/NoteAdd';

import { formatUserName } from '../../Users/utils';
import { DefaultUserPic } from '../../Users/constants';

import { IMediaKind } from '../../Medias/interfaces';

import * as interfaces from '../interfaces';
import * as services from '../services';

export interface NotesListProps {
  isCreatingModule?: boolean;

  kind: interfaces.INoteKind;
  subKind?: interfaces.INoteSubKind;

  userId?: string;
  userOwnerId?: string;
  jobId?: string;
  propertyId?: string;
  propertyUnitId?: string;

  currentNotes: interfaces.INotePopulated[];

  addEffect?: (note: interfaces.INotePopulated) => void;
}

export default function NotesList({
  isCreatingModule = false,
  kind,
  subKind,

  userId,
  userOwnerId,
  jobId,
  propertyId,
  propertyUnitId,

  currentNotes,

  addEffect,
}: NotesListProps) {
  const isMounted = useMountedState();

  const { authUser, accountIndex, accountsPermissions } = useSelector(
    (state: IAppReduxState) => state.auth
  );

  const notesAddPerm =
    accountsPermissions[accountIndex][kind]?.notes.all ||
    accountsPermissions[accountIndex][kind]?.notes.add;
  const notesListPerm =
    accountsPermissions[accountIndex][kind]?.notes.all ||
    accountsPermissions[accountIndex][kind]?.notes.view ||
    accountsPermissions[accountIndex][kind]?.notes.edit;

  const [isFetching, setIsFetching] = useState(false);

  const [search, setSearch] = useState('');

  const [notes, setNotes] = useState<interfaces.INotePopulated[]>([]);

  const fetchData = async () => {
    if (!notesListPerm) {
      return;
    }

    let notesList: interfaces.INotePopulated[] = [];

    setIsFetching(true);

    try {
      notesList = isCreatingModule
        ? [...currentNotes]
        : await services.notesListService({
            kind: kind,
            subKind: subKind,
            userOwnerId,
            userId,
            jobId,
            propertyId,
            propertyUnitId,
            search,
          });
    } catch (error) {
      console.error(error);
    }

    if (!isMounted()) {
      return;
    }
    setIsFetching(false);

    setNotes(notesList);
  };

  const newAddEffect = (note: interfaces.INotePopulated) => {
    if (addEffect) {
      addEffect(note);
    } else {
      //  If present in creating module then simply calling th parent effect
      setNotes([...notes, note]);
    }
  };

  useEffect(() => {
    setNotes([...currentNotes]);
  }, [currentNotes]);

  useEffect(() => {
    fetchData();
  }, []);

  const NotesListComp = () => {
    return (
      <Fragment>
        <div className="row justify-content-end">
          <div className="col-md-4">
            {!isCreatingModule && (
              <SearchComp
                search={search}
                setSearch={setSearch}
                placeholder="Search Notes"
                disabled={isFetching}
                onClick={fetchData}
              />
            )}
          </div>
        </div>

        {notes.map((note, index) => {
          const userName = formatUserName(
            note.creatorId.firstName,
            note.creatorId.lastName
          );

          return (
            <div className="d-flex" key={index}>
              <div className="notes-avatar">
                <img
                  src={note.creatorId.picURL || DefaultUserPic}
                  alt={userName}
                  title={userName}
                />
              </div>
              <div className="ml-3">
                <h6 className="fz-16">{userName}</h6>
                <p>{note.note}</p>

                <div className="d-flex mb-2">
                  {note.medias.map((media) => {
                    const onClick = () => window.open(media.mediaURL, '_blank');

                    if (media.kind === IMediaKind.Photo) {
                      return (
                        <div
                          className="property-single-image"
                          key={media.id}
                          onClick={onClick}
                        >
                          <img
                            src={media.mediaURL}
                            alt={media.name}
                            title={media.name}
                          />
                        </div>
                      );
                    } else if (media.kind === IMediaKind.Video) {
                      return (
                        <div
                          className="property-single-image"
                          key={media.id}
                          onClick={onClick}
                        >
                          <img
                            src={media.thumbnailURL}
                            alt={media.name}
                            title={media.name}
                          />

                          <div className="property-play" title={media.name}>
                            <PlayIcon />
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          className="property-single-image"
                          key={media.id}
                          title={media.name}
                          onClick={onClick}
                        >
                          <DocIcon />
                        </div>
                      );
                    }
                  })}
                </div>

                <p className="fz-12">{toLocaleDTString(note.createdAt)}</p>
              </div>
            </div>
          );
        })}
      </Fragment>
    );
  };

  return (
    <Fragment>
      {isFetching && <IsFetching />}

      <div className="mt-3">
        {notesListPerm && <NotesListComp />}

        {notesAddPerm && (
          <NoteAdd
            user={authUser}
            kind={kind}
            subKind={subKind}
            addEffect={newAddEffect}
            userId={userId}
            userOwnerId={userOwnerId}
            jobId={jobId}
            propertyId={propertyId}
            propertyUnitId={propertyUnitId}
          />
        )}
      </div>
    </Fragment>
  );
}
