import { Fragment, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useMountedState } from 'react-use';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

import { CommonPerms, DummyPhotoBase64 } from '../../../constants';

import { generateUniqueId } from '../../../utils/common';
import { successToast } from '../../../utils/toast';

import { BigDocIcon } from '../../../components/Icons';

import { formatUserName } from '../../Users/utils';
import { DefaultUserPic } from '../../Users/constants';

import * as interfaces from '../interfaces';
import * as utils from '../utils';
import * as services from '../services';

import SubMediaUserPermissions from './SubMediaUserPermissions';

export function AddVisibility({
  paths,

  medias,
  setMedias,

  selectedIndex,
  setSelectedIndex,

  selectedSubMediaIndex = 0,
  setSelectedSubMediaIndex = (selectedSubMediaIndex: number) => {},

  clearMediaStream = utils.noop,
}: {
  paths: interfaces.IAddEditPhotoPaths;

  medias: (
    | interfaces.IVideoAddMedia
    | interfaces.IDocAddMedia
    | interfaces.IPhotoAddMedia
  )[];
  setMedias: (data: any) => void;

  selectedIndex: number;
  setSelectedIndex: (data: number) => void;

  selectedSubMediaIndex?: number;
  setSelectedSubMediaIndex?: (selectedSubMediaIndex: number) => void;

  clearMediaStream?: () => void;
}) {
  const history = useHistory();

  const subMediaUserChange = (
    userIndex: number,
    expand: boolean,
    permissions: interfaces.ISubMediaUserPerms
  ) => {
    const newMedias = [...medias];

    const subMediaUsers = [
      ...newMedias[selectedIndex].medias[selectedSubMediaIndex].users,
    ];
    subMediaUsers[userIndex] = {
      ...subMediaUsers[userIndex],
      expand,
      permissions: {
        ...subMediaUsers[userIndex].permissions,
        ...permissions,
      },
    };

    newMedias[selectedIndex].medias[selectedSubMediaIndex].users =
      subMediaUsers;

    setMedias(newMedias);
  };

  useEffect(() => {
    if (!medias[selectedIndex]?.id) {
      history.push(paths.base);
    }

    clearMediaStream();
  }, []);

  return (
    <Fragment>
      <div className="mx-4">
        <div className="create-property-wrap">
          <div className="main-heading-wrap flex-space-between-wrap  align-items-center mb-4 py-2 ">
            <div className="dashboard-heading-title">
              <h6 className="title">Visibility</h6>
            </div>
            <div className="flex-content ">
              <div className="btn-wrap mr-3 ">
                <Link to={paths.base}>
                  <button className="btn btn-primary btn-sm">
                    Save Changes
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="media-wrap">
            {medias.map((media, mediaIndex) => {
              const mediaSelected = mediaIndex === selectedIndex;

              const { creatorId, medias: subMedias, kind } = media;

              if (
                kind === interfaces.IMediaKind.Video ||
                kind === interfaces.IMediaKind.JobVideo
              ) {
                //@ts-ignore
                const thumbnail: string = subMedias[0]['thumbnail'];

                return (
                  <div
                    className="media-content-wrap d-inline-block mr-3 mb-3"
                    key={media.id}
                    onClick={() => {
                      setSelectedIndex(mediaIndex);
                      setSelectedSubMediaIndex(0);
                    }}
                  >
                    <div className="position-relative">
                      <img
                        className="d-inline-block"
                        style={{
                          border: mediaSelected
                            ? '2px solid var(--primary)'
                            : 'none',
                        }}
                        src={thumbnail}
                        title={subMedias[0].name}
                        alt={subMedias[0].name}
                      />
                      <div className="floated-play-button">
                        <img
                          style={{ width: 24, height: 24 }}
                          src={
                            require('../../../assets/images/play-button.png')
                              .default
                          }
                          alt="Play"
                        />
                      </div>
                    </div>
                    <p
                      className={`mt-2 text-ellip mb-0 text-first ${
                        mediaSelected ? 'text-primary' : 'text-dark'
                      }`}
                    >
                      {subMedias[0].name}
                    </p>
                    <p className="primary-text-color text-second">
                      {formatUserName(creatorId.firstName, creatorId.lastName)}
                    </p>
                  </div>
                );
              } else if (
                kind === interfaces.IMediaKind.Doc ||
                kind === interfaces.IMediaKind.JobDoc
              ) {
                return (
                  <div
                    className="media-content-wrap d-inline-block mr-3 mb-3"
                    key={media.id}
                    onClick={() => {
                      setSelectedIndex(mediaIndex);
                      setSelectedSubMediaIndex(0);
                    }}
                  >
                    <div className="position-relative">
                      <BigDocIcon
                        title={subMedias[0].name}
                        style={{
                          border: mediaSelected
                            ? '2px solid var(--primary)'
                            : 'none',
                        }}
                      />
                    </div>
                    <p
                      className={`mt-2 text-ellip mb-0 text-first ${
                        mediaSelected ? 'text-primary' : 'text-dark'
                      }`}
                    >
                      {subMedias[0].name}
                    </p>
                    <p className="primary-text-color text-second">
                      {formatUserName(creatorId.firstName, creatorId.lastName)}
                    </p>
                  </div>
                );
              } else if (
                kind === interfaces.IMediaKind.Photo ||
                kind === interfaces.IMediaKind.JobPhoto
              ) {
                return media.medias.map((subMedia, subMediaIndex) => {
                  if (subMedia.isDummy) {
                    return null;
                  }

                  const subMediaSelected =
                    mediaSelected && selectedSubMediaIndex === subMediaIndex;

                  return (
                    <div
                      className="media-content-wrap d-inline-block mr-3 mb-3"
                      key={subMedia.id}
                      onClick={() => {
                        setSelectedIndex(mediaIndex);

                        setSelectedSubMediaIndex(subMediaIndex);
                      }}
                    >
                      <div className="position-relative">
                        <img
                          className="d-inline-block"
                          style={{
                            border: subMediaSelected
                              ? '2px solid var(--primary)'
                              : 'none',
                          }}
                          src={subMedia.media}
                          title={subMedia.name}
                          alt={subMedia.name}
                        />
                      </div>
                      <p
                        className={`mt-2 text-ellip mb-0 text-first ${
                          subMediaSelected ? 'text-primary' : 'text-dark'
                        }`}
                      >
                        {subMedia.name}
                        {subMedia.subKind ===
                          interfaces.IPhotoSubMediaKinds.Before && '(Before)'}
                        {subMedia.subKind ===
                          interfaces.IPhotoSubMediaKinds.After && '(After)'}
                      </p>
                      <p className="primary-text-color text-second">
                        {formatUserName(
                          creatorId.firstName,
                          creatorId.lastName
                        )}
                      </p>
                    </div>
                  );
                });
              }

              return null;
            })}
          </div>

          <div>
            <ul className="media-permission-list">
              {medias[selectedIndex]?.medias[selectedSubMediaIndex].users.map(
                (user, userIndex) => {
                  if (user.skip) {
                    return null;
                  }
                  const uniqueId = generateUniqueId();

                  return (
                    <li className="py-3 border-bottom" key={uniqueId}>
                      <div className="d-flex align-items-center">
                        <div className="user-avatar mt-0">
                          <img
                            src={user.picURL || DefaultUserPic}
                            alt={user.name}
                            title={user.name}
                          />
                        </div>
                        <div className="ml-4">
                          <p className="text-dark mb-0 fs-14 line-1">
                            {user.name}
                          </p>
                          <p className="fs-12 mb-0 primary-text-color">
                            {user.email}
                          </p>
                        </div>

                        <div
                          className="light-icon ml-auto"
                          onClick={(e) =>
                            subMediaUserChange(
                              userIndex,
                              !user.expand,
                              user.permissions
                            )
                          }
                        >
                          {user.expand ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                      </div>
                      {user.expand && (
                        <SubMediaUserPermissions
                          mediaKind={medias[selectedIndex].kind}
                          permissions={user.permissions}
                          onSave={(perms: interfaces.ISubMediaUserPerms) =>
                            subMediaUserChange(userIndex, user.expand, perms)
                          }
                        />
                      )}
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export function EditVisibility({
  currentUserId,

  medias,
  setMedias,

  selectedIndex,
  setSelectedIndex,

  memberPerm = CommonPerms.none,
}: {
  currentUserId: string;

  medias: interfaces.IMediaPopulatedTypes[];
  setMedias: (data: interfaces.IMediaPopulatedTypes[]) => void;

  selectedIndex: number;
  setSelectedIndex: (data: number) => void;

  memberPerm: number;
}) {
  const isMounted = useMountedState();

  const history = useHistory<any>();

  const [isFetching, setIsFetching] = useState(false);

  const [subMediaSelectedIndex, setSubMediaSelectedIndex] = useState(0);
  const [subMediaUsers, setSubMediaUsers] = useState<
    interfaces.IAddEditSubMediaUser[]
  >([]);

  const subMediaUserChange = (
    userIndex: number,
    expand: boolean,
    permissions: interfaces.ISubMediaUserPerms
  ) => {
    const newPermissions: interfaces.ISubMediaUserPerms = {
      ...subMediaUsers[userIndex].permissions,
      ...permissions,
    };

    //  Current Component SubMedia Active
    const newSubMediaUsers = [...subMediaUsers];
    newSubMediaUsers[userIndex] = {
      ...subMediaUsers[userIndex],
      expand,
      permissions: newPermissions,
    };

    const newMedias = [...medias];
    newMedias[selectedIndex].medias[subMediaSelectedIndex].users[userIndex] = {
      ...newMedias[selectedIndex].medias[subMediaSelectedIndex].users[
        userIndex
      ],
      permissions: newPermissions,
    };

    setSubMediaUsers(newSubMediaUsers);
    setMedias(newMedias);
  };

  const onSave = async () => {
    setIsFetching(true);

    try {
      //  Media Edit Permissions Service
      const result = await services.mediaSubMediaPermEditService(
        {
          subMediaId: medias[selectedIndex].medias[subMediaSelectedIndex].id,
          mediaKind: medias[selectedIndex].kind,
        },
        {
          users: medias[selectedIndex].medias[subMediaSelectedIndex].users.map(
            (user) => {
              return {
                //@ts-ignore
                userId: user.userId['id'],
                primaryUserId: user.primaryUserId,
                permissions: user.permissions,
              };
            }
          ),
        }
      );

      successToast(result.message);
    } catch (error) {
      console.error(error);
    }

    if (!isMounted()) {
      return;
    }

    setIsFetching(false);
  };

  const changeSelectedMedia = (mediaIndex: number) => {
    if (isFetching) {
      return;
    }

    setSelectedIndex(mediaIndex);
  };

  useEffect(() => {
    const subMediaUsers =
      medias[selectedIndex]?.medias[subMediaSelectedIndex].users;

    if (!subMediaUsers) {
      setSubMediaUsers([]);
      return;
    }

    const newSubMediaUsers: interfaces.IAddEditSubMediaUser[] =
      //@ts-ignore
      utils.filterUsersToEditSubMedia(currentUserId, subMediaUsers);

    setSubMediaUsers(newSubMediaUsers);
  }, [subMediaSelectedIndex, selectedIndex]);

  useEffect(() => {
    if (!medias[selectedIndex]?.medias[0]?.media) {
      history.push(history.location.pathname);
    }
  }, []);

  return (
    <Fragment>
      <div className="mx-4">
        <div className="create-property-wrap">
          <div className="main-heading-wrap flex-space-between-wrap  align-items-center mb-4 py-2">
            <div className="dashboard-heading-title">
              <h6 className="title">Visibility</h6>
            </div>
            <div className="flex-content">
              <div className="btn-wrap mr-3">
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => {
                    history.push(history.location.pathname);
                  }}
                  disabled={isFetching}
                >
                  Cancel
                </button>
              </div>
              <div className="btn-wrap mr-3">
                {/* Only showing edit button if have edit member permission for this subMedia */}
                {!!(memberPerm && CommonPerms.all | CommonPerms.edit) && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={onSave}
                    disabled={isFetching}
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="media-wrap">
            {medias.map((media, index) => {
              const mediaSelected = index === selectedIndex;

              const { creatorId, medias: subMedias, kind } = media;

              let isVideo =
                // kind === interfaces.IMediaKind.Video ||
                kind === interfaces.IMediaKind.JobVideo;
              let isDocument =
                // kind === interfaces.IMediaKind.Doc ||
                kind === interfaces.IMediaKind.JobDoc;

              if (isVideo) {
                //@ts-ignore
                const thumbnailURL: string = subMedias[0]['thumbnailURL'];

                return (
                  <div
                    className="media-content-wrap d-inline-block mr-3 mb-3"
                    key={media.id}
                    onClick={() => changeSelectedMedia(index)}
                  >
                    <div className="position-relative">
                      <img
                        className="d-inline-block"
                        style={{
                          border: mediaSelected
                            ? '2px solid var(--primary)'
                            : 'none',
                        }}
                        src={thumbnailURL}
                        title={subMedias[0].name}
                        alt={subMedias[0].name}
                      />
                      <div className="floated-play-button">
                        <img
                          style={{ width: 24, height: 24 }}
                          src={
                            require('../../../assets/images/play-button.png')
                              .default
                          }
                          alt="Play"
                        />
                      </div>
                    </div>
                    <p
                      className={`mt-2 text-ellip mb-0 text-first ${
                        mediaSelected ? 'text-primary' : 'text-dark'
                      }`}
                    >
                      {subMedias[0].name}
                    </p>
                    <p className="primary-text-color text-second">
                      {formatUserName(creatorId.firstName, creatorId.lastName)}
                    </p>
                  </div>
                );
              } else if (isDocument) {
                return (
                  <div
                    className="media-content-wrap d-inline-block mr-3 mb-3"
                    key={media.id}
                    onClick={() => changeSelectedMedia(index)}
                  >
                    <div className="position-relative">
                      <BigDocIcon
                        title={subMedias[0].name}
                        style={{
                          border: mediaSelected
                            ? '2px solid var(--primary)'
                            : 'none',
                        }}
                      />
                    </div>
                    <p
                      className={`mt-2 text-ellip mb-0 text-first ${
                        mediaSelected ? 'text-primary' : 'text-dark'
                      }`}
                    >
                      {subMedias[0].name}
                    </p>
                    <p className="primary-text-color text-second">
                      {formatUserName(creatorId.firstName, creatorId.lastName)}
                    </p>
                  </div>
                );
              } else {
                return (
                  <div
                    className="media-content-wrap d-inline-block mr-3 mb-3"
                    key={media.id}
                    onClick={() => changeSelectedMedia(index)}
                  >
                    <div className="position-relative">
                      <img
                        className="d-inline-block"
                        style={{
                          border: mediaSelected
                            ? '2px solid var(--primary)'
                            : 'none',
                        }}
                        src={subMedias[0].mediaURL || DummyPhotoBase64}
                        title={subMedias[0].name}
                        alt={subMedias[0].name}
                      />
                    </div>
                    <p
                      className={`mt-2 text-ellip mb-0 text-first ${
                        mediaSelected ? 'text-primary' : 'text-dark'
                      }`}
                    >
                      {subMedias[0].name}
                      {subMedias[0].subKind ===
                        interfaces.IPhotoSubMediaKinds.Before && '(Before)'}
                      {subMedias[0].subKind ===
                        interfaces.IPhotoSubMediaKinds.After && '(After)'}
                    </p>
                    <p className="primary-text-color text-second">
                      {formatUserName(creatorId.firstName, creatorId.lastName)}
                    </p>
                  </div>
                );
              }
            })}
          </div>

          <div>
            <ul className="media-permission-list">
              {subMediaUsers.map((user, userIndex) => {
                if (user.skip) {
                  return null;
                }
                const uniqueId = generateUniqueId();

                return (
                  <li className="py-3 border-bottom" key={uniqueId}>
                    <div className="d-flex align-items-center">
                      <div className="user-avatar mt-0">
                        <img
                          src={user.picURL || DefaultUserPic}
                          alt={user.name}
                          title={user.name}
                        />
                      </div>
                      <div className="ml-4">
                        <p className="text-dark mb-0 fs-14 line-1">
                          {user.name}
                        </p>
                        <p className="fs-12 mb-0 primary-text-color">
                          {user.email}
                        </p>
                      </div>
                      <div
                        className="light-icon ml-auto"
                        onClick={(e) =>
                          subMediaUserChange(
                            userIndex,
                            !user.expand,
                            user.permissions
                          )
                        }
                      >
                        {user.expand ? <FiChevronUp /> : <FiChevronDown />}
                      </div>
                    </div>
                    {user.expand && (
                      <SubMediaUserPermissions
                        mediaKind={medias[subMediaSelectedIndex].kind}
                        permissions={user.permissions}
                        onSave={(perms: interfaces.ISubMediaUserPerms) =>
                          subMediaUserChange(userIndex, user.expand, perms)
                        }
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
