import { Fragment } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';

import { googleDirectionPath } from '../../Address/utils';

import * as interfaces from '../interfaces';

interface TabPropertiesProps {
  accountProperties: interfaces.IUserOwnerPropertiesListAll[];
  setAccountProperties: (
    accountProperties: interfaces.IUserOwnerPropertiesListAll[]
  ) => void;
}

export default function TabProperties({
  accountProperties,
  setAccountProperties,
}: TabPropertiesProps) {
  return (
    <div className="mt-4">
      <div className="owner-property-tab mb-5">
        <div className=" d-block d-lg-flex  justify-content-between p-3 align-items-center">
          <h6 className="mb-0 fz-18 my-2">Owned Properties</h6>
        </div>

        <div className="property-header">
          <div className="row">
            <p className="mb-0 col-4">Property Name</p>
            <p className="mb-0 col-4">Address</p>
            <p className="mb-0 col-4 px-0 d-flex pr-5 justify-content-end ">
              Action
            </p>
          </div>
        </div>
        {/* if there is no data in table  */}
        {!accountProperties.filter(
          (accountProperty) => accountProperty.isSelected
        ).length && (
          <div className="py-3">
            <p className="text-center mb-0 text-muted">NO DATA</p>
          </div>
        )}
        {/* if there is no data in table  */}
        <div className="p-3">
          {accountProperties.map((property, propertyIndex) => {
            if (!property.isSelected) {
              return null;
            }

            return (
              <Fragment key={property.id}>
                {/* for web */}
                <div className="row p-3 d-lg-flex">
                  <p className="mb-0 col-4 ellipsis-2">
                    {property.name} ({property.shortName})
                  </p>
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
                    </div>
                  </div>
                </div>
                {property.showUnits && (
                  <div className="list-property bg-white mx-0 mx-md-5 my-3 p-3 border-radius-10">
                    <div className="d-block d-lg-flex justify-content-between align-items-center">
                      <h6 className="mb-0 ">Units</h6>
                    </div>

                    {/* Units List */}
                    {property.propertyUnits.map((unit) => {
                      let unitSelected =
                        property.selectedUnits.indexOf(unit.id) !== -1;

                      return !unitSelected ? null : (
                        <div className="d-flex py-3 light-border" key={unit.id}>
                          <div className="d-flex ">
                            <div className=" ellipsis-2 font-weight-bold">
                              {unit.name}
                            </div>
                            <div
                              className="ml-3 ellipsis-2 lh-22"
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
                <hr />
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
