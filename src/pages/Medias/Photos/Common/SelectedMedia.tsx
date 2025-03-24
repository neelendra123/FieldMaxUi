import { Fragment, useState, ChangeEvent } from 'react';
import { useHistory } from 'react-router-dom';

import { BiUpload } from 'react-icons/bi';
import {
  AiOutlineInfoCircle,
  AiOutlineCamera,
  AiOutlineDelete,
  AiOutlineEye,
} from 'react-icons/ai';
import { MdModeEdit } from 'react-icons/md';

import { IOption } from '../../../../interfaces';
import { CommonPerms, DummyPhotoBase64 } from '../../../../constants';

import { generateUniqueId } from '../../../../utils/common';

import Popup from '../../../../components/Common/Popup';

import { SubMediaInfoEditPopup } from '../../Common';

import * as interfaces from '../../interfaces';

const SimpleImageStyle = {
  width: '100%',
  height: '100%',
};
const DualImageStyle = {
  width: '100%',
  height: '100%',
  paddingRight: '0 px',
  marginBottom: '0 px',
};

export function SelectedMediaAdd({
  paths,

  medias,
  setMedias,

  selectedIndex,

  setSelectedSubMediaIndex,

  removeMedia,

  setStartCamera,
}: {
  paths: interfaces.IAddEditPhotoPaths;

  medias: interfaces.IPhotoAddMedia[];
  setMedias: (medias: interfaces.IPhotoAddMedia[]) => void;

  selectedIndex: number;

  setSelectedSubMediaIndex: (selectedSubMediaIndex: number) => void;

  removeMedia: (index: number) => void;

  setStartCamera: (startCamera: boolean) => void;
}) {
  const history = useHistory();

  const [deleteSubMediaIndex, setDeleteSubMediaIndex] = useState(-1);
  const [infoSubMediaIndex, setInfoSubMediaIndex] = useState(-1);

  const mediaInfoEditEffect = (
    name: string,
    tags: IOption[],
    subMediaIndex: number
  ) => {
    const newMedias = [...medias];

    const tagValues = tags.map((tag: IOption) => tag.value);

    newMedias[selectedIndex].medias[subMediaIndex] = {
      ...newMedias[selectedIndex].medias[subMediaIndex],
      name,
      tags: tagValues,
    };

    setMedias(newMedias);

    setInfoSubMediaIndex(-1);
  };

  const selectingFromGalleryEffect = (
    { currentTarget: { files } }: ChangeEvent<HTMLInputElement>,
    subMediaIndex: number
  ) => {
    if (!files?.length) {
      return;
    }

    
    const newMedias = [...medias];

    for (let i = 0; i < files.length; i++) {
      const media = window.URL.createObjectURL(files[i]);

      newMedias[selectedIndex].medias[subMediaIndex].media = media;
      newMedias[selectedIndex].medias[subMediaIndex].isDummy = false;
    }

    setMedias(newMedias);
  };

  const removeSubMedia = () => {
    if (medias[selectedIndex].subKind === interfaces.IPhotoSubKinds.Simple) {
      //  Simple Photo -> Removing current selected media
      removeMedia(selectedIndex);
    } else {
      const newMedias = [...medias];

      newMedias[selectedIndex].medias[deleteSubMediaIndex] = {
        ...newMedias[selectedIndex].medias[deleteSubMediaIndex],
        media: DummyPhotoBase64,
        isDummy: true,
      };

      if (
        newMedias[selectedIndex].medias[0].isDummy &&
        newMedias[selectedIndex].medias[1].isDummy
      ) {
        //If Both the Before and After Photos have been removed, then simply removing media
        removeMedia(selectedIndex);
        return;
      }

      setMedias(newMedias);
    }

    setDeleteSubMediaIndex(-1);
  };

  const SelectedMediaOptionsComp = ({
    subMediaIndex,
  }: {
    subMediaIndex: number;
  }) => {
    return (
      <div className="button-icon">
        <ul>
          {/* Camera Starting */}
          <li
            onClick={() => {
              setStartCamera(true);
              setSelectedSubMediaIndex(subMediaIndex);
            }}
          >
            <button title="Camera">
              <AiOutlineCamera className="fz-20" />
            </button>
          </li>
          {/* Photo Select from Gallery */}
          <li>
            <button title="Gallery">
              <label htmlFor="photoSelect2">
                <BiUpload className="fz-20" />
                <input
                  className="d-none"
                  id="photoSelect2"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    selectingFromGalleryEffect(event, subMediaIndex);
                  }}
                />
              </label>
            </button>
          </li>
          {!medias[selectedIndex].medias[subMediaIndex].isDummy && (
            <Fragment>
              {/* Edit Sub Media */}
              <li
                onClick={() => {
                  setSelectedSubMediaIndex(subMediaIndex);

                  history.push(paths.edit);
                }}
              >
                <button title="Edit">
                  <MdModeEdit className="fz-20" />
                </button>
              </li>

              {/* Delete Sub Media */}
              <li
                onClick={(e) => {
                  setDeleteSubMediaIndex(subMediaIndex);
                }}
              >
                <button title="Delete">
                  <AiOutlineDelete className="fz-20" />
                </button>
              </li>

              {/* Info Sub Media */}
              <li
                onClick={() => {
                  setInfoSubMediaIndex(subMediaIndex);
                }}
              >
                <button title="Info">
                  <AiOutlineInfoCircle className="fz-20 text-white" />
                </button>
              </li>

              {/* Visibility Sub Media */}
              <li
                onClick={() => {
                  setSelectedSubMediaIndex(subMediaIndex);

                  history.push(paths.visibility);
                }}
              >
                <button title="Visibility">
                  <AiOutlineEye className="fz-20" color="#FFF" />
                </button>
              </li>
            </Fragment>
          )}
        </ul>
      </div>
    );
  };

  return (
    <Fragment key={generateUniqueId()}>
      {deleteSubMediaIndex !== -1 || infoSubMediaIndex !== -1
        ? (document.body.className = 'fixed-position')
        : (document.body.className = '')}

      {/* For Deleting a single Sub Media */}
      <Popup
        isOpen={deleteSubMediaIndex !== -1}
        title={'Confirmation'}
        hideButton={false}
        onClose={() => setDeleteSubMediaIndex(-1)}
        leftItem={'Cancel'}
        leftFunction={() => setDeleteSubMediaIndex(-1)}
        onSave={removeSubMedia}
        ModalName={'Delete'}
        addClassToWrapper="card-media-box"
        leftItemViewOnlyClass="flex-space-center"
      >
        <div className="sec-content">
          <p>Are you sure you want to delete this photo?</p>
        </div>
      </Popup>

      {infoSubMediaIndex !== -1 && (
        <SubMediaInfoEditPopup
          tempName={medias[selectedIndex]?.medias[infoSubMediaIndex].name}
          tempTags={medias[selectedIndex]?.medias[infoSubMediaIndex].tags}
          info={infoSubMediaIndex !== -1}
          setInfo={() => setInfoSubMediaIndex(-1)}
          selectedIndex={selectedIndex}
          selectedSubMediaIndex={infoSubMediaIndex}
          mediaInfoEditEffect={mediaInfoEditEffect}
        />
      )}

      {/* Single Image */}
      {medias[selectedIndex]?.subKind === interfaces.IPhotoSubKinds.Simple && (
        <div className="single-image-container">
          <img
            src={medias[selectedIndex].medias[0].media}
            alt={medias[selectedIndex].medias[0].name}
            title={medias[selectedIndex].medias[0].name}
            style={SimpleImageStyle}
          />

          <SelectedMediaOptionsComp subMediaIndex={0} />
        </div>
      )}

      {medias[selectedIndex]?.subKind === interfaces.IPhotoSubKinds.Dual && (
        <div className="dual-image d-block d-md-flex">
          {medias[selectedIndex].medias.map((subMedia, index) => {
            return (
              <div className="dual-image-inner" key={index}>
                <img
                  className="d-inline-block"
                  src={subMedia.media || DummyPhotoBase64}
                  alt={subMedia.name}
                  title={subMedia.name}
                  style={DualImageStyle}
                />
                <SelectedMediaOptionsComp subMediaIndex={index} />
              </div>
            );
          })}
        </div>
      )}
    </Fragment>
  );
}

export function SelectedMediaEdit({
  paths,

  medias,
  setMedias,

  selectedIndex,

  selectedSubMediaIndex = 0,
  setSelectedSubMediaIndex,

  setStartCamera,

  onSaveEffect,
}: {
  paths: interfaces.IAddEditPhotoPaths;

  medias: interfaces.IMediaPopulatedTypes[];
  setMedias: (medias: interfaces.IMediaPopulatedTypes[]) => void;

  selectedIndex: number;

  selectedSubMediaIndex: number;
  setSelectedSubMediaIndex: (selectedSubMediaIndex: number) => void;

  setStartCamera: (startCamera: boolean) => void;

  onSaveEffect: (media: string, mediaContentType: string) => void;
}) {
  const history = useHistory();

  const [infoSubMediaIndex, setInfoSubMediaIndex] = useState(-1);

  const mediaInfoEditEffect = (
    name: string,
    tags: IOption[],
    subMediaIndex: number
  ) => {
    const newMedias = [...medias];

    const tagValues = tags.map((tag: IOption) => tag.value);

    newMedias[selectedIndex].medias[subMediaIndex] = {
      ...newMedias[selectedIndex].medias[subMediaIndex],
      name,
      tags: tagValues,
    };

    setMedias(newMedias);

    setInfoSubMediaIndex(-1);
  };

  const selectingFromGalleryEffect = async (
    { currentTarget: { files } }: ChangeEvent<HTMLInputElement>,
    subMediaIndex: number
  ) => {
    if (!files?.length) {
      return;
    }

    const newMedias = [...medias];

    for (let i = 0; i < files.length; i++) {
      const media = window.URL.createObjectURL(files[i]);

      newMedias[selectedIndex].medias[subMediaIndex].mediaURL = media;

      onSaveEffect(media, files[i].type);
    }

    setMedias(newMedias);
  };

  const SelectedMediaOptionsComp = ({
    subMediaIndex,
  }: {
    subMediaIndex: number;
  }) => {
    return (
      <div className="button-icon">
        <ul>
          {!!medias[selectedIndex].medias[selectedSubMediaIndex]?.mediaURL && (
            <Fragment>
              {/* Camera Starting */}
              <li
                onClick={() => {
                  setStartCamera(true);
                  setSelectedSubMediaIndex(subMediaIndex);
                }}
              >
                <button title="Camera">
                  <AiOutlineCamera className="fz-20" />
                </button>
              </li>
              {/* Photo Select from Gallery */}
              <li>
                <button title="Gallery">
                  <label htmlFor="photoSelect">
                    <BiUpload className="fz-20" />
                    <input
                      className="d-none"
                      id="photoSelect"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        selectingFromGalleryEffect(event, subMediaIndex);
                      }}
                    />
                  </label>
                </button>
              </li>
              {/* Edit Sub Media */}
              <li
                onClick={() => {
                  setSelectedSubMediaIndex(subMediaIndex);
                  history.push(paths.edit);
                }}
              >
                <button title="Edit">
                  <MdModeEdit className="fz-20" />
                </button>
              </li>
              {/* Info Sub Media */}
              <li
                onClick={() => {
                  setInfoSubMediaIndex(subMediaIndex);
                }}
              >
                <button title="Info">
                  <AiOutlineInfoCircle className="fz-20 text-white" />
                </button>
              </li>
              {/* Visibility Sub Media */}
              {!!(
                medias[selectedIndex]?.currentUserPerm[
                  medias[selectedIndex].medias[selectedSubMediaIndex]?.id
                ]?.members &
                (CommonPerms.all | CommonPerms.edit | CommonPerms.view)
              ) && (
                <li
                  onClick={() => {
                    setSelectedSubMediaIndex(subMediaIndex);

                    history.push(paths.visibility);
                  }}
                >
                  <button title="Visibility">
                    <AiOutlineEye className="fz-20" color="#FFF" />
                  </button>
                </li>
              )}
            </Fragment>
          )}
        </ul>
      </div>
    );
  };

  return (
    <Fragment>
      {infoSubMediaIndex !== -1
        ? (document.body.className = 'fixed-position')
        : (document.body.className = '')}

      {infoSubMediaIndex !== -1 && (
        <SubMediaInfoEditPopup
          tempName={medias[selectedIndex]?.medias[infoSubMediaIndex]?.name}
          tempTags={medias[selectedIndex]?.medias[infoSubMediaIndex]?.tags}
          info={infoSubMediaIndex !== -1}
          setInfo={() => setInfoSubMediaIndex(-1)}
          selectedIndex={selectedIndex}
          selectedSubMediaIndex={infoSubMediaIndex}
          mediaInfoEditEffect={mediaInfoEditEffect}
        />
      )}

      {!!medias[selectedIndex].medias.length && (
        <div className="single-image-container">
          <img
            src={
              medias[selectedIndex].medias[selectedSubMediaIndex].mediaURL ||
              DummyPhotoBase64
            }
            alt={medias[selectedIndex].medias[selectedSubMediaIndex].name}
            title={medias[selectedIndex].medias[selectedSubMediaIndex].name}
            style={SimpleImageStyle}
          />

          <SelectedMediaOptionsComp subMediaIndex={0} />
        </div>
      )}
    </Fragment>
  );
}
