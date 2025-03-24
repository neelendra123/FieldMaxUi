import { useEffect, useState } from 'react';

import { IRMIntegration } from '../../Integrations/interfaces';
import RentManagerAccountSetting from '../../Integrations/RentManager/RentManagerAccountSetting';

import * as interfaces from '../interfaces';

interface IntegerationsTabProps {
  account: interfaces.IAccountDetails;
  setAccount: (account: interfaces.IAccountDetails) => void;
}

export default function IntegerationsTab({
  account,
  setAccount,
}: IntegerationsTabProps) {
  const [rentManager, setRentManager] = useState<IRMIntegration>(
    account.integrations.rm
  );

  useEffect(() => {
    const rmIntegrations = account.integrations.rm;

    setRentManager(rmIntegrations);
  }, [account]);

  return (
    <div>
      <RentManagerAccountSetting
        rentManager={rentManager}
        updateEffect={(rmIntegration) => {
          //  OnUpdate needs to update the Parent Data
          setAccount({
            ...account,
            integrations: {
              ...account.integrations,
              rm: { ...rmIntegration },
            },
          });
        }}
      />
    </div>
  );
}
