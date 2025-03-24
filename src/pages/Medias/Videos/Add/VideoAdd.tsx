import { Fragment, useEffect, useState, useRef, createRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useMountedState } from 'react-use';

import {
  AiFillCloseSquare,
  AiOutlineInfoCircle,
  AiOutlineEye,
} from 'react-icons/ai';
import { FiTrash } from 'react-icons/fi';

import { IModuleKind, IOption } from '../../../../interfaces';
import { DummyPhotoBase64 } from '../../../../constants';

import { errorToast } from '../../../../utils/toast';
import { dataURLToFile, generateUniqueId } from '../../../../utils/common';
import { useQuery, useCameraVideo } from '../../../../utils/hooks';

import { IAppReduxState } from '../../../../redux/reducer';

import Main from '../../../../components/Layouts/Main';
import Popup from '../../../../components/Common/Popup';

import { IJobSubModuleTypes } from '../../../Orgs/interfaces';

import { IUserIdPopulated, IUserListAllRes } from '../../../Users/interfaces';
import { generateUserIdPopulated } from '../../../Users/utils';

import JobRoutes from '../../../Jobs/routes';
import { jobDetailService, jobSubModuleMembersListService, uploadFile } from '../../../Jobs/services';

import {
  AddVisibility,
  SubMediaInfoEditPopup,
  VideoPlayer,
} from '../../Common';

import { generateJobDetailsPath } from '../../../Jobs/utils';

import MediaRoutes from '../../routes';
import * as interfaces from '../../interfaces';
import * as utils from '../../utils';
import * as services from '../../services';
import * as constants from '../../constants';

export default function VideoAdd() {
  const isMounted = useMountedState();

  const query = useQuery();
  const params: { jobId?: string } = useParams();
  const history = useHistory<any>();
  const { pathname } = useLocation();

  const kind = params.jobId
    ? interfaces.IMediaKind.JobVideo
    : interfaces.IMediaKind.Video;

  const { authUser } = useSelector((state: IAppReduxState) => state.auth);

  const [creatorId] = useState<IUserIdPopulated>(
    generateUserIdPopulated(authUser)
  );
  const [paths] = useState(utils.generateAddEditMediaPaths(pathname));

  const videoPreviewRef = useRef<any>();
  const canvasRef = createRef<any>();

  const [isFetching, setIsFetching] = useState(false);

  const [accountUsers, setAccountUsers] = useState<
    interfaces.IAddEditSubMediaUser[]
  >([]);

  const [medias, setMedias] = useState<interfaces.IVideoAddMedia[]>([]);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [deleteIndex, setDeleteIndex] = useState(-1);
  const [saveMedia, setSaveMedia] = useState(false);
  const [info, setInfo] = useState(false);

  const [discard, setDiscard] = useState(false);

  //  This is called once stop recording is called
  const onStopRecordingEffect = async (mediaBlob: Blob) => {
    const newMedias = [...medias];

    const media = URL.createObjectURL(mediaBlob);

    const thumbnail = await utils.fileGenerateThumb(media);

    //  This is incase of re recording a selected media
    if (selectedIndex >= 0) {
      newMedias[selectedIndex].medias[0].media = media;
      newMedias[selectedIndex].medias[0].thumbnail = thumbnail;
    } else {
      //  This is incase recording a new media
      let name = `Video ${medias.length + 1}`;
      let tags: string[] = [];

      newMedias.push({
        id: generateUniqueId(),
        kind,
        name,
        tags,
        creatorId,
        type: 'Uploaded',
        medias: [
          {
            id: generateUniqueId(),

            name,
            tags,
            duration: 0,
            media,
            contentType: 'video/mp4',
            thumbnail,
            users: [...accountUsers],

            mediaPath: '',
            thumbnailPath: '',
          },
        ],
      });
    }

    setSelectedIndex(-1);
    setMedias(newMedias);
    getMediaStream();
  };
  const selectingFromGalleryEffect = async (files: any) => {
    if (!files?.length) {
      return;
    }

    const newMedias = [...medias];
    for (let i = 0; i < files.length; i++) {
      let name = files[i].name; //`Video ${medias.length + i + 1}`;
      let tags: string[] = [];

      // const media = (await utils.fileToDataUri(files[i])) as string;
      // const media = blobs[i] as string;
      // const thumb = await utils.dataURItoBlob(media);
      const thumbnail = await utils.fileGenerateThumb(files[i]);

      newMedias.push({
        id: generateUniqueId(),
        kind,
        name,
        tags,
        creatorId,
        type: 'Uploaded',
        medias: [
          {
            id: generateUniqueId(),
            name,
            tags,
            duration: 0,
            media: window.URL.createObjectURL(files[i]),
            contentType: files[i].type,
            // media: window.URL.createObjectURL(files[i]),
            // utils.dataURItoBlob(media),
            thumbnail,
            users: [...accountUsers],

            mediaPath: '',
            thumbnailPath: '',
          },
        ],
      });
    }

    setMedias(newMedias);
  };

  const removeMedia = () => {
    const newMedias = [...medias];
    newMedias.splice(deleteIndex, 1);
    setMedias(newMedias);
    setSelectedIndex(-1);
    setDeleteIndex(-1);
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
  //  This is loading the Members of the Account or Job
  const fetchData = async () => {
    setIsFetching(true);
    try {
      let moduleKind: IModuleKind = IModuleKind.jobs; //TODO: by default should be simple video
      const subModuleKind = IJobSubModuleTypes.mediaVideos;

      let users: IUserListAllRes[] = [];
      if (params.jobId) {
        moduleKind = IModuleKind.jobs;

        // This is in incase of creating job video
        users = await jobSubModuleMembersListService(params.jobId, {
          subModuleKind,
        });
      }

      if (!isMounted()) {
        return;
      }

      const accountUsers: interfaces.IAddEditSubMediaUser[] =
        utils.filterUsersToAddNewMedias(authUser.id, users, moduleKind);

      setAccountUsers(accountUsers);
    } catch (error) {
      console.error(error);
    }
    if (!isMounted()) {
      return;
    }
    setIsFetching(false);
  };

  const mediaInfoEditEffect = (
    name: string,
    tags: IOption[],
    subMediaIndex = 0
  ) => {
    const newMedias = [...medias];

    const tagValues = tags.map((tag: IOption) => tag.value);

    newMedias[selectedIndex] = {
      ...newMedias[selectedIndex],
      name,
      tags: tagValues,
    };

    newMedias[selectedIndex].medias[subMediaIndex] = {
      ...newMedias[selectedIndex].medias[subMediaIndex],
      name,
      tags: tagValues,
    };

    setMedias(newMedias);

    setInfo(false);
  };

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

    getMediaStream();

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
          <AddVisibility
            paths={paths}
            // kind={utils.videoKindGenerate(params.jobId)}
            medias={medias}
            setMedias={setMedias}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
          />
        );
      }
      default: {
        return <AddMedia />;
      }
    }
  };

  const AddMedia = () => {
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

    const AddMediasPopupComp = () => {
      const onSave = async () => {
        setIsFetching(true);

        try {
          const preSignedURLData: interfaces.IVideosPreSignedURLReqData = {
            medias: medias.map((media) => {
              return {
                kind,
                contentType: media.medias[0].contentType,
              };
            }),
          };

          //  Generating Pre Signed URLs
          const preSignedURLs: interfaces.IVideoPreSignedURLResData[] =
            await services.mediasPreSignedURLService({
              jobId: params.jobId,
              data: preSignedURLData,
            });

          //  Uploading to S3 all videos, thumbnail
          const uploadPromises = [];
          const JobDetails = await jobDetailService(params.jobId?params.jobId:"");
          const ServiceID = JobDetails.serviceIssues.ServiceManagerIssueID;
          const formdata = new FormData();
          formdata.append("issueID", ""+ServiceID);
          for (let i = 0; i < medias.length; i++) {
            const mediaName = utils.fileNameExtractFromURL(
              preSignedURLs[i].video
            );
            const mediaURL = preSignedURLs[i].videoURL;
            const mediaContentType = medias[i].medias[0].contentType;

            const thumbnailName = utils.fileNameExtractFromURL(
              preSignedURLs[i].thumbnail
            );
            const thumbnailURL = preSignedURLs[i].thumbnailURL;
            const thumbnailContentType = 'image/png';

            medias[i].medias[0].mediaPath = preSignedURLs[i].video;
            medias[i].medias[0].thumbnailPath = preSignedURLs[i].thumbnail;

            const [mediaFile, thumbnailFile] = await Promise.all([
              dataURLToFile(
                medias[i].medias[0].media,
                mediaContentType,
                mediaName
              ),
              dataURLToFile(
                medias[i].medias[0].thumbnail,
                thumbnailContentType,
                thumbnailName
              ),
            ]);

            uploadPromises.push(
              axios.put(mediaURL, mediaFile, {
                headers: { 'Content-Type': mediaContentType },
              }),
              axios.put(thumbnailURL, thumbnailFile, {
                headers: { 'Content-Type': thumbnailContentType },
              })
            );

            formdata.append("file"+i, mediaFile, thumbnailURL);
            uploadPromises.push(
              axios.put(thumbnailURL, mediaFile, {
                headers: { 'Content-Type': mediaContentType },
              })
            );

          }
          //
          //Uploading photos to RM.
          if(Number(ServiceID) > 0){
            await uploadFile(formdata);
          }
          await Promise.all(uploadPromises);

          if (params.jobId) {
            await services.jobVideosAddService(params.jobId, medias);

            history.push(
              `${generateJobDetailsPath(params.jobId as string)}#pills-home`,
              {
                successMsg:
                  medias.length === 1
                    ? constants.Messages.videoCreated
                    : constants.Messages.videosCreated,
              }
            );
          }
        } catch (error) {
          console.error(error);
        }

        if (!isMounted()) {
          return;
        }

        setIsFetching(false);
        setSaveMedia(false);
      };

      return (
        <Popup
          isOpen={saveMedia}
          title={'Save Videos'}
          hideButton={false}
          onClose={() => setSaveMedia(false)}
          leftFunction={() => setSaveMedia(false)}
          onSave={onSave}
          addClassToWrapper="card-media-box"
          leftItemViewOnlyClass="flex-space-center"
          disableButtons={isFetching}
        >
          <div className="sec-content">
            <p>Are you sure want save these videos?</p>
          </div>
        </Popup>
      );
    };

    return (
      <div className="media-camera-wrap pb-5">
        <div className="d-block d-md-flex">
          {deleteIndex !== -1 || discard || saveMedia || info
            ? (document.body.className = 'fixed-position')
            : (document.body.className = '')}

          <Popup
            isOpen={deleteIndex !== -1}
            title={'Confirmation'}
            hideButton={false}
            onClose={() => setDeleteIndex(-1)}
            leftItem={'Cancel'}
            leftFunction={() => setDeleteIndex(-1)}
            onSave={removeMedia}
            ModalName={'Delete'}
            addClassToWrapper="card-media-box"
            leftItemViewOnlyClass="flex-space-center"
          >
            <div className="sec-content">
              <p>Are you sure you want to delete this video?</p>
            </div>
          </Popup>

          <Popup
            isOpen={discard}
            title={'Confirmation'}
            hideButton={false}
            onClose={() => setDiscard(false)}
            leftItem={'Cancel'}
            leftFunction={() => setDiscard(false)}
            onSave={() => {
              setSelectedIndex(-1);
              setMedias([]);
              setDiscard(false);
            }}
            ModalName={'Discard'}
            addClassToWrapper="card-media-box"
            leftItemViewOnlyClass="flex-space-center"
          >
            <div className="sec-content">
              <p>Are you sure you want to discard all the progress?</p>
            </div>
          </Popup>

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

          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

          {selectedIndex === -1 && liveStream ? (
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
              <div className="image-inner">
                {selectedIndex !== -1 && (
                  <>
                    <VideoPlayer
                      className="responsive-video"
                      //@ts-ignore
                      srcBlob={medias[selectedIndex].medias[0].media}
                      title={medias[selectedIndex].medias[0]?.name}
                    />
                    <div className="button-icon">
                      <ul>
                        {/* <li onClick={startRecording}>
                          <button title="Record Again">
                            <MdModeEdit />
                          </button>
                        </li> */}
                        {/* This is re recording the selected media */}
                        <li
                          onClick={() => {
                            setDeleteIndex(selectedIndex);
                          }}
                        >
                          <button title="Remove media">
                            <FiTrash />
                          </button>
                        </li>
                        {/* This is removing the selected Media from Medias */}
                        <li onClick={(e) => setInfo(true)}>
                          <button title="Info">
                            <AiOutlineInfoCircle color="#FFF" />
                          </button>
                        </li>
                        <li
                          onClick={() => {
                            history.push(paths.visibility);
                          }}
                        >
                          <button title="Visibility">
                            <AiOutlineEye className="text-white" />
                          </button>
                        </li>
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
          ) : selectedIndex >= 0 ? (
            <div className="d-flex justify-content-end">
              <img
                onClick={() => {
                  getMediaStream();
                  setSelectedIndex(-1);
                }}
                className="d-inline-block w-40 mr-2"
                src={require('../../../../assets/images/cross.png').default}
                alt="logo"
              />

              <img
                onClick={() => setSaveMedia(true)}
                className="d-inline-block w-40"
                src={require('../../../../assets/images/check.png').default}
                alt="Save Videos"
                title="Save Videos"
              />
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
                    multiple
                    className="d-none"
                    onChange={(event) =>
                      selectingFromGalleryEffect(event.target.files)
                    }
                  />
                </label>
              </div>

              <div className="centerinfo">
                <img
                  onClick={startRecording}
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
                  <Fragment>
                    <img
                      onClick={() => setDiscard(true)}
                      className="d-inline-block w-40 mr-2"
                      src={
                        require('../../../../assets/images/cross.png').default
                      }
                      alt="Discard All"
                      title="Discard All"
                    />
                    <img
                      onClick={() => setSaveMedia(true)}
                      className="d-inline-block w-40"
                      src={
                        require('../../../../assets/images/check.png').default
                      }
                      alt="Save Videos"
                      title="Save Videos"
                    />
                  </Fragment>
                )}
              </div>
            </div>
          )}

          <div className="bottom-sliderarea min-116">
            <ul className="bottom-double-outer d-flex m-0 p-0 pt-3 overflow-auto">
              {!isRecording &&
                medias.map((media, index) => (
                  <li
                    className="d-flex mt-3"
                    key={index}
                    onClick={() => {
                      clearMediaStream();
                      setSelectedIndex(index);
                    }}
                    style={{ border: `ipx solid yellow` }}
                  >
                    <AiFillCloseSquare
                      className="close-video"
                      onClick={() => {
                        setDeleteIndex(index);
                      }}
                      title="Delete Video"
                    />
                    <div
                      style={{
                        border:
                          selectedIndex === index
                            ? `2px solid var(--primary)`
                            : 'none',
                      }}
                      className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center"
                    >
                      <img
                        className=" "
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
                          className="d-inline-block "
                          src={media.medias[0].thumbnail || DummyPhotoBase64}
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
          ? JobRoutes.routes.jobVideoAdd.sideBarId
          : MediaRoutes.routes.videoAdd.sideBarId
      }
    >
      {getType()}
    </Main>
  );
}
