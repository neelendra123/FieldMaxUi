import {
  useEffect,
  useState,
  useRef,
  createRef,
  Fragment,
  ChangeEvent,
} from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { useGeolocation, useMountedState } from 'react-use';

import { AiFillCloseSquare } from 'react-icons/ai';
import { FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { IoFlashlightOutline, IoLocateOutline } from 'react-icons/io5';
import { AiOutlineClockCircle, AiOutlineLine } from 'react-icons/ai';
import { RiLayoutGridLine } from 'react-icons/ri';
import { FaSyncAlt } from 'react-icons/fa';

import { IModuleKind } from '../../../../interfaces';
import { DummyPhotoBase64 } from '../../../../constants';

import { useQuery, useCameraPhoto } from '../../../../utils/hooks';

import {
  dataURLToFile,
  generateUniqueId,
  toLocaleDTString,
} from '../../../../utils/common';
import { errorToast } from '../../../../utils/toast';

import { IAppReduxState } from '../../../../redux/reducer';

import Popup from '../../../../components/Common/Popup';
import Main from '../../../../components/Layouts/Main';
import JobRoutes from '../../../Jobs/routes';

import { AddVisibility } from '../../Common';

import { IUserIdPopulated, IUserListAllRes } from '../../../Users/interfaces';
import { generateUserIdPopulated } from '../../../Users/utils';

import { IJobSubModuleTypes } from '../../../Orgs/interfaces';

import { jobDetailService, jobSubModuleMembersListService, uploadFile } from '../../../Jobs/services';
import { generateJobDetailsPath } from '../../../Jobs/utils';

import MediaRoutes from '../../routes';
import * as interfaces from '../../interfaces';
import * as utils from '../../utils';
import * as services from '../../services';
import * as constants from '../../constants';

import {
  SelectedMediaAdd,
  PhotoEditor,
  PhotoGrid,
  PhotoLevel,
} from '../Common';

import '../Photos.scss';
import { TextInputComp } from '../../../../components/Forms';



export default function PhotoAdd() {
  const isMounted = useMountedState();
  const params: { jobId?: string } = useParams();
  const { pathname } = useLocation();
  const query: any = useQuery();
  const history = useHistory<any>();

  const kind = params.jobId
    ? interfaces.IMediaKind.JobPhoto
    : interfaces.IMediaKind.Photo;

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

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedSubMediaIndex, setSelectedSubMediaIndex] = useState(0);

  // const [deviceId, setDeviceId] = useState('');

  const [medias, setMedias] = useState<interfaces.IPhotoAddMedia[]>([]);

  const [startCamera, setStartCamera] = useState(true);

  //
  const [inputValue, setInputValue] = useState('');
  //

  // Popups
  const [deleteMediaIndex, setDeleteMediaIndex] = useState(-1);
  const [saveMedia, setSaveMedia] = useState(false);
  const [discard, setDiscard] = useState(false);
  const [upload, setUpload] = useState(false);

  // Camera Filter
  const [cameraOptions, setCameraOptions] = useState(true);

  const [maxZoom, setMaxZoom] = useState(1);
  const [zoom, setZoom] = useState(1);

  const [stampDT, setStampDT] = useState(false);
  const [stampLocation, setStampLocation] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [torch, setTorch] = useState(false);
  const [level, setLevel] = useState(false);

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

  //  This is loading the Members of the Account or Job
  const fetchData = async () => {
    setIsFetching(true);
    try {
      let moduleKind: IModuleKind = IModuleKind.jobs; //TODO: by default should be simple video
      const subModuleKind = IJobSubModuleTypes.mediaPhotos;

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
  //  This is called once stop recording is called
  const clickPhoto = async (subKind: interfaces.IPhotoSubKinds) => {
    if (!canvasRef.current && !videoPreviewRef.current) {
      return;
    }

    const { media, contentType } = utils.cameraOptionsPhotoProcess(
      { canvasRef, videoPreviewRef },
      {
        stampDT,
        stampLocation,
        showGrid,
        location,
      }
    );

    const newMedias = [...medias];

    if (selectedIndex !== -1) {
      newMedias[selectedIndex].medias[selectedSubMediaIndex] = {
        ...newMedias[selectedIndex].medias[selectedSubMediaIndex],
        media,
        isDummy: false,
      };
    } else {
      const name = `Photo ${medias.length + 1}`;
      const tags: string[] = [];

      const users: interfaces.IAddEditSubMediaUser[] = [...accountUsers];

      const subMedias: interfaces.IPhotoAddSubMedia[] = [];

      if (subKind === interfaces.IPhotoSubKinds.Simple) {
        subMedias.push({
          id: generateUniqueId(),

          subKind: interfaces.IPhotoSubMediaKinds.Simple,

          name: `${name} Simple`,
          tags,
          media,
          contentType,
          users,

          mediaPath: '',

          isDummy: false,
        });
      } else {
        subMedias.push(
          {
            id: generateUniqueId(),

            subKind: interfaces.IPhotoSubMediaKinds.Before,

            name: `${name} Before`,
            tags,
            media: media,
            contentType,
            users,

            mediaPath: '',

            isDummy: false,
          },
          {
            id: generateUniqueId(),

            subKind: interfaces.IPhotoSubMediaKinds.After,

            name: `${name} After`,
            tags,
            media: DummyPhotoBase64,
            contentType: '',
            users,

            mediaPath: '',

            isDummy: true,
          }
        );
      }

      newMedias.push({
        id: generateUniqueId(),
        kind,
        subKind,
        name,
        tags,
        creatorId,
        type: 'Uploaded',
        medias: subMedias,
      });
    }

    setMedias(newMedias);

    if (selectedIndex !== -1 && startCamera) {
      setStartCamera(false);
    }
  };
  //  This is called once user selects from the gallery
  const selectingFromGalleryEffect = async (
    { currentTarget: { files } }: ChangeEvent<HTMLInputElement>,
    subKind: interfaces.IPhotoSubKinds
  ) => {
    if (!files?.length) {
      return;
    }
    
    console.log("files are: ",files)

    const newMedias = [...medias];
    for (let i = 0; i < files.length; i++) {
      //uploadFile(files[i]);
      const name = files[i].name; //`Photo ${medias.length + i + 1}`;
      const tags: string[] = [];

      const media = window.URL.createObjectURL(files[i]);
      const contentType = files[i].type;
      const users: interfaces.IAddEditSubMediaUser[] = [...accountUsers];

      const subMedias: interfaces.IPhotoAddSubMedia[] = [];
      if (subKind === interfaces.IPhotoSubKinds.Simple) {
        subMedias.push({
          id: generateUniqueId(),

          subKind: interfaces.IPhotoSubMediaKinds.Simple,

          name: `Simple_${name}`,
          tags,
          media,
          contentType,
          users,

          mediaPath: '',

          isDummy: false,
        });
      } else {
        subMedias.push(
          {
            id: generateUniqueId(),

            subKind: interfaces.IPhotoSubMediaKinds.Before,

            name: `Before_${name}`,
            tags,
            media,
            contentType,
            users,

            mediaPath: '',

            isDummy: false,
          },
          {
            id: generateUniqueId(),

            subKind: interfaces.IPhotoSubMediaKinds.After,

            name: `After_${name}`,
            tags,
            media: DummyPhotoBase64,
            contentType: '',
            users,

            mediaPath: '',

            isDummy: true,
          }
        );
      }

      newMedias.push({
        id: generateUniqueId(),
        kind,
        subKind,
        name,
        tags,
        creatorId,
        type: 'Uploaded',
        medias: subMedias,
      });
    }

    setMedias(newMedias);
    setUpload(false);
  };

  const removeMedia = (index: number) => {
    const newMedias = [...medias];
    newMedias.splice(index, 1);
    setMedias(newMedias);
    setSelectedIndex(-1);
    setSelectedSubMediaIndex(0);
    setDeleteMediaIndex(-1);
    setStartCamera(true);
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

    if (key === 'zoom') {
      setZoom(value as number);
    } else {
      setTorch(value as boolean);
    }

    if (!capabilities[key]) {
      return;
    }

    await track.applyConstraints({
      advanced: [{ [key]: value }],
    });

    // const imageCapture = new ImageCapture(track);
    // const photoCapabilities = await imageCapture.getPhotoCapabilities();
    // await track.applyConstraints({
    //   advanced: [{ torch: true }],
    // });
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

  // //  This is called when changing the camera
  // useEffect(() => {
  //   const videoConstraints: MediaTrackConstraints = {};

  //   if (deviceId) {
  //     videoConstraints.deviceId = { exact: deviceId };
  //   } else {
  //     videoConstraints.facingMode = 'environment';
  //   }

  //   const constraints: MediaStreamConstraints = {
  //     video: videoConstraints,
  //     audio: false,
  //   };

  //   setMediaConstraints(constraints);
  // }, [deviceId]);

  const isCameraReady = status === 'ready';

  const getType = () => {
    switch (query.get('type')) {
      case 'Edit': {
        return (
          <PhotoEditor
            image={medias[selectedIndex]?.medias[selectedSubMediaIndex]?.media}
            onLoadEffect={() => {
              clearMediaStream();
            }}
            onSaveEffect={(media: string, mediaContentType: string) => {
              const newMedias = [...medias];
              newMedias[selectedIndex].medias[selectedSubMediaIndex] = {
                ...newMedias[selectedIndex].medias[selectedSubMediaIndex],
                media,
                isDummy: false,
              };

              setMedias(newMedias);

              history.push(paths.base);
            }}
          />
        );
      }
      case 'Visibility': {
        return (
          <AddVisibility
            paths={paths}
            medias={medias}
            setMedias={setMedias}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            selectedSubMediaIndex={selectedSubMediaIndex}
            setSelectedSubMediaIndex={setSelectedSubMediaIndex}
            clearMediaStream={clearMediaStream}
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
        {/* {JSON.stringify(
          {
            // mediaConstraints,
            // maxZoom,
            // zoom,
            torch,
            check: liveStream?.getVideoTracks()[0]?.getCapabilities?.(),
          },
          null,
          2
        )} */}
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
      var _NewFileName = '';
      const onSave = async () => {
        setIsFetching(true);
        try {
          const preSignedURLData: interfaces.IPhotoPreSignedURLReqData = {
            medias: medias.map((media) => {
              if (media.subKind === interfaces.IPhotoSubKinds.Simple) {
                return {
                  kind,
                  subKind: interfaces.IPhotoSubKinds.Simple,
                  contentType: media.medias[0].contentType,
                };
              } else {
                return {
                  kind,
                  subKind: interfaces.IPhotoSubKinds.Dual,
                  contentType: media.medias[0].contentType || 'image/png',
                  afterContentType: media.medias[1].contentType || 'image/png',
                };
              }
            }),
          };
          //  Generating Pre Signed URLs
          const preSignedURLs: interfaces.IPhotoPreSignedURLResData[] =
            await services.mediasPreSignedURLService({
              jobId: params.jobId,
              data: preSignedURLData,
            });

          const dummyFile = await dataURLToFile(
            DummyPhotoBase64,
            'image/png',
            'dummyPhoto.png'
          );

          //  Uploading to S3 all photos
          const uploadPromises = [];
          //
          const JobDetails = await jobDetailService(params.jobId?params.jobId:"");
          const ServiceID = JobDetails.serviceIssues.ServiceManagerIssueID;
          const formdata = new FormData();
          formdata.append("issueID", ""+ServiceID);
          var _JData = [];
          //
          var FCount = 0;
          for (let i = 0; i < preSignedURLs.length; i++) {
            if (medias[i].subKind === interfaces.IPhotoSubKinds.Simple) {
              //@ts-ignore
              const { simpleImage, simpleImageURL } = preSignedURLs[i];

              const simpleNameTest = utils.fileNameExtractFromURL(simpleImage);
              const extension = simpleNameTest.split('.').pop();
              const simpleURL = simpleImageURL;
              const simpleContentType = medias[i].medias[0].contentType;
              
              const SampleName = inputValue+""+i+"."+extension; 
              console.log("inputted name is: ", SampleName, " : "+inputValue);
              const simpleName = SampleName;
              //if you need to change the name of the file, do it here
              medias[i].name = simpleName;
              medias[i].medias[0].name = simpleName;//
              //

              medias[i].medias[0].mediaPath = simpleImage;
              //There will always be a simple photo
              const mediaFile = await dataURLToFile(
                medias[i].medias[0].media,
                simpleContentType,
                simpleName
              );
              formdata.append("file"+i, mediaFile, simpleName);
              //formdata.append("file"+i, medias[i], simpleName);
              var _tData = {jobId: params.jobId, name:medias[i].name,subKind:medias[i].subKind,fileName:simpleName, data:medias[i]};
              _JData.push(_tData);
              
              uploadPromises.push(
                axios.put(simpleURL, mediaFile, {
                  headers: { 'Content-Type': simpleContentType },
                })
              );
            } else {
              //@ts-ignore
              const { beforeImage, beforeImageURL, afterImage, afterImageURL } =
                preSignedURLs[i];

              const beforeNameTest = utils.fileNameExtractFromURL(beforeImage);
              const extension_before = beforeNameTest.split('.').pop();
              const beforeURL = beforeImageURL;
              const beforeContentType = medias[i].medias[0].contentType;

              const afterNameTest = utils.fileNameExtractFromURL(afterImage);
              const extension_after = afterNameTest.split('.').pop();
              const afterURL = afterImageURL;
              const afterContentType = medias[i].medias[1].contentType;
              const SampleName_before = inputValue+"_before"+i+"."+extension_before; 
              const SampleName_after = inputValue+"_after"+i+"."+extension_after; 
              //
              const beforeName = SampleName_before;
              const afterName = SampleName_after;
              //if you need to change the name of the file, do it here
              medias[i].name = beforeName;
              medias[i].medias[0].name = beforeName;//
             // medias[i].name = beforeName;
              medias[i].medias[1].name = afterName;//
              //
              medias[i].medias[0].mediaPath = beforeImage;
              medias[i].medias[1].mediaPath = afterImage;

              //  Converting data before & after dataURL to files to upload to s3
              const [beforeFile, afterFile] = await Promise.all([
                medias[i].medias[0].isDummy
                  ? dummyFile
                  : dataURLToFile(
                      medias[i].medias[0].media,
                      beforeContentType,
                      beforeName
                    ),
                medias[i].medias[1].isDummy
                  ? dummyFile
                  : dataURLToFile(
                      medias[i].medias[1].media,
                      afterContentType,
                      afterName
                    ),
              ]);
              
              var _tData2 = {jobId: params.jobId,name:"Before"+FCount,subKind:medias[i].medias[0].subKind,fileName:beforeName, data:medias[i]};
              formdata.append("file"+i, beforeFile, beforeName);
              //formdata.append("file"+(FCount+FCount+0), beforeFile, beforeName);
              //console.log("File: ",FCount+FCount+0, beforeFile, beforeName)
              //var _tData3 = {jobId: params.jobId,name:"After"+FCount,subKind:medias[i].medias[1].subKind,fileName:afterName, data:medias[i].medias[1]};
              formdata.append("file"+i, afterFile, afterName);
              //formdata.append("file"+(FCount+FCount+1), afterFile, afterName);
             // console.log("File: ",FCount+FCount+1, afterFile, afterName)
              FCount++;
              _JData.push(_tData2);
              //_JData.push(_tData3);
              uploadPromises.push(
                axios.put(beforeURL, beforeFile, {
                  headers: { 'Content-Type': beforeContentType },
                }),
                axios.put(afterURL, afterFile, {
                  headers: { 'Content-Type': afterContentType },
                })
              );
            }
          }
          //Added by pawan
          formdata.append("type", JSON.stringify(_JData));
          //Uploading photos to RM.
          if(Number(ServiceID) > 0){
            const rest = await uploadFile(formdata);
            console.log(rest);
            console.log("--------");
            history.push(
              `${generateJobDetailsPath(params.jobId as string)}#pills-home`,
              {
                successMsg:
                  medias.length === 1
                    ? constants.Messages.photoCreated
                    : constants.Messages.photosCreated,
              }
            );
          }
          if(Number(ServiceID) === 0){
            //backend will handle all 
            const rest = await uploadFile(formdata);
            console.log(rest);
            console.log("--------");
            history.push(
              `${generateJobDetailsPath(params.jobId as string)}#pills-home`,
              {
                successMsg:
                  medias.length === 1
                    ? constants.Messages.photoCreated
                    : constants.Messages.photosCreated,
              }
            );

            //Uploading to S3 all the photos parallelly.
            // await Promise.all(uploadPromises);

            // if (params.jobId) {
            //   await services.jobPhotosAddService(params.jobId, medias);

            //   history.push(
            //     `${generateJobDetailsPath(params.jobId as string)}#pills-home`,
            //     {
            //       successMsg:
            //         medias.length === 1
            //           ? constants.Messages.photoCreated
            //           : constants.Messages.photosCreated,
            //     }
            //   );
            // }
          }

          //  For Future Media independent of Job
        } catch (error) {
          console.error(error);
        }

        if (!isMounted()) {
          return;
        }

        setIsFetching(false);
        setSaveMedia(false);
      };

      const handleInputChange = (e: any) => {
        console.log(e);
        _NewFileName = e;
        //setInputValue(e.target.value);
        const regex = /^[a-zA-Z0-9\s]+$/;
    
        if (regex.test(_NewFileName)) {
          console.log("pass");
          setInputValue(_NewFileName);
        }
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
          disableButtons={isFetching}>
          
          <TextInputComp
            className="form-control form-control-sm"
            label="Enter file name...."
            id="fileName"
            name="fileName"
            placeholder="File name ....."
            autoFocus
            value={inputValue}
            onChange={handleInputChange}           
          />

          {/* <input
            type="text"
            name="name"
            onChange={handleInputChange}
            //value={inputValue}
          /> */}
         
          <div className="sec-content">
            <p>Are you sure you want to save these photos?</p>
          </div>
        </Popup>
      );
    };
    

    return (
      <div className="media-camera-wrap pb-5">
        {deleteMediaIndex !== -1 || saveMedia || upload || discard
          ? (document.body.className = 'fixed-position')
          : (document.body.className = '')}

        {/* For Deleting a single media */}
        <Popup
          isOpen={deleteMediaIndex !== -1}
          title={'Confirmation'}
          hideButton={false}
          onClose={() => setDeleteMediaIndex(-1)}
          leftItem={'Cancel'}
          leftFunction={() => setDeleteMediaIndex(-1)}
          onSave={() => removeMedia(deleteMediaIndex)}
          ModalName={'Delete'}
          addClassToWrapper="card-media-box"
          leftItemViewOnlyClass="flex-space-center"
        >
          <div className="sec-content">
            <p>Are you sure you want to delete this photo?</p>
          </div>
        </Popup>
        {/* For Discarding all medias */}
        <Popup
          isOpen={discard}
          title={'Confirmation'}
          hideButton={false}
          onClose={() => setDiscard(false)}
          leftItem={'Cancel'}
          leftFunction={() => setDiscard(false)}
          onSave={() => {
            setSelectedIndex(-1);
            setSelectedSubMediaIndex(0);
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
        {/* For Uploading Photo kind: Normal or Before,After */}
        <Popup
          title="Confirmation"
          // addClassToInnerWrapper="confirm-box-sm"
          isOpen={upload}
          onClose={() => setUpload(false)}
          hideButton={true}
        >
          <div className="confirm-box-sm">
            <div className="text-center py-5 text-dark">
              Choose the prototype you are uploding
            </div>
            <div className="popup-action-buttons">
              <button className="btn btn-primary">
                Normal
                <input
                  id="photoSelect"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) =>
                    selectingFromGalleryEffect(
                      event,
                      interfaces.IPhotoSubKinds.Simple
                    )
                  }
                />
              </button>
              <button className="btn btn-primary">
                Before And After{' '}
                <input
                  id="photoSelect"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) =>
                    selectingFromGalleryEffect(
                      event,
                      interfaces.IPhotoSubKinds.Dual
                    )
                  }
                />
              </button>
            </div>
          </div>
        </Popup>
        {/* For Saving all media */}
        <AddMediasPopupComp />

        {startCamera ? (
          <PhotoCameraComp />
        ) : (
          <SelectedMediaAdd
            paths={paths}
            medias={medias}
            setMedias={setMedias}
            selectedIndex={selectedIndex}
            setSelectedSubMediaIndex={setSelectedSubMediaIndex}
            removeMedia={removeMedia}
            setStartCamera={setStartCamera}
          />
        )}

        <div className="slider-bottom-info">
          <div className="leftcenterright">
            <div className="d-flex">
              <img
                onClick={() => setUpload(true)}
                className="d-inline-block w-40 mr-2 c-pointer"
                src={
                  require('../../../../assets/images/gallery-image.png').default
                }
                alt="Gallery"
                title="Gallery"
              />
            </div>

            {startCamera && (
              <div className="centerinfo">
                <img
                  onClick={() => clickPhoto(interfaces.IPhotoSubKinds.Simple)}
                  className="d-inline-block w-40 mr-2"
                  src={
                    require('../../../../assets/images/camera-single.png')
                      .default
                  }
                  alt="Simple Photo"
                  title="Simple Photo"
                />
                <img
                  onClick={() => clickPhoto(interfaces.IPhotoSubKinds.Dual)}
                  className="d-inline-block w-40"
                  src={
                    require('../../../../assets/images/camera-dual.png').default
                  }
                  alt="Dual Photo"
                  title="Dual Photo"
                />
              </div>
            )}

            <div className="rightinfo">
              {isCameraReady && startCamera && (
                <Fragment>
                  {/* <select
                    onChange={(event) => {
                      setDeviceId(event.target.value);
                      setMediaConstraints({
                        ...mediaConstraints,
                        video: {
                          ...(mediaConstraints.video as object),
                          deviceId: { exact: deviceId },
                        },
                      });
                    }}
                    value={deviceId}
                  >
                    {videoDevices.map((videoDevice) => {
                      return (
                        <option
                          key={videoDevice.value}
                          value={videoDevice.value}
                        >
                          {videoDevice.label}
                        </option>
                      );
                    })}
                  </select> */}
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
                    onClick={() => {
                      if (selectedIndex !== -1) {
                        setSelectedIndex(-1);
                        setStartCamera(true);
                      } else {
                        setDiscard(true);
                      }
                    }}
                    className="d-inline-block w-40 mr-2"
                    src={require('../../../../assets/images/cross.png').default}
                    alt="Discard All"
                    title="Discard All"
                  />
                  <img
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    onClick={(e) => {setSaveMedia(true)}}
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
                    <AiFillCloseSquare
                      className="close-image"
                      onClick={() => {
                        setDeleteMediaIndex(index);
                      }}
                    />

                    {media.subKind === interfaces.IPhotoSubKinds.Simple ? (
                      <Fragment>
                        <div className="bottom-inner-outer-wrap d-flex">
                          <div>
                            <img
                              className="d-inline-block"
                              src={media.medias[0].media}
                              alt={media.medias[0].name}
                              title={media.medias[0].name}
                            />
                          </div>
                        </div>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <div className="bottom-inner-outer-wrap d-flex">
                          <div className="bottom-inner-outer">
                            <img
                              className="d-inline-block"
                              src={media.medias[0].media}
                              alt={media.medias[0].name}
                              title={media.medias[0].name}
                            />
                          </div>
                          <div className="bottom-inner-outer">
                            <img
                              className="d-inline-block"
                              src={media.medias[1].media || DummyPhotoBase64}
                              alt={media.medias[1].name}
                              title={media.medias[1].name}
                            />
                          </div>
                        </div>
                      </Fragment>
                    )}
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
