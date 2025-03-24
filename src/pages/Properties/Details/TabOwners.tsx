import { UserCircleIcon } from '../../../components/Icons';

import { IUserOwnerPopulated } from '../../UserOwners/interfaces';

import { formatUserName } from '../../Users/utils';

interface ITabOwnersProps {
  userOwners: IUserOwnerPopulated[];
}

export default function TabOwners({ userOwners }: ITabOwnersProps) {
  return (
    <div className="row">
      {userOwners.map((owner) => {
        const name = formatUserName(owner.firstName, owner.lastName);

        return (
          <div className="col-sm-3" key={owner.id}>
            <div className="shadow-equal card p-2 my-3">
              <div className="d-flex align-items-center overflow-hidden">
                {owner.picURL ? (
                  <img
                    className="account-user-img"
                    src={owner.picURL}
                    alt={name}
                    title={name}
                  />
                ) : (
                  <UserCircleIcon className="min-30 self-align-center" />
                )}

                <div>
                  <h6 className="fz-14 mb-0 ml-2">{name}</h6>
                  <p className="fz-14 mb-0 ml-2 col-special">{owner.email}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
