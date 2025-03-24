import { Fragment, useEffect, useState } from 'react';
import Select from 'react-select';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { FiTrash } from 'react-icons/fi';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { BiCheck } from 'react-icons/bi';

import { IModuleKind } from '../../../interfaces';

import { generateDynamicPath } from '../../../utils/common';

import { redirectAction } from '../../../redux/redirects/redirects.actions';

import { Popup } from '../../../components/Common';
import { PolyfillAddIcon } from '../../../components/Icons';

import { googleDirectionPath } from '../../Address/utils';

import PropertyRoutes from '../../Properties/routes';
import PropertyUnitRoutes from '../../PropertyUnits/routes';

import * as interfaces from '../interfaces';

interface TabPropertiesProps {
  accountProperties: interfaces.IUserOwnerPropertiesListAll[];
  setAccountProperties: (
    accountProperties: interfaces.IUserOwnerPropertiesListAll[]
  ) => void;

  properties: interfaces.IUserOwnerProperty[];
  setProperties: (properties: interfaces.IUserOwnerProperty[]) => void;

  backupDataFunc: (
    newBackup?: interfaces.IUserOwnerCreateEditBackup,
    newTab?: interfaces.IOwnerCreateUpdateTabsType
  ) => void;

  isFetching: boolean;

  redirectPath?: string;
}

export default function TabProperties({
  accountProperties,
  setAccountProperties,

  properties,
  setProperties,

  backupDataFunc,

  isFetching,

  redirectPath,
}: TabPropertiesProps) {
  const history = useHistory();
  const { pathname } = useLocation();
  const reduxActionDispatch = useDispatch();

  const [addPopUp, setAddPopUp] = useState(false);

  useEffect(() => {
    const userOwnerProperitesCache: Record<string, string[]> = {};
    properties.forEach((prop) => {
      userOwnerProperitesCache[prop.propertyId] = prop.propertyUnits;
    });

    const newAccountProperties = accountProperties.map((accountProperty) => {
      if (userOwnerProperitesCache[accountProperty.id]) {
        accountProperty.isSelected = true;
        accountProperty.selectedUnits =
          userOwnerProperitesCache[accountProperty.id];
      } else {
        accountProperty.isSelected = false;
        accountProperty.selectedUnits = [];
      }

      return accountProperty;
    });

    setAccountProperties(newAccountProperties);

    backupDataFunc(undefined, interfaces.IOwnerCreateUpdateTabsType.properties);
  }, [properties]);

  const AddFromExistingPropertiesComp = () => {
    const [selectedOptions, setSelectedOptions] = useState<
      interfaces.IUserOwnerPropertiesListAll[]
    >([]);

    const onSave = () => {
      const newProperties = [...properties];

      selectedOptions.forEach((selectedOption) => {
        newProperties.push({
          propertyId: selectedOption.id,
          propertyUnits: selectedOption.propertyUnits.map(
            (propertyUnit) => propertyUnit.id
          ),
        });
      });

      setProperties(newProperties);

      setAddPopUp(false);
    };

    return (
      <Popup
        isOpen={addPopUp}
        title="Add Properties"
        hideButton={true}
        onClose={() => setAddPopUp(false)}
        ModalName="Add Properties"
        addClassToWrapper="card-media-box"
        leftItemViewOnlyClass="flex-space-center"
      >
        <div className="text-left">
          <div>
            <div className="form-group">
              <label htmlFor="properties">Select Properties</label>
              <Select
                isMulti
                name="properties"
                styles={{
                  valueContainer: (provided, state) => {
                    return {
                      ...provided,
                      paddingLeft: 16,
                    };
                  },
                }}
                options={accountProperties.filter(
                  (property) => !property.isSelected
                )}
                onChange={(values: any) => {
                  setSelectedOptions(values);
                }}
              />
            </div>

            <div>
              <button className="btn btn-primary w-100 mt-2" onClick={onSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </Popup>
    );
  };

  return (
    <div className="mt-4">
      <AddFromExistingPropertiesComp />

      <div className="owner-property-tab mb-5">
        <div className="d-block d-lg-flex justify-content-between p-3 align-items-center">
          <h6 className="mb-0 fz-18 my-2">Owned Properties</h6>
          <div className="d-block d-lg-flex">
            {PropertyRoutes.routes.add.access && (
              <button
                className="btn btn-primary btn-sm d-flex mr-2 my-2 w-md-100"
                onClick={() => {
                  //  Adding on Redux Redirect path for redirecting back after creation
                  reduxActionDispatch(
                    redirectAction({
                      redirectPath: pathname,
                      kind: IModuleKind.properties,
                    })
                  );
                  history.push(PropertyRoutes.routes.add.path);
                }}
                disabled={isFetching}
              >
                <PolyfillAddIcon className="mr-2" />
                Add New
              </button>
            )}

            <button
              className="btn btn-primary btn-sm d-flex my-2 w-md-100"
              onClick={() => setAddPopUp(true)}
              disabled={isFetching}
            >
              <PolyfillAddIcon className="mr-2" />
              Add From Existing Properties
            </button>
          </div>
        </div>

        <div className="property-header">
          <div className="row">
            <p className="mb-0 col-4">Property Name</p>
            <p className="mb-0 col-4">Address</p>
            <p className="mb-0 col-4 px-0 d-flex pr-5 justify-content-end">
              Action
            </p>
          </div>
        </div>

        {!!!accountProperties.length ? (
          <div className="py-3">
            {/* if there is no data in table */}
            <p className="text-center mb-0 text-muted">NO DATA</p>
          </div>
        ) : (
          <div className="p-3">
            {/* if data is available use this map */}
            {accountProperties.map((property, propertyIndex) => {
              if (!property.isSelected) {
                return null;
              }

              return (
                <Fragment key={property.id}>
                  {/* for web */}
                  <div className="row p-3 d-lg-flex">
                    <p className="mb-0 col-4 ellipsis-2">{property.label}</p>
                    <p
                      className="mb-0 col-4 ellipsis-2 lh-22"
                      onClick={() => {
                        const googlePath = googleDirectionPath(
                          property.primaryAddress.location.coordinates[0],
                          property.primaryAddress.location.coordinates[1],
                          property.primaryAddress.formatted
                        );

                        window.open(googlePath, '_blank');
                      }}
                    >
                      {property.primaryAddress.formatted}
                    </p>
                    <div className="col-4">
                      <div className="d-flex justify-content-end">
                        <div
                          className="light-icon mr-3"
                          onClick={() => {
                            //  Toggling Units Expand and Collapse
                            const newAccountProperties = [...accountProperties];

                            newAccountProperties[propertyIndex].showUnits =
                              !newAccountProperties[propertyIndex].showUnits;

                            setAccountProperties(newAccountProperties);
                          }}
                        >
                          {property.showUnits ? (
                            <BsChevronUp />
                          ) : (
                            <BsChevronDown />
                          )}
                        </div>
                        <div
                          className="light-icon"
                          onClick={() => {
                            //Removing Selected Property
                            const newProperties = properties.filter(
                              (prop) => prop.propertyId !== property.id
                            );

                            setProperties(newProperties);
                          }}
                        >
                          <FiTrash />
                        </div>
                      </div>
                    </div>
                  </div>
                  {property.showUnits && (
                    <div className="list-property bg-white mx-0 mx-md-5 my-3 p-3 border-radius-10">
                      <div className="d-block d-lg-flex justify-content-between align-items-center">
                        <h6 className="mb-0">Units</h6>

                        <div className="d-block d-lg-flex">
                          {PropertyUnitRoutes.routes.add.access && (
                            <button
                              className="btn btn-primary btn-sm d-flex mr-2 my-2 w-md-100"
                              onClick={() => {
                                //  Adding on Redux Redirect path for redirecting back after creation
                                reduxActionDispatch(
                                  redirectAction({
                                    redirectPath: pathname,
                                    kind: IModuleKind.properties,
                                  })
                                );

                                const path = generateDynamicPath(
                                  PropertyUnitRoutes.routes.add.path,
                                  {
                                    propertyId: property.id,
                                  }
                                );

                                history.push(path);
                              }}
                              disabled={isFetching}
                            >
                              <PolyfillAddIcon className={'mr-2'} />
                              Add New Unit
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Units List */}
                      {property.propertyUnits.map((unit) => {
                        const unitSelected =
                          property.selectedUnits.indexOf(unit.id) !== -1;

                        return (
                          <div
                            className="d-flex py-3 light-border"
                            key={unit.id}
                          >
                            <div className="max-checkbox c-pointer">
                              <div
                                className="check"
                                onClick={(e) => {
                                  const newProperties = properties.map(
                                    (prop) => {
                                      if (prop.propertyId === property.id) {
                                        //Deleting the selected property
                                        let selectedUnitIds =
                                          prop.propertyUnits;

                                        if (unitSelected) {
                                          prop.propertyUnits =
                                            selectedUnitIds.filter(
                                              (selectedUnitId) =>
                                                unit.id !== selectedUnitId
                                            );
                                        } else {
                                          prop.propertyUnits = [
                                            ...selectedUnitIds,
                                            unit.id,
                                          ];
                                        }
                                      }

                                      return prop;
                                    }
                                  );

                                  setProperties(newProperties);
                                }}
                              >
                                {unitSelected && <BiCheck className="fs-18" />}
                              </div>
                            </div>

                            <div>
                              <div className="ellipsis-2 font-weight-bold">
                                {unit.name}
                              </div>
                              <div
                                className="ellipsis-2 lh-22"
                                onClick={() => {
                                  const googlePath = googleDirectionPath(
                                    unit.primaryAddress.location.coordinates[0],
                                    unit.primaryAddress.location.coordinates[1],
                                    unit.primaryAddress.formatted
                                  );

                                  window.open(googlePath, '_blank');
                                }}
                              >
                                {unit.primaryAddress.formatted}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
