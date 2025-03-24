import { Fragment, useEffect, useState, useRef, createRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { useMountedState } from 'react-use';

import { AiOutlineInfoCircle, AiOutlineEye } from 'react-icons/ai';

import { IOption } from '../../../../interfaces';
import { CommonPerms, DummyPhotoBase64 } from '../../../../constants';

import { dataURLToFile } from '../../../../utils/common';
import { errorToast, successToast } from '../../../../utils/toast';
import { useQuery, useCameraVideo } from '../../../../utils/hooks';

import { IAppReduxState } from '../../../../redux/reducer';

import Main from '../../../../components/Layouts/Main';
import Popup from '../../../../components/Common/Popup';

import JobRoutes from '../../../Jobs/routes';

import {
  SubMediaInfoEditPopup,
  EditVisibility,
  VideoPlayer,
} from '../../Common';

import MediaRoutes from '../../routes';
import * as interfaces from '../../interfaces';
import * as constants from '../../constants';
import * as utils from '../../utils';
import * as services from '../../services';

const MediaEditedDetail = {
  edited: false,

  media: '',
  mediaPath: '', //This is the path that is stored in S3
  mediaContentType: 'video/mp4',

  thumbnail: '',
  thumbnailPath: '', //This is the path that is stored in S3
  thumbnailContentType: '',

  oldMedia: '',
  oldThumbnail: '',
};
export default function VideoEdit() {
  const isMounted = useMountedState();

  const query = useQuery();
  let history = useHistory<any>();
  const { pathname } = useLocation();
  const params: { jobId?: string; mediaId: string; subMediaId: string } =
    useParams();

  const kind = params.jobId
    ? interfaces.IMediaKind.JobVideo
    : interfaces.IMediaKind.Video;

  const { authUser, accountIndex } = useSelector(
    (state: IAppReduxState) => state.auth
  );

  const [isFetching, setIsFetching] = useState(false);

  const videoPreviewRef = useRef<any>();
  const canvasRef = createRef<any>();

  const [medias, setMedias] = useState<interfaces.IMediaPopulatedTypes[]>([
    utils.generateDefaultMedia(
      kind,
      params.jobId,
      params.mediaId,
      undefined,
      {
        [params.subMediaId]: utils.generateDefaultSubMediaPerm(),
      },
      params.subMediaId
    ),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [mediaEditedDetails, setMediaEditedDetails] = useState({
    ...MediaEditedDetail,
  });

  const [saveMedia, setSaveMedia] = useState(false);
  const [info, setInfo] = useState(false);

  //  This is called once stop recording is called
  const onStopRecordingEffect = async (mediaBlob: Blob) => {
    const newMedias = [...medias];

    const media = URL.createObjectURL(mediaBlob);

    const thumbnail = await utils.fileGenerateThumb(media);

    newMedias[selectedIndex].medias[0].media = media;
    newMedias[selectedIndex].medias[0].mediaURL = media;
    newMedias[selectedIndex].medias[0].thumbnail = thumbnail;
    newMedias[selectedIndex].medias[0].thumbnailURL = thumbnail;

    setMedias(newMedias);

    setMediaEditedDetails({
      ...mediaEditedDetails,
      edited: true,

      media,
      mediaContentType: 'video/mp4',

      thumbnail,
      thumbnailContentType: 'image/png',
    });
  };
  const selectingFromGalleryEffect = async (files: any) => {
    if (!files?.length) {
      return;
    }

    const newMedias = [...medias];

    const media = window.URL.createObjectURL(files[0]);
    const thumbnail = await utils.fileGenerateThumb(files[0]);

    newMedias[selectedIndex].medias[0].media = media;
    newMedias[selectedIndex].medias[0].mediaURL = media;
    newMedias[selectedIndex].medias[0].thumbnail = thumbnail;
    newMedias[selectedIndex].medias[0].thumbnailURL = thumbnail;

    setMedias(newMedias);

    setMediaEditedDetails({
      ...mediaEditedDetails,
      edited: true,

      media,
      mediaContentType: files[0].type,

      thumbnail,
      thumbnailContentType: 'image/png',
    });
  };

  const fetchData = async () => {
    setIsFetching(true);

    let mediaDetails = await services.mediaDetailsService({
      jobId: params.jobId,
      mediaId: params.mediaId,
      params: {
        kind: interfaces.IMediaKind.JobVideo,
        subMediaId: params.subMediaId,
      },
    });

    const formatedMedia = utils.parsePopulatedMedia(mediaDetails, {
      userId: authUser.id,
      baseUserType: authUser.userType,
      accountUserType: authUser.accounts[accountIndex].userType,
    });

    if (!isMounted()) {
      return;
    }

    const oldMedia = formatedMedia.medias[0].media;
    const oldThumbnail = formatedMedia.medias[0].thumbnail as string;

    setMedias([formatedMedia]);
    setIsFetching(false);

    setMediaEditedDetails({
      ...mediaEditedDetails,
      oldMedia,
      oldThumbnail,
    });
  };

  const handleStartRecording = async () => {
    await getMediaStream();
    startRecording();
  };

  let {
    error,
    status,
    liveStream,
    stopRecording,
    getMediaStream,
    startRecording,
    clearMediaStream,
  } = useCameraVideo({
    onStop: onStopRecordingEffect,
  });

  useEffect(() => {
    if (!error || !isMounted()) {
      return;
    }

    console.error(error);

    errorToast(error.message || error);
  }, [error]);

  useEffect(() => {
    if (!isMounted()) {
      return;
    }

    fetchData();

    return () => {
      clearMediaStream();
    };
  }, []);

  useEffect(() => {
    if (videoPreviewRef.current && liveStream) {
      videoPreviewRef.current.srcObject = liveStream;
    }
  }, [liveStream]);

  const getType = () => {
    switch (query.get('type')) {
      case 'Visibility': {
        return (
          <EditVisibility
            currentUserId={authUser.id}
            medias={medias}
            setMedias={setMedias}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            memberPerm={
              medias[selectedIndex]?.currentUserPerm[
                medias[selectedIndex].medias[0]?.id
              ]?.members
            }
          />
        );
      }
      default: {
        return <EditMedia />;
      }
    }
  };

  const EditMedia = () => {
    const isRecording = status === 'recording';

    const [recordingSeconds, setRecordingSeconds] = useState(0);
    const [recordingMinutes, setRecordingMinutes] = useState(0);

    useEffect(() => {
      const MAX_RECORDER_TIME = 1;
      let recordingInterval: interfaces.IInterval = null;

      if (status === 'recording') {
        recordingInterval = setInterval(() => {
          if (
            recordingMinutes === MAX_RECORDER_TIME &&
            recordingSeconds === 0
          ) {
            typeof recordingInterval === 'number' &&
              clearInterval(recordingInterval);

            stopRecording();
            return;
          }

          if (recordingSeconds >= 0 && recordingSeconds < 59) {
            const newSeconds = recordingSeconds + 1;

            setRecordingSeconds(newSeconds);
            return;
          }

          if (recordingSeconds === 59) {
            setRecordingMinutes(recordingMinutes + 1);
            setRecordingSeconds(0);
          }
        }, 1000);
      } else {
        typeof recordingInterval === 'number' &&
          clearInterval(recordingInterval);
      }

      return () => {
        typeof recordingInterval === 'number' &&
          clearInterval(recordingInterval);
      };
    });

    const mediaInfoEditEffect = (name: string, tags: IOption[]) => {
      const newMedias = [...medias];

      const tagValues = tags.map((tag: IOption) => tag.value);

      newMedias[selectedIndex] = {
        ...newMedias[selectedIndex],
        name,
        tags: tagValues,
        medias: [
          {
            ...newMedias[selectedIndex].medias[0],
            name,
            tags: tagValues,
          },
        ],
      };

      setMedias(newMedias);

      setInfo(false);
    };

    const AddMediasPopupComp = () => {
      const onSave = async () => {
        setIsFetching(true);

        let { name, tags } = medias[0].medias[0];
        let media = medias[0].medias[0].media;
        let thumbnail = medias[0].medias[0].thumbnail as string;

        //  Upload to S3
        if (mediaEditedDetails.edited) {
          //  There will always be one Video
          const preSignedURLData: interfaces.IVideosPreSignedURLReqData = {
            medias: medias.map((media) => {
              return {
                kind,
                contentType: mediaEditedDetails.mediaContentType,
              };
            }),
          };

          //  Generating Pre Signed URLs
          const preSignedURLs: interfaces.IVideoPreSignedURLResData[] =
            await services.mediasPreSignedURLService({
              jobId: params.jobId,
              data: preSignedURLData,
            });

          //  Uploading to S3 the edited video, thumbnail
          const uploadPromises = [];
          for (let i = 0; i < medias.length; i++) {
            const mediaName = utils.fileNameExtractFromURL(
              preSignedURLs[i].video
            );
            const mediaURL = preSignedURLs[i].videoURL;

            const thumbnailName = utils.fileNameExtractFromURL(
              preSignedURLs[i].thumbnail
            );
            const thumbnailURL = preSignedURLs[i].thumbnailURL;

            const [mediaFile, thumbnailFile] = await Promise.all([
              dataURLToFile(
                mediaEditedDetails.media,
                mediaEditedDetails.mediaContentType,
                mediaName
              ),
              dataURLToFile(
                mediaEditedDetails.thumbnail,
                mediaEditedDetails.thumbnailContentType,
                thumbnailName
              ),
            ]);

            uploadPromises.push(
              axios.put(mediaURL, mediaFile, {
                headers: {
                  'Content-Type': mediaEditedDetails.mediaContentType,
                },
              }),
              axios.put(thumbnailURL, thumbnailFile, {
                headers: {
                  'Content-Type': mediaEditedDetails.thumbnailContentType,
                },
              })
            );

            //  Updated Medias Path after S3 upload for Info Edit
            media = preSignedURLs[i].video;
            thumbnail = preSignedURLs[i].thumbnail;
          }
          await Promise.all(uploadPromises);
        }

        //  Video Edit Service
        await services.videoSubMediaInfoEditService(
          {
            subMediaId: medias[0].medias[0].id,
            mediaKind: kind,
          },
          { name, tags, media, thumbnail }
        );

        if (!isMounted()) {
          return;
        }

        setSaveMedia(false);
        setMediaEditedDetails({
          ...MediaEditedDetail,
          oldMedia: media,
          oldThumbnail: thumbnail,
        });
        setIsFetching(false);

        successToast(constants.Messages.videoEdited);
      };

      return (
        <Popup
          isOpen={saveMedia}
          title={'Update Video'}
          hideButton={false}
          onClose={() => setSaveMedia(false)}
          leftFunction={() => setSaveMedia(false)}
          onSave={onSave}
          addClassToWrapper="card-media-box"
          leftItemViewOnlyClass="flex-space-center"
          disableButtons={isFetching}
        >
          <div className="sec-content">
            <p>Are you sure you want to update the video?</p>
          </div>
        </Popup>
      );
    };

    return (
      <div className="media-camera-wrap pb-5">
        <div className="d-block d-md-flex">
          {saveMedia || info
            ? (document.body.className = 'fixed-position')
            : (document.body.className = '')}

          <SubMediaInfoEditPopup
            tempName={medias[selectedIndex]?.medias[0].name}
            tempTags={medias[selectedIndex]?.medias[0].tags}
            info={info}
            setInfo={setInfo}
            selectedIndex={selectedIndex}
            selectedSubMediaIndex={0}
            mediaInfoEditEffect={mediaInfoEditEffect}
          />
          <AddMediasPopupComp />

          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {isRecording && liveStream ? (
            <Fragment>
              <video
                className="image-inner"
                // style={{backgroundColor: '#000'}}
                ref={videoPreviewRef}
                autoPlay
              />
            </Fragment>
          ) : (
            <Fragment>
              <div className="image-inner ">
                {selectedIndex !== -1 && (
                  <>
                    <VideoPlayer
                      className="responsive-video"
                      //@ts-ignore
                      srcBlob={medias[selectedIndex].medias[0].mediaURL}
                      title={medias[selectedIndex].medias[0]?.name}
                    />
                    <div className="button-icon">
                      <ul>
                        {!!mediaEditedDetails.oldMedia && (
                          <Fragment>
                            <li onClick={(e) => setInfo(true)}>
                              <button title="Info">
                                <AiOutlineInfoCircle color="#FFF" />
                              </button>
                            </li>

                            {!!(
                              medias[selectedIndex]?.currentUserPerm[
                                medias[selectedIndex].medias[0].id
                              ]?.members &
                              (CommonPerms.all |
                                CommonPerms.edit |
                                CommonPerms.view)
                            ) && (
                              <li>
                                <button
                                  title="Visibility"
                                  onClick={() => {
                                    history.push(`${pathname}?type=Visibility`);
                                  }}
                                >
                                  <AiOutlineEye className="text-white" />
                                </button>
                              </li>
                            )}
                          </Fragment>
                        )}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </Fragment>
          )}
        </div>
        <div className="slider-bottom-info">
          {isRecording ? (
            <div className="d-flex justify-content-center position-relative align-items-center">
              <div className="centerinfo">
                <img
                  onClick={stopRecording}
                  className="d-inline-block w-40 mr-2"
                  src={
                    require('../../../../assets/images/camera-recording.png')
                      .default
                  }
                  alt="Stop Recording"
                  title="Stop Recording"
                />
              </div>

              <div className="recording-timer">{`0${recordingMinutes}:${
                recordingSeconds < 10
                  ? `0${recordingSeconds}`
                  : recordingSeconds
              }`}</div>
            </div>
          ) : (
            <div className="leftcenterright">
              <div className="leftside">
                <label htmlFor="videoSelect">
                  <img
                    className="d-inline-block w-40 mr-2"
                    src={
                      require('../../../../assets/images/gallery-image.png')
                        .default
                    }
                    alt="Gallery"
                    title="Gallery"
                  />
                  <input
                    id="videoSelect"
                    type="file"
                    accept="video/mp4,video/x-m4v,video/*"
                    className="d-none"
                    onChange={(event) =>
                      selectingFromGalleryEffect(event.target.files)
                    }
                  />
                </label>
              </div>

              <div className="centerinfo">
                <img
                  onClick={handleStartRecording}
                  className="d-inline-block w-40 mr-2"
                  style={{ marginLeft: medias.length !== 0 ? 40 : 0 }}
                  src={
                    require('../../../../assets/images/camera-single.png')
                      .default
                  }
                  alt="Start Recording"
                  title="Start Recording"
                />
              </div>
              <div className="float-right">
                {medias.length !== 0 && (
                  // medias[0].currentUserPerm[]
                  <Fragment>
                    <img
                      onClick={() => setSaveMedia(true)}
                      className="d-inline-block w-40"
                      src={
                        require('../../../../assets/images/check.png').default
                      }
                      alt="Edit Video"
                      title="Edit Video"
                    />
                  </Fragment>
                )}
              </div>
            </div>
          )}

          <div className="bottom-sliderarea min-116">
            <ul className="bottom-double-outer d-flex m-0 p-0 pt-3 overflow-auto">
              {!isRecording &&
                medias.map((media, i) => (
                  <li
                    className="d-flex mt-3"
                    key={i}
                    onClick={() => setSelectedIndex(i)}
                    style={{ border: `1 px solid yellow` }}
                  >
                    <div
                      style={{
                        border:
                          selectedIndex === i
                            ? `2px solid var(--primary)`
                            : 'none',
                      }}
                      className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center"
                    >
                      <img
                        src={
                          require('../../../../assets/images/play-button.png')
                            .default
                        }
                        alt={media.medias[0].name}
                        title={media.medias[0].name}
                      />
                    </div>

                    <div className="bottom-inner-outer-wrap d-flex">
                      <div className="">
                        <img
                          className="d-inline-block"
                          src={media.medias[0].thumbnailURL || DummyPhotoBase64}
                          alt={media.medias[0].name}
                          title={media.medias[0].name}
                        />
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Main
      sideBarId={
        params.jobId
          ? JobRoutes.routes.jobVideoEdit.sideBarId
          : MediaRoutes.routes.videoAdd.sideBarId
      }
    >
      {getType()}
    </Main>
  );
}
