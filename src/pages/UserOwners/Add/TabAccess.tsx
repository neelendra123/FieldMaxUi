import { useEffect } from 'react';
import { BiCheck } from 'react-icons/bi';

import { ICommonAccess } from '../../Common/interfaces';

import { IUserListAllRes } from '../../Users/interfaces';
import { formatUserName } from '../../Users/utils';

import * as interfaces from '../interfaces';

interface TabAccessProps {
  accountUsers: IUserListAllRes[];

  access: ICommonAccess;
  setAccess: (access: ICommonAccess) => void;

  backupDataFunc: (
    newBackup?: interfaces.IUserOwnerCreateEditBackup,
    newTab?: interfaces.IOwnerCreateUpdateTabsType
  ) => void;
}

export default function TabAccess({
  accountUsers,

  access,
  setAccess,

  backupDataFunc,
}: TabAccessProps) {
  useEffect(() => {
    backupDataFunc(undefined, interfaces.IOwnerCreateUpdateTabsType.access);
  }, [access]);

  return (
    <div className="user-permission">
      <p>Users</p>
      <div className="grid-mobile">
        <div className="max-checkbox fs-12">
          <div
            className="check"
            onClick={() => {
              setAccess({
                ...access,
                all: !access.all,
              });
            }}
          >
            {access.all && <BiCheck className="fs-18" />}
          </div>
          All
        </div>

        {accountUsers.map((accountUser) => {
          const indexOf = access.users.indexOf(accountUser.id);

          return (
            <div
              className="max-checkbox fs-12"
              key={accountUser.id}
              onClick={() => {
                // if (access.all) {
                //   return;
                // }
                let all = access.all;

                let newUsers = [...access.users];
                if (indexOf === -1) {
                  //  If Not Added presently
                  newUsers = [...access.users, accountUser.id];
                } else {
                  //  If already added, filtering out the userId
                  newUsers = newUsers.filter(
                    (userId) => userId !== accountUser.id
                  );
                  all = false;
                }

                setAccess({
                  ...access,
                  all,
                  users: newUsers,
                });
              }}
            >
              <div className="check">
                {(access.all || indexOf !== -1) && (
                  <BiCheck className="fs-18" />
                )}
              </div>
              {formatUserName(accountUser.firstName, accountUser.lastName)}
            </div>
          );
        })}
      </div>
      <br />
    </div>
  );
}
