import { Fragment } from 'react';

import { IInviteStatusKind } from '../../pages/Invites/interfaces';

function InviteStatus({ status }: { status?: IInviteStatusKind }) {
  return (
    <Fragment>
      {status === IInviteStatusKind.accepted && (
        <button className="active-btn">Accepted</button>
      )}
      {status === IInviteStatusKind.pending && (
        <button className="pending-btn">Pending</button>
      )}
      {status === IInviteStatusKind.notSent && (
        <button className="pending-btn">Not Sent</button>
      )}
      {status === IInviteStatusKind.rejected && (
        <button className="inactive-btn">{status}</button>
      )}
    </Fragment>
  );
}

export default InviteStatus;
