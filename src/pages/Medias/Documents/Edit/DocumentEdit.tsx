import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useMountedState } from 'react-use';

import { AiOutlineInfoCircle, AiOutlineEye } from 'react-icons/ai';

import { IOption } from '../../../../interfaces';
import { CommonPerms } from '../../../../constants';

import { dataURLToFile } from '../../../../utils/common';
import { successToast } from '../../../../utils/toast';
import { useQuery } from '../../../../utils/hooks';

import { IAppReduxState } from '../../../../redux/reducer';

import Main from '../../../../components/Layouts/Main';
import Popup from '../../../../components/Common/Popup';
import { BigDocIcon } from '../../../../components/Icons';

import JobRoutes from '../../../Jobs/routes';

import { EditVisibility, SubMediaInfoEditPopup } from '../../Common';

import MediaRoutes from '../../routes';
import * as interfaces from '../../interfaces';
import * as utils from '../../utils';
import * as services from '../../services';
import * as constants from '../../constants';

const MediaEditedDetail = {
  edited: false,

  media: '',
  mediaPath: '', //This is the path that is stored in S3
  mediaURL: '',
  mediaContentType: 'application/pdf',

  oldMedia: '',
};
export default function DocumentEdit() {
  const isMounted = useMountedState();

  const query = useQuery();
  const { pathname } = useLocation();
  const params: { jobId?: string; mediaId: string; subMediaId: string } =
    useParams();
  const history = useHistory<any>();

  const kind = params.jobId
    ? interfaces.IMediaKind.JobDoc
    : interfaces.IMediaKind.Doc;

  const { authUser, accountIndex } = useSelector(
    (state: IAppReduxState) => state.auth
  );

  const [paths] = useState(utils.generateAddEditMediaPaths(pathname));

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

  const [mediaEditedDetails, setMediaEditedDetails] = useState({
    ...MediaEditedDetail,
  });

  const [saveMedia, setSaveMedia] = useState(false);
  const [info, setInfo] = useState(false);

  const selectingFromGalleryEffect = async (files: any) => {
    if (!files?.length) {
      return;
    }

    const newMedias = [...medias];

    const media = window.URL.createObjectURL(files[0]);

    newMedias[selectedIndex].medias[0].media = media;
    newMedias[selectedIndex].medias[0].mediaURL = media;

    setMedias(newMedias);

    setMediaEditedDetails({
      ...mediaEditedDetails,
      edited: true,

      media,
      mediaContentType: files[0].type,
    });
  };

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

    setMedias([formatedMedia]);
    setIsFetching(false);

    setMediaEditedDetails({
      ...mediaEditedDetails,
      oldMedia,
    });
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

  const AddMediasPopupComp = () => {
    const onSave = async () => {
      setIsFetching(true);

      let { name, tags } = medias[0].medias[0];
      let media = mediaEditedDetails.oldMedia;

      //  Upload to S3
      if (mediaEditedDetails.edited) {
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

        //  Media string changed to URL
        const mediaFile = await dataURLToFile(
          mediaEditedDetails.media,
          mediaEditedDetails.mediaContentType,
          params.subMediaId
        );

        let mediaPath = preSignedURLs[0].doc;
        let mediaURL = preSignedURLs[0].docURL;

        //  Upload to S3
        await axios.put(mediaURL, mediaFile, {
          headers: { 'Content-Type': mediaEditedDetails.mediaContentType },
        });

        //  Updated Medias Path after S3 upload for Info Edit
        media = mediaPath;
      }

      //  Photo Edit Service
      await services.docSubMediaInfoEditService(
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

      successToast(constants.Messages.docEdited);
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
        <div className="sec-content">
          <p>Are you sure want save these Documents?</p>
        </div>
      </Popup>
    );
  };

  const AddMediaComp = () => {
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

          <div className="image-inner bg-white">
            {selectedIndex !== -1 && (
              <Fragment>
                <div className="dual-image-inner max-full-width full-video-size">
                  <iframe
                    src={`${medias[selectedIndex].medias[0].mediaURL}#navpanes=0&scrollbar=0`}
                    title={medias[selectedIndex].medias[0].name}
                  />
                </div>

                <div className="button-icon">
                  <ul>
                    <li onClick={(e) => setInfo(true)} title="Document Info">
                      <button>
                        <AiOutlineInfoCircle color="#FFF" />
                      </button>
                    </li>

                    {!!(
                      medias[selectedIndex]?.currentUserPerm[
                        medias[selectedIndex].medias[0].id
                      ]?.members &
                      (CommonPerms.all | CommonPerms.edit | CommonPerms.view)
                    ) && (
                      <li
                        onClick={() => {
                          history.push(paths.visibility);
                        }}
                      >
                        <button>
                          <AiOutlineEye className="text-white" />
                        </button>
                      </li>
                    )}
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
                  alt="Gallery"
                  title="Gallery"
                />
                <input
                  accept="application/pdf"
                  type="file"
                  id="fileupload"
                  onChange={(event) => {
                    selectingFromGalleryEffect(event.target.files);
                  }}
                  className="d-none"
                />
              </label>
            </div>

            <div className="rightinfo">
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
        return <AddMediaComp />;
      }
    }
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
