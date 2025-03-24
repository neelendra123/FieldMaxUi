import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { useHistory } from 'react-router-dom';

import { IAppReduxState } from '../../redux/reducer';

import NotificationRoutes from '../../pages/Notifications/routes';
import NotificationRow from '../../pages/Notifications/Common/NotificationRow';

interface NotificationsSidebarProps {
  toggleNotifications: boolean;
  setToggleNotifications: (toggleNotifications: boolean) => void;
}

export default function NotificationsSidebar({
  toggleNotifications,
  setToggleNotifications,
}: NotificationsSidebarProps) {
  const history: any = useHistory();

  const {
    auth: { accountIndex },
    notifications: { notifications },
  } = useSelector((state: IAppReduxState) => state);

  return (
    <div className="header-v1 sidebarmenu">
      <CSSTransition timeout={500} classNames="quote-in">
        <div
          className="popup-overlay"
          style={
            toggleNotifications
              ? { display: 'block', background: 'none' }
              : { display: 'none', background: 'none' }
          }
          onClick={() => setToggleNotifications(false)}
        ></div>
      </CSSTransition>
      <div
        className={
          toggleNotifications
            ? 'profile-cart-popup-wrap quote-fixed quote-in'
            : 'profile-cart-popup-wrap quote-fixed'
        }
      >
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Notifications</h5>
          <p
            className="mb-0 text-primary"
            onClick={() => history.push(NotificationRoutes.routes.list.path)}
          >
            See All
          </p>
        </div>

        {(notifications[accountIndex]?.records || []).map((record) => (
          <Fragment key={record.id}>
            <NotificationRow record={record} />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
