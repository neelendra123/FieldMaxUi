import React, { useState, useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useMountedState } from 'react-use';

import { validateData } from '../../utils/joi';

import ProductLogo from '../../components/Common/ProductLogo';
import { TextInputComp, ButtonComp } from '../../components/Forms';

import * as constants from './constants';
import * as interfaces from './interfaces';
import * as services from './services';
import AuthRoutes from './routes';

const DefaultFormError = {
  token: undefined,
  newPassword: undefined,
  newPasswordConfirm: undefined,
};

function PasswordReset() {
  const isMounted = useMountedState();
  const params: { token: string } = useParams();
  const history: any = useHistory();

  const [isFetching, setIsFetching] = useState(true);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const [errors, setErrors] = useState(DefaultFormError);

  const decodeJWT = async () => {
    try {
      const result = await services.passwordResetGetService(params.token);
      if (!isMounted()) {
        return;
      }

      const jwtData: interfaces.IResetPasswordJWTDecodedData =
        result.data.jwtData;

      setFirstName(jwtData.firstName);
      setLastName(jwtData.lastName);

      setIsFetching(false);
    } catch (error: any) {
      console.error(error);
      if (isMounted() && error.response?.data?.data?.tokenError) {
        setErrors({
          ...DefaultFormError,
          token: error.response.data.data.tokenError,
        });
      }
    }
  };

  const formSubmitted = async (event: React.ChangeEvent<any>) => {
    event.preventDefault();

    const validate = validateData(
      { newPassword, newPasswordConfirm },
      constants.PasswordResetJoiScheme
    );

    if (validate.errors) {
      setErrors(validate.errors);
      return;
    }

    setIsFetching(true);
    setErrors(DefaultFormError);

    try {
      const result = await services.passwordResetPostService({
        newPassword,
        token: params.token,
      });

      history.push(AuthRoutes.login.path, { successMsg: result.message });
    } catch (error) {
      console.error(error);
    }

    if (!isMounted()) {
      return;
    }

    setIsFetching(false);
  };

  useEffect(() => {
    document.body.className = 'p-0 m-0';

    decodeJWT();

    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <div id="wrapper">
      <div className="session-wrap login-wrap d-flex align-items-center justify-content-center justify-content-lg-end">
        <div className="session-content contact-form-wrap text-center card shadow-box">
          <ProductLogo />
          <div className="invite-signup-content text-align-left mb-2">
            <h6 className="mb-1">
              Hi {firstName} {lastName || ''},
            </h6>
          </div>
          <div>
            <form onSubmit={formSubmitted}>
              <div className="form-group text-left mb-4">
                <TextInputComp
                  name="newPassword"
                  type="password"
                  onChange={setNewPassword}
                  label="New Password"
                  autoFocus
                  placeholder="New Password *"
                  value={newPassword}
                  errorMsg={errors.newPassword}
                />
              </div>

              <div className="form-group text-left mb-2">
                <TextInputComp
                  name="newPasswordConfirm"
                  type="password"
                  onChange={setNewPasswordConfirm}
                  label="New Confirm Password"
                  placeholder="New Confirm Password *"
                  value={newPasswordConfirm}
                  errorMsg={errors.newPasswordConfirm}
                />
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
                  text="Password Reset"
                />
              </div>

              <div className="link-register">
                <span>
                  Remembered the password?{' '}
                  <Link to={AuthRoutes.login.path}>Log In</Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset;
