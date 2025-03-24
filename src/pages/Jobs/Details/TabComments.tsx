import { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMountedState } from 'react-use';

import { CommonPerms, DummyPhotoBase64 } from '../../../constants';

import { toLocaleDTString } from '../../../utils/common';

import { BigDocIcon } from '../../../components/Icons';

import { DefaultUserPic } from '../../Users/constants';
import { formatUserName } from '../../Users/utils';

import { IJobCommentsPopulated } from '../../Conversations/interfaces';
import { jobCommentsListService } from '../../Conversations/services';

import { IJobSubModulePerms } from '../../Orgs/interfaces';

import { IMediaKind } from '../../Medias/interfaces';
import { mediaPathsGenerator } from '../../Medias/utils';

import * as interfaces from '../interfaces';
import { JobCommentsSkeleton } from '../skeletons';

export default function TabComments({
  job,
  setJob,

  userJobPerm,

  search,
}: {
  job: interfaces.IJobPopulated;
  setJob: (job: interfaces.IJobPopulated) => void;

  userJobPerm: IJobSubModulePerms;

  search?: string;
}) {
  const isMounted = useMountedState();

  const history = useHistory();

  const [isLoaded, setIsLoaded] = useState(false); // For Skeleton

  const [comments, setComments] = useState<IJobCommentsPopulated[]>([]);

  const fetchData = async () => {
    let commentsCount = 0;

    try {
      //  Only Loading the Notes if have permissions
      if (!!(userJobPerm.notes & (CommonPerms.all | CommonPerms.view))) {
        const result = await jobCommentsListService(job.id, search);

        if (!isMounted()) {
          return;
        }

        commentsCount = result.length;

        setComments(result);
      }

      setJob({
        ...job,
        details: {
          ...job.details,
          commentsCount,
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

  useEffect(() => {
    if (!isMounted()) {
      return;
    }

    fetchData();
  }, [search]);

  return (
    <div
      className="tab-pane fade show active"
      id="pills-comments"
      role="tabpanel"
      aria-labelledby="pills-comments-tab"
    >
      {!isLoaded ? (
        <JobCommentsSkeleton keys={[1, 2]} />
      ) : (
        <Fragment>
          {comments.map((comment) => {
            const name = formatUserName(
              comment.creatorId.firstName,
              comment.creatorId.lastName
            );

            const picURL = comment.creatorId.picURL || DefaultUserPic;

            const mediaKind = comment.mediaId.kind;
            const subMedia = comment.mediaId.medias[0];

            const { mediaDetailsPath } = mediaPathsGenerator(
              comment.jobId as string,
              comment.mediaId.id,
              mediaKind
            );

            const historyState: interfaces.IJobPhotoDetailsHistoryState = {
              job,
              selectedSubMediaId: subMedia.id,
              mediaSubKind: comment.mediaId.subKind,
            };

            let subMediaSRC = subMedia.mediaURL;
            if (mediaKind === IMediaKind.JobVideo) {
              subMediaSRC = subMedia.thumbnailURL || DummyPhotoBase64;
            }

            return (
              <div
                className="plumbing-tab-profile-wrap comment-content"
                key={comment.id}
              >
                <div className="flex-space-between">
                  <div className="flex-content-start">
                    <div className="image-wrap">
                      <img src={picURL} alt={name} title={name} />
                    </div>
                    <div className="tab-profile-content">
                      <h6 className="title mb-1">{name}</h6>
                      <p className="mb-1">{comment.message}</p>
                      <span className="date-text">
                        {toLocaleDTString(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="image-wrap comment-img">
                    {mediaKind === IMediaKind.JobDoc ? (
                      <BigDocIcon
                        onClick={() => {
                          history.push(mediaDetailsPath, historyState);
                        }}
                        title={subMedia.name}
                      />
                    ) : (
                      <img
                        src={subMediaSRC}
                        className="rounded"
                        title={subMedia.name}
                        alt={subMedia.name}
                        onClick={() => {
                          history.push(mediaDetailsPath, historyState);
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </Fragment>
      )}
    </div>
  );
}
