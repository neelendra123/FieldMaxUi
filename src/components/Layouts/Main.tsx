import { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { Offline } from 'react-detect-offline';
import { useInterval } from 'react-use';

import { MESSAGES } from '../../constants';

import { IAppReduxState } from '../../redux/reducer';
import { notificationsUpdateAction } from '../../redux/notifications/notifications.actions';

import {
  clearAllToast,
  errorToast,
  successToast,
  warningToast,
} from '../../utils/toast';
import { getAuthToken } from '../../utils/common';

import AuthRoutes from '../../pages/Auth/routes';

import { Themes } from '../../pages/Users/constants';

import Header from './Header';
import SideBar from './SideBar';
import { notificationsListService } from '../../pages/Notifications/services';

function Main({
  children,
  sideBarId = 0,
}: {
  children: any;
  sideBarId?: number;
}) {
  const history: any = useHistory();

  const {
    auth: { authUser, accountIndex, product },
    notifications: { notifications },
  } = useSelector((state: IAppReduxState) => state);
  const reduxActionDispatch = useDispatch();

  const [sideBar, setSideBar] = useState(
    localStorage.getItem('sideBar') || 'min'
  );

  const toggleSideBar = () => {
    const value = sideBar === 'min' ? 'max' : 'min';

    setSideBar(value);

    localStorage.setItem('sideBar', value);
  };

  useInterval(async () => {
    //  This is the polling for notifications update for the current account index
    try {
      //  Fetch Notifications Data
      const result = await notificationsListService({});

      //  Update Redux State for current account index
      reduxActionDispatch(
        notificationsUpdateAction({
          accountIndex,
          notificationData: result,
        })
      );
    } catch (error) {
      console.error(error);
    }
  }, 1800000);

  useEffect(() => {
    // This is done in case api call is not made and user is not logged in the panel
    const token = getAuthToken();
    if (!token) {
      clearAllToast();
      localStorage.clear();
      history.push(AuthRoutes.login.path, {
        warningMsg: MESSAGES.loginRequired,
      });
      return;
    }

    const warningMsg: string = history.location?.state?.warningMsg || undefined;
    const successMsg: string = history.location?.state?.successMsg || undefined;
    const errorMsg: string = history.location?.state?.errorMsg || undefined;

    if (warningMsg) {
      warningToast(warningMsg);
    } else if (successMsg) {
      successToast(successMsg);
    } else if (errorMsg) {
      errorToast(errorMsg);
    }
  }, []);

  //  This is checking the theme color on change of auth paramter and changing it incase different
  useEffect(() => {
    let docStyle = getComputedStyle(document.documentElement);
    const defaultPrimary = docStyle.getPropertyValue('--primary');
    const { theme = Themes[0] } = authUser;
    if (defaultPrimary === theme.primary) {
      return;
    }
    const root = document.documentElement;
    for (const [key, value] of Object.entries(theme)) {
      root?.style.setProperty(`--${key}`, value);
    }
  }, [authUser]);

  return (
    <Fragment>
      <Header
        user={authUser}
        activeAccountIndex={accountIndex}
        sideBar={sideBar}
        toggleSideBar={toggleSideBar}
        unreadCount={notifications[accountIndex]?.unreadCount}
      />
      <SideBar
        user={authUser}
        sideBarId={sideBarId}
        productDetails={product}
        sideBar={sideBar}
        activeAccountIndex={accountIndex}
      />

      <div className={sideBar === 'min' ? 'body-pd' : ''}>
        <div className="content">
          {/* <Offline>
            <div
              className="callout callout-warning"
              style={{
                marginBottom: 0,
              }}
            >
              <h4>Warning!</h4>
              <p>Internet Connection Lost.</p>
            </div>
          </Offline> */}
          {children}
        </div>
      </div>
    </Fragment>
  );
}

export default Main;
