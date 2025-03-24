import { useState, Fragment, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { ICommonAddress } from '../../../interfaces';

import { validateData } from '../../../utils/joi';

import { TextInputComp } from '../../../components/Forms';
import { GoogleMapComp } from '../../../components/Maps';

import PropertyLocationDropdown from '../../Properties/Commons/LocationDropdown';

import * as constants from '../constants';
import * as interfaces from '../interfaces';

export default function Map({
  paths,
  job,
  setJob,

  backupData,
}: {
  paths: interfaces.IJobEditInfoPaths;
  job: interfaces.IJobPopulated;
  setJob: (job: interfaces.IJobPopulated) => void;

  backupData: (address: ICommonAddress) => void;
}) {
  const history = useHistory();

  const [errors, setErrors] = useState({
    ...constants.AddEditMapDefaultErrors,
  });

  const [title, setTitle] = useState(job.title);
  const [address, setAddress] = useState(job.address);

  const MemoGoogleMap = useCallback(
    () => <GoogleMapComp marker={address} />,
    [address]
  );

  const nextClick = async (event: React.ChangeEvent<any>) => {
    const validate = validateData(
      {
        title,
        address: address.formatted,
      },
      constants.AddEditMapJoiScheme
    );

    if (validate.errors) {
      setErrors(validate.errors);
      return;
    }

    setErrors({ ...constants.AddEditMapDefaultErrors });

    setJob({
      ...job,
      title: title || address.formatted,
      address,
    });

    history.push(paths.details);
  };

  return (
    <Fragment>
      <div className="create-property-wrap">
        <div className="main-heading-wrap flex-space-between-wrap">
          <div className="dashboard-heading-title">
            <h6 className="title">Job Edit</h6>
          </div>
          <div className="btn-wrap">
            <button className="btn btn-primary" onClick={nextClick}>
              Next
            </button>
          </div>
        </div>
        <div className="property-content-wrap">
          <div className="form-content-wrap">
            <form>
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <label htmlFor="address">Location *</label>
                    <PropertyLocationDropdown
                      address={address}
                      setAddress={setAddress}
                      onSelectEffect={(data: any) => {
                        setJob({
                          ...job,
                          ...data,
                        });
                      }}
                      backupData={backupData}
                    />
                    {/* <GooglePlaceSearchBox
                      label="Enter Full Address"
                      placeholder="Full Address *"
                      placeOnChange={(address) => {
                        setAddress({ ...address });
                      }}
                      value={job.address.formatted}
                      errorMsg={errors.address}
                    /> */}
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <TextInputComp
                      name="title"
                      onChange={(val) => {
                        setTitle(val);
                      }}
                      label="Job Title"
                      autoFocus
                      placeholder="Job Title"
                      value={title}
                      errorMsg={errors.title}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="graph-image-wrap w-100">
            <MemoGoogleMap />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
