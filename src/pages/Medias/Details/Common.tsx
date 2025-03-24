import { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMountedState } from 'react-use';

import { MdModeEdit, MdDelete } from 'react-icons/md';
import { BiShareAlt } from 'react-icons/bi';
import { IoIosEye } from 'react-icons/io';

import { CommonPerms } from '../../../constants';

import { successToast } from '../../../utils/toast';
import { toLocaleDTString } from '../../../utils/common';

import { Popup } from '../../../components/Common';

import { IAuthUser } from '../../Auth/interfaces';

import { DefaultUserPic } from '../../Users/constants';
import { formatUserName } from '../../Users/utils';

import {
  IConversationKinds,
  IConvPopulatedTypes,
  ICommentsPopulated,
} from '../../Conversations/interfaces';
import { mediaCommentsListService } from '../../Conversations/services';
import { ConversationsSkeleton } from '../../Conversations/skeletons';
import ConversationAdd from '../../Conversations/Common/ConversationAdd';

import { jobMediaDeleteService } from '../../Jobs/services';
import { IJobPopulated } from '../../Jobs/interfaces';

import MediaLinkAddPopup from '../MediaLinks/MediaLinkAddPopup';

import { SimpleSlider } from '../Common';
import * as interfaces from '../interfaces';
import * as utils from '../utils';

//  The Various options shown at side of each media
export const MediaDetailSideOptionsComponent = ({
  media,

  id,
  index,

  setDeletePopup,
  setViewSlider,

  sharePopup,
  setSharePopup,
}: {
  media: interfaces.IMediaPopulatedTypes;

  id: string;
  index: number;

  setDeletePopup: (value: number) => void;
  setViewSlider?: (value: number) => void;

  sharePopup: {
    mediaKind: interfaces.IMediaTypes;
    subMediaId: string;
  };
  setSharePopup: (value: {
    mediaKind: interfaces.IMediaTypes;
    subMediaId: string;
  }) => void;
}) => {
  const history = useHistory<any>();

  const currentUserMediaPerm =
    media.currentUserPerm[id]?.base ?? CommonPerms.none;

  const { mediaEditPath } = utils.mediaPathsGenerator(
    media.jobId,
    media.id,
    media.kind,
    media.medias[index].id
  );

  return (
    <Fragment>
      <MediaLinkAddPopup
        sharePopup={sharePopup}
        setSharePopup={setSharePopup}
      />

      {!media.isDeleted && (
        <Fragment>
          {/* Only shown if have edit permission on this media */}
          {!!(currentUserMediaPerm & (CommonPerms.all | CommonPerms.edit)) && (
            <li
              onClick={() => {
                history.push(mediaEditPath);
              }}
              title="Edit"
            >
              <button>
                <MdModeEdit />
              </button>
            </li>
          )}
          {/* Only shown if have delete permission on this media */}
          {!!(currentUserMediaPerm & (CommonPerms.all | CommonPerms.delete)) &&
            !media.isDeleted && (
              <li onClick={() => setDeletePopup(index)} title="Delete">
                <button>
                  <MdDelete className="fz-20" />
                </button>
              </li>
            )}
        </Fragment>
      )}
      {/* <li title="Tags">
        <button>
          <AiFillTag />
        </button>
      </li> */}
      <li
        onClick={() =>
          setSharePopup({
            mediaKind: media.kind,
            subMediaId: media.medias[index].id,
          })
        }
        title="Share"
      >
        <button>
          <BiShareAlt />
        </button>
      </li>
      {!!setViewSlider && (
        <li onClick={() => setViewSlider(index)} title="View">
          <button>
            <IoIosEye />
          </button>
        </li>
      )}
    </Fragment>
  );
};

//  Delete Media Popup
export const DeleteJobMediaPopupComponent = ({
  media,
  setMedia,

  deletePopup = -1,
  setDeletePopup,
}: {
  media: interfaces.IMediaPopulatedTypes;
  setMedia: (media: interfaces.IMediaPopulatedTypes) => void;

  deletePopup: number;
  setDeletePopup: (value: number) => void;
}) => {
  const [isCreating, setIsCreating] = useState(false);

  const deleteJobMedia = async () => {
    setIsCreating(true);

    try {
      const result = await jobMediaDeleteService(
        media.jobId,
        [media.id],
        media.kind
      );

      setMedia({
        ...media,
        isDeleted: true,
      });

      successToast(result.message);
    } catch (error) {
      console.error(error);
      setIsCreating(false);
    }

    setDeletePopup(-1);
  };

  if (deletePopup === -1 || !media.medias.length) {
    return null;
  }

  return (
    <Fragment>
      <Popup
        isOpen={deletePopup !== -1}
        title={'Confirmation'}
        hideButton={false}
        onClose={() => setDeletePopup(-1)}
        leftItem={'Cancel'}
        leftFunction={() => setDeletePopup(-1)}
        onSave={deleteJobMedia}
        ModalName={'Yes'}
        addClassToWrapper="card-media-box"
        leftItemViewOnlyClass="flex-space-center"
        disableButtons={isCreating}
      >
        <div className="sec-content">
          <p>
            Are you sure you want to delete {media?.medias[deletePopup].name}?
          </p>
        </div>
      </Popup>
    </Fragment>
  );
};

//  Media Slider Popup
export const MediaSliderPopupComponent = ({
  media,

  viewSlider,
  setViewSlider,
}: {
  media: interfaces.IMediaPopulatedTypes;

  viewSlider: number;
  setViewSlider: (value: number) => void;
}) => {
  if (viewSlider === -1 || !media.medias.length) {
    return null;
  }

  return (
    <Fragment>
      <SimpleSlider
        isOpen={viewSlider !== -1}
        onClose={() => setViewSlider(-1)}
        addClassToWrapper="viewer-img-slider"
      >
        {media.medias.map((media) => {
          if (!media.mediaURL) {
            return null;
          }

          return (
            <div className="image-wrap" key={media.id}>
              <img
                className="d-inline-block"
                src={media.mediaURL}
                alt={media.name}
                title={media.name}
              />
            </div>
          );
        })}
      </SimpleSlider>
    </Fragment>
  );
};

export const MediaDetailsCommentsSectionComponent = ({
  job,

  media,

  user,
  selectedSubMediaCommentsPerm = CommonPerms.none,
  selectedIndex = 0,
}: {
  job: IJobPopulated;
  media: interfaces.IMediaPopulatedTypes;

  user: IAuthUser;
  selectedSubMediaCommentsPerm: number; //  Current User SubMedia Comments Permission
  selectedIndex: number;
}) => {
  const isMounted = useMountedState();

  const [isLoaded, setIsLoaded] = useState(false); // For Skeleton

  const [comments, setComments] = useState<ICommentsPopulated[]>([]);

  const commentListingPerm = !!(
    !!(
      job.currentUserJobPerm.permissions.comments &
      (CommonPerms.all | CommonPerms.view)
    ) && !!(selectedSubMediaCommentsPerm & (CommonPerms.all | CommonPerms.view))
  );
  const commentAddPerm = !!(
    !!(
      job.currentUserJobPerm.permissions.comments &
      (CommonPerms.all | CommonPerms.add)
    ) && !!(selectedSubMediaCommentsPerm & (CommonPerms.all | CommonPerms.add))
  );

  const fetchData = async () => {
    setIsLoaded(false);
    setComments([]);

    const subMediaId = media.medias[selectedIndex]?.id;

    //  Only Loading the Comments if have permissions in the job and the selected sub media
    if (!commentListingPerm || !subMediaId) {
      setIsLoaded(true);
      return;
    }

    try {
      const result = await mediaCommentsListService(
        media.jobId,
        media.id,
        subMediaId,
        true
      );

      if (!isMounted()) {
        return;
      }

      setComments(result);
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

    setComments([
      ...comments,
      {
        ...conversation,
        kind: IConversationKinds.comments,
      },
    ]);

    successToast(msg, {
      position: 'top-left',
    });
  };

  useEffect(() => {
    if (!isMounted()) {
      return;
    }

    fetchData();
  }, [selectedIndex, commentListingPerm, media]);

  return (
    <Fragment>
      <div className="post-content my-4">
        <div className="comment-area">
          {!isLoaded ? (
            <ConversationsSkeleton
              kind={IConversationKinds.comments}
              keys={[1, 2, 3, 4]}
            />
          ) : (
            <Fragment>
              {comments.map((row) => {
                const name = formatUserName(
                  row.creatorId.firstName,
                  row.creatorId.lastName
                );

                const picURL = row.creatorId.picURL || DefaultUserPic;

                return (
                  <div
                    className="flex-content post mb-3 align-items-start"
                    key={row.id}
                  >
                    <div className="image-wrap pr-3">
                      <img
                        className="rounded-circle avatar-sm"
                        src={picURL}
                        title={name}
                        alt={name}
                      />
                    </div>
                    <div className="tab-profile-content flex-grow-1 ">
                      <div className="flex-space-between mb-2">
                        <h6 className="title mb-1">{name} </h6>
                        <span className="date-text fz-10">
                          {' '}
                          {toLocaleDTString(row.createdAt)}
                        </span>
                      </div>
                      <p className="mb-1 sec-content">{row.message}</p>
                    </div>
                  </div>
                );
              })}
            </Fragment>
          )}
        </div>

        {commentAddPerm &&
          isLoaded &&
          isMounted() &&
          !media.isDeleted &&
          !job.isDeleted && (
            <ConversationAdd
              kind={IConversationKinds.comments}
              jobId={media.jobId}
              mediaId={media.id}
              subMediaId={media.medias[selectedIndex]?.id}
              user={user}
              addEffect={addEffect}
            />
          )}
      </div>
    </Fragment>
  );
};
