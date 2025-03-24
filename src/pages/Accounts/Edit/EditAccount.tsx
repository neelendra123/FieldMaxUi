import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useMountedState } from 'react-use';

import { IModuleKind } from '../../../interfaces';
import { CommonPerms, DefaultCommonMediaUpload } from '../../../constants';

import { validateData } from '../../../utils/joi';
import { successToast } from '../../../utils/toast';

import { IAppReduxState } from '../../../redux/reducer';
import { profileUpdateAction } from '../../../redux/auth/auth.actions';

import Main from '../../../components/Layouts/Main';
import { FileInputComp, TextInputComp } from '../../../components/Forms';
import { RoundedCameraIcon } from '../../../components/Icons';

import { mediaUploadCommonService } from '../../Common/services';

import { IAuthPrimaryUserPopulate } from '../../Auth/interfaces';
import { formatAuthUser } from '../../Auth/utils';

import { Themes } from '../../Users/constants';

import DashboardRoutes from '../../Dashboard/routes';

import { AddressAddEdit, AddressAddEditList } from '../../Address';
import { DefaultCommonAddress } from '../../Address/constants';

import ProfileRoutes from '../routes';
import * as constants from '../constants';
import * as interfaces from '../interfaces';
import * as services from '../services';

const DefaultFormError = {
  name: '',
  address: '',
  phone: '',
  primaryEmail: '',
  logo: '',
};
export default function EditAccount() {
  const isMounted = useMountedState();

  const params: { accountIndex: string } = useParams();
  const history = useHistory();

  const { authUser } = useSelector((state: IAppReduxState) => state.auth);
  const reduxActionDispatch = useDispatch();

  const [baseAccount] = useState<IAuthPrimaryUserPopulate>(
    authUser.accounts[parseInt(params.accountIndex)].primaryUserId
  );

  const [isFetching, setIsFetching] = useState(false);

  const [errors, setErrors] = useState(DefaultFormError);

  const [name, setName] = useState(baseAccount.account.name || '');
  const [phone, setPhone] = useState(baseAccount.account.phone || '');
  const [primaryEmail, setPrimaryEmail] = useState(
    baseAccount.account.primaryEmail || ''
  );
  const [pic, setPic] = useState({
    ...DefaultCommonMediaUpload,
    default: baseAccount.account.logoURL as string,
  });
  const [theme, setTheme] = useState(authUser.theme ?? Themes[0]);
  //  Address States & Functions
  const [addressIndex, setAddressIndex] = useState(-1);
  const [addresses, setAddresses] = useState([
    {
      ...DefaultCommonAddress,
      ...baseAccount.account.address,
    },
  ]);

  const formSubmitted = async (event: React.ChangeEvent<any>) => {
    event.preventDefault();

    const formData: interfaces.IAccountEditReqData = {
      name,
      address: addresses[0],
      phone,
      primaryEmail,
      theme,
    };

    try {
      const validate = validateData(formData, constants.AccountEditJoiScheme);
      if (validate.errors) {
        setErrors(validate.errors);
        return;
      }
      setErrors({ ...DefaultFormError });
      setIsFetching(true);

      if (pic.mediaURL) {
        formData.logo = await mediaUploadCommonService(pic, {
          name: 'Logo',
          moduleKind: IModuleKind.account,
        });
      }

      //  updating the account details
      const result = await services.accountEditService(
        baseAccount.id,
        formData
      );

      //  Redux User -> Accounts Details Update
      const accountIndex = parseInt(params.accountIndex);
      const newAuthUser = { ...authUser, theme };
      newAuthUser.accounts[accountIndex].primaryUserId = result.data.account;

      reduxActionDispatch(
        profileUpdateAction({
          user: formatAuthUser(newAuthUser),
        })
      );

      setPic({
        ...DefaultCommonMediaUpload,
        default: result.data.account.account.logoURL,
      });

      successToast(result.message);
      // history.push(DashboardRoutes.routes.home.path, {
      //   successMsg: result.message,
      // });
    } catch (error: any) {
      if (isMounted() && error.response?.data?.data) {
        setErrors({
          ...DefaultFormError,
          ...error.response.data.data,
        });
      }
    }

    if (!isMounted()) {
      return;
    }

    setIsFetching(false);
  };

  useEffect(() => {
    const selectedAccountIndex = parseInt(params.accountIndex);
    const userAccountPerm =
      authUser.accounts[selectedAccountIndex]?.permissions.account.base ||
      CommonPerms.none;

    if (!!!(userAccountPerm & (CommonPerms.all | CommonPerms.edit))) {
      history.push(DashboardRoutes.routes.home.path, {
        errorMsg: constants.AccountMessages.editNoPerm,
      });
      return;
    }

    return () => {
      //  Theme Changer Function of SCSS Update Parameters incase save changes was not done
      const root = document.documentElement;
      for (const [key, value] of Object.entries(authUser.theme)) {
        root?.style.setProperty(`--${key}`, value);
      }
    };
  }, []);

  if (addressIndex !== -1) {
    return (
      <AddressAddEdit
        sideBarId={ProfileRoutes.routes.editAccount.sideBarId}
        onSaveEffect={(address) => {
          setAddresses([address]);
          setAddressIndex(-1);
        }}
        addressCancelEvent={() => {
          setAddressIndex(-1);
        }}
      />
    );
  }

  return (
    <Main sideBarId={ProfileRoutes.routes.editAccount.sideBarId}>
      <div>
        <form onSubmit={formSubmitted}>
          <div className="profile-header">
            <div className="header-green">
              <div style={{ marginTop: 70, textAlign: 'center' }}>
                <div className="d-flex justify-content-center">
                  <div className="position-relative mb-3">
                    <img
                      className="account-user-img"
                      src={pic.mediaURL || pic.default}
                      alt={baseAccount.account.name}
                      title={baseAccount.account.name}
                    />
                    <div className="float-popup-camera">
                      <label
                        htmlFor="profile_select"
                        className="mb-0 c-pointer"
                      >
                        <RoundedCameraIcon />
                      </label>

                      <FileInputComp
                        name="logo"
                        className="d-none"
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
                        placeholder="Logo"
                        label=""
                        errorMsg={errors.logo}
                        id="profile_select"
                      />
                    </div>
                  </div>
                </div>
                <p className="fz-24 mb-0">{baseAccount.account.name}</p>
                <p className="mb-0">{baseAccount.account.primaryEmail}</p>
              </div>
            </div>
          </div>
          <div className="px-4">
            <div className="organization-edit-form">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextInputComp
                      type="text"
                      name="name"
                      className="form-control form-control-sm"
                      onChange={setName}
                      label="Organization Name"
                      autoFocus
                      placeholder="Organization Name"
                      value={name}
                      errorMsg={errors.name}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <TextInputComp
                      type="text"
                      className="form-control form-control-sm"
                      name="primaryEmail"
                      onChange={setPrimaryEmail}
                      label="Primary Email"
                      placeholder="Primary Email"
                      value={primaryEmail}
                      errorMsg={errors.primaryEmail}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <TextInputComp
                      type="text"
                      className="form-control form-control-sm"
                      name="phone"
                      onChange={setPhone}
                      label="Phone Number"
                      placeholder="Phone Number"
                      value={phone}
                      errorMsg={errors.phone}
                    />
                  </div>
                </div>

                <div className="col-md-12">
                  <label>Select Colour Theme For Your Account</label>

                  <div className="color-container d-flex overflow-auto">
                    {Themes.map((availableTheme, index) => {
                      const isActive = theme.primary === availableTheme.primary;

                      return (
                        <div
                          key={index}
                          className={`${
                            isActive ? 'active-color-box' : ''
                          } color-box ml-3`}
                          style={{ backgroundColor: availableTheme.primary }}
                          onClick={() => {
                            const newTheme = {
                              ...theme,
                              ...availableTheme,
                            };

                            setTheme(newTheme);
                            //  Theme Changer Function ofr SCSS Update Parameters
                            const root = document.documentElement;
                            for (const [key, value] of Object.entries(
                              newTheme
                            )) {
                              root?.style.setProperty(`--${key}`, value);
                            }
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="col-md-12 mt-3">
                  <div className="form-group">
                    <label>Address</label>
                    <AddressAddEditList
                      className="col-md-12"
                      setAddressIndex={setAddressIndex}
                      addresses={addresses}
                      setAddresses={setAddresses}
                      primaryAddressIndex={0}
                      errors={errors}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="d-flex justify-content-center w-100">
                  <button className="btn btn-primary m-3" disabled={isFetching}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Main>
  );
}
