import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { useMountedState } from 'react-use';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { deviceType } from '../../config';

import { successToast, warningToast } from '../../utils/toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

import { IAppReduxState } from '../../redux/reducer';
import { authUpdateAction } from '../../redux/auth/auth.actions';

import ProductLogo from '../../components/Common/ProductLogo';
import { ButtonComp, FormikInputCom } from '../../components/Forms';

import DashboardRoutes from '../Dashboard/routes';

import { Themes } from '../Users/constants';

import * as utils from './utils';
import * as services from './services';

import AuthRoutes from './routes';

const initialValues = {
  email: '',
  password: '',
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().min(6).max(18, 'Maximun 18 characters').required(),
});

const Login = () => {
  const isMounted = useMountedState();

  const history: any = useHistory();

  const {
    auth: {
      auth: { token: authToken },
    },
  } = useSelector((state: IAppReduxState) => state);
  const reduxActionDispatch = useDispatch();

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isFormik, setIsFormik] = useState<any>({});

  useEffect(() => {
    document.body.className = 'p-0 m-0';
    return () => {
      document.body.className = '';
    };
  });

  //  Incase redirected from after 401 error or not authenticated
  useEffect(() => {
    if (!isMounted()) {
      return;
    }

    if (authToken) {
      history.push(DashboardRoutes.routes.home.path);
    }

    const warningMsg: string = history.location?.state?.warningMsg || undefined;
    const successMsg: string = history.location?.state?.successMsg || undefined;

    if (warningMsg) {
      warningToast(warningMsg);
    } else if (successMsg) {
      successToast(successMsg);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(isFormik).length > 0) {
      const errorKeys = Object.keys(isFormik.errors);
      if (errorKeys.length > 0) {
        const errorElement = document.getElementById(errorKeys[0]);
        errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement?.focus({ preventScroll: true });
      }
    }
  }, [isFormik]);

  const handleSubmit = async (values: typeof initialValues) => {
    setIsFetching(true);
    try {
      const result = await services.loginService({
        ...values,
        deviceType,
      });
      result.data.user = utils.formatAuthUser(result.data.user);
      //  Redux Auth Update
      reduxActionDispatch(authUpdateAction(result.data));
      //  Theme Changer Function ofr SCSS Update Parameters
      const { theme = Themes[0] } = result.data.user;
      const root = document.documentElement;
      for (const [key, value] of Object.entries(theme)) {
        root?.style.setProperty(`--${key}`, value);
      }
      //TODO THE UI may change according to the current product Kind
      // ProductUpdateDispatch({
      //   type: productActionTypes.UPDATE_PRODUCT_KIND,
      //   payload: {
      //     userProducts: result.data.user.permissions.products,
      //   },
      // });
      history.push(DashboardRoutes.routes.home.path);
      return;
    } catch (error: any) {
      console.error(error);
    }
    if (!isMounted()) {
      return;
    }
    setIsFetching(false);
  };

  return (
    <div id="wrapper">
      <div className="session-wrap login-wrap d-flex align-items-center justify-content-center justify-content-lg-end">
        <div className="session-content contact-form-wrap text-center card shadow-box">
          <ProductLogo />

          <div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {(formik) => {
                return (
                  <Form>
                    <div className="form-group text-left mb-4">
                      <FormikInputCom
                        name="email"
                        placeholder="Email"
                        label="Email"
                      />
                    </div>

                    <div className="form-group text-left mb-4 input_password">
                      <FormikInputCom
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        label="Password"
                      />
                      {showPassword ? (
                        <AiOutlineEye
                          onClick={() => setShowPassword(!showPassword)}
                          className="password_icon"
                        />
                      ) : (
                        <AiOutlineEyeInvisible
                          onClick={() => setShowPassword(!showPassword)}
                          className="password_icon"
                        />
                      )}
                    </div>

                    <div className="forgot-password-link">
                      Forgot
                      <Link
                        className="pull-right ml-1"
                        to={{
                          pathname: AuthRoutes.passwordForgot.path,
                          state: Boolean(formik.values.email.length)
                            ? { email: formik.values.email }
                            : undefined,
                        }}
                      >
                        {' '}
                        Username
                      </Link>{' '}
                      or{' '}
                      <Link
                        className="pull-right mr-1"
                        to={{
                          pathname: AuthRoutes.passwordForgot.path,
                          state: Boolean(formik.values.email.length)
                            ? { email: formik.values.email }
                            : undefined,
                        }}
                      >
                        Password
                      </Link>
                      ?
                    </div>

                    <div className="form-group">
                      <ButtonComp
                        onClick={() => setIsFormik(formik)}
                        loading={isFetching}
                        type="submit"
                        className="btn btn-one btn-block btn-primary"
                        text="Log In"
                      />
                    </div>

                    <div className="link-register">
                      <span>
                        Don’t have an account?{' '}
                        <Link
                          className="pull-left"
                          to={{
                            pathname: AuthRoutes.register.path,
                            state: Boolean(formik.values.email.length)
                              ? { email: formik.values.email }
                              : undefined,
                          }}
                        >
                          Register
                        </Link>
                      </span>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
