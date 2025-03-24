import { useState, useCallback } from 'react';

import { ICommonAddress } from '../../../interfaces';

import { validateData } from '../../../utils/joi';

import Main from '../../../components/Layouts/Main';
import { TextInputComp } from '../../../components/Forms';

import { GoogleMapComp, GooglePlaceSearchBox } from '../../../components/Maps';

import * as constants from '../constants';
import * as utils from '../utils';

export default function AddressAdd({
  sideBarId,

  defaultAddress = constants.DefaultCommonAddress,

  onSaveEffect,

  addressCancelEvent,
}: {
  sideBarId: number;

  defaultAddress?: ICommonAddress;

  onSaveEffect: (adr: ICommonAddress) => void;

  addressCancelEvent: () => void;
}) {
  const [address, setAddress] = useState({ ...defaultAddress });
  const [addressErrors, setAddressErrors] = useState({
    ...constants.DefaultAddressError,
  });

  const setAddressAction = (value: any, name: string): void => {
    if (name === 'latitude' || name === 'longitude') {
      value = parseFloat(value);
    }

    setAddress({
      ...address,
      [name]: value,
    });
  };

  const onSave = () => {
    const validate = validateData(
      address,
      utils.generateCommonAddressJoiSchema({})
    );
    if (validate.errors) {
      return setAddressErrors(validate.errors);
    }

    onSaveEffect({ ...address });
  };

  const MemoGoogleMap = useCallback(
    () => <GoogleMapComp marker={address} />,
    [address]
  );

  return (
    <Main sideBarId={sideBarId}>
      <div className="mx-4">
        <div className="create-property-wrap">
          <div className="main-heading-wrap flex-space-between-wrap mb-4 py-2 pt-4">
            <div className="dashboard-heading-title">
              <h6 className="title">Address</h6>
            </div>

            <div className="mobile-d-none">
              <button
                className="btn btn-danger mr-3"
                onClick={addressCancelEvent}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={onSave}>
                Save
              </button>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-6 mb-3">
              <div className="form-group">
                <GooglePlaceSearchBox
                  label="Location"
                  placeholder="Location"
                  placeOnChange={(adr) => {
                    setAddress({ ...adr, name: address.name });
                  }}
                  value={address.formatted}
                  name="location"
                  errorMsg={addressErrors.formatted}
                  autoFocus
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <TextInputComp
                name="name"
                placeholder="Name"
                onChange={setAddressAction}
                value={address.name}
                label="Name"
                labelClassName="mb-2"
                errorMsg={addressErrors.name}
              />
            </div>
            <div className="col-md-6 mb-3">
              <TextInputComp
                name="line1"
                placeholder="Building / House Number"
                onChange={setAddressAction}
                value={address.line1}
                label="Building / House Number"
                labelClassName="mb-2"
                errorMsg={addressErrors.line1}
              />
            </div>
            <div className="col-md-6 mb-3">
              <TextInputComp
                name="line2"
                placeholder="Street Address"
                onChange={setAddressAction}
                value={address.line2}
                label="Street Address"
                labelClassName="mb-2"
                errorMsg={addressErrors.line2}
              />
            </div>
            <div className="col-md-6 mb-3">
              <TextInputComp
                name="zipCode"
                placeholder="Postal/Zip Code"
                onChange={setAddressAction}
                value={address.zipCode}
                label="Postal/Zip Code"
                labelClassName="mb-2"
                errorMsg={addressErrors.zipCode}
              />
            </div>

            <div className="col-md-6 mb-3">
              <div className="form-group">
                <TextInputComp
                  name="city"
                  placeholder="City"
                  onChange={setAddressAction}
                  value={address.city}
                  label="City"
                  labelClassName="mb-2"
                  errorMsg={addressErrors.city}
                />
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <div className="form-group">
                <TextInputComp
                  name="state"
                  placeholder="State"
                  onChange={setAddressAction}
                  value={address.state}
                  label="State"
                  labelClassName="mb-2"
                  errorMsg={addressErrors.state}
                />
              </div>
            </div>
            <div className="google-map-container mb-3 mx-3">
              <MemoGoogleMap />
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
}
