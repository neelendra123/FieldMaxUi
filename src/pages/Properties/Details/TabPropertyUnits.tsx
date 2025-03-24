import { useHistory } from 'react-router-dom';

import { UnitsCirleIcon } from '../../../components/Icons';
import { generateDynamicPath } from '../../../utils/common';

// import { googleDirectionPath } from '../../Address/utils';

import { IPropertyUnitPopulated } from '../../PropertyUnits/interfaces';
import PropertyUnitRoutes from '../../PropertyUnits/routes';

interface ITabPropertyUnitsProps {
  propertyId: string;
  propertyUnits: IPropertyUnitPopulated[];
}

export default function TabPropertyUnits({
  propertyId,
  propertyUnits,
}: ITabPropertyUnitsProps) {
  const history = useHistory();

  const propertyUnitDetailsRedirect = (propertyUnitId: string) => {
    const path = generateDynamicPath(PropertyUnitRoutes.routes.detail.path, {
      propertyId,
      propertyUnitId,
    });

    history.push(path);
  };

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between align-items-center">
        <h6 className="fz-16">Units</h6>
      </div>
      <div className="mt-3">
        <div className="row">
          {propertyUnits.map((propertyUnit) => {
            return (
              <div className="col-md-6 my-3" key={propertyUnit.id}>
                <div className="card shadow-equal p-3 rounded">
                  <div className="d-flex justify-content-between">
                    {propertyUnit.picURL ? (
                      <img
                        className="account-user-img"
                        src={propertyUnit.picURL}
                        alt={propertyUnit.name}
                        title={propertyUnit.name}
                        onClick={() =>
                          propertyUnitDetailsRedirect(propertyUnit.id)
                        }
                      />
                    ) : (
                      <UnitsCirleIcon className="min-30 self-align-center" />
                    )}
                    <div
                      className="ml-3 flex-grow-1"
                      onClick={() =>
                        propertyUnitDetailsRedirect(propertyUnit.id)
                      }
                    >
                      <h6 className="mb-0 fz-18">{propertyUnit.name}</h6>
                      <p
                        className="mb-0 text-muted ellipsis-2"
                        // onClick={() => {
                        //   const googlePath = googleDirectionPath(
                        //     propertyUnit.primaryAddress.location.coordinates[0],
                        //     propertyUnit.primaryAddress.location.coordinates[1]
                        //   );

                        //   window.open(googlePath, '_blank');
                        // }}
                      >
                        {propertyUnit.primaryAddress.formatted}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
