import { Fragment } from 'react';
import { BiTrashAlt } from 'react-icons/bi';

import { TextInputComp } from '../../components/Forms';
import { PolyfillAddIcon } from '../../components/Icons';

import * as interfaces from './interfaces';
import * as constants from './constants';

interface CommonEmailsCreateEditProps {
  className?: string;

  emails: interfaces.ICommonEmail[];
  setEmails: (emails: interfaces.ICommonEmail[]) => void;
}

export default function CommonEmailsCreateEdit({
  className,

  emails,
  setEmails,
}: CommonEmailsCreateEditProps) {
  const addRow = () => {
    setEmails([...emails, { ...constants.DefaultCommonEmail }]);
  };

  const removeRow = (index: number) => {
    // Remove a Row
    const newEmails = emails.filter(
      (email, emailIndex) => emailIndex !== index
    );

    setEmails([...newEmails]);
  };

  return (
    <div className={`${className} mt-5`}>
      <div className="d-flex justify-content-between align-items-center">
        <h6 className="mb-0 fz-16 title">Emails</h6>
        <button className="btn btn-primary btn-sm d-flex" onClick={addRow}>
          <PolyfillAddIcon className="mr-2" />
          Add New
        </button>
      </div>

      <div className="general-info-card p-3 mt-3">
        {emails.map((email, index) => (
          <Fragment key={'email' + index}>
            <div className="row mb-3">
              <div className="col-md-5 mb-3 mb-lg-0">
                <TextInputComp
                  name="type"
                  label="Types"
                  labelClassName="w-100"
                  className="form-control-sm border-0 px-2 w-100"
                  onChange={(value) => {
                    const newEmails = [...emails];
                    newEmails[index].type = value;

                    setEmails(newEmails);
                  }}
                  value={email.type}
                />
              </div>
              <div className="col-md-5">
                <TextInputComp
                  name="email"
                  label="Email"
                  type="email"
                  labelClassName="w-100"
                  className="form-control-sm border-0 px-2 w-100"
                  onChange={(value) => {
                    const newEmails = [...emails];
                    newEmails[index].email = value;

                    setEmails(newEmails);
                  }}
                  value={email.email}
                />
              </div>
              {!!index && (
                <div className="col-md-2 d-flex align-items-end mt-3 mb-1">
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
