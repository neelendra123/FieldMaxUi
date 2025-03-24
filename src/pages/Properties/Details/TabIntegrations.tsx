import { Fragment } from 'react';
import { BiCheck } from 'react-icons/bi';

import * as interfaces from '../interfaces';

interface TabIntegrationsProps {
  rm: interfaces.IPropertyRMIntegrations;
}

export default function TabIntegrations({ rm }: TabIntegrationsProps) {
  return (
    <Fragment>
      <div className="card shadow-equal rounded-sm my-3 p-2">
        <div className="max-checkbox ml-3 c-pointer">
          <div className="check">{rm.enabled && <BiCheck fontSize="16" />}</div>
          <h6 className="fz-14 mb-0">Sync With RM</h6>
        </div>
        {rm.enabled && <div className="m-3"></div>}
      </div>
    </Fragment>
  );
}
