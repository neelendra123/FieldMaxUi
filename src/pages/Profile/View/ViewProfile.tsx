import { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useMountedState } from 'react-use';

import { BiPencil } from 'react-icons/bi';

import { IModuleKind } from '../../../interfaces';
import { deviceType } from '../../../config';
import { CommonPerms, DefaultCommonMediaUpload } from '../../../constants';

import {
  generateDynamicPath,
  toLocaleDateString,
  toLocaleTimeString,
} from '../../../utils/common';
import { validateData } from '../../../utils/joi';
import { successToast } from '../../../utils/toast';

import { IAppReduxState } from '../../../redux/reducer';
import { profileUpdateAction } from '../../../redux/auth/auth.actions';

import { Popup } from '../../../components/Common';
import Main from '../../../components/Layouts/Main';
import { FileInputComp, TextInputComp } from '../../../components/Forms';
import { RoundedCameraIcon } from '../../../components/Icons';

import { mediaUploadCommonService } from '../../Common/services';

import { formatAuthUser } from '../../Auth/utils';

import { DefaultUserPic } from '../../Users/constants';
import { getUserTypesArray } from '../../Users/utils';

import AccountRoutes from '../../Accounts/routes';

import SubscriptionRoutes from '../../Subscriptions/routes';

import ProfileRoutes from '../routes';
import * as constants from '../constants';
import * as services from '../services';
import * as interfaces from '../interfaces';

export default function ViewProfile() {
  const isMounted = useMountedState();

  const history = useHistory();

  const [isFetching, setIsFetching] = useState(true);

  const [editProfile, setEditProfile] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  const { authUser } = useSelector((state: IAppReduxState) => state.auth);
  const reduxActionDispatch = useDispatch();

  const fetchData = async () => {
    try {
      const profile = await services.profileGetService();
      if (!isMounted()) {
        return;
      }

      //  Redux Update State
      reduxActionDispatch(
        profileUpdateAction({
          user: formatAuthUser(profile),
        })
      );
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

  const EditProfilePopup = () => {
    let isProfileUpdateMounted = true;

    const [firstName, setFirstName] = useState(authUser.firstName);
    const [lastName, setLastName] = useState(authUser.lastName || '');

    const [pic, setPic] = useState({
      ...DefaultCommonMediaUpload,
      default: authUser.picURL || DefaultUserPic,
    });

    const [isFetching, setIsFetching] = useState(false);
    const [errors, setErrors] = useState(constants.ProfileUpdateFormError);

    useEffect(() => {
      return () => {
        isProfileUpdateMounted = false;
      };
    }, []);
    
    const formSubmitted = async (event: React.ChangeEvent<any>) => {
      event.preventDefault();

      const formData: interfaces.IProfileUpdateReqData = {
        firstName,
        lastName,
      };

      const validate = validateData(formData, constants.ProfileUpdateJoiScheme);

      if (validate.errors) {
        setErrors(validate.errors);
        return;
      }

      setIsFetching(true);
      setErrors(constants.ProfileUpdateFormError);

      try {
        if (pic.mediaURL) {
          formData.pic = await mediaUploadCommonService(pic, {
            name: 'Profile Pic',
            moduleKind: IModuleKind.users,
          });
        } else {
          formData.pic = authUser.pic as string;
        }

        const result = await services.profileUpdateService(formData);

        //  Redux Update State
        reduxActionDispatch(
          profileUpdateAction({
            user: formatAuthUser(result.data.user),
          })
        );

        successToast(result.message);

        if (!isProfileUpdateMounted) {
          return;
        }
        setEditProfile(false);
      } catch (error: any) {
        if (!isProfileUpdateMounted) {
          return;
        }

        if (error.response?.data?.data) {
          setErrors({
            ...constants.ProfileUpdateFormError,
            ...error.response.data.data,
          });
        }
      }

      if (!isProfileUpdateMounted) {
        return;
      }
      setIsFetching(false);
    };

    if (!editProfile || !isProfileUpdateMounted) {
      return null;
    }
    
    return (
      <Popup
        isOpen={editProfile}
        title="Edit Profile"
        hideButton={true}
        onClose={() => setEditProfile(false)}
        leftFunction={() => setEditProfile(false)}
        onSave={() => {}}
        ModalName="Edit Profile"
        addClassToWrapper="big-media-box"
        leftItemViewOnlyClass="d-flex justify-content-end"
        disableButtons={isFetching}
      >
        <form onSubmit={formSubmitted}>
          <div className="d-flex justify-content-center mb-3">
            <div className="position-relative">
              <img
                className="rounded-circle popup-img"
                src={pic.mediaURL || pic.default}
                alt={authUser.name}
                title={authUser.name}
              />
              <div className="float-popup-camera">
                <label htmlFor="pic" className="mb-0 c-pointer">
                  <RoundedCameraIcon />
                </label>
                <FileInputComp
                  className="d-none"
                  id="pic"
                  name="pic"
                  accept="image/*"
                  type="file"
                  onChange={(file) => {
                    if (!file) {
                      setPic({
                        ...pic,
                        mediaURL: '',
                        type: '',
                        name: '',
                      });
                      return;
                    }

                    setPic({
                      ...pic,
                      mediaURL: window.URL.createObjectURL(file),
                      type: file.type,
                      name: file.name,
                    });
                  }}
                  placeholder="Profile Pic"
                  errorMsg={errors.pic}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <TextInputComp
              type="text"
              name="firstName"
              onChange={setFirstName}
              label="First Name"
              autoFocus
              placeholder="First Name"
              value={firstName}
              errorMsg={errors.firstName}
            />
          </div>
          <div className="form-group">
            <TextInputComp
              type="text"
              name="lastName"
              onChange={setLastName}
              label="Last Name"
              placeholder="Last Name"
              value={lastName}
              errorMsg={errors.lastName}
            />
          </div>
          <button
            className="btn btn-primary btn-lg py-3 my-4 w-100"
            disabled={isFetching}
          >
            Edit Profile
          </button>
        </form>
      </Popup>
    );
  };

  const PasswordUpdatePopup = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

    const [isFetching, setIsFetching] = useState(false);
    const [errors, setErrors] = useState(constants.PasswordUpdateFormError);

    const formSubmitted = async (event: React.ChangeEvent<any>) => {
      event.preventDefault();

      const formData: interfaces.IPasswordUpdateReqData = {
        oldPassword,
        newPassword,
        newPasswordConfirm,
        deviceType,
      };

      const validate = validateData(
        formData,
        constants.PasswordUpdateJoiScheme
      );

      if (validate.errors) {
        setErrors(validate.errors);
        return;
      }

      setIsFetching(true);
      setErrors(constants.PasswordUpdateFormError);

      try {
        const result = await services.passwordUpdateService(formData);

        successToast(result.message);

        setEditPassword(false);
      } catch (error: any) {
        if (error.response?.data?.data) {
          setErrors({
            ...constants.PasswordUpdateFormError,
            ...error.response.data.data,
          });
        }
      }
      setIsFetching(false);
    };

    return (
      <Popup
        isOpen={editPassword}
        title="Update Password"
        hideButton={true}
        onClose={() => {
          setEditPassword(false);
        }}
        leftFunction={() => {}}
        onSave={() => {}}
        ModalName="Update Password"
        addClassToWrapper="big-media-box"
        leftItemViewOnlyClass="d-flex justify-content-end"
        disableButtons={isFetching}
      >
        <form onSubmit={formSubmitted}>
          <div className="form-group">
            <TextInputComp
              type="password"
              name="oldPassword"
              onChange={setOldPassword}
              label="Old Password"
              autoFocus
              placeholder="Old Password"
              value={oldPassword}
              errorMsg={errors.oldPassword}
            />
          </div>
          <div className="form-group">
            <TextInputComp
              type="password"
              name="newPassword"
              onChange={setNewPassword}
              label="New Password"
              placeholder="New Password"
              value={newPassword}
              errorMsg={errors.newPassword}
            />
          </div>
          <div className="form-group">
            <TextInputComp
              type="password"
              name="newPasswordConfirm"
              onChange={setNewPasswordConfirm}
              label="New Confirm Password"
              placeholder="New Confirm Password"
              value={newPasswordConfirm}
              errorMsg={errors.newPasswordConfirm}
            />
          </div>
          <button
            className="btn btn-primary btn-lg py-3 my-4 w-100"
            disabled={isFetching}
          >
            Update Password
          </button>
        </form>
      </Popup>
    );
  };

  const generateStripeDetails = async () => {
    try {
      const stripeURL = await services.addBankService(authUser.email, "express", authUser.primaryUserId );
      
      if (stripeURL && stripeURL.accountLink && stripeURL.accountLink.url) {
        window.open(stripeURL.accountLink.url, '_blank');
      } else {
        console.error("Invalid Stripe URL");
      }
    } catch (error) {
      console.error("Error generating Stripe URL:", error);
    }
    
  }
  return (
    <Main sideBarId={ProfileRoutes.routes.viewProfile.sideBarId}>
      {editPassword || editProfile
        ? (document.body.className = 'fixed-position')
        : (document.body.className = '')}

      <EditProfilePopup />
      <PasswordUpdatePopup />

      <div className="profile-header">
        {/* TODO:Color need to make this color dynamic according to default account of user */}
        <div className="header-green">
          <div className="profile-avatar">
            <img
              src={authUser.picURL}
              alt={authUser.name}
              title={authUser.name}
            />
            <p className="fz-24 mb-0">{authUser.name}</p>
            <p className="mb-0">{authUser.email}</p>
          </div>
        </div>
      </div>
      <div className="mx-4">
        <div className="d-flex flex-lg-column-reverse flex-column">
          <div className="d-flex justify-content-center my-3">
            <button
              className="btn btn-primary mr-2"
              onClick={() => setEditProfile(true)}
              disabled={isFetching}
            >
              Edit Profile
            </button>
            <button
              className="btn btn-primary mr-2"
              onClick={() => setEditPassword(true)}
              disabled={isFetching}
            >
              Update Password
            </button>
            <button
              className="btn btn-primary mr-2"
              onClick={() => generateStripeDetails()}
              disabled={authUser.stripeid !== undefined &&  authUser.stripeid !== null && authUser.stripeid !== ""}
            >
              { authUser.stripeid !== undefined && authUser.stripeid !== null && authUser.stripeid !== "" ? "Update Bank Account" : "Add Bank Account"}
            </button>

          </div>
          <div className="subscription-container">
            <div className="d-lg-flex justify-content-lg-between align-items-lg-center">
              <div>
                <p className="mb-2 fz-12 d-md-block d-none">
                  You currently using{' '}
                </p>
                <div className="d-lg-flex text-center">
                  <h6 className="mb-0">CAM MAX PRO PLUS</h6>
                  <p className="fz-12 mb-2 ml-2">Expiring on Sept 23, 2021</p>
                </div>
              </div>
              <div>
                <button
                  className="btn btn-primary mobile-w-100"
                  onClick={() =>
                    history.push(SubscriptionRoutes.routes.listPlans.path)
                  }
                  disabled={isFetching}
                >
                  Upgrade
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="divider mobile-only" />

        <h6 className="my-lg-4 my-2">Accounts</h6>
        <div>
          <div className="user-table-wrap mobile-table">
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr className="mobile-d-none profile-row">
                    <th scope="col">Pic</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Type</th>
                    <th scope="col">Joined At</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>

                <tbody className="px-0 py-3">
                  {authUser.accounts.map((account, accountIndex) => {
                    const accountEditPath = generateDynamicPath(
                      AccountRoutes.routes.editAccount.path,
                      { accountIndex: `${accountIndex}` }
                    );

                    const accountUserTypes = getUserTypesArray(
                      account.userType
                    );
                    const accountUserTypesStr = accountUserTypes.join();

                    return (
                      <Fragment key={account.primaryUserId.id}>
                        <tr className="mobile-d-none profile-row">
                          <td
                            className="d-flex justify-content-center"
                            scope="row"
                          >
                            <img
                              style={{
                                width: 40,
                                height: 40,
                                objectFit: 'scale-down',
                                maxWidth: 'none',
                              }}
                              src={account.primaryUserId.account.logoURL}
                              alt={account.primaryUserId.account.name}
                              title={account.primaryUserId.account.name}
                            />
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="pl-3">
                                {account.primaryUserId.account.name}
                              </div>
                            </div>
                          </td>
                          <td>{account.primaryUserId.account.primaryEmail}</td>
                          <td>{account.primaryUserId.account.phone}</td>
                          <td>{accountUserTypesStr}</td>
                          <td>
                            {toLocaleDateString(account.createdAt)} (
                            {toLocaleTimeString(account.createdAt)})
                          </td>
                          <td>
                            {!!(
                              account.permissions.account.base &
                              (CommonPerms.all | CommonPerms.edit)
                            ) &&
                              !isFetching && (
                                <div
                                  className="light-icon mr-2"
                                  onClick={() => {
                                    history.push(accountEditPath);
                                  }}
                                >
                                  <BiPencil />
                                </div>
                              )}
                          </td>
                        </tr>

                        <tr
                          className={'d-block d-md-none p-3 position-relative'}
                        >
                          <td>
                            <div className="d-flex">
                              <div className="mr-3">
                                <img
                                  style={{ height: 40, width: 40 }}
                                  src={account.primaryUserId.account.logoURL}
                                  alt={account.primaryUserId.account.name}
                                  title={account.primaryUserId.account.name}
                                />
                              </div>

                              <div className="user-mobile-description">
                                <h6 className="mb-0 fs-18">
                                  {account.primaryUserId.account.name}
                                </h6>
                                <p>
                                  {account.primaryUserId.account.primaryEmail}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 border-top">
                              <div className="d-flex mt-2 w-100 justify-content-between">
                                <div>
                                  <p className="fs-12 mb-0">
                                    {' '}
                                    Phone No :{' '}
                                    <span className="text-dark">
                                      {account.primaryUserId.account.phone}
                                    </span>
                                  </p>
                                </div>
                                <div>
                                  <p className="fs-12 mb-0">
                                    TYPE :{' '}
                                    <span className="text-dark">
                                      {accountUserTypesStr}
                                    </span>
                                  </p>
                                </div>
                              </div>
                              {/* <p className="fs-12 mb-0 lh-1">
                                Status:{' '}
                                <span className="text-dark">active</span>
                              </p> */}
                            </div>

                            {!!(
                              account.permissions.account.base &
                              (CommonPerms.all | CommonPerms.edit)
                            ) && (
                              <button
                                className="btn btn-primary w-100 mt-2"
                                onClick={() => {
                                  history.push(accountEditPath);
                                }}
                                disabled={isFetching}
                              >
                                Edit Account
                              </button>
                            )}
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
}
