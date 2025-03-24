import { useEffect } from 'react';

import { ICommonAddress } from '../../../../interfaces';

import { PolyfillAddIcon } from '../../../../components/Icons';

import { AddressAddEditList } from '../../../Address';

import * as interfaces from '../../interfaces';

interface TabGeneralInfoProps {
  backupDataFunc: (
    newBackup?: interfaces.IPropertyCreateEditBackup,
    newTab?: interfaces.IPropertyCreateUpdateTabsType
  ) => void;

  setAddressIndex: (addressIndex: number) => void;

  addresses: ICommonAddress[];
  setAddresses: (addresses: ICommonAddress[]) => void;

  addressAddEvent: () => void;

  errors: object;
}

export default function ({
  backupDataFunc,

  setAddressIndex,

  addresses,
  setAddresses,

  addressAddEvent,

  errors,
}: TabGeneralInfoProps) {
  useEffect(() => {
    return () => {
      backupDataFunc(
        undefined,
        interfaces.IPropertyCreateUpdateTabsType.generalInfo
      );
    };
  }, []);

  return (
    <div className="my-3">
      <div className="d-flex align-items-center justify-content-between ">
        <h6 className="mb-0">Address</h6>
        <button className="btn btn-primary" onClick={addressAddEvent}>
          <PolyfillAddIcon className="mr-2" /> Add Address
        </button>
      </div>
      <AddressAddEditList
        setAddressIndex={setAddressIndex}
        addresses={addresses}
        setAddresses={setAddresses}
        primaryAddressIndex={0}
        billingAddressIndex={1}
        errors={errors}
      />
    </div>
  );
}
