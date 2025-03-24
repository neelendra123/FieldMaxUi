import { useEffect, useState, useRef, createRef, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { useMountedState, useGeolocation } from 'react-use';

import { FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { IoFlashlightOutline, IoLocateOutline } from 'react-icons/io5';
import { AiOutlineClockCircle, AiOutlineLine } from 'react-icons/ai';
import { RiLayoutGridLine } from 'react-icons/ri';
import { FaSyncAlt } from 'react-icons/fa';

import { useQuery, useCameraPhoto } from '../../../../utils/hooks';
import { dataURLToFile, toLocaleDTString } from '../../../../utils/common';
import { errorToast, successToast } from '../../../../utils/toast';

import { IAppReduxState } from '../../../../redux/reducer';

import Popup from '../../../../components/Common/Popup';
import Main from '../../../../components/Layouts/Main';
import JobRoutes from '../../../Jobs/routes';

import { EditVisibility } from '../../Common';

import MediaRoutes from '../../routes';
import * as interfaces from '../../interfaces';
import * as utils from '../../utils';
import * as services from '../../services';
import * as constants from '../../constants';

import {
  SelectedMediaEdit,
  PhotoEditor,
  PhotoGrid,
  PhotoLevel,
} from '../Common';

import '../Photos.scss';

const MediaEditedDetail = {
  edited: false,

  media: '',
  mediaPath: '', //This is the path that is stored in S3
  mediaContentType: '',
  mediaURL: '',

  subMediaKind: '',

  oldMedia: '',
};
export default function PhotoEdit() {
  const isMounted = useMountedState();

  const query = useQuery();
  const { pathname } = useLocation();
  const params: { jobId?: string; mediaId: string; subMediaId: string } =
    useParams();
  const history = useHistory<any>();

  const kind = params.jobId
    ? interfaces.IMediaKind.JobPhoto
    : interfaces.IMediaKind.Photo;

  const { authUser, accountIndex } = useSelector(
    (state: IAppReduxState) => state.auth
  );

  const [paths] = useState(utils.generateAddEditMediaPaths(pathname));

  const videoPreviewRef = useRef<any>();
  const canvasRef = createRef<any>();

  const [isFetching, setIsFetching] = useState(false);

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
  const [selectedSubMediaIndex, setSelectedSubMediaIndex] = useState(0);

  const [mediaEditedDetails, setMediaEditedDetails] = useState({
    ...MediaEditedDetail,
  });

  //  Camera Constraints

  const [startCamera, setStartCamera] = useState(false);

  // Popups
  const [saveMedia, setSaveMedia] = useState(false);

  // Camera Filter
  const [cameraOptions, setCameraOptions] = useState(true);

  const [stampDT, setStampDT] = useState(false);
  const [stampLocation, setStampLocation] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [torch, setTorch] = useState(false);
  const [level, setLevel] = useState(false);

  const [maxZoom, setMaxZoom] = useState(1);
  const [zoom, setZoom] = useState(1);

  //  Camera
  const [mediaConstraints, setMediaConstraints] =
    useState<MediaStreamConstraints>({
      audio: false,
      video: {
        facingMode: 'environment',
      },
    });

  let {
    error: cameraError,
    status,
    liveStream,
    getMediaStream,
    clearMediaStream,
  } = useCameraPhoto({
    mediaConstraints,
  });

  //  Location
  const location = useGeolocation();

  const fetchData = async () => {
    setIsFetching(true);

    let mediaDetails = await services.mediaDetailsService({
      jobId: params.jobId,
      mediaId: params.mediaId,
      params: {
        kind,
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

    //  This is changing the URL to DataURL
    const mediaArray = formatedMedia.medias[0].media.split('.');
    const extention = mediaArray[mediaArray.length - 1];

    const mediaContentType = `image/${extention}`;

    const mediaFile = await dataURLToFile(
      formatedMedia.medias[0].mediaURL,
      mediaContentType,
      params.subMediaId
    );
    const mediaURL = window.URL.createObjectURL(mediaFile);

    formatedMedia.medias[0].media = mediaURL;
    formatedMedia.medias[0].mediaURL = mediaURL;

    setMedias([formatedMedia]);
    setIsFetching(false);
    setStartCamera(false);

    setMediaEditedDetails({
      ...mediaEditedDetails,
      oldMedia,
    });
  };
  //  This is called once stop recording is called
  const clickPhoto = async (subKind: interfaces.IPhotoSubKinds) => {
    if (!canvasRef.current && !videoPreviewRef.current) {
      return;
    }

    const { media, contentType } = utils.cameraOptionsPhotoProcess(
      { canvasRef, videoPreviewRef },
      { stampDT, stampLocation, showGrid, location }
    );

    const newMedias = [...medias];

    newMedias[selectedIndex].medias[selectedSubMediaIndex] = {
      ...newMedias[selectedIndex].medias[selectedSubMediaIndex],
      mediaURL: media,
    };

    setMedias(newMedias);

    setMediaEditedDetails({
      ...mediaEditedDetails,
      edited: true,
      media,
      mediaContentType: contentType,
      subMediaKind: newMedias[selectedIndex].medias[selectedSubMediaIndex]
        .subKind as string,
    });

    if (selectedIndex !== -1 && startCamera) {
      setStartCamera(false);
    }
  };

  const changeAdvancedOption = async (
    key: 'torch' | 'zoom',
    value: number | boolean
  ) => {
    if (!liveStream || !isMounted()) {
      return;
    }

    // Get the Active track of the Stream
    const track = liveStream.getVideoTracks()[0];

    const capabilities = track.getCapabilities ? track.getCapabilities() : {};

    if (capabilities.zoom?.max && capabilities.zoom?.max !== -1) {
      setMaxZoom(capabilities.zoom.max);
    }

    if (!capabilities[key]) {
      return;
    }

    await track.applyConstraints({
      advanced: [{ [key]: value }],
    });

    if (key === 'zoom') {
      setZoom(value as number);
    } else {
      setTorch(value as boolean);
    }
  };

  useEffect(() => {
    if (!isMounted()) {
      return;
    }

    fetchData();

    return () => {
      clearMediaStream();
    };
  }, []);

  //  This is live streaming the the camera to the video
  useEffect(() => {
    if (videoPreviewRef.current && liveStream) {
      videoPreviewRef.current.srcObject = liveStream;
    }
  }, [liveStream]);

  useEffect(() => {
    if (!startCamera) {
      clearMediaStream();
    } else {
      getMediaStream();
    }
  }, [selectedIndex, selectedSubMediaIndex, startCamera, mediaConstraints]);

  //  For Handling Error
  useEffect(() => {
    if (!isMounted()) {
      return;
    }

    let error = cameraError;
    if (location.error) {
      error = `${location.error.message}, stamping location is disabled, kindly refresh and try again`;
    }

    if (!error) {
      return;
    }

    console.error(error);

    errorToast(error);
  }, [cameraError, location.error]);

  const isCameraReady = status === 'ready';

  const getType = () => {
    switch (query.get('type')) {
      case 'Edit': {
        return (
          <PhotoEditor
            image={
              medias[selectedIndex]?.medias[selectedSubMediaIndex]?.mediaURL
            }
            onLoadEffect={() => {
              clearMediaStream();
            }}
            onSaveEffect={(media: string, mediaContentType: string) => {
              const newMedias = [...medias];
              newMedias[selectedIndex].medias[selectedSubMediaIndex] = {
                ...newMedias[selectedIndex].medias[selectedSubMediaIndex],
                media,
                mediaURL: media,
              };

              setMedias(newMedias);

              setMediaEditedDetails({
                ...mediaEditedDetails,
                edited: true,
                media,
                mediaContentType,

                subMediaKind: newMedias[selectedIndex].medias[
                  selectedSubMediaIndex
                ].subKind as string,
              });

              history.push(paths.base);
            }}
          />
        );
      }
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
                medias[selectedIndex].medias[selectedSubMediaIndex]?.id
              ]?.members
            }
          />
        );
      }
      default: {
        return <AddMedia />;
      }
    }
  };

  const PhotoCameraComp = () => {
    return (
      <Fragment>
        <div className="single-image-container">
          {startCamera && isCameraReady && liveStream && (
            <Fragment>
              <video
                ref={videoPreviewRef}
                autoPlay
                className="videoPreviewRef"
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />

              {showGrid && <PhotoGrid />}

              <div className="vert-center-text">
                {stampDT && <p>{toLocaleDTString()}</p>}

                {stampLocation && location.latitude && location.longitude && (
                  <p>
                    {location.latitude.toFixed(5)},{' '}
                    {location.longitude.toFixed(5)}
                  </p>
                )}
              </div>

              {level && <PhotoLevel />}
            </Fragment>
          )}

          {cameraOptions && (
            <div className="button-icon">
              <ul>
                <li
                  title="Switch Camera"
                  onClick={async () => {
                    const videoMediaConstraints: MediaTrackConstraints =
                      mediaConstraints.video as object;

                    const facingMode =
                      videoMediaConstraints.facingMode === 'environment'
                        ? 'user'
                        : 'environment';

                    setMediaConstraints({
                      ...mediaConstraints,
                      video: {
                        ...(mediaConstraints.video as object),
                        facingMode,
                      },
                    });

                    setZoom(1);
                  }}
                >
                  <button>
                    <FaSyncAlt className="fz-20" />
                  </button>
                </li>
                <li
                  title="Zoom In"
                  onClick={() => {
                    changeAdvancedOption('zoom', zoom + 1);
                  }}
                >
                  <button>
                    <FiZoomIn className="fz-20" />
                  </button>
                </li>
                <li
                  title="Zoom Out"
                  onClick={() => {
                    let newZoom = zoom === 1 ? 1 : zoom - 1;
                    if (newZoom >= maxZoom) {
                      newZoom = maxZoom - 1;
                    }
                    if (newZoom >= maxZoom) {
                      newZoom = maxZoom - 1 !== 0 ? maxZoom - 1 : 1;
                    }

                    changeAdvancedOption('zoom', newZoom);
                  }}
                >
                  <button>
                    <FiZoomOut className="fz-20" />
                  </button>
                </li>
                {!location.error && (
                  <li
                    title="Stamp Location"
                    onClick={() => {
                      setStampLocation(!stampLocation);
                    }}
                  >
                    <button>
                      <IoLocateOutline className="fz-20" />
                    </button>
                  </li>
                )}
                <li
                  title="Stamp Date Time"
                  onClick={() => {
                    setStampDT(!stampDT);
                  }}
                >
                  <button>
                    <AiOutlineClockCircle className="fz-20 text-white" />
                  </button>
                </li>
                <li
                  title="Torch"
                  onClick={() => {
                    changeAdvancedOption('torch', !torch);
                  }}
                >
                  <button>
                    <IoFlashlightOutline className="fz-20 text-white" />
                  </button>
                </li>
                <li
                  title="Grid"
                  onClick={() => {
                    setShowGrid(!showGrid);
                  }}
                >
                  <button>
                    <RiLayoutGridLine className="fz-20 text-white" />
                  </button>
                </li>
                <li
                  title="Level"
                  onClick={() => {
                    setLevel(!level);
                  }}
                >
                  <button>
                    <AiOutlineLine className="fz-20 text-white" />
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </Fragment>
    );
  };

  const AddMedia = () => {
    const AddMediasPopupComp = () => {
      const onSave = async () => {
        setIsFetching(true);

        let { name, tags } = medias[0].medias[0];
        let media = mediaEditedDetails.oldMedia;

        //  Upload to S3
        if (mediaEditedDetails.edited) {
          let preSignedURLData: interfaces.IPhotoPreSignedURLReqData = {
            medias: [],
          };

          if (
            mediaEditedDetails.subMediaKind ===
            interfaces.IPhotoSubMediaKinds.Simple
          ) {
            preSignedURLData.medias.push({
              kind,
              subKind: interfaces.IPhotoSubKinds.Simple,
              contentType: mediaEditedDetails.mediaContentType,
            });
          } else {
            preSignedURLData.medias.push({
              kind,
              subKind: interfaces.IPhotoSubKinds.Dual,
              contentType: mediaEditedDetails.mediaContentType,
              afterContentType: mediaEditedDetails.mediaContentType,
            });
          }

          //  Generating Pre Signed URLs
          const preSignedURLs: interfaces.IPhotoPreSignedURLResData[] =
            await services.mediasPreSignedURLService({
              jobId: params.jobId,
              data: preSignedURLData,
            });

          //  Media string changed to URL
          const mediaFile = await dataURLToFile(
            mediaEditedDetails.media,
            mediaEditedDetails.mediaContentType,
            params.subMediaId
          );

          let mediaURL = '';
          let mediaPath = '';
          if (
            mediaEditedDetails.subMediaKind ===
            interfaces.IPhotoSubMediaKinds.Simple
          ) {
            //@ts-ignore
            mediaURL = preSignedURLs[0]['simpleImageURL'];
            //@ts-ignore
            mediaPath = preSignedURLs[0]['simpleImage'];
          } else if (
            mediaEditedDetails.subMediaKind ===
            interfaces.IPhotoSubMediaKinds.Before
          ) {
            //@ts-ignore
            mediaURL = preSignedURLs[0]['beforeImageURL'];
            //@ts-ignore
            mediaPath = preSignedURLs[0]['beforeImage'];
          } else {
            //@ts-ignore
            mediaURL = preSignedURLs[0]['afterImageURL'];
            //@ts-ignore
            mediaPath = preSignedURLs[0]['afterImage'];
          }

          //  Upload to S3
          await axios.put(mediaURL, mediaFile, {
            headers: { 'Content-Type': mediaEditedDetails.mediaContentType },
          });

          //  Updated Medias Path after S3 upload for Info Edit
          media = mediaPath;
        }

        //  Photo Edit Service
        await services.photoSubMediaInfoEditService(
          {
            subMediaId: medias[0].medias[0].id,
            mediaKind: kind,
          },
          { name, tags, media }
        );

        if (!isMounted()) {
          return;
        }

        setSaveMedia(false);
        setMediaEditedDetails({
          ...MediaEditedDetail,
          oldMedia: media,
        });
        setIsFetching(false);

        successToast(constants.Messages.photoEdited);
      };

      return (
        <Popup
          isOpen={saveMedia}
          title={'Save Photos'}
          hideButton={false}
          onClose={() => setSaveMedia(false)}
          leftFunction={() => setSaveMedia(false)}
          onSave={onSave}
          addClassToWrapper="card-media-box"
          leftItemViewOnlyClass="flex-space-center"
          disableButtons={isFetching}
        >
          <div className="sec-content">
            <p>Are you sure want save these photos?</p>
          </div>
        </Popup>
      );
    };

    return (
      <div className="media-camera-wrap pb-5">
        {saveMedia
          ? (document.body.className = 'fixed-position')
          : (document.body.className = '')}

        {/* For Saving all media */}
        <AddMediasPopupComp />

        {startCamera ? (
          <PhotoCameraComp />
        ) : (
          <SelectedMediaEdit
            paths={paths}
            medias={medias}
            setMedias={setMedias}
            selectedIndex={selectedIndex}
            selectedSubMediaIndex={selectedSubMediaIndex}
            setSelectedSubMediaIndex={setSelectedSubMediaIndex}
            setStartCamera={setStartCamera}
            onSaveEffect={(media: string, mediaContentType: string) => {
              const newMedias = [...medias];
              newMedias[selectedIndex].medias[selectedSubMediaIndex] = {
                ...newMedias[selectedIndex].medias[selectedSubMediaIndex],
                media,
                mediaURL: media,
              };
              setMedias(newMedias);

              setMediaEditedDetails({
                ...mediaEditedDetails,
                edited: true,
                media,
                mediaContentType,

                subMediaKind: medias[selectedIndex].medias[
                  selectedSubMediaIndex
                ].subKind as string,
              });
            }}
          />
        )}

        <div className="slider-bottom-info">
          <div className="leftcenterright">
            <div className="d-flex"></div>

            {startCamera && (
              <div className="centerinfo">
                <img
                  onClick={() => clickPhoto(interfaces.IPhotoSubKinds.Simple)}
                  className="d-inline-block w-40 mr-2"
                  src={
                    require('../../../../assets/images/camera-single.png')
                      .default
                  }
                  alt="Photo"
                  title="Photo"
                />
              </div>
            )}

            <div className="rightinfo">
              {isCameraReady && startCamera && (
                <Fragment>
                  <img
                    onClick={() => setCameraOptions(!cameraOptions)}
                    className="d-inline-block w-40 mr-2"
                    src={
                      require('../../../../assets/images/camera-tool.png')
                        .default
                    }
                    alt="Camera Options"
                    title="Camera Options"
                  />
                </Fragment>
              )}

              {medias.length !== 0 && (
                <Fragment>
                  <img
                    onClick={(e) => setSaveMedia(true)}
                    className="d-inline-block w-40"
                    src={require('../../../../assets/images/check.png').default}
                    alt="Save Photos"
                    title="Save Photos"
                  />
                </Fragment>
              )}
            </div>
          </div>
          <div className="empty-placeholder">
            <ul className="bottom-double-outer d-flex m-0 p-0 pt-3">
              {medias.map((media, index) => {
                return (
                  <li
                    key={media.id}
                    className={`d-flex ${
                      selectedIndex === index
                        ? 'active-photo'
                        : 'inactive-photo'
                    }`}
                    onClick={() => {
                      setStartCamera(false);
                      setSelectedSubMediaIndex(0);
                      setSelectedIndex(index);
                    }}
                  >
                    <div className="bottom-inner-outer-wrap d-flex">
                      <div>
                        <img
                          className="d-inline-block"
                          src={media.medias[0].mediaURL}
                          alt={media.medias[0].name}
                          title={media.medias[0].name}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
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
          ? JobRoutes.routes.jobPhotoAdd.sideBarId
          : MediaRoutes.routes.photoAdd.sideBarId
      }
    >
      {getType()}
    </Main>
  );
}
