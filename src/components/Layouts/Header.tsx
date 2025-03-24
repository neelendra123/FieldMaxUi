import { useState, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { FiChevronDown } from 'react-icons/fi';
import { MdDone } from 'react-icons/md';
import { FiChevronRight } from 'react-icons/fi';

import { clearAllToast, successToast } from '../../utils/toast';

import { accountChangeAction } from '../../redux/auth/auth.actions';

import { IAuthUser } from '../../pages/Auth/interfaces';

import DashboardRoutes from '../../pages/Dashboard/routes';
import AuthRoutes from '../../pages/Auth/routes';
import CalendarEventsRoutes from '../../pages/CalendarEvents/routes';

import { BellIcon, CalenderIcon, LogoutIcon } from '../Icons';

import NotificationsSidebar from './NotificationsSidebar';

//TODO Add in Memoization to increase performance, preventing unnecessary re-rendering
function Header({
  sideBar,
  toggleSideBar,

  user,
  activeAccountIndex,

  unreadCount = 0,
}: {
  sideBar: string;
  toggleSideBar: () => void;

  user: IAuthUser;
  activeAccountIndex: number;

  unreadCount?: number;
}) {
  const history: any = useHistory();

  const reduxActionDispatch = useDispatch();

  const [toggleLeft, setToggleLeft] = useState(false);

  const [toggleNotifications, setToggleNotifications] = useState(false);

  const activeAccount = user.accounts[activeAccountIndex];

  const Popup = () => {
    return (
      <div className="header-v1 sidebarmenu">
        <CSSTransition timeout={500} classNames="quote-in">
          <div
            className="popup-overlay"
            style={
              toggleLeft
                ? { display: 'block', background: 'none' }
                : { display: 'none', background: 'none' }
            }
            onClick={() => setToggleLeft(false)}
          ></div>
        </CSSTransition>
        <div
          className={
            toggleLeft
              ? 'profile-cart-popup-wrap quote-fixed quote-in'
              : 'profile-cart-popup-wrap quote-fixed'
          }
        >
          <div className="d-flex flex-column justify-content-between h-100">
            <div className="cart-content-wrap">
              <div className="cart-block">
                <div className="image-wrap">
                  <img
                    className="img-fluid"
                    src={user.picURL}
                    alt={user.name}
                  />
                </div>
                <div className="cart-content">
                  <div>
                    <p className="mb-0 fz-16">{user.name}</p>
                    <p className="fz-16">{user.email}</p>
                  </div>
                </div>
              </div>
              <div>
                <button
                  className="btn btn-primary w-100"
                  onClick={() => history.push('/profile')}
                >
                  View Profile
                </button>
              </div>
              <div className="divider"></div>
              <ul className="organisation-list">
                {user.accounts.map((account, index) => {
                  const isActive = activeAccountIndex === index;

                  return (
                    <li
                      className={`organisation-list-item my-3 ${
                        isActive ? 'org-active' : ''
                      }`}
                      key={`${account.primaryUserId.id}-${index}`}
                      onClick={() => {
                        //  Changing Default Account then redirecting to dashboard and closing right sidebar
                        if (index !== activeAccountIndex) {
                          reduxActionDispatch(
                            accountChangeAction({
                              accountIndex: index,
                            })
                          );

                          setToggleLeft(!toggleLeft);

                          clearAllToast();

                          successToast(
                            `Account Changed to ${account.primaryUserId.account.name}`,
                            { position: 'bottom-right' }
                          );

                          history.push(DashboardRoutes.routes.home.path);
                        }
                      }}
                    >
                      <div className="flex-content flex-grow-1">
                        <img
                          src={account.primaryUserId.account.logoURL}
                          alt={account.primaryUserId.account.name}
                          title={account.primaryUserId.account.primaryEmail}
                        />

                        <span className="cut-text">
                          {account.primaryUserId.account.name}
                        </span>
                      </div>

                      {isActive && <MdDone className="fz-20" />}
                    </li>
                  );
                })}
              </ul>{' '}
            </div>
            <Link to={AuthRoutes.logout.path} title={AuthRoutes.logout.name}>
              <div className="d-flex justify-content-between align-items-center border-top pt-3">
                <div>
                  <LogoutIcon />
                  <span className="ml-3 txt-light">Logout</span>
                </div>
                <div>
                  <FiChevronRight />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <header
        className={
          sideBar === 'min'
            ? 'header header-v1 quote-fixed header-pd header-pd'
            : 'header header-v1 quote-fixed'
        }
        id="header"
      >
        <div className="header_toggle">
          <svg
            className="bx bx-menu"
            id="header-toggle"
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            onClick={toggleSideBar}
            viewBox="0 0 24 24"
            fill="none"
          >
            <g clipPath="url(#clip0)">
              <path
                d="M23 11H1C0.447715 11 0 11.4477 0 12C0 12.5523 0.447715 13 1 13H23C23.5523 13 24 12.5523 24 12C24 11.4477 23.5523 11 23 11Z"
                fill="var(--primary)"
                stroke="var(--primary)"
                strokeWidth="0.4"
              />
              <path
                d="M23 4H1C0.447715 4 0 4.44772 0 5C0 5.55228 0.447715 6 1 6H23C23.5523 6 24 5.55228 24 5C24 4.44772 23.5523 4 23 4Z"
                fill="var(--primary)"
                stroke="var(--primary)"
                strokeWidth="0.4"
              />
              <path
                d="M23 18H1C0.447715 18 0 18.4477 0 19C0 19.5523 0.447715 20 1 20H23C23.5523 20 24 19.5523 24 19C24 18.4477 23.5523 18 23 18Z"
                fill="var(--primary)"
                stroke="var(--primary)"
                strokeWidth="0.4"
              />
            </g>
            <defs>
              <clipPath id="clip0">
                <rect width={24} height={24} fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="dropdown pl-3 logo-dropdown">
          {/* TODO:css add css in class instead on inline css */}
          <img
            className="header-main-logo"
            src={activeAccount.primaryUserId.account.logoURL}
            alt={activeAccount.primaryUserId.account.name}
            title={activeAccount.primaryUserId.account.name}
          />
        </div>
        <div className="ml-auto">
          <div className="flex-content">
            <div
              className="bell-icon mr-2"
              onClick={() => setToggleNotifications(!toggleNotifications)}
            >
              <BellIcon unreadCount={unreadCount} />
            </div>
            <div
              className="calendar-icon mr-2"
              onClick={() => {
                history.push(CalendarEventsRoutes.routes.list.path);
              }}
            >
              <CalenderIcon />
            </div>
            <div className="dropdown profile-dropdown dropdown-open">
              <button
                className="dropdown-toggle cart-icon btn-style-remove"
                onClick={() => setToggleLeft(!toggleLeft)}
              >
                <img src={user.picURL} alt={user.name} title={user.name} />
                <span>{user.name}</span>
                <FiChevronDown className="primary-color ml-2" />
              </button>
            </div>
          </div>
        </div>

        <Popup />
        <NotificationsSidebar
          toggleNotifications={toggleNotifications}
          setToggleNotifications={setToggleNotifications}
        />
      </header>
    </Fragment>
  );
}

export default Header;
