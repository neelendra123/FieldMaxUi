import { useEffect, useState, Fragment } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMountedState } from 'react-use';
import { RiCloseLine } from 'react-icons/ri';

import { DummyPhotoBase64 } from '../../../constants';

import { useQuery } from '../../../utils/hooks';

import { IAppReduxState } from '../../../redux/reducer';

import { IJobPopulated } from '../../Jobs/interfaces';
import {
  generateDefaultJob,
  generateJobDetailsPath,
  parsePopulatedJob,
} from '../../Jobs/utils';
import { jobDetailService } from '../../Jobs/services';

import {
  MediaDetailSideOptionsComponent,
  DeleteJobMediaPopupComponent,
  MediaDetailsCommentsSectionComponent,
} from './Common';

import * as interfaces from '../interfaces';
import * as services from '../services';
import * as utils from '../utils';

export default function DocDetails() {
  const isMounted = useMountedState();

  let query = useQuery();
  let history = useHistory<any>();
  const params: { jobId: string; mediaId: string } = useParams();

  const { authUser, accountIndex } = useSelector(
    (state: IAppReduxState) => state.auth
  );

  const [job, setJob] = useState<IJobPopulated>(
    generateDefaultJob(authUser, accountIndex, params.jobId)
  );
  const [media, setMedia] = useState<interfaces.IMediaPopulatedTypes>(
    utils.generateDefaultMedia(
      interfaces.IMediaKind.JobDoc,
      params.jobId,
      params.mediaId
    )
  );

  const [optionClicked, setOptionClicked] = useState(false);

  const [deletePopup, setDeletePopup] = useState(-1);
  const [sharePopup, setSharePopup] = useState({
    mediaKind: interfaces.IMediaKind.Doc,
    subMediaId: '',
  });

  const fetchData = async () => {
    try {
      let formatedJob: IJobPopulated = history.location?.state?.job;
      let mediaDetails: interfaces.IMediaPopulatedTypes =
        history.location?.state?.media || null;

      if (!mediaDetails) {
        let job;
        //  If the response do not come on state then making api request to get the job and document details
        [job, mediaDetails] = await Promise.all([
          jobDetailService(params.jobId),
          services.mediaDetailsService({
            jobId: params.jobId,
            mediaId: params.mediaId,
            params: {
              kind: interfaces.IMediaKind.JobDoc,
            },
          }),
        ]);

        formatedJob = parsePopulatedJob(job, {
          userId: authUser.id,
          baseUserType: authUser.userType,
          accountUserType: authUser.accounts[accountIndex].userType,
        });
      }

      if (!isMounted()) {
        return;
      }

      const formatedMedia = utils.parsePopulatedMedia(mediaDetails, {
        userId: authUser.id,
        baseUserType: authUser.userType,
        accountUserType: authUser.accounts[accountIndex].userType,
      });

      setJob(formatedJob);
      setMedia(formatedMedia);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isMounted()) {
      return;
    }

    fetchData();
  }, []);

  useEffect(() => {
    query.get('edit') == 'true'
      ? (document.body.className = '')
      : (document.body.className = 'p-0 m-0');
    return () => {
      document.body.className = '';
    };
  });

  let subMedia: interfaces.IJobSubMedia =
    media.medias[0] ?? utils.generateDefaultSubMedia();

  return (
    <Fragment>
      <DeleteJobMediaPopupComponent
        media={media}
        setMedia={setMedia}
        deletePopup={deletePopup}
        setDeletePopup={setDeletePopup}
      />

      <div id="wrapper">
        <div className="details-comment-wrap">
          <div className="details-comment-content mobile-flex-wrap">
            <div className="comment-image-wrap mobile-w-100 pdf-file-img-wrap">
              <div className="dual-image d-block pdf-file-wrap">
                <div className="dual-image-inner max-full-width full-video-size active-border">
                  {!!subMedia.mediaURL && (
                    <iframe
                      src={`${
                        subMedia.mediaURL || DummyPhotoBase64
                      }#navpanes=0&scrollbar=0`}
                      title={subMedia.name}
                    />
                  )}
                  <div
                    className="button-icon"
                    style={
                      optionClicked ? { display: 'none' } : { display: '' }
                    }
                  >
                    <ul>
                      {!!subMedia.id && (
                        <MediaDetailSideOptionsComponent
                          media={media}
                          id={subMedia.id}
                          index={0}
                          setDeletePopup={setDeletePopup}
                          sharePopup={sharePopup}
                          setSharePopup={setSharePopup}
                        />
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="comment-content mobile-w-100">
              <div className="sec-heading-title ">
                <div className="sec-title">
                  <h6 className="mb-1">{subMedia.name}</h6>
                  <p className="mb-0">{media.creatorId.name}</p>
                </div>
                <div className="btn-wrap flex-content" id="optionsbtn">
                  <button
                    className="btn btn-primary  flex-content mr-2"
                    onClick={() => {
                      setOptionClicked(!optionClicked);
                    }}
                  >
                    <i className="fas fa-ellipsis-v pr-2" />
                    Options
                  </button>
                  <button
                    className="btn btn-primary px-3 flex-content"
                    onClick={() => {
                      if (history.goBack) {
                        history.goBack();
                      } else {
                        history.push(generateJobDetailsPath(params.jobId));
                      }
                    }}
                  >
                    <RiCloseLine className="fz-20" />
                  </button>
                </div>
              </div>

              {!!media.medias[0]?.tags?.length && (
                <div className="tag-box">
                  <div className="flex-content">
                    {media.medias[0].tags.map((mediaTag, index) => {
                      return (
                        <span className="box" key={index}>
                          {mediaTag}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <MediaDetailsCommentsSectionComponent
                job={job}
                media={media}
                user={authUser}
                selectedSubMediaCommentsPerm={
                  media.currentUserPerm[media.medias[0]?.id]?.comments
                }
                selectedIndex={0}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
