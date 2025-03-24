import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { useMountedState } from 'react-use';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import DashboardRoutes from '../Dashboard/routes';

import { IAppReduxState } from '../../redux/reducer';

import ProductLogo from '../../components/Common/ProductLogo';
import { ButtonComp, FormikInputCom } from '../../components/Forms';

import * as services from './services';
import AuthRoutes from './routes';
import { IPasswordForgotReqData } from './interfaces';

function PasswordForgot() {
  const isMounted = useMountedState();
  const history: any = useHistory();
  const { auth } = useSelector((state: IAppReduxState) => state.auth);

  const [isFetching, setIsFetching] = useState(false);

  const initialValues = {
    email: history.location?.state?.email || '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(),
  });

  if (auth.token) {
    history.push(DashboardRoutes.routes.home.path);
  }

  useEffect(() => {
    document.body.className = 'p-0 m-0';
    return () => {
      document.body.className = '';
    };
  });

  const handleSubmit = async (value: IPasswordForgotReqData) => {
    setIsFetching(true);

    try {
      const result = await services.passwordForgotService(value);

      history.push(AuthRoutes.login.path, { successMsg: result.message });

      //Todo remove after password setup
    } catch (error) {
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

                    <div className="form-group">
                      <ButtonComp
                        loading={isFetching}
                        type="submit"
                        className="btn btn-one btn-block btn-primary"
                        text="Password Forgot"
                      />
                    </div>

                    <div className="link-register">
                      <span>
                        Already have an account?{' '}
                        <Link
                          to={{
                            pathname: AuthRoutes.login.path,
                            state: Boolean(formik.values.email.length)
                              ? { email: [formik.values.email] }
                              : undefined,
                          }}
                        >
                          Log In
                        </Link>
                      </span>
                    </div>

                    <div className="link-register">
                      <span>
                        Don’t have an account?{' '}
                        <Link
                          className="pull-left"
                          to={{
                            pathname: AuthRoutes.register.path,
                            state: Boolean(formik.values.email.length)
                              ? { email: [formik.values.email] }
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
}

export default PasswordForgot;
