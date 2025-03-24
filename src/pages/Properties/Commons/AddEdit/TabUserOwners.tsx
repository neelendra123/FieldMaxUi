import { Fragment, useState, useEffect } from 'react';
import Select from 'react-select';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiTrash } from 'react-icons/fi';

import { IModuleKind } from '../../../../interfaces';

import { redirectAction } from '../../../../redux/redirects/redirects.actions';

import { Popup } from '../../../../components/Common';

import { PolyfillAddIcon } from '../../../../components/Icons';

import UserOwnerRoutes from '../../../UserOwners/routes';

import * as interfaces from '../../interfaces';

interface TabUserOwnersProps {
  accountUserOwners: interfaces.IPropertyUserOwnersListAll[];
  setAccountUserOwners: (
    accountUserOwners: interfaces.IPropertyUserOwnersListAll[]
  ) => void;

  userOwners: string[];
  setUserOwners: (access: string[]) => void;

  backupDataFunc: (
    newBackup?: interfaces.IPropertyCreateEditBackup,
    newTab?: interfaces.IPropertyCreateUpdateTabsType
  ) => void;

  isFetching: boolean;

  redirectPath: string | null;
}

export default function TabUserOwners({
  accountUserOwners,
  setAccountUserOwners,

  userOwners,
  setUserOwners,

  backupDataFunc,

  isFetching,

  redirectPath,
}: TabUserOwnersProps) {
  const history = useHistory();
  const { pathname } = useLocation();
  const reduxActionDispatch = useDispatch();

  const [addPopUp, setAddPopUp] = useState(false);

  useEffect(() => {
    const userOwnerProperitesCache: Record<string, boolean> = {};
    userOwners.forEach((userOwner) => {
      userOwnerProperitesCache[userOwner] = true;
    });

    const newAccountUserOwners = accountUserOwners.map((accountUserOwner) => {
      if (userOwnerProperitesCache[accountUserOwner.id]) {
        accountUserOwner.isSelected = true;
      } else {
        accountUserOwner.isSelected = false;
      }

      return accountUserOwner;
    });

    setAccountUserOwners(newAccountUserOwners);

    backupDataFunc(
      undefined,
      interfaces.IPropertyCreateUpdateTabsType.userOwners
    );
  }, [userOwners]);

  const AddFromExistingComp = () => {
    const [selectedOptions, setSelectedOptions] = useState<
      interfaces.IPropertyUserOwnersListAll[]
    >([]);

    const onSave = () => {
      const newUserOwners = [...userOwners];
      selectedOptions.forEach((selectedOption) => {
        newUserOwners.push(selectedOption.id);
      });
      setUserOwners(newUserOwners);
      setAddPopUp(false);
    };

    return (
      <Popup
        isOpen={addPopUp}
        title="Add Owner"
        hideButton={true}
        onClose={() => setAddPopUp(false)}
        ModalName="Add Owner"
        addClassToWrapper="card-media-box"
        leftItemViewOnlyClass="flex-space-center"
      >
        <div className="text-left">
          <div>
            <div className="form-group">
              <label htmlFor="properties">Select Owner</label>
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
                options={accountUserOwners.filter((row) => !row.isSelected)}
                onChange={(values: any) => {
                  setSelectedOptions(values);
                }}
              />
            </div>

            <div>
              <button
                className="btn btn-primary w-100 mt-2"
                onClick={onSave}
                disabled={isFetching}
              >
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
      <AddFromExistingComp />

      <div className="owner-property-tab mb-5">
        <div className=" d-block d-lg-flex justify-content-between p-3 align-items-center">
          <h6 className="mb-0 fz-18 my-2">Owners</h6>
          <div className="d-block d-lg-flex">
            <button
              className="btn btn-primary btn-sm d-flex mr-2 my-2 w-md-100"
              onClick={() => {
                //  Adding on Redux Redirect path for redirecting back after creation
                reduxActionDispatch(
                  redirectAction({
                    redirectPath: pathname,
                    kind: IModuleKind.userOwners,
                  })
                );
                history.push(UserOwnerRoutes.routes.add.path);
              }}
              disabled={isFetching}
            >
              <PolyfillAddIcon className="mr-2" />
              Add New
            </button>

            <button
              className="btn btn-primary btn-sm d-flex my-2 w-md-100"
              onClick={() => setAddPopUp(true)}
              disabled={isFetching}
            >
              <PolyfillAddIcon className="mr-2" />
              Add From Existing Owners
            </button>
          </div>
        </div>

        <div className="property-header">
          <div className="row">
            <p className="mb-0 col-4">Owner Name</p>
            <p className="mb-0 col-4">Email</p>
            <p className="mb-0 col-4 px-0 d-flex pr-5 justify-content-end">
              Action
            </p>
          </div>
        </div>
        {/* if there is no data in table */}
        {!userOwners.length && (
          <div className="py-3">
            <p className="text-center mb-0 text-muted">NO DATA</p>
          </div>
        )}

        {/* if data is available use this map */}
        <div className="py-3">
          {accountUserOwners.map((accountUserOwner) => {
            if (!accountUserOwner.isSelected) {
              return null;
            }

            return (
              <Fragment key={accountUserOwner.id}>
                <div className="row p-3 d-lg-flex">
                  <p className="mb-0 col-4 ellipsis-2">
                    {accountUserOwner.label}
                  </p>
                  <p className="mb-0 col-4 ellipsis-2 lh-22">
                    {accountUserOwner.email}
                  </p>
                  <div className="col-4">
                    <div className="d-flex justify-content-end">
                      <div
                        className="light-icon"
                        onClick={() => {
                          const newUserOwners = userOwners.filter(
                            (userOwnerId) => userOwnerId !== accountUserOwner.id
                          );

                          setUserOwners(newUserOwners);
                        }}
                      >
                        <FiTrash />
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
  );
}
