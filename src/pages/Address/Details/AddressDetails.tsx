import { useCallback } from 'react';

import { MapPinIcon } from '../../../components/Icons';

import { GoogleMapComp } from '../../../components/Maps';

import { ICommonAddress } from '../../../interfaces';
import { googleDirectionPath } from '../utils';

export default function AddressDetails({
  index,

  address,
}: {
  index: number;

  address: ICommonAddress;
}) {
  const MemoGoogleMap = useCallback(
    () => <GoogleMapComp marker={address} />,
    [address]
  );

  return (
    <div className="col-md-4 position-relative" key={index}>
      <div className="d-none d-lg-flex absolute-center">
        <MapPinIcon />
      </div>
      <div
        className="card shadow-equal p-3 rounded"
        onClick={() => {
          const googlePath = googleDirectionPath(
            address.location.coordinates[0],
            address.location.coordinates[1],
            address.formatted
          );

          window.open(googlePath, '_blank');
        }}
      >
        <b>{address.name}</b>
        <p>{address.formatted}</p>
        <div className="map-sm">
          <MemoGoogleMap />
        </div>
      </div>
    </div>
  );
}
