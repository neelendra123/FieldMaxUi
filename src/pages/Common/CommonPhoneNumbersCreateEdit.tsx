import { Fragment } from 'react';
import { BiCheck, BiTrashAlt } from 'react-icons/bi';

import { TextInputComp } from '../../components/Forms';
import { PolyfillAddIcon } from '../../components/Icons';

import * as interfaces from './interfaces';
import * as constants from './constants';

interface CommonPhoneNumbersCreateEditProps {
  className?: string;
  phoneNumbers: interfaces.ICommonPhoneNumber[];
  setPhoneNumbers: (value: interfaces.ICommonPhoneNumber[]) => void;
}

export default function CommonPhoneNumbersCreateEdit({
  className,
  phoneNumbers,
  setPhoneNumbers,
}: CommonPhoneNumbersCreateEditProps) {
  const addRow = () => {
    setPhoneNumbers([
      ...phoneNumbers,
      { ...constants.DefaultCommonPhoneNumber },
    ]);
  };

  const removeRow = (index: number) => {
    // Remove a Row
    const newPhoneNumbers = phoneNumbers.filter(
      (phoneNumber, phoneNumberIndex) => phoneNumberIndex !== index
    );

    setPhoneNumbers([...newPhoneNumbers]);
  };

  const handleChange = (val: string | boolean, key: string, index: number) => {
    const allNumbers: any = [...phoneNumbers];
    allNumbers[index][key] = val;
    setPhoneNumbers(allNumbers);
  };

  return (
    <div className={`${className} col-lg-6 mt-5`}>
      <div className="d-flex justify-content-between align-items-center">
        <h6 className="mb-0 fz-16 ">Phone Numbers</h6>
        <button className="btn btn-primary btn-sm d-flex" onClick={addRow}>
          <PolyfillAddIcon className="mr-2" />
          Add New
        </button>
      </div>

      <div className="general-info-card p-3 mt-3">
        {phoneNumbers.map((phoneNumber, index) => (
          <Fragment key={'number' + index}>
            <div className="row mb-3">
              <div className="col-md-3 mb-3 mb-lg-0">
                <TextInputComp
                  name="name"
                  label="Name"
                  labelClassName="w-100"
                  className="form-control-sm border-0 px-1 mr-2 w-100"
                  onChange={(val, key) => handleChange(val, key, index)}
                  value={phoneNumber.name}
                />
              </div>
              <div className="col-lg-1 col-3 px-3 px-lg-0 mb-3 mb-lg-0">
                <TextInputComp
                  name="extension"
                  label="Ext."
                  type="number"
                  labelClassName="w-100"
                  className="form-control-sm border-0 px-0 mr-2 w-100"
                  onChange={(val, key) => handleChange(val, key, index)}
                  value={phoneNumber.extension}
                  min={0}
                />
              </div>
              <div className="col-lg-3 col-9 mb-3 mb-lg-0">
                <TextInputComp
                  name="phoneNumber"
                  label="Phone No."
                  labelClassName="w-100"
                  className="form-control-sm border-0 px-1 mr-2 w-100"
                  onChange={(val, key) => handleChange(val, key, index)}
                  value={phoneNumber.phoneNumber}
                />
              </div>
              <div className="col-md-3 d-flex d-lg-block mb-3 mb-lg-0">
                <div
                  onClick={() => {
                    const makingDefault = !phoneNumbers[index].default;

                    //  There can only be one default, converting other numbers to non default
                    const newPhoneNumbers = phoneNumbers.map(
                      (phoneNumber, phoneNumberIndex) => {
                        if (phoneNumberIndex === index) {
                          phoneNumber.default = makingDefault;
                        } else if (makingDefault) {
                          phoneNumber.default = false;
                        }

                        return phoneNumber;
                      }
                    );

                    setPhoneNumbers(newPhoneNumbers);
                  }}
                  className={`max-checkbox mr-2 c-pointer p-0`}
                >
                  <div className="check">
                    {phoneNumber.default && <BiCheck />}
                  </div>
                  <p className="mb-0 fz-8">Default</p>
                </div>
                <div
                  onClick={() => {
                    handleChange(
                      !phoneNumbers[index].textMessage,
                      'textMessage',
                      index
                    );
                  }}
                  className="max-checkbox c-pointer p-0"
                >
                  <div className="check">
                    {phoneNumber.textMessage && <BiCheck />}
                  </div>
                  <p className="mb-0 fz-8">Text Message</p>
                </div>
              </div>
              {!!index && (
                <div className="col-md-2 mb-3 mb-lg-0 d-flex align-items-center">
                  <div
                    className="light-icon"
                    onClick={() => {
                      removeRow(index);
                    }}
                  >
                    <BiTrashAlt />
                  </div>
                </div>
              )}
            </div>
            <div className="divider-gray" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
