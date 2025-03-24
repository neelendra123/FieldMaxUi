import { useCallback, memo } from 'react';

import { BiPencil, BiTrashAlt, BiCopy } from 'react-icons/bi';

import { ICommonAddress } from '../../../interfaces';

import { GoogleMapComp } from '../../../components/Maps';

const AddressAddEditList = ({
  setAddressIndex,

  addresses,
  setAddresses,

  primaryAddressIndex = -1,
  billingAddressIndex = -1,

  errors = {
    primaryAddress: '',
    billingAddress: '',
  },

  className = 'col-md-6 my-3',
}: {
  setAddressIndex: (addressIndex: number) => void;

  addresses: ICommonAddress[];
  setAddresses: (addresses: ICommonAddress[]) => void;

  primaryAddressIndex?: number;
  billingAddressIndex?: number;

  errors?: object & {
    primaryAddress?: string;
    billingAddress?: string;
  };

  className?: string;
}) => {
  const AddressComponent = ({
    index,

    address,
  }: {
    index: number;

    address: ICommonAddress;
  }) => {
    const MemoGoogleMap = useCallback(
      () => <GoogleMapComp marker={address} />,
      [address]
    );

    return (
      <div className={className} key={index}>
        {index === primaryAddressIndex && errors.primaryAddress && (
          <p className="text-danger">
            <small>{errors.primaryAddress}</small>
          </p>
        )}

        {index === billingAddressIndex && errors.billingAddress && (
          <p className="text-danger">
            <small>{errors.billingAddress}</small>
          </p>
        )}

        <div className="d-flex justify-content-between align-items-center">
          <p className="mb-0">{address.name}</p>
          <div>
            <div
              className="light-icon mr-2"
              title="Edit"
              onClick={() => {
                setAddressIndex(index);
              }}
            >
              <BiPencil />
            </div>

            {/* Shortcut to copy primary address to billing address */}
            {index === primaryAddressIndex &&
              billingAddressIndex != -1 &&
              !!address.formatted && (
                <div
                  className="light-icon mr-2"
                  title="Copy to Billing Address"
                  onClick={() => {
                    const newAddresses = [...addresses];

                    newAddresses[billingAddressIndex] = {
                      ...newAddresses[primaryAddressIndex],
                      name: 'Billing',
                    };
                    setAddresses(newAddresses);
                  }}
                >
                  <BiCopy />
                </div>
              )}

            {/* Delete Option visible if not a primary or billing address */}
            {index !== primaryAddressIndex && index !== billingAddressIndex && (
              <div
                className="light-icon"
                title="Delete"
                onClick={() => {
                  setAddresses(
                    addresses.filter((adr, adrIndex) => adrIndex !== index)
                  );
                }}
              >
                <BiTrashAlt />
              </div>
            )}
          </div>
        </div>

        <div className="gray-card mt-3">
          <p>{address.formatted}</p>
          <div className="map-container">
            <MemoGoogleMap />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="row">
      {addresses.map((address, index) => (
        <AddressComponent key={index} index={index} address={address} />
      ))}
    </div>
  );
};

export default memo(AddressAddEditList);
