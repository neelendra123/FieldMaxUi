import { Fragment, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { BiPencil } from 'react-icons/bi';
import { AiOutlineDelete } from 'react-icons/ai';
import { useDispatch } from 'react-redux';

import { generateDynamicPath } from '../../../../utils/common';

import { redirectAction } from '../../../../redux/redirects/redirects.actions';

import { UnitsCirleIcon, PolyfillAddIcon } from '../../../../components/Icons';

import PropertyUnitRoutes from '../../../PropertyUnits/routes';
import { IPropertyUnitListAll } from '../../../PropertyUnits/interfaces';

import { googleDirectionPath } from '../../../Address/utils';

import * as interfaces from '../../interfaces';
import PropertyUnitDeletePopup from '../../../PropertyUnits/Commons/PropertyUnitDeletePopup';

interface TabPropertyUnitsProps {
  propertyId: string;

  accountPropertyUnits: IPropertyUnitListAll[];

  propertyUnits: string[];
  setPropertyUnits: (propertyUnits: string[]) => void;

  isFetching: boolean;

  backupDataFunc: (
    newBackup?: interfaces.IPropertyCreateEditBackup,
    newTab?: interfaces.IPropertyCreateUpdateTabsType
  ) => void;

  redirectPath: string | null;
}

export default function TabPropertyUnits({
  propertyId,

  accountPropertyUnits,

  propertyUnits,
  setPropertyUnits,

  isFetching,

  backupDataFunc,

  redirectPath,
}: TabPropertyUnitsProps) {
  const history = useHistory();
  const { pathname } = useLocation();
  const reduxActionDispatch = useDispatch();

  const [unitDeleteId, setUnitDeleteId] = useState('');

  useEffect(() => {
    return () => {
      backupDataFunc(
        undefined,
        interfaces.IPropertyCreateUpdateTabsType.propertyUnits
      );
    };
  }, []);

  return (
    <Fragment>
      <div className="mt-3">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="fz-16">Units</h6>
          {PropertyUnitRoutes.routes.add.access && (
            <button
              className="btn btn-primary"
              onClick={() => {
                //  Adding on Redux Redirect path for redirecting back after editing
                reduxActionDispatch(
                  redirectAction({
                    redirectPath: pathname,
                    kind: 'propertyUnits',
                  })
                );

                const path = generateDynamicPath(
                  PropertyUnitRoutes.routes.add.path,
                  {
                    propertyId,
                  }
                );

                history.push(path, {
                  skipPropertyCheck: true,
                });
              }}
              disabled={isFetching}
            >
              <PolyfillAddIcon className="mr-2" />
              Add New
            </button>
          )}
        </div>
        <div className="mt-3">
          <div className="row">
            {accountPropertyUnits.map((accountPropertyUnit) => {
              const isSelected =
                propertyUnits.indexOf(accountPropertyUnit.id) != -1;

              if (!isSelected) {
                return null;
              }

              return (
                <Fragment key={accountPropertyUnit.id}>
                  <PropertyUnitDeletePopup
                    deleteId={unitDeleteId}
                    setDeleteId={setUnitDeleteId}
                    callBackEffect={async () => {
                      //  Delete A unit from property
                      const newPropertyUnits = propertyUnits.filter(
                        (unitId) => unitId !== accountPropertyUnit.id
                      );

                      setPropertyUnits(newPropertyUnits);
                    }}
                  />

                  <div className="col-md-6 my-3">
                    <div className="card shadow-equal p-3 rounded">
                      <div className="d-flex justify-content-between">
                        {accountPropertyUnit.picURL ? (
                          <img
                            className="account-user-img"
                            src={accountPropertyUnit.picURL}
                            alt={accountPropertyUnit.name}
                            title={accountPropertyUnit.name}
                          />
                        ) : (
                          <UnitsCirleIcon className="self-align-center" />
                        )}

                        <div className="ml-3 flex-grow-1">
                          <h6 className="mb-0 fz-18">
                            {accountPropertyUnit.name}
                          </h6>
                          <p
                            className="mb-0 text-muted ellipsis-2"
                            onClick={() => {
                              const googlePath = googleDirectionPath(
                                accountPropertyUnit.primaryAddress.location
                                  .coordinates[0],
                                accountPropertyUnit.primaryAddress.location
                                  .coordinates[1],
                                accountPropertyUnit.primaryAddress.formatted
                              );

                              window.open(googlePath, '_blank');
                            }}
                          >
                            {accountPropertyUnit.primaryAddress.formatted}
                          </p>
                        </div>
                        <div>
                          <div className="d-flex">
                            <div
                              onClick={() => {
                                //  Adding on Redux Redirect path for redirecting back after editing
                                reduxActionDispatch(
                                  redirectAction({
                                    redirectPath: pathname,
                                    kind: 'propertyUnits',
                                  })
                                );

                                const path = generateDynamicPath(
                                  PropertyUnitRoutes.routes.edit.path,
                                  {
                                    propertyId,
                                    propertyUnitId: accountPropertyUnit.id,
                                  }
                                );

                                history.push(path);
                              }}
                              className="light-icon-sm mr-2 c-pointer"
                            >
                              <BiPencil />
                            </div>

                            {!accountPropertyUnit.isDefault && (
                              <div
                                onClick={() => {
                                  setUnitDeleteId(accountPropertyUnit.id);
                                }}
                                className="light-icon-sm c-pointer"
                              >
                                <AiOutlineDelete />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
