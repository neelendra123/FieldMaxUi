import { IRouteParams } from '../../interfaces';

import * as Pages from './index';

type RouteType =
  | 'register'
  | 'login'
  | 'passwordForgot'
  | 'passwordReset'
  | 'logout';

const Routes: Record<RouteType, IRouteParams> = {
  register: {
    name: 'Register',
    key: 'register',
    path: '/register',
    component: Pages.Register,
    sideBarId: 0,
  },
  login: {
    name: 'Login',
    key: 'login',
    path: '/login',
    component: Pages.Login,
    sideBarId: 0,
  },
  passwordForgot: {
    name: 'Password Forgot',
    key: 'passwordForgot',
    path: '/passwordForgot',
    component: Pages.PasswordForgot,
    sideBarId: 0,
  },
  passwordReset: {
    name: 'Password Reset',
    key: 'passwordReset',
    path: '/passwordReset/:token',
    component: Pages.PasswordReset,
    sideBarId: 0,
  },

  logout: {
    name: 'Logout',
    key: 'logout',
    path: '/logout',
    component: Pages.Logout,
    sideBarId: 0,
    authRequired: true,
  },
};

export default Routes;
