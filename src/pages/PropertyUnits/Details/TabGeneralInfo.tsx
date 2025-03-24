import { Fragment } from 'react';

import { ICommonAddress } from '../../../interfaces';

import { AddressDetails } from '../../Address';

interface TabGeneralInfoProps {
  addresses: ICommonAddress[];
}

export default function TabGeneralInfo({ addresses }: TabGeneralInfoProps) {
  return (
    <Fragment>
      <div>
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fz-16 title my-4">Addresses</h6>
        </div>
        <div className="row my-3">
          {addresses.map((address, index) => {
            if (!address.formatted) {
              return null;
            }

            return (
              <AddressDetails key={index} index={index} address={address} />
            );
          })}
        </div>
      </div>
    </Fragment>
  );
}
