import AsyncSelect from 'react-select/async';

import { IOption } from '../../../interfaces';

import { makeGetRequest } from '../../../utils/axios';

import { IOrgPerms, IJobSubModulePerms } from '../../Orgs/interfaces';

import { ISubMediaUserPerms } from '../../Medias/interfaces';

import RoleRoutes from '../routes';
import * as interfaces from '../interfaces';
import * as constants from '../constants';

interface RoleIOption extends IOption {
  permissions: IOrgPerms | IJobSubModulePerms | ISubMediaUserPerms;
}

export default function RolesDropdown({
  onChange,
}: {
  onChange: (permissions: any) => void;
}) {
  const loadRoles = (search = '') => {
    return makeGetRequest(constants.RoleApiRoutes.base, { search }).then(
      (res) => {
        const results: interfaces.IRolesListResData = res.data;

        let options = results.data.list.map((result) => {
          const option: RoleIOption = {
            value: result.id,
            label: result.name,
            permissions: result.permissions,
          };

          return option;
        });

        return options;
      }
    );
  };

  return RoleRoutes.routes.list.access ? (
    <AsyncSelect
      className="w-200"
      id="exampleFormControlSelect1"
      cacheOptions
      defaultOptions
      loadOptions={loadRoles}
      onInputChange={(value) => {
        if (value) {
          loadRoles(value);
        }
      }}
      onChange={(value) => {
        if (value) {
          onChange(value.permissions);
        }
      }}
      placeholder="Role"
    />
  ) : null;
}
