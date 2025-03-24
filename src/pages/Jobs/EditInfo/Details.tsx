import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMountedState } from 'react-use';

import { CommonPerms } from '../../../constants';

import { validateData } from '../../../utils/joi';
import { successToast } from '../../../utils/toast';

import { TextInputComp } from '../../../components/Forms';
import { DtRangeFilters } from '../../../components/Common';

import * as interfaces from '../interfaces';
import * as constants from '../constants';
import * as services from '../services';

export default function Detail({
  paths,

  job,
  setJob,
}: {
  paths: interfaces.IJobEditInfoPaths;

  job: interfaces.IJobPopulated;
  setJob: (job: interfaces.IJobPopulated) => void;
}) {
  const isMounted = useMountedState();

  const history = useHistory();

  const [isFetching, setIsFetching] = useState(false);

  const [errors, setErrors] = useState({
    ...constants.AddEditDetailsDefaultErrors,
  });

  const addressUpdate = (
    value: string,
    key: 'formatted' | 'city' | 'state'
  ) => {
    const address = {
      ...job.address,
      [key]: value,
    };

    setJob({
      ...job,
      address,
    });
  };

  const jobFormSubmit = async () => {
    try {
      const formData: interfaces.IJobEditReqData = {
        propertyId: job.propertyId,
        propertyUnitId: job.propertyUnitId,
        title: job.title,
        startDt: job.startDt,
        endDt: job.endDt,
        address: job.address,
      };

      const validate = validateData(
        formData,
        constants.JobEditDetailsJoiScheme
      );
      if (validate.errors) {
        return setErrors(validate.errors);
      }

      setErrors({ ...constants.AddEditDetailsDefaultErrors });
      setIsFetching(true);

      let result = await services.jobEditService(job.id, formData);
      if (!isMounted()) {
        return;
      }

      successToast(result.message);
    } catch (error: any) {
      if (error.response?.data?.data && isMounted()) {
        setErrors({
          ...constants.AddEditDetailsDefaultErrors,
          ...error.response.data.data,
        });
      }
    }

    if (!isMounted()) {
      return;
    }
    setIsFetching(false);
  };

  const {
    isDeleted,
    currentUserJobPerm: { permissions },
  } = job;

  return (
    <div className="content">
      <div className="create-property-wrap">
        <div className="main-heading-wrap flex-space-between-wrap mb-4">
          <div className="dashboard-heading-title">
            <h6 className="title">Job Edit</h6>
          </div>
          <div className="flex-content">
            {!!(permissions.base & (CommonPerms.all | CommonPerms.edit)) && (
              <div className="btn-wrap mr-2">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    history.push(paths.map);
                  }}
                  disabled={isFetching}
                >
                  Map
                </button>
              </div>
            )}

            <div className="btn-wrap mr-3">
              <button
                disabled={isDeleted || isFetching}
                className="btn btn-primary"
                onClick={jobFormSubmit}
              >
                Save Job
              </button>
            </div>
          </div>
        </div>

        {!!(permissions.base & (CommonPerms.all | CommonPerms.edit)) && (
          <div className="property-content-wrap">
            <div className="form-content-wrap">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <TextInputComp
                      name="title"
                      onChange={(val) => {
                        setJob({
                          ...job,
                          title: val,
                        });
                      }}
                      label="Job Title"
                      autoFocus
                      placeholder="Job Title *"
                      value={job.title}
                      errorMsg={errors.title}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <TextInputComp
                      name="formatted"
                      onChange={(value) => addressUpdate(value, 'formatted')}
                      label="Full Address"
                      placeholder="Full Address"
                      value={job.address.formatted}
                      errorMsg={errors.formatted}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <TextInputComp
                      name="city"
                      onChange={(value) => addressUpdate(value, 'city')}
                      label="City"
                      placeholder="City"
                      value={job.address.city}
                      errorMsg={errors.city}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <TextInputComp
                      name="state"
                      onChange={(value) => addressUpdate(value, 'state')}
                      label="State"
                      placeholder="State"
                      value={job.address.state}
                      errorMsg={errors.state}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <DtRangeFilters
                      timePicker
                      startDt={job.startDt}
                      endDt={job.endDt}
                      onChange={(startDt, endDt) => {
                        setJob({
                          ...job,
                          startDt,
                          endDt,
                        });
                      }}
                      errorMsg={errors.startDt || errors.endDt}
                      format="YYYY-MM-DD"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
