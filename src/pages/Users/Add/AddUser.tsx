import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMountedState } from 'react-use';

import { DefaultCommonMediaUpload } from '../../../constants';
import { IModuleKind } from '../../../interfaces';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { validateData } from '../../../utils/joi';

import Main from '../../../components/Layouts/Main';
import {
  FileInputComp,
  TextInputComp,
  FormikInputCom,
} from '../../../components/Forms';
import { RoundedCameraIcon } from '../../../components/Icons';

import { IOrgPerms } from '../../Orgs/interfaces';
import { generateDefaultOrgPerms } from '../../Orgs/utils';

import DashboardRoutes from '../../Dashboard/routes';

import { mediaUploadCommonService } from '../../Common/services';

import { PropertiesCircleIcon2x } from '../../Properties/Icons';

import UserPermissions from '../Common/UserPermissions';

import UserRoutes from '../routes';
import * as interfaces from '../interfaces';
import * as constants from '../constants';
import * as services from '../services';

export default function AddUser() {
  const isMounted = useMountedState();

  const history = useHistory();

  const [isFetching, setIsFetching] = useState(false);
  const [pic, setPic] = useState(DefaultCommonMediaUpload);
  const [permissions, setPermissions] = useState<IOrgPerms>({
    ...generateDefaultOrgPerms(),
  });

  const [errors, setErrors] = useState({
    permissions: '',
    pic: '',
  });

  const initialValues: interfaces.IUserAddReqData = {
    firstName: '',
    lastName: '',
    email: '',
    permissions,
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    email: Yup.string().email().required('Email is required'),
  });

  const handleSubmit = async (formData: interfaces.IUserAddReqData) => {
    setIsFetching(true);

    try {
      if (pic.mediaURL) {
        formData.pic = await mediaUploadCommonService(pic, {
          name: 'Profile Pic',
          moduleKind: IModuleKind.users,
        });
      }
      formData.sendEmail = false;

      const result = await services.userAddService(formData);
      if (!isMounted()) {
        return;
      }

      const redirectPath = UserRoutes.routes.list.access
        ? UserRoutes.routes.list.path
        : DashboardRoutes.routes.home.path;

      history.push(redirectPath, {
        successMsg: result.message,
      });
    } catch (error: any) {
      if (!isMounted()) {
        return;
      }

      if (error.response?.data?.data) {
        setErrors({
          ...error.response.data.data,
        });
      }

      setIsFetching(false);
    }
  };

  return (
    <Main sideBarId={UserRoutes.routes.add.sideBarId}>
      <div className="mx-1">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="main-heading-wrap flex-space-between ipad-flex-wrap mb-4">
              <div className="dashboard-heading-title d-flex ipad-w-100">
                <h5 className="title">Create User</h5>
              </div>
              <div className="flex-content ipad-w-100 pt-sm-3 pt-lg-0">
                <div className="d-none d-md-flex">
                  <button
                    className="btn btn-primary"
                    disabled={isFetching}
                    type="submit"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-center justify-content-lg-start">
              <div className="position-relative d-inline">
                {pic.mediaURL ? (
                  <img
                    src={pic.mediaURL}
                    alt="pic"
                    className="rounded-circle"
                    style={{
                      width: '126px',
                      height: '126px',
                    }}
                  />
                ) : (
                  //TODO Add User Icon
                  <PropertiesCircleIcon2x />
                )}

                <div className="cameraRounded">
                  <label htmlFor="pic">
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
                        setPic({ mediaURL: '', type: '', name: '' });
                        return;
                      }

                      setPic({
                        mediaURL: window.URL.createObjectURL(file),
                        type: file.type,
                        name: file.name,
                      });
                    }}
                    placeholder="Pic"
                    errorMsg={errors.pic}
                  />
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-6">
                <div className="form-group ">
                  <FormikInputCom
                    name="firstName"
                    placeholder="First Name"
                    label="First Name"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <FormikInputCom
                    name="lastName"
                    placeholder="Last Name"
                    label="Last Name"
                  />
                </div>
              </div>

              <div className="col-6">
                <div className="form-group">
                  <FormikInputCom
                    name="email"
                    label="Email"
                    placeholder="Email"
                  />
                </div>
              </div>
            </div>

            <div className="border-top my-2" />
            <UserPermissions
              setPermissions={setPermissions}
              permissions={permissions}
            />
            <div className="d-block d-sm-block d-md-none my-5">
              <button
                className="btn btn-primary w-100"
                disabled={isFetching}
                type="submit"
              >
                Save
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </Main>
  );
}
