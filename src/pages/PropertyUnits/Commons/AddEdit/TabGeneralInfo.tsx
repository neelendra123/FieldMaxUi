import { Fragment } from 'react';

import { ICommonAddress } from '../../../../interfaces';

import { PolyfillAddIcon } from '../../../../components/Icons';

import { AddressAddEditList } from '../../../Address';

interface TabGeneralInfoProps {
  setAddressIndex: (addressIndex: number) => void;

  addresses: ICommonAddress[];
  setAddresses: (addresses: ICommonAddress[]) => void;

  addressAddEvent: () => void;

  errors: object;
}

export default function TabGeneralInfo({
  setAddressIndex,

  addresses,
  setAddresses,

  addressAddEvent,

  errors,
}: TabGeneralInfoProps) {
  return (
    <Fragment>
      <div>
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fz-16 title my-4">Addresses</h6>
          <div>
            <button
              className="btn btn-primary btn-sm d-flex"
              onClick={addressAddEvent}
            >
              <PolyfillAddIcon className="mr-2" />
              Add New
            </button>
          </div>
        </div>

        <AddressAddEditList
          setAddressIndex={setAddressIndex}
          addresses={addresses}
          setAddresses={setAddresses}
          primaryAddressIndex={0}
          errors={errors}
        />
      </div>
    </Fragment>
  );
}
