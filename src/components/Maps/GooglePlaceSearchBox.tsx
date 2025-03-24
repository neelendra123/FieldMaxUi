import React, { Fragment, useState } from 'react';
import { StandaloneSearchBox } from '@react-google-maps/api';

import { googleApiKey } from '../../config';
import { ICommonAddress } from '../../interfaces';
import { GoogleMapLibTypes } from '../../constants';

import LoadGoogleScriptOnlyIfNeeded from './LoadGoogleScriptOnlyIfNeeded';
import * as utils from './utils';

function GooglePlaceSearchBox({
  label = 'Auto Complete',
  placeholder = 'Auto Complete',
  placeOnChange,
  autoFocus = false,
  errorMsg,

  value = '',

  name = '',
}: // onInput,
{
  label?: string;
  placeholder?: string;

  placeOnChange: (adr: ICommonAddress) => void;
  // onInput?: any;

  autoFocus?: boolean;
  errorMsg?: string;

  value?: string;

  name?: string;
}) {
  const [refs, setRefs] = useState<{ searchBox?: any }>({});

  function handleLoad(ref: any) {
    setRefs({
      searchBox: ref,
    });
  }

  function handlePlacesChanged() {
    const places = refs.searchBox.getPlaces();

    if (!places.length) {
      return;
    }

    const address = utils.convertGoogleResultToCommonAddress(places[0]);

    placeOnChange(address);
  }

  return (
    <Fragment>
      <LoadGoogleScriptOnlyIfNeeded
        id="google-script-loader"
        googleMapsApiKey={googleApiKey}
        libraries={GoogleMapLibTypes}
      >
        {/* <LoadScript
        googleMapsApiKey={googleApiKey}
        libraries={constants.googleMapLibTypes}
      > */}
        <label>{label}</label>
        <StandaloneSearchBox
          onLoad={handleLoad}
          onPlacesChanged={handlePlacesChanged}
          // options={{
          //   types: 'address'
          // } as any}
        >
          <input
            autoFocus={autoFocus}
            type="text"
            placeholder={placeholder}
            className="form-control"
            defaultValue={value}
            // value={value}
            // onChange={(event) => {}}
            name={name}
          >
            {/* <BsPinMap className="ml-2" /> */}
          </input>
        </StandaloneSearchBox>
        {errorMsg && (
          <p className="text-danger">
            <small>{errorMsg}</small>
          </p>
        )}
        {/* </LoadScript> */}
      </LoadGoogleScriptOnlyIfNeeded>
    </Fragment>
  );
}

export default React.memo(GooglePlaceSearchBox);
