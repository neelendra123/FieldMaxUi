import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { useMountedState } from 'react-use';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import DashboardRoutes from '../Dashboard/routes';

import { deviceType } from '../../config';

import { generateDynamicPath } from '../../utils/common';

import { IAppReduxState } from '../../redux/reducer';
import { authUpdateAction } from '../../redux/auth/auth.actions';

import ProductLogo from '../../components/Common/ProductLogo';
import { ButtonComp, FormikInputCom } from '../../components/Forms';

import AccountsRoutes from '../Accounts/routes';

import * as interfaces from './interfaces';
import * as utils from './utils';
import * as services from './services';
import AuthRoutes from './routes';

function Register() {
  const isMounted = useMountedState();

  const history: any = useHistory();
  const {
    auth: {
      auth: { token: authToken },
      product,
    },
  } = useSelector((state: IAppReduxState) => state);
  const reduxActionDispatch = useDispatch();

  const [isFetching, setIsFetching] = useState(false);
  const [isFormik, setIsFormik] = useState<any>({});

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('first name is a required field'),
    email: Yup.string().email().required('email is a required field'),
    password: Yup.string().min(6).max(18).required(),
    passwordConfirm: Yup.string()
      .required('confirm password is a required field')
      .oneOf([Yup.ref('password'), null], 'confirm password must match'),
  });

  console.log('First render location', history.location);
  const initialValues = {
    productKind: product.productKind,
    deviceType,
    firstName: '',
    lastName: '',
    email: history.location?.state?.email || '',
    password: '',
    passwordConfirm: '',
    companyName: '',
  };

  useEffect(() => {
    document.body.className = 'p-0 m-0';
    return () => {
      document.body.className = '';
    };
  });

  useEffect(() => {
    if (authToken) {
      history.push(DashboardRoutes.routes.home.path);
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

  const handleSubmit = async (value: interfaces.IRegisterReqData) => {
    if (!isMounted()) {
      return;
    }

    setIsFetching(true);

    try {
      const result = await services.registerService(value);

      result.data.user = utils.formatAuthUser(result.data.user);

      //  Redux Auth Update
      reduxActionDispatch(authUpdateAction(result.data));

      const accountEditPath = generateDynamicPath(
        AccountsRoutes.routes.editAccount.path,
        { accountIndex: '0' }
      );

      history.push(accountEditPath, {
        successMsg: result.message,
      });
      return;
    } catch (error: any) {
      console.error(error);
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
                    <div className="row">
                      <div className="col-6 col-md-6 col-lg-6">
                        <div className="form-group text-left mb-3">
                          <FormikInputCom
                            name="firstName"
                            placeholder="First Name"
                            label="First Name"
                          />
                        </div>
                      </div>

                      <div className="col-6 col-md-6 col-lg-6">
                        <div className="form-group text-left mb-3">
                          <FormikInputCom
                            name="lastName"
                            placeholder="Last Name"
                            label="Last Name"
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-12 col-lg-12">
                        <div className="form-group text-left mb-3">
                          <FormikInputCom
                            name="email"
                            placeholder="Email"
                            label="Email"
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-12 col-lg-12">
                        <div className="form-group text-left mb-3">
                          <FormikInputCom
                            name="companyName"
                            placeholder="Company Name"
                            label="Company Name"
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-12 col-lg-12">
                        <div className="form-group text-left mb-3">
                          <FormikInputCom
                            name="password"
                            type="password"
                            placeholder="Password"
                            label="Password"
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-12 col-lg-12">
                        <div className="form-group text-left mb-3">
                          <FormikInputCom
                            name="passwordConfirm"
                            type="password"
                            placeholder="Confirm Password"
                            label="Confirm Password"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <ButtonComp
                        onClick={() => setIsFormik(formik)}
                        loading={isFetching}
                        type="submit"
                        className="btn btn-one btn-block btn-primary"
                        text="Register"
                      />
                    </div>

                    <div className="link-register">
                      <span>
                        Already have an account?{' '}
                        <Link to={AuthRoutes.login.path}>Log In</Link>
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

export default Register;
