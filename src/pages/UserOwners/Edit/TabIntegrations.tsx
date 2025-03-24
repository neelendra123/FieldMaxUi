import { Fragment, useEffect } from 'react';
import { BiCheck } from 'react-icons/bi';

import { TextInputComp } from '../../../components/Forms';

import * as interfaces from '../interfaces';

interface TabIntegrationsProps {
  rm: interfaces.IUserOwnerRMIntegrations;
  setRM: (rmFields: interfaces.IUserOwnerRMIntegrations) => void;

  backupDataFunc: () => void;

  errors: Record<string, string>;
}

export default function TabIntegrations({
  errors,
  rm,
  setRM,
  backupDataFunc,
}: TabIntegrationsProps) {
  const onUpdateEffect = (value: string, key: string) => {
    setRM({
      ...rm,
      [key]: value,
    });
  };

  useEffect(() => {
    backupDataFunc();
  }, [rm]);

  return (
    <Fragment>
      <div className="card shadow-equal rounded-sm my-3 p-2">
        <div
          className="max-checkbox ml-3 c-pointer"
          onClick={() => {
            setRM({
              ...rm,
              enabled: !rm.enabled,
            });
          }}
        >
          <div className="check">{rm.enabled && <BiCheck fontSize="16" />}</div>
          <h6 className="fz-14 mb-0">Sync With RM</h6>
        </div>
        {rm.enabled && (
          <div className="m-3">
            {errors.rm && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                {errors.rm}
                <button
                  type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            )}

            <TextInputComp
              name="displayName"
              label="Display Name *"
              placeholder="Display Name *"
              className="form-control form-control-sm"
              value={rm.displayName}
              onChange={(value: string) => {
                onUpdateEffect(value, 'displayName');
              }}
            />
          </div>
        )}
      </div>
    </Fragment>
  );
}
