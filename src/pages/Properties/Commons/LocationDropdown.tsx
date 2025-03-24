import { Fragment } from 'react';
import AsyncSelect from 'react-select/async';

import { ICommonAddress } from '../../../interfaces';

import { generateUniqueId } from '../../../utils/common';

import {
  LocationRoundedIcon,
  PropertiesCircleIcon,
  PolyfillAddIcon,
} from '../../../components/Icons';

import * as services from '../services';
import * as interfaces from '../interfaces';

enum OptionType {
  GOOGLE = 'GOOGLE',
  LOCAL = 'LOCAL',
}

interface PropertyLocationDropdownProps {
  address: ICommonAddress;
  setAddress: (address: ICommonAddress) => void;

  // onSelectEffect: (address: ICommonAddress) => void;
  onSelectEffect: (data: {
    propertyId: string;
    propertyUnitId: string;
    // address: ICommonAddress;
  }) => void;

  backupData: (data: any) => void;
}

export default function PropertyLocationDropdown({
  address,
  setAddress,

  onSelectEffect,

  backupData,
}: PropertyLocationDropdownProps) {
  const fetchLocationData = async (search: string) => {
    try {
      //  Only searching if typed 2 characters
      if (search.length < 2) {
        return [];
      }

      const response = await services.propertiesListAllService(search, true);

      const properties = response.records.map((record) => ({
        type: OptionType.LOCAL,
        record,
      }));
      const googlePlaces = response.googleRecords.map((record) => ({
        type: OptionType.GOOGLE,
        record,
      }));

      return [...properties, ...googlePlaces];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const CustomOptionComp = ({ innerRef, innerProps, data, setValue }: any) => {
    const property: interfaces.IPropertyListAll = data?.record;
    const googlePlace: ICommonAddress = data?.record;

    return (
      <div
        ref={innerRef}
        {...innerProps}
        key={generateUniqueId()}
        className="border-bottom-light c-pointer"
      >
        {data.type === OptionType.GOOGLE && (
          <div
            className="d-flex py-3 align-items-center"
            onClick={(e) => {
              e.stopPropagation();

              setValue({
                ...googlePlace,
                propertyId: '',
                propertyUnitId: '',
              });
            }}
          >
            <div>
              <LocationRoundedIcon />
            </div>
            <p className="mb-0 ellipsis-2 ml-2 lh-1">{googlePlace.formatted}</p>

            <button
              className="btn btn-primary btn-sm d-flex mr-2 my-2 w-md-100"
              onClick={() => {
                backupData({
                  ...googlePlace,
                });
              }}
            >
              <PolyfillAddIcon className="mr-2" />
              Add New
            </button>
          </div>
        )}

        {data.type === OptionType.LOCAL && (
          <Fragment>
            <div
              className="d-flex py-3 align-items-center"
              onClick={(e) => {
                e.stopPropagation();

                setValue({
                  ...property.primaryAddress,
                  propertyId: property.id,
                  propertyUnitId: '',
                });

                //Updating parent component value
                onSelectEffect({
                  propertyId: property.id,
                  propertyUnitId: '',
                  // address: property.primaryAddress,
                });
              }}
            >
              <PropertiesCircleIcon />
              <div className="ml-2">
                <b>{property.name}</b>
                <p className="mb-0 mt-1 ellipsis-2 lh-1">
                  {property.primaryAddress?.formatted}
                </p>
              </div>
            </div>
            {property.propertyUnits.map((propertyUnit) => (
              <div
                className="p-2 bg-light py-2 mb-2"
                key={propertyUnit.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setValue({
                    ...propertyUnit.primaryAddress,
                    propertyId: property.id,
                    propertyUnitId: propertyUnit.id,
                  });

                  //Updating parent component value
                  onSelectEffect({
                    propertyId: property.id,
                    propertyUnitId: propertyUnit.id,
                    // address: propertyUnit.primaryAddress,
                  });
                }}
              >
                <b className="mb-2 fz-12">{propertyUnit.name}</b>
                <p className="mb-0 fz-12 ellipsis-2 lh-1">
                  {propertyUnit.primaryAddress.formatted}
                </p>
              </div>
            ))}
          </Fragment>
        )}
      </div>
    );
  };

  return (
    <AsyncSelect
      id="address"
      name="address"
      placeholder="Search Property & Units"
      components={{ Option: CustomOptionComp }}
      //@ts-ignore
      loadOptions={fetchLocationData}
      value={{ label: address?.formatted }}
      onChange={(e: any) => setAddress(e)}
      styles={{
        menu: (provided: any) => ({
          ...provided,
          paddingLeft: 15,
          paddingRight: 15,
        }),
        control: (provided: any) => ({
          ...provided,
          backgroundColor: '#f8f8f8',
          border: 'none',
          paddingBlock: 3,
        }),
      }}
    />
  );
}
