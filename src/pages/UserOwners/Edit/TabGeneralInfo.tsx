import { Fragment, useEffect } from 'react';

import { ICommonAddress } from '../../../interfaces';

import { PolyfillAddIcon } from '../../../components/Icons';

import { ICommonPhoneNumber, ICommonEmail } from '../../Common/interfaces';
import {
  CommonPhoneNumbersCreateEdit,
  CommonEmailsCreateEdit,
} from '../../Common';

import { AddressAddEditList } from '../../Address';

interface TabGeneralInfoProps {
  backupDataFunc: () => void;

  setAddressIndex: (addressIndex: number) => void;

  emails: ICommonEmail[];
  setEmails: (emails: ICommonEmail[]) => void;

  phoneNumbers: ICommonPhoneNumber[];
  setPhoneNumbers: (phoneNumbers: ICommonPhoneNumber[]) => void;

  addresses: ICommonAddress[];
  setAddresses: (addresses: ICommonAddress[]) => void;

  addressAddEvent: () => void;

  errors: object;
}

export default function TabGeneralInfo({
  backupDataFunc,

  setAddressIndex,

  emails,
  setEmails,

  addresses,
  setAddresses,

  addressAddEvent,

  phoneNumbers,
  setPhoneNumbers,

  errors,
}: TabGeneralInfoProps) {
  useEffect(() => {
    return () => {
      backupDataFunc();
    };
  }, []);

  return (
    <Fragment>
      <div className="row general-info-container">
        <CommonEmailsCreateEdit
          className="col-lg-6"
          emails={emails}
          setEmails={setEmails}
        />
        <CommonPhoneNumbersCreateEdit
          className="col-lg-6"
          phoneNumbers={phoneNumbers}
          setPhoneNumbers={setPhoneNumbers}
        />
      </div>

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
          billingAddressIndex={1}
          errors={errors}
        />
      </div>
    </Fragment>
  );
}
