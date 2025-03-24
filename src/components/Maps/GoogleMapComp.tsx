import { Fragment, FunctionComponent, useState } from 'react';
import { GoogleMap, Marker, InfoBox } from '@react-google-maps/api';

import { googleApiKey } from '../../config';
import { ICommonAddress } from '../../interfaces';
import { GoogleMapLibTypes } from '../../constants';

import LoadGoogleScriptOnlyIfNeeded from './LoadGoogleScriptOnlyIfNeeded';

const GoogleMapComp: FunctionComponent<{ marker: ICommonAddress }> = ({
  children,
  marker,
}) => {
  const [markerInfoBox, setMarkerInfoBox] = useState(false);
  const [latitude, longitude] = marker.location.coordinates;

  return (
    <Fragment>
      <LoadGoogleScriptOnlyIfNeeded
        id="google-script-loader"
        googleMapsApiKey={googleApiKey}
        libraries={GoogleMapLibTypes}
      >
        {/* <script
        type="text/javascript"
        src={`https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`}
      ></script> */}

        {/* <LoadScript
        googleMapsApiKey={googleApiKey}
        libraries={constants.googleMapLibTypes}
      > */}
        <GoogleMap
          mapContainerStyle={{
            height: '400px',
            width: '100%',
          }}
          zoom={13}
          center={{
            lat: latitude,
            lng: longitude,
            // lat: marker.location.coordinates[0],
            // lng: marker.location.coordinates[1],
          }}
        >
          {children}

          {!!latitude && !!longitude && (
            <Marker
              position={{
                lat: latitude,
                lng: longitude,
              }}
              title={marker.formatted || ''}
              onClick={() => setMarkerInfoBox(!markerInfoBox)}
            >
              {!!(markerInfoBox && marker.formatted) && (
                <InfoBox
                // position={{
                //   lat: 33.772,
                //   lng: -117.214,
                // }}
                >
                  <div
                    style={{
                      backgroundColor: `yellow`,
                      opacity: 0.75,
                      padding: `12px`,
                    }}
                  >
                    <strong>{marker.line1}</strong>
                    <br />
                    City: {marker.city}
                    <br />
                    State: {marker.state}
                  </div>
                </InfoBox>
              )}
            </Marker>
          )}
        </GoogleMap>
        {/* </LoadScript> */}
      </LoadGoogleScriptOnlyIfNeeded>
    </Fragment>
  );
};

export default GoogleMapComp;
