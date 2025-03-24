import { Fragment } from 'react';
import { BiCheck } from 'react-icons/bi';

import { ICommonAddress } from '../../../interfaces';

import { ICommonEmail, ICommonPhoneNumber } from '../../Common/interfaces';

import { AddressDetails } from '../../Address';

interface TabGeneralInfoProps {
  emails: ICommonEmail[];

  phoneNumbers: ICommonPhoneNumber[];

  addresses: ICommonAddress[];
}

export default function TabGeneralInfo({
  emails,
  phoneNumbers,
  addresses,
}: TabGeneralInfoProps) {
  return (
    <Fragment>
      <div className="row general-info-container">
        <div className="col-lg-6 mt-5">
          <h6 className="mb-0 fz-16 title">Emails</h6>
          {emails.map((email, index) => (
            <Fragment key={index}>
              <div className="card rounded shadow-equal p-3 mt-3">
                <b>{email.type}</b>
                <p className="mb-0">{email.email}</p>
              </div>
            </Fragment>
          ))}
        </div>
        <div className="col-lg-6 mt-5">
          <h6 className="mb-0 fz-16 title">Phone</h6>
          {phoneNumbers.map((phoneNumber, index) => (
            <div className="card rounded shadow-equal p-3 mt-3" key={index}>
              <b>{phoneNumber.name}</b>
              <div className="d-lg-flex d-sm-block">
                <p className="mb-0 mr-2">
                  {phoneNumber.extension} {phoneNumber.phoneNumber}
                </p>
                <div className="mb-0 d-flex">
                  {phoneNumber.default && (
                    <div className="max-checkbox my-0 mr-2 c-pointer p-0">
                      <div className="check">
                        <BiCheck />
                      </div>
                      <p className="mb-0 fz-8">Default</p>
                    </div>
                  )}

                  {phoneNumber.textMessage && (
                    <div className="max-checkbox my-0 c-pointer p-0">
                      <div className="check">
                        <BiCheck />
                      </div>
                      <p className="mb-0 fz-8">Text Message</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
