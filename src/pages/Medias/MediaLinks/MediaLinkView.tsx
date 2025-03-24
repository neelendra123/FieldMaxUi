import { useEffect, useState, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { useMountedState } from 'react-use';

import { CommonPerms, DummyPhotoBase64 } from '../../../constants';

import { toLocaleDTString } from '../../../utils/common';

import { IMediaLinkDetails } from '../../Links/interfaces';
import { generateDefaultMediaLinkDetails } from '../../Links/utils';
import { mediaLinkDetailsService } from '../../Links/services';

import { DefaultUserPic } from '../../Users/constants';
import { formatUserName } from '../../Users/utils';

import { ConversationsSkeleton } from '../../Conversations/skeletons';
import { IConversationKinds } from '../../Conversations/interfaces';

export default function MediaLinkView() {
  const isMounted = useMountedState();

  const params: { token: string } = useParams();

  const [isLoaded, setIsLoaded] = useState(false);

  const [linkDetails, setLinkDetails] = useState<IMediaLinkDetails>(
    generateDefaultMediaLinkDetails()
  );

  const fetchData = async () => {
    setIsLoaded(false);
    try {
      const result = await mediaLinkDetailsService(params.token);
      if (!isMounted()) {
        return;
      }

      //  If not have Media View Permission then setting it as dummy
      if (!(result.permissions.medias & CommonPerms.view)) {
        result.mediaId.medias[0].mediaURL = DummyPhotoBase64;
      }

      //  If not have Comments View Permission then setting it as empty
      if (!(result.permissions.comments & CommonPerms.view)) {
        result.comments = [];
      }

      //  If not have Comments View Permission then setting it as empty
      if (!(result.permissions.details & CommonPerms.view)) {
        result.mediaId.medias[0].tags = [];
      }

      setLinkDetails(result);
    } catch (error) {
      console.error(error);
    }

    if (!isMounted()) {
      return;
    }
    setIsLoaded(true);
  };

  useEffect(() => {
    document.body.className = 'p-0 m-0';

    fetchData();

    return () => {
      document.body.className = '';
    };
  }, []);

  const subMedia = linkDetails.mediaId.medias[0];

  const CommentsListingComp = () => {
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
                {linkDetails?.comments.map((row) => {
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
        </div>
      </Fragment>
    );
  };

  return (
    <div id="wrapper">
      <div className="details-comment-wrap">
        <div className="details-comment-content mobile-flex-wrap">
          <div className="comment-image-wrap mobile-w-100">
            <div className="dual-image">
              <div className="dual-image-inner max-full-width full-video-size active-border">
                <iframe
                  src={`${
                    subMedia.mediaURL || DummyPhotoBase64
                  }#navpanes=0&scrollbar=0`}
                  // #toolbar=0&navpanes=0&scrollbar=0
                  title={subMedia.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
          <div className="comment-content mobile-w-100">
            <div className="sec-heading-title">
              <div className="sec-title">
                <h6 className="mb-1">{subMedia.name}</h6>
                <p className="mb-0">{linkDetails?.mediaId.creatorId.name}</p>
              </div>
              <div className="btn-wrap flex-content" id="optionsbtn"></div>
            </div>

            {!!subMedia.tags.length && (
              <div className="tag-box">
                <div className="flex-content">
                  {subMedia.tags.map((mediaTag, index) => {
                    return (
                      <span className="box" key={index}>
                        {mediaTag}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <CommentsListingComp />
          </div>
        </div>
      </div>
    </div>
  );
}
