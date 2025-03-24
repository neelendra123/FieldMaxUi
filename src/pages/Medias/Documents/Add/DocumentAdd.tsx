import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useMountedState } from 'react-use';

import {
  AiFillCloseSquare,
  AiOutlineInfoCircle,
  AiOutlineEye,
} from 'react-icons/ai';

import { IModuleKind, IOption } from '../../../../interfaces';

import { dataURLToFile, generateUniqueId } from '../../../../utils/common';
import { useQuery } from '../../../../utils/hooks';

import { IAppReduxState } from '../../../../redux/reducer';

import Main from '../../../../components/Layouts/Main';
import Popup from '../../../../components/Common/Popup';
import { BigDocIcon } from '../../../../components/Icons';

import { IJobSubModuleTypes } from '../../../Orgs/interfaces';

import { IUserIdPopulated, IUserListAllRes } from '../../../Users/interfaces';
import { generateUserIdPopulated } from '../../../Users/utils';

import JobRoutes from '../../../Jobs/routes';
import { jobDetailService, jobSubModuleMembersListService, uploadDocument, uploadFile } from '../../../Jobs/services';

import { AddVisibility, SubMediaInfoEditPopup } from '../../Common';

import { generateJobDetailsPath } from '../../../Jobs/utils';

import MediaRoutes from '../../routes';
import * as interfaces from '../../interfaces';
import * as utils from '../../utils';
import * as services from '../../services';
import * as constants from '../../constants';
import { TextInputComp } from '../../../../components/Forms';

export default function DocumentAdd() {
  const isMounted = useMountedState();

  const query = useQuery();
  const params: { jobId?: string } = useParams();
  const { pathname } = useLocation();
  const history = useHistory<any>();

  const kind = params.jobId
    ? interfaces.IMediaKind.JobDoc
    : interfaces.IMediaKind.Doc;

  const { authUser } = useSelector((state: IAppReduxState) => state.auth);

  const [creatorId] = useState<IUserIdPopulated>(
    generateUserIdPopulated(authUser)
  );
  const [paths] = useState(utils.generateAddEditMediaPaths(pathname));

  const [usersFetched, setUsersFetched] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [inputValue, setInputValue] = useState('');

  const [accountUsers, setAccountUsers] = useState<
    interfaces.IAddEditSubMediaUser[]
  >([]);

  const [medias, setMedias] = useState<interfaces.IDocAddMedia[]>([]);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [deleteIndex, setDeleteIndex] = useState(-1);
  const [saveMedia, setSaveMedia] = useState(false);
  const [info, setInfo] = useState(false);
  const [discard, setDiscard] = useState(false);

  const selectingFromGalleryEffect = async (files: any, firstTime = true) => {
    if (!files?.length) {
      return;
    }

    const newMedias = [...medias];
    for (let i = 0; i < files.length; i++) {
      let name = files[i].name; // `Document ${medias.length + i + 1}`;
      //set the value to inout text here and check the same in the popup whether the same is showing 
      let tags: string[] = [];

      newMedias.push({
        id: generateUniqueId(),
        kind: utils.documentKindGenerate(params.jobId),
        name,
        tags,
        creatorId,
        medias: [
          {
            id: generateUniqueId(),
            name,
            tags,
            media: window.URL.createObjectURL(files[i]),
            users: [...accountUsers],
            numPages: 1,
            mediaPath: '',
          },
        ],
      });
    }

    setMedias(newMedias);

    if (firstTime) {
      setSelectedIndex(0);
    }
  };

  const removeMedia = () => {
    const newMedias = [...medias];
    newMedias.splice(deleteIndex, 1);
    setMedias(newMedias);
    setSelectedIndex(-1);
    setDeleteIndex(-1);
  };
  //  This is loading the Members of the Account or Job
  const fetchData = async () => {
    try {
      let moduleKind: IModuleKind = IModuleKind.jobs; //TODO: by default should be simple video
      const subModuleKind = IJobSubModuleTypes.documents;

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
    setUsersFetched(true);
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

  //  This is for pre adding the medias that were selected from previous screen
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (usersFetched) {
      const routeState: any = history.location.state;

      selectingFromGalleryEffect(routeState?.documents, true);
    }
  }, [usersFetched]);

  const getType = () => {
    switch (query.get('type')) {
      case 'Visibility': {
        return (
          <AddVisibility
            paths={paths}
            // kind={utils.documentKindGenerate(params.jobId)}
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

  const AddMediasPopupComp = () => {
    var _NewFileName = '';
    const onSave = async () => {
      setIsFetching(true);

      try {
        const preSignedURLData: interfaces.IDocsPreSignedURLReqData = {
          medias: medias.map((media) => {
            return {
              kind,
              contentType: 'application/pdf',
            };
          }),
        };
        //  Generating Pre Signed URLs for the documents
        const preSignedURLs: interfaces.IDocPreSignedURLResData[] =
          await services.mediasPreSignedURLService({
            jobId: params.jobId,
            data: preSignedURLData,
          });
        //added by pawan
        const JobDetails = await jobDetailService(params.jobId?params.jobId:"");
        const ServiceID = JobDetails.serviceIssues.ServiceManagerIssueID;
        const formdata = new FormData();
        formdata.append("issueID", ""+ServiceID);
        //  Uploading to S3 all documents
        var _JData = [];
        const uploadPromises = [];
        for (let i = 0; i < medias.length; i++) {
          const mediaNameTest = utils.fileNameExtractFromURL(preSignedURLs[i].doc);
          const extension = mediaNameTest.split('.').pop();
          const mediaURL = preSignedURLs[i].docURL;
          const mediaContentType = 'application/pdf';

          const SampleName = inputValue+""+i+"."+extension; 
          console.log("inputted name is: ", SampleName, " : "+inputValue);
          const mediaName = SampleName;

          medias[i].name = mediaName;
          medias[i].medias[0].name = mediaName;//

          medias[i].medias[0].mediaPath = preSignedURLs[i].doc;

          const mediaFile = await dataURLToFile(
            medias[i].medias[0].media,
            mediaContentType,
            mediaName
          );
          
          //added by pawan
          formdata.append("file"+i, mediaFile, mediaName);
          var _tData = {jobId: params.jobId, name:medias[i].name,subKind:'simple',fileName:mediaName, data:medias[i]};
          _JData.push(_tData);
          uploadPromises.push(
            axios.put(mediaURL, mediaFile, {
              headers: { 'Content-Type': mediaContentType },
            })
          );
        }
        //added by pawan
        formdata.append("type", JSON.stringify(_JData));
        if(Number(ServiceID) > 0){
          const rest = await uploadFile(formdata);
            console.log(rest);
            console.log("--------");
            history.push(
              `${generateJobDetailsPath(params.jobId as string)}#pills-document`,
              {
                successMsg:
                  medias.length === 1
                    ? constants.Messages.docCreated
                    : constants.Messages.docsCreated,
              }
            );
        }
        if(Number(ServiceID) === 0){
          const rest = await uploadFile(formdata);
          console.log(rest);
          console.log("--------");
          history.push(
            `${generateJobDetailsPath(params.jobId as string)}#pills-document`,
            {
              successMsg:
                medias.length === 1
                  ? constants.Messages.docCreated
                  : constants.Messages.docsCreated,
            }
          );
          // await Promise.all(uploadPromises);

          // if (params.jobId) {
          //   await services.jobDocsAddService(params.jobId, medias);

          //   history.push(
          //     `${generateJobDetailsPath(params.jobId as string)}#pills-document`,
          //     {
          //       successMsg:
          //         medias.length === 1
          //           ? constants.Messages.docCreated
          //           : constants.Messages.docsCreated,
          //     }
          //   );
          // }
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
        title={'Save Documents'}
        hideButton={false}
        onClose={() => setSaveMedia(false)}
        leftFunction={() => setSaveMedia(false)}
        onSave={onSave}
        addClassToWrapper="card-media-box"
        leftItemViewOnlyClass="flex-space-center"
        disableButtons={isFetching}
      >

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

        <div className="sec-content">
          <p>Are you sure want save these Documents?</p>
        </div>
      </Popup>
    );
  };

  const AddMedia = () => {
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
              <p>Are you sure you want to delete this document?</p>
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

          <div className="image-inner bg-white">
            {selectedIndex !== -1 && (
              <Fragment>
                <div className="dual-image-inner max-full-width full-video-size">
                  <iframe
                    src={`${medias[selectedIndex].medias[0].media}#navpanes=0&scrollbar=0`}
                    title={medias[selectedIndex].medias[0].name}
                  />
                </div>

                {/* <Document
                  className="d-flex align-items-center h-100 overflow-auto  flex-column"
                  file={medias[selectedIndex].medias[0].media}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={console.error}
                  options={{ cMapUrl: '/_next/cmaps/', cMapPacked: true }}
                  // file="https://arxiv.org/pdf/quant-ph/0410100.pdf"
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                  ))}
                </Document> */}

                <div className="button-icon">
                  <ul>
                    <li onClick={(e) => setInfo(true)}>
                      <button title="Document Info">
                        <AiOutlineInfoCircle color="#FFF" />
                      </button>
                    </li>
                    <li
                      onClick={() => {
                        history.push(paths.visibility);
                      }}
                    >
                      <button>
                        <AiOutlineEye className="text-white" />
                      </button>
                    </li>
                  </ul>
                </div>
              </Fragment>
            )}
          </div>
        </div>
        <div className="slider-bottom-info">
          <div className="only-mobile">
            <ul className="d-flex m-0 p-0 pt-3  overflow-auto">
              {medias.map((media: any, index: number) => (
                <li
                  className="d-flex my-2 position-relative"
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                >
                  <AiFillCloseSquare
                    className="small-close-doc"
                    onClick={() => {
                      setDeleteIndex(index);
                    }}
                  />
                  <div
                    style={{
                      border:
                        selectedIndex === index
                          ? `2px solid var(--primary)`
                          : 'none',
                    }}
                    className="small-doc d-flex bg-white"
                  >
                    <div className="text-center m-auto">
                      <BigDocIcon title={media.medias[0].name} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="leftcenterright">
            <div className="leftside">
              <label htmlFor="fileupload">
                <img
                  className="d-inline-block w-40 mr-2"
                  src={
                    require('../../../../assets/images/gallery-image.png')
                      .default
                  }
                  alt="logo"
                />
                <input
                  accept="application/pdf"
                  type="file"
                  id="fileupload"
                  multiple
                  onChange={(event) => {
                    selectingFromGalleryEffect(event.target.files, false);
                  }}
                  className="d-none"
                />
              </label>
            </div>

            <div className="rightinfo">
              <img
                onClick={() => setDiscard(true)}
                className="d-inline-block w-40 mr-2"
                src={require('../../../../assets/images/cross.png').default}
                alt="Discard All"
                title="Discard All"
              />
              <img
                onClick={() => {
                  setSaveMedia(true);
                }}
                className="d-inline-block w-40"
                src={require('../../../../assets/images/check.png').default}
                alt="Save Documents"
                title="Save Documents"
              />
            </div>
          </div>

          <div className="bottom-sliderarea min-116 only-web">
            <ul className="bottom-double-outer d-flex m-0 p-0 pt-3  overflow-auto">
              {medias.map((media, index) => (
                <li
                  className="d-flex mt-3"
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                >
                  <AiFillCloseSquare
                    className="close-video"
                    onClick={() => {
                      setDeleteIndex(index);
                    }}
                  />
                  <div
                    style={{
                      border:
                        selectedIndex === index
                          ? `2px solid var(--primary)`
                          : 'none',
                    }}
                    className="bottom-inner-outer-wrap d-flex bg-white"
                  >
                    <div className="text-center m-auto">
                      <BigDocIcon title={media.medias[0].name} />
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
          ? JobRoutes.routes.jobDocAdd.sideBarId
          : MediaRoutes.routes.docAdd.sideBarId
      }
    >
      {getType()}
    </Main>
  );
}
