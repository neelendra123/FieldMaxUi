import { TextInputComp } from '../../../components/Forms';

import * as interfaces from '../interfaces';

interface TabIntegrationsProps {
  rm: interfaces.IUserOwnerRMIntegrations;
}

export default function TabIntegrations({ rm }: TabIntegrationsProps) {
  return (
    <div>
      <div className="card shadow-equal p-3 rounded">
        <h6 className="fz-16 mb-1">Rent Manager</h6>
        <TextInputComp
          label="Display Name *"
          className="form-control form-control-sm"
          name="displayName"
          value={rm.displayName}
          disabled
        />
      </div>
    </div>
  );
}
