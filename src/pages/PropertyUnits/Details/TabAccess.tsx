import { UserCircleIcon } from '../../../components/Icons';

import { IUserListAllRes } from '../../Users/interfaces';
import { formatUserName } from '../../Users/utils';

import { ICommonAccess } from '../../Common/interfaces';

interface TabAccessProps {
  accountUsers: IUserListAllRes[];

  access: ICommonAccess;
}

export default function TabAccess({
  accountUsers,

  access,
}: TabAccessProps) {
  return (
    <div className="row">
      {accountUsers.map((accountUser) => {
        let isSelected = false;
        if (access.all) {
          isSelected = true;
        } else {
          isSelected =
            access.users.indexOf(accountUser.id) != -1 ? true : false;
        }

        if (!isSelected) {
          return null;
        }

        const username = formatUserName(
          accountUser.firstName,
          accountUser.lastName
        );

        return (
          <div className="col-sm-3" key={accountUser.id}>
            <div className="shadow-equal card p-2 my-3">
              <div className="d-flex align-items-center">
                {accountUser.picURL ? (
                  <div className="property-single-image" key={accountUser.id}>
                    <img
                      src={accountUser.picURL}
                      alt={username}
                      title={username}
                    />
                  </div>
                ) : (
                  <UserCircleIcon />
                )}

                <h6 className="fz-14 mb-0 ml-2">{username}</h6>
              </div>
            </div>
          </div>
        );
      })}
      <br />
      <br />
    </div>
  );
}
