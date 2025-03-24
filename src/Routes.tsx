import { Fragment } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import { MESSAGES } from './constants';
import { IRouteParams } from './interfaces';

import { IAppReduxState } from './redux/reducer';
import { allowAccessCheck } from './utils/common';

//  New Routess
import AuthRoutes from './pages/Auth/routes';
import InviteRoutes from './pages/Invites/routes';

import ProfileRoutes from './pages/Profile/routes'; //1

import AccountsRoutes from './pages/Accounts/routes'; //2

import DashboardRoutes from './pages/Dashboard/routes'; //3

import JobRoutes from './pages/Jobs/routes'; //4

import RoleRoutes from './pages/Roles/routes'; //5

import UsersRoutes from './pages/Users/routes'; // 6

import MediaRoutes from './pages/Medias/routes'; //7

import SubscriptionRoutes from './pages/Subscriptions/routes'; //8

import CalendarEvents from './pages/CalendarEvents/routes'; //9

import IntegrationCommonsRoutes from './pages/IntegrationCommons/routes'; //10

import LinkRoutes from './pages/Links/routes'; //11
import PropertiesRoutes from './pages/Properties/routes'; //11

import UnitsRoutes from './pages/PropertyUnits/routes'; // 12

import UserOwnerRoutes from './pages/UserOwners/routes'; //13

import NotFound from './pages/Errors/NotFound/NotFound';

import NotificationRoutes from './pages/Notifications/routes'; //16

import 'react-toastify/dist/ReactToastify.css';
import 'react-responsive-modal/styles.css';

const RoutesConfig: IRouteParams[] = [
  ...Object.values(AuthRoutes), //0

  ...Object.values(InviteRoutes), //0

  ...Object.values(LinkRoutes.routes), // 11

  ...Object.values(ProfileRoutes.routes), //1

  ...Object.values(AccountsRoutes.routes), //2

  ...Object.values(DashboardRoutes.routes), //3

  ...Object.values(JobRoutes.routes), //4

  ...Object.values(RoleRoutes.routes), //5

  ...Object.values(UsersRoutes.routes), //6

  ...Object.values(MediaRoutes.routes), //7

  ...Object.values(SubscriptionRoutes.routes), //8

  ...Object.values(CalendarEvents.routes), //9

  ...Object.values(IntegrationCommonsRoutes.routes), // 10

  ...Object.values(PropertiesRoutes.routes), // 11

  ...Object.values(UnitsRoutes.routes), // 12

  ...Object.values(UserOwnerRoutes.routes), // 13

  ...Object.values(NotificationRoutes.routes), // 16
];

function AppRoutes() {
  const { auth, authUser, accountIndex } = useSelector(
    (state: IAppReduxState) => state.auth
  );

  // const activeAccountInviteStatus =
  //   user.accounts[parseInt(accountIndex)].invite.status;

  return (
    <Fragment>
      <ToastContainer />

      <BrowserRouter>
        <Switch>
          {RoutesConfig.map((route) => {
            // //  If invite status is rejected then routes is not allowed to access
            // if (activeAccountInviteStatus === IInviteStatusKind.rejected) {
            //   console.log({
            //     activeAccountInviteStatus,
            //   });

            //   return null;
            // }

            let {
              exact = true,
              path,
              component,
              key,

              authRequired = false,
              aclCheck = {},
            } = route;

            const allowAccess = !authRequired
              ? true
              : allowAccessCheck(aclCheck, {
                  mainUserType: authUser.userType,
                  orgUserType: authUser.accounts?.[accountIndex]?.userType,
                  permissions: authUser.accounts?.[accountIndex]?.permissions,
                });

            // if (!allowAccess) {
            //   return null;
            // }

            route.access = allowAccess;

            if (allowAccess) {
              return (
                <Route
                  exact={exact}
                  path={path}
                  component={component}
                  key={key}
                />
              );
            }

            if (authRequired && !auth.token) {
              return (
                <Redirect
                  to={{
                    pathname: AuthRoutes.login.path,
                    state: { warningMsg: MESSAGES.loginRequired },
                  }}
                  key={key}
                />
              );
            }

            return (
              <Route
                exact={exact}
                path={path}
                component={component}
                key={key}
              />
            );
          })}

          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </Fragment>
  );
}

export default AppRoutes;
