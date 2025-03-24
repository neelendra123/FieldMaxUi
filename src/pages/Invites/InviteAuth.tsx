import React, { useState, useEffect, Fragment } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useMountedState } from 'react-use';

import { IProductKind } from '../../interfaces';
import { deviceType } from '../../config';

import { validateData } from '../../utils/joi';
import { getProductDetails } from '../../utils/common';
import { useQuery } from '../../utils/hooks';

import {
  authUpdateAction,
  logoutAction,
  accountChangeAction,
} from '../../redux/auth/auth.actions';

import ProductLogo from '../../components/Common/ProductLogo';
import { TextInputComp, ButtonComp } from '../../components/Forms';

import { LoginJoiScheme } from '../Auth/constants';
import { IAuthResData, ILoginReqData } from '../Auth/interfaces';
import { formatAuthUser } from '../Auth/utils';
import AuthRoutes from '../Auth/routes';
import { loginService } from '../Auth/services';

import { Themes } from '../Users/constants';

import DashboardRoutes from '../Dashboard/routes';

import * as constants from './constants';
import * as interfaces from './interfaces';
import * as services from './services';

const DefaultFormError = {
  token: '',

  firstName: '',
  lastName: '',
  email: '',

  companyName: '',

  password: '',
  passwordConfirm: '',
};

export default function InviteAuth() {
  const isMounted = useMountedState();

  const params: { token: string } = useParams();
  const query = useQuery();
  const history: any = useHistory();

  const reduxActionDispatch = useDispatch();

  const [product] = useState(
    getProductDetails(
      parseInt(query.get('products') || `${IProductKind.camMax}`)
    )
  );

  const [isFetching, setIsFetching] = useState(true);

  const [inviteData, setInviteData] =
    useState<interfaces.InviteDecodeJWTResData | null>(null);

  const [newUser, setNewUser] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [errors, setErrors] = useState(DefaultFormError);

  useEffect(() => {
    document.body.className = 'p-0 m-0';

    //Logging Out the Previous User
    reduxActionDispatch(logoutAction());

    decodeJWT();

    return () => {
      document.body.className = '';
    };
  }, []);

  const decodeJWT = async () => {
    try {
      const result = await services.inviteDetailsService(params.token);

      if (!isMounted()) {
        return;
      }

      setInviteData(result);

      setNewUser(result.user.newUser);
      setFirstName(result.user.firstName);
      setLastName(result.user.lastName);
      setEmail(result.user.email);
      setCompanyName(result.user.account.name);

      setIsFetching(false);
    } catch (error: any) {
      if (error.response?.data?.data?.tokenError) {
        setErrors({
          ...DefaultFormError,
          token: error.response.data.data.tokenError,
        });
      }
    }
  };

  const newUserFormSubmit = async (event: React.ChangeEvent<any>) => {
    event.preventDefault();

    const formData: interfaces.InviteNewUserReqData = {
      token: params.token,
      firstName,
      lastName,
      password,
      deviceType,
      companyName,
    };

    const validate = validateData(
      { ...formData, passwordConfirm },
      constants.InviteNewUserJoiScheme
    );

    if (validate.errors) {
      setErrors(validate.errors);
      return;
    }

    setIsFetching(true);
    setErrors(DefaultFormError);

    try {
      const result = await services.inviteRegisterService(formData);

      commonInviteAuthFlow(result);
    } catch (error: any) {
      console.error(error);
      if (!isMounted()) {
        return;
      }

      if (error.response?.data?.data?.tokenError) {
        setErrors({
          ...DefaultFormError,
          token: error.response.data.data.tokenError,
        });
        setIsFetching(true);
      } else {
        setIsFetching(false);
      }
    }
  };

  const oldUserFormSubmit = async (event: React.ChangeEvent<any>) => {
    event.preventDefault();

    const formData: ILoginReqData = {
      email,
      password,
      deviceType,
    };

    const validate = validateData(formData, LoginJoiScheme);
    if (validate.errors) {
      setErrors(validate.errors);
      return;
    }

    setIsFetching(true);
    setErrors(DefaultFormError);

    try {
      const result = await loginService(formData);

      commonInviteAuthFlow(result);
    } catch (error: any) {}

    if (!isMounted()) {
      return;
    }
    setIsFetching(false);
  };

  const commonInviteAuthFlow = (result: IAuthResData) => {
    result.data.user = formatAuthUser(result.data.user);

    //  Redux Auth Update
    reduxActionDispatch(authUpdateAction(result.data));

    //  Theme Changer Function ofr SCSS Update Parameters
    const { theme = Themes[0] } = result.data.user;

    const root = document.documentElement;
    for (const [key, value] of Object.entries(theme)) {
      root?.style.setProperty(`--${key}`, value);
    }

    //  Only Setting the invite data if the email is same as invited email
    if (result.data.user.email === inviteData?.jwtData.email) {
      //  Changing the default account to the account on which the invite was sent.

      const inviteAccountIndex = result.data.user.accounts.findIndex(
        (account) =>
          account.primaryUserId.id === inviteData.jwtData.invitedPrimaryUserId
      );

      reduxActionDispatch(
        accountChangeAction({
          accountIndex: inviteAccountIndex !== -1 ? inviteAccountIndex : 0,
        })
      );

      localStorage.setItem(
        'invite',
        JSON.stringify({
          token: params.token,
          data: inviteData,
        })
      );
    }

    history.push(DashboardRoutes.routes.home.path);
  };

  return (
    <div id="wrapper">
      <div className="session-wrap login-wrap d-flex align-items-center justify-content-center justify-content-lg-end">
        <div className="session-content contact-form-wrap text-center card shadow-box">
          <ProductLogo />

          {newUser ? (
            <Fragment>
              <div className="invite-signup-content text-align-left mb-2">
                <h6 className="mb-1">
                  Hi {firstName} {lastName || ''},
                </h6>
                <p className="mb-0">
                  Welcome to <strong>{product.name}</strong> please setup
                  password for your account
                </p>
              </div>

              <div>
                <form method="post" onSubmit={newUserFormSubmit}>
                  <div className="row">
                    <div className="col-6 col-md-6 col-lg-6">
                      <div className="form-group text-left  mb-2">
                        <TextInputComp
                          name="firstName"
                          onChange={setFirstName}
                          label="First Name"
                          autoFocus
                          placeholder="First Name *"
                          value={firstName}
                          errorMsg={errors.firstName}
                        />
                      </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-6">
                      <div className="form-group text-left  mb-2">
                        <TextInputComp
                          name="lastName"
                          onChange={setLastName}
                          label="Last Name"
                          placeholder="Last Name"
                          value={lastName}
                          errorMsg={errors.lastName}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-12">
                      <div className="form-group text-left mb-3">
                        <TextInputComp
                          name="email"
                          onChange={setEmail}
                          label="Email"
                          placeholder="Email *"
                          value={email}
                          errorMsg={errors.email}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-12 col-md-12 col-lg-12">
                      <div className="form-group text-left mb-3">
                        <TextInputComp
                          name="companyName"
                          onChange={setCompanyName}
                          label="Company Name"
                          placeholder="Company Name"
                          value={companyName}
                          errorMsg={errors.companyName}
                        />
                      </div>
                    </div>

                    <div className="col-6 col-md-6 col-lg-6">
                      <div className="form-group text-left mb-3">
                        <TextInputComp
                          type="password"
                          name="password"
                          onChange={setPassword}
                          label="Password"
                          placeholder="Password *"
                          value={password}
                          errorMsg={errors.password}
                        />
                      </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-6">
                      <div className="form-group text-left mb-3">
                        <TextInputComp
                          type="password"
                          name="passwordConfirm"
                          onChange={setPasswordConfirm}
                          label="Confirm Password"
                          placeholder="Confirm Password *"
                          value={passwordConfirm}
                          errorMsg={errors.passwordConfirm}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    {errors.token && (
                      <p className="text-danger">
                        <small>{errors.token}</small>
                      </p>
                    )}
                    <ButtonComp
                      loading={isFetching}
                      type="submit"
                      className="btn btn-one btn-block btn-primary"
                      text="Password Setup"
                    />
                  </div>
                </form>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="invite-signup-content text-align-left mb-2">
                <p className="mb-0">
                  Welcome to <strong>{product.name}</strong> please login to
                  view the invitation
                </p>
              </div>

              <div>
                <form method="post" onSubmit={oldUserFormSubmit}>
                  <div className="row">
                    <div className="col-12 col-md-12 col-lg-12">
                      <div className="form-group text-left mb-3">
                        <TextInputComp
                          name="email"
                          onChange={setEmail}
                          label="Email"
                          placeholder="Email *"
                          value={email}
                          errorMsg={errors.email}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-12 col-md-12 col-lg-12">
                      <div className="form-group text-left mb-3">
                        <TextInputComp
                          type="password"
                          name="password"
                          onChange={setPassword}
                          label="Password"
                          placeholder="Password *"
                          value={password}
                          errorMsg={errors.password}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    {errors.token && (
                      <p className="text-danger">
                        <small>{errors.token}</small>
                      </p>
                    )}
                    <ButtonComp
                      loading={isFetching}
                      type="submit"
                      className="btn btn-one btn-block btn-primary"
                      text="Login"
                    />
                  </div>

                  {errors.token && (
                    <Fragment>
                      <div className="link-register">
                        <span>
                          Already have an account?{' '}
                          <Link to={AuthRoutes.login.path}>Log In</Link>
                        </span>
                      </div>
                    </Fragment>
                  )}
                </form>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
}
