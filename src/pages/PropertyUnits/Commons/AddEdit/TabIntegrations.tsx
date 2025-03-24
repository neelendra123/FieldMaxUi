import { Fragment } from 'react';
import { BiCheck } from 'react-icons/bi';

import * as interfaces from '../../interfaces';

interface TabIntegrationsProps {
  rm: interfaces.IPropertyUnitRMIntegrations;
  setRM: (rmFields: interfaces.IPropertyUnitRMIntegrations) => void;

  errors: Record<string, string>;
}

export default function TabIntegrations({
  errors,
  rm,
  setRM,
}: TabIntegrationsProps) {
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
          </div>
        )}
      </div>
    </Fragment>
  );
}
