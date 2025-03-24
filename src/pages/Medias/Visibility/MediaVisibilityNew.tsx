import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMountedState } from 'react-use';
import { useSelector } from 'react-redux';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

import { DummyPhotoBase64 } from '../../../constants';

import { IAppReduxState } from '../../../redux/reducer';

import { generateUniqueId } from '../../../utils/common';
import { successToast } from '../../../utils/toast';

import Main from '../../../components/Layouts/Main';
import { BigDocIcon } from '../../../components/Icons';

import { formatUserName } from '../../Users/utils';
import { DefaultUserPic } from '../../Users/constants';

import JobRoutes from '../../Jobs/routes';

import { SubMediaUserPermissionsNew } from '../Common';
import * as interfaces from '../interfaces';
import * as utils from '../utils';
import * as services from '../services';
import { BiCheck } from 'react-icons/bi';

export default function MediasVisibility() {
  const isMounted = useMountedState();

  const params: { jobId: string } = useParams();

  const { authUser } = useSelector((state: IAppReduxState) => state.auth);

  const [isFetching, setIsFetching] = useState(false);

  const [medias, setMedias] = useState<interfaces.IMediaPopulatedTypes[]>([]);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [subMediaSelectedIndex, setSubMediaSelectedIndex] = useState(0);
  const [subMediaUsers, setSubMediaUsers] = useState<
    interfaces.IAddEditSubMediaUser[]
  >([]);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const result = await services.jobMediasListAllService(params.jobId, {});
      if (!isMounted()) {
        return;
      }

      setMedias(result);
      // setJob(formatedJob);
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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const subMediaUsers =
      medias[selectedIndex]?.medias[subMediaSelectedIndex].users;

    if (!subMediaUsers) {
      setSubMediaUsers([]);
      return;
    }

    const newSubMediaUsers: interfaces.IAddEditSubMediaUser[] =
      //@ts-ignore
      utils.filterUsersToEditSubMedia(authUser.id, subMediaUsers);

    setSubMediaUsers(newSubMediaUsers);
  }, [subMediaSelectedIndex, selectedIndex]);

  return (
    <Main sideBarId={JobRoutes.routes.jobMediasVisibility.sideBarId}>
      <div className="create-property-wrap pl-4 pb-4 pr-4">
        <div className="main-heading-wrap flex-space-between-wrap  align-items-center mb-4 py-2">
          <div className="dashboard-heading-title">
            <h6 className="title">Media Visibility</h6>
          </div>
          <div className="flex-content">
            {/* <div className="btn-wrap mr-3">
              <button
                className="btn btn-warning btn-sm"
                onClick={() => {
                  history.goBack();
                  // history.push(history.location.pathname);
                }}
                disabled={isFetching}
              >
                Cancel
              </button>
            </div> */}
            <div className="btn-wrap mr-3">
              {/* Only showing edit button if have edit member permission for this subMedia */}
              <button
                className="btn btn-primary btn-sm"
                onClick={onSave}
                disabled={isFetching}
              >
                Save Changes
              </button>
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
                    <div className="d-none d-lg-block">
                      <BigDocIcon
                        title={subMedias[0].name}
                        height={167}
                        width={167}
                        style={{
                          border: mediaSelected
                            ? '2px solid var(--primary)'
                            : 'none',
                        }}
                      />
                    </div>

                    <div className="d-block d-lg-none">
                      <BigDocIcon
                        title={subMedias[0].name}
                        height={98}
                        width={98}
                        style={{
                          border: mediaSelected
                            ? '2px solid var(--primary)'
                            : 'none',
                        }}
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
            {/* medias[selectedIndex]?.medias[subMediaSelectedIndex]?.users.map((user, userIndex) */}
            {subMediaUsers.map((user, userIndex) => {
              // user = {
              //   skip: 1,
              //   name: 'jitender',
              //   expand: false,
              //   email: 'jitenderattri3@gmail.com',
              // };
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
                      <p className="text-dark mb-0 fs-14 f-600">{user.name}</p>
                      <p className="fs-12 mb-0 primary-text-color">
                        {user.email}
                      </p>
                    </div>
                    {user.expand ? null : (
                      <div className="ml-5 d-lg-flex d-none">
                        {[
                          {
                            label: 'Image',
                            // value: CommonPerms.all,
                          },
                          {
                            label: 'Detail',
                            // value: CommonPerms.view,
                          },
                          {
                            label: 'Comment',
                            // value: CommonPerms.add,
                          },
                        ].map(({ label }, index) => {
                          return (
                            <div
                              className="max-checkbox fs-12 mr-5"
                              key={index}
                            >
                              <div
                                className="check"
                                onClick={
                                  (e) => {}
                                  // onChangeSubModulePerm(
                                  //   interfaces.ISubMediaUserPermTypes.base,
                                  //   value
                                  // )
                                }
                              >
                                {/* {!!(base & (CommonPerms.all | value)) && ( */}
                                <BiCheck className="fs-18" />
                                {/* )} */}
                              </div>
                              {label}
                            </div>
                          );
                        })}
                      </div>
                    )}

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
                    <SubMediaUserPermissionsNew
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

          {/* <ul className="media-permission-list">
           
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
                      <p className="text-dark mb-0 fs-14 line-1">{user.name}</p>
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
          </ul> */}
        </div>
      </div>
    </Main>
  );
}
