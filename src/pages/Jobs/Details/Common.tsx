import { Fragment, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { BiShareAlt } from 'react-icons/bi';
import { IoIosEye } from 'react-icons/io';
import { FiPlayCircle } from 'react-icons/fi';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

import { DummyPhotoBase64 } from '../../../constants';

import { BigDocIcon } from '../../../components/Icons';

import {
  IPhotoSubKinds,
  IPhotoSubMediaKinds,
  IJobSubMedia,
  IMediaKind,
} from '../../Medias/interfaces';
import {
  generateDefaultSubMedia,
  mediaPathsGenerator,
} from '../../Medias/utils';
import MediaLinkAddPopup from '../../Medias/MediaLinks/MediaLinkAddPopup';

import * as interfaces from '../interfaces';

export const MediaListingComponent = ({
  job,

  parsedMedias,

  groupOptions,
  setGroupOptions,

  selectedMedias,
  setSelectedMedias,
}: {
  job: interfaces.IJobPopulated;

  parsedMedias: interfaces.IJobDetailsTabMediaList[];

  groupOptions: interfaces.IJobDetailsTabMediaGroupOptions;
  setGroupOptions: (data: interfaces.IJobDetailsTabMediaGroupOptions) => void;

  selectedMedias: Record<string, boolean>;
  setSelectedMedias: (data: Record<string, boolean>) => void;
}) => {
  const history = useHistory();

  //  For changing the sorting order of groups
  const groupSortChangeFunc = (
    key: string,
    selected: boolean,
    newSortValue: 1 | -1
  ) => {
    const newGroupOption: interfaces.IJobDetailsTabMediaGroupOptions = {
      ...groupOptions,
      [key]: {
        sort: newSortValue,
        selected,
      },
    };
    setGroupOptions(newGroupOption);
  };

  const MediaSelectInputBoxComponent = ({
    checked,
    id,
  }: {
    checked: boolean;
    id: string;
  }) => {
    return (
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => {
          //  Updating the selected media checkbox
          setSelectedMedias({
            ...selectedMedias,
            [id]: event.target.checked,
          });
        }}
      />
    );
  };

  const [sharePopup, setSharePopup] = useState({
    mediaKind: IMediaKind.Photo,
    subMediaId: '',
  });

  return (
    <Fragment>
      <MediaLinkAddPopup
        sharePopup={sharePopup}
        setSharePopup={setSharePopup}
      />

      {parsedMedias.map((parsedMedia) => {
        const { value, key, selected, medias, sort } = parsedMedia;

        return (
          <Fragment key={key}>
            <div className="check-box-heading-title">
              <div className="form-check pl-0">
                <div className="checkbox-list-box-wrap">
                  <div className="checkbox-list-box border-0 p-0">
                    <div className="flex-space-wrap">
                      <div className="checkbox-card pr-0 mb-0">
                        <div className="flex-content">
                          <label className="mb-0">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={(event) => {
                                //  For selecting or deselecting a particular group
                                const newGroupOption: interfaces.IJobDetailsTabMediaGroupOptions =
                                  {
                                    ...groupOptions,
                                    [key]: {
                                      sort,
                                      selected: event.target.checked,
                                    },
                                  };

                                //  For selecting or deselecting all medias under a group
                                parsedMedia.medias.forEach((media) => {
                                  selectedMedias = {
                                    ...selectedMedias,
                                    [media.id]: event.target.checked,
                                  };
                                });

                                setSelectedMedias({ ...selectedMedias });
                                setGroupOptions(newGroupOption);
                              }}
                            />
                            <span className="check-card">
                              <i className="fas fa-check" />
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <label className="form-check-label" htmlFor="defaultCheck1">
                  {value}
                </label>
                <div className="sort-icon ml-3">
                  {sort === 1 ? (
                    <FaSortAmountUp
                      onClick={() => groupSortChangeFunc(key, selected, -1)}
                    />
                  ) : (
                    <FaSortAmountDown
                      onClick={() => groupSortChangeFunc(key, selected, 1)}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="blog-image-wrap">
              {medias.map((media) => {
                const checked = selectedMedias[media.id] ?? false;

                const { photoDetailsPath, videoDetailsPath, docDetailsPath } =
                  mediaPathsGenerator(job.id, media.id, media.kind);

                //  Job Video
                if (media.kind === IMediaKind.JobVideo) {
                  const simpleMedia =
                    media.medias[0] || generateDefaultSubMedia();

                  const thumbnailURL =
                    media.medias[0].thumbnailURL || DummyPhotoBase64;

                  return (
                    <div className="blog-image-content" key={media.id}>
                      <div className="media-box-img-link">
                        <img
                          src={thumbnailURL}
                          alt={simpleMedia.name || media.name}
                          title={simpleMedia.name || media.name}
                        />
                        <Link
                          className="image-overlay-link"
                          to={{
                            pathname: videoDetailsPath,
                            state: { media, job },
                          }}
                        >
                          <IoIosEye className="fa-2x" />
                        </Link>
                        <button
                          className="btn image-overlay-link2"
                          onClick={() => {
                            setSharePopup({
                              mediaKind: media.kind,
                              subMediaId: simpleMedia.id,
                            });
                          }}
                        >
                          <BiShareAlt className="fa-2x" />
                        </button>
                        <div className="image-overlay-link4">
                          <FiPlayCircle />
                        </div>

                        <div className="checkbox-list-box-wrap image-overlay-link3">
                          <div className="checkbox-list-box border-0 p-0">
                            <div className="flex-space-wrap">
                              <div className="checkbox-card pr-0 mb-0">
                                <div className="flex-content">
                                  <label className="mb-0">
                                    <MediaSelectInputBoxComponent
                                      checked={checked}
                                      id={media.id}
                                    />
                                    <span className="check-card">
                                      <i className="fas fa-check" />
                                    </span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h6 className="mb-1 title">
                        {simpleMedia.name ?? media.name}
                      </h6>
                      <span>{media.creatorId.name}</span>
                    </div>
                  );
                }

                //  Job Document
                if (media.kind === IMediaKind.JobDoc) {
                  const simpleMedia =
                    media.medias[0] || generateDefaultSubMedia();

                  return (
                    <div
                      className="blog-image-content"
                      key={media.id}
                      onClick={() => {
                        history.push(docDetailsPath, { media, job });
                      }}
                    >
                      <div className="doc-image-wrap">
                        <BigDocIcon title={simpleMedia.name || media.name} />
                      </div>
                      <h6 className="mb-1 title">
                        {simpleMedia.name || media.name}
                      </h6>
                      <span>{media.creatorId.name}</span>
                    </div>
                  );
                }

                //  Job Simple Image
                if (media.subKind === IPhotoSubKinds.Simple) {
                  const simpleMedia =
                    media.medias[0] ||
                    generateDefaultSubMedia(IPhotoSubMediaKinds.Simple);

                  const historyState: interfaces.IJobPhotoDetailsHistoryState =
                    {
                      media,
                      selectedSubMediaId: simpleMedia.id,
                      job,
                      mediaSubKind: media.subKind,
                    };

                  return (
                    <div className="blog-image-content" key={media.id}>
                      <div className="media-box-img-link">
                        <img
                          src={simpleMedia.mediaURL || DummyPhotoBase64}
                          title={simpleMedia.name}
                          alt={simpleMedia.name}
                        />
                        <Link
                          className="image-overlay-link"
                          to={{
                            pathname: photoDetailsPath,
                            state: historyState,
                          }}
                        >
                          <IoIosEye className="fa-2x" />
                        </Link>
                        <button
                          className="btn image-overlay-link2"
                          onClick={() => {
                            setSharePopup({
                              mediaKind: media.kind,
                              subMediaId: simpleMedia.id,
                            });
                          }}
                        >
                          <BiShareAlt className="fa-2x" />
                        </button>
                        <div className="checkbox-list-box-wrap image-overlay-link3">
                          <div className="checkbox-list-box border-0 p-0">
                            <div className="flex-space-wrap">
                              <div className="checkbox-card pr-0 mb-0">
                                <div className="flex-content">
                                  <label className="mb-0">
                                    <MediaSelectInputBoxComponent
                                      checked={checked}
                                      id={media.id}
                                    />
                                    <span className="check-card">
                                      <i className="fas fa-check" />
                                    </span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h6 className="mb-1 title">
                        {simpleMedia.name || media.name}
                      </h6>
                      <span>{media.creatorId.name}</span>
                    </div>
                  );
                }

                //  JobDual Image
                if (media.subKind === IPhotoSubKinds.Dual) {
                  let beforeSubMedia: IJobSubMedia = generateDefaultSubMedia(
                    IPhotoSubMediaKinds.Before
                  );
                  let afterSubMedia: IJobSubMedia = generateDefaultSubMedia(
                    IPhotoSubMediaKinds.After
                  );

                  media.medias.forEach((subMedia) => {
                    if (subMedia.subKind === IPhotoSubMediaKinds.Before) {
                      beforeSubMedia = subMedia;
                    } else {
                      afterSubMedia = subMedia;
                    }
                  });

                  const historyState: interfaces.IJobPhotoDetailsHistoryState =
                    {
                      media,
                      // selectedSubMediaId: simpleMedia.id,
                      job,
                      mediaSubKind: media.subKind,
                    };

                  return (
                    <div className="blog-image-content" key={media.id}>
                      <div className="media-box-img-link d-flex dual-imgcon">
                        <div className="img-con">
                          <img
                            src={beforeSubMedia.mediaURL || DummyPhotoBase64}
                            alt={beforeSubMedia.name}
                            title={beforeSubMedia.name}
                          />
                          <div className="checkbox-list-box-wrap image-overlay-link3">
                            <div className="checkbox-list-box border-0 p-0">
                              <div className="flex-space-wrap">
                                <div className="checkbox-card pr-0 mb-0">
                                  <div className="flex-content">
                                    <label className="mb-0">
                                      <MediaSelectInputBoxComponent
                                        checked={checked}
                                        id={media.id}
                                      />
                                      <span className="check-card">
                                        <i className="fas fa-check" />
                                      </span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {!!beforeSubMedia.id && (
                            <Fragment>
                              <Link
                                className="image-overlay-link"
                                to={{
                                  pathname: photoDetailsPath,
                                  state: {
                                    ...historyState,
                                    selectedSubMediaId: beforeSubMedia.id,
                                  },
                                }}
                              >
                                <IoIosEye className="fa-2x" />
                              </Link>
                              <button
                                className="btn image-overlay-link2"
                                onClick={() => {
                                  setSharePopup({
                                    mediaKind: media.kind,
                                    subMediaId: beforeSubMedia.id,
                                  });
                                }}
                              >
                                <BiShareAlt className="fa-2x" />
                              </button>
                            </Fragment>
                          )}

                          <div className="title-align-botton w-100">
                            <h6 className="mb-1 title">
                              {beforeSubMedia.name}
                            </h6>
                            <span>
                              {beforeSubMedia.id ? media.creatorId.name : ''}
                            </span>
                          </div>
                        </div>

                        <div className="img-con img-con2">
                          <img
                            src={afterSubMedia.mediaURL || DummyPhotoBase64}
                            alt={afterSubMedia.name || media.name}
                            title={afterSubMedia.name || media.name}
                          />

                          {!!afterSubMedia.id && (
                            <Fragment>
                              <Link
                                className="image-overlay-link"
                                to={{
                                  pathname: photoDetailsPath,
                                  state: {
                                    ...historyState,
                                    selectedSubMediaId: afterSubMedia.id,
                                  },
                                }}
                              >
                                <IoIosEye className="fa-2x" />
                              </Link>
                              <button
                                className="btn image-overlay-link2"
                                onClick={() => {
                                  setSharePopup({
                                    mediaKind: media.kind,
                                    subMediaId: afterSubMedia.id,
                                  });
                                }}
                              >
                                <BiShareAlt className="fa-2x" />
                              </button>
                            </Fragment>
                          )}

                          <div className="title-align-botton w-100">
                            <h6 className="mb-1 title">{afterSubMedia.name}</h6>
                            <span>
                              {afterSubMedia.id ? media.creatorId.name : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </Fragment>
        );
      })}
    </Fragment>
  );
};
