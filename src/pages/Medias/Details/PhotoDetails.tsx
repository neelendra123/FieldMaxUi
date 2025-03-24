import { useEffect, useState, Fragment } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMountedState } from 'react-use';
import { RiCloseLine } from 'react-icons/ri';

import { DummyPhotoBase64 } from '../../../constants';

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
  MediaSliderPopupComponent,
  MediaDetailsCommentsSectionComponent,
} from './Common';

import * as interfaces from '../interfaces';
import * as services from '../services';
import * as utils from '../utils';

export default function PhotoDetails() {
  const isMounted = useMountedState();

  const history = useHistory<any>();
  const params: { jobId: string; mediaId: string } = useParams();

  const { authUser, accountIndex } = useSelector(
    (state: IAppReduxState) => state.auth
  );

  const [job, setJob] = useState<IJobPopulated>(
    generateDefaultJob(authUser, accountIndex, params.jobId)
  );
  const [media, setMedia] = useState<interfaces.IMediaPopulatedTypes>({
    ...utils.generateDefaultMedia(
      interfaces.IMediaKind.JobPhoto,
      params.jobId,
      params.mediaId,
      history.location.state?.mediaSubKind === interfaces.IPhotoSubKinds.Simple
        ? interfaces.IPhotoSubKinds.Simple
        : interfaces.IPhotoSubKinds.Dual
    ),
    subKind:
      history.location.state?.mediaSubKind === interfaces.IPhotoSubKinds.Simple
        ? interfaces.IPhotoSubKinds.Simple
        : interfaces.IPhotoSubKinds.Dual,
    medias:
      history.location.state?.mediaSubKind === interfaces.IPhotoSubKinds.Simple
        ? [utils.generateDefaultSubMedia(interfaces.IPhotoSubMediaKinds.Simple)]
        : [
            utils.generateDefaultSubMedia(
              interfaces.IPhotoSubMediaKinds.Before
            ),
            utils.generateDefaultSubMedia(interfaces.IPhotoSubMediaKinds.After),
          ],
  });

  const [optionClicked, setOptionClicked] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [deletePopup, setDeletePopup] = useState(-1);
  const [viewSlider, setViewSlider] = useState(-1);

  const [sharePopup, setSharePopup] = useState({
    mediaKind: interfaces.IMediaKind.Photo,
    subMediaId: '',
  });

  const fetchData = async () => {
    try {
      let formatedJob: IJobPopulated = history.location?.state?.job;
      let mediaDetails: interfaces.IMediaPopulatedTypes =
        history.location?.state?.media;

      let job;
      //  If the response do not come on history state then making api requests to get the job and media details
      [job, mediaDetails] = await Promise.all([
        formatedJob || jobDetailService(params.jobId),
        mediaDetails ||
          services.mediaDetailsService({
            jobId: params.jobId,
            mediaId: params.mediaId,
            params: {
              kind: interfaces.IMediaKind.JobPhoto,
            },
          }),
      ]);

      formatedJob = parsePopulatedJob(job, {
        userId: authUser.id,
        baseUserType: authUser.userType,
        accountUserType: authUser.accounts[accountIndex].userType,
      });

      if (
        mediaDetails.subKind === interfaces.IPhotoSubKinds.Simple &&
        !media.medias.length
      ) {
        mediaDetails.medias = [
          utils.generateDefaultSubMedia(interfaces.IPhotoSubMediaKinds.Simple),
        ];
      } else if (mediaDetails.subKind === interfaces.IPhotoSubKinds.Dual) {
        //  Adding on the default sub medias of length 2 incase of dual photo missing before or after photo
        let beforeSubMedia: interfaces.IJobSubMedia =
          utils.generateDefaultSubMedia(interfaces.IPhotoSubMediaKinds.Before);
        let beforeSubMediaIndex = -1;

        let afterSubMedia: interfaces.IJobSubMedia =
          utils.generateDefaultSubMedia(interfaces.IPhotoSubMediaKinds.After);
        let afterSubMediaIndex = -1;

        mediaDetails.medias.forEach((subMedia, index) => {
          if (subMedia.subKind === interfaces.IPhotoSubMediaKinds.Before) {
            beforeSubMedia = subMedia;

            beforeSubMediaIndex = index;
          } else {
            afterSubMedia = subMedia;

            afterSubMediaIndex = index;
          }
        });

        if (beforeSubMediaIndex === -1) {
          mediaDetails.medias = [beforeSubMedia, ...mediaDetails.medias];
        }
        if (afterSubMediaIndex === -1) {
          mediaDetails.medias = [...mediaDetails.medias, afterSubMedia];
        }
      }

      const formatedMedia = utils.parsePopulatedMedia(mediaDetails, {
        userId: authUser.id,
        baseUserType: authUser.userType,
        accountUserType: authUser.accounts[accountIndex].userType,
      });

      // This is for selecting the dual image
      let histSelectedIndex = history.location?.state?.selectedIndex ?? 0;
      //  This is incase pre selecting a selected sub media via id
      if (history.location?.state?.selectedSubMediaId) {
        const selectedSubMediaId = history.location.state.selectedSubMediaId;

        const index = formatedMedia.medias.findIndex(
          (subMedia) => subMedia.id === selectedSubMediaId
        );
        if (index !== -1) {
          histSelectedIndex = index;
        }
      }

      if (!isMounted()) {
        return;
      }

      setSelectedIndex(histSelectedIndex);
      setJob(formatedJob);
      setMedia(formatedMedia);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    document.body.className = 'p-0 m-0';

    fetchData();

    return () => {
      document.body.className = '';
    };
  }, []);

  const singleImage = () => {
    let simpleMedia: interfaces.IJobSubMedia = media.medias[0];

    return (
      <div className="">
        <div className="">
          <img
            className="d-inline-block"
            src={simpleMedia.mediaURL || DummyPhotoBase64}
            alt={simpleMedia.name || media.name}
            title={simpleMedia.name || media.name}
          />

          <div
            className="button-icon"
            style={optionClicked ? { display: 'none' } : { display: '' }}
          >
            <ul>
              {!!simpleMedia.id && (
                <MediaDetailSideOptionsComponent
                  media={media}
                  id={simpleMedia.id}
                  index={0}
                  setDeletePopup={setDeletePopup}
                  setViewSlider={setViewSlider}
                  sharePopup={sharePopup}
                  setSharePopup={setSharePopup}
                />
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const doubleImage = () => {
    let [beforeSubMedia, afterSubMedia] = media.medias;

    return (
      <div className="dual-image h-100">
        <div
          className={
            selectedIndex === 0
              ? 'dual-image-inner active-border'
              : 'dual-image-inner border'
          }
        >
          <img
            className="d-inline-block"
            src={beforeSubMedia.mediaURL || DummyPhotoBase64}
            alt={beforeSubMedia.name ?? media.name}
            title={beforeSubMedia.name ?? media.name}
            onClick={() => setSelectedIndex(0)}
          />
          <div
            className="button-icon"
            style={optionClicked ? { display: 'none' } : { display: '' }}
          >
            <ul>
              {!!beforeSubMedia.id && (
                <MediaDetailSideOptionsComponent
                  media={media}
                  id={beforeSubMedia.id}
                  index={0}
                  setDeletePopup={setDeletePopup}
                  setViewSlider={setViewSlider}
                  sharePopup={sharePopup}
                  setSharePopup={setSharePopup}
                />
              )}
            </ul>
          </div>
        </div>
        <div
          className={
            selectedIndex === 1
              ? 'dual-image-inner active-border'
              : 'dual-image-inner border'
          }
        >
          <img
            className="d-inline-block"
            src={afterSubMedia?.mediaURL || DummyPhotoBase64}
            alt={afterSubMedia?.name ?? media.name}
            title={afterSubMedia?.name ?? media.name}
            onClick={() => setSelectedIndex(1)}
          />
          <div
            className="button-icon"
            style={optionClicked ? { display: 'none' } : { display: '' }}
          >
            <ul>
              {!!afterSubMedia.id && (
                <MediaDetailSideOptionsComponent
                  media={media}
                  id={afterSubMedia.id}
                  index={1}
                  setDeletePopup={setDeletePopup}
                  setViewSlider={setViewSlider}
                  sharePopup={sharePopup}
                  setSharePopup={setSharePopup}
                />
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <DeleteJobMediaPopupComponent
        media={media}
        setMedia={setMedia}
        deletePopup={deletePopup}
        setDeletePopup={setDeletePopup}
      />

      <MediaSliderPopupComponent
        media={media}
        viewSlider={viewSlider}
        setViewSlider={setViewSlider}
      />

      <div id="wrapper">
        <div className="details-comment-wrap">
          <div className="details-comment-content mobile-flex-wrap">
            <div className="comment-image-wrap mobile-w-100">
              {media.subKind === interfaces.IPhotoSubKinds.Simple
                ? singleImage()
                : doubleImage()}
            </div>
            <div className="comment-content mobile-w-100">
              <div className="sec-heading-title">
                <div className="sec-title">
                  <h6 className="mb-1">
                    {media.medias[selectedIndex]?.name || media.name}
                  </h6>
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
                        return history.goBack();
                      }
                      history.push(generateJobDetailsPath(params.jobId));
                    }}
                  >
                    <RiCloseLine className="fz-20" />
                  </button>
                </div>
              </div>

              {!!media.medias[selectedIndex]?.tags?.length && (
                <div className="tag-box">
                  <div className="flex-content">
                    {media.medias[selectedIndex].tags.map((mediaTag, index) => {
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
                  media.currentUserPerm[media.medias[selectedIndex]?.id]
                    ?.comments
                }
                selectedIndex={selectedIndex}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
