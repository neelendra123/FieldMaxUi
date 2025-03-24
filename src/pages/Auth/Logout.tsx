import { useEffect, memo } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { MESSAGES } from '../../constants';

import { clearAllToast } from '../../utils/toast';
import { useQuery } from '../../utils/hooks';

import { logoutAction } from '../../redux/auth/auth.actions';

import AuthRoutes from './routes';
import * as services from './services';

function Logout() {
  let query = useQuery();
  const reduxActionDispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        await services.logoutService();
      } catch (error) {
        console.error(error);
      }
    })();

    clearAllToast();

    reduxActionDispatch(logoutAction());
  }, [reduxActionDispatch]);

  return (
    <Redirect
      to={{
        pathname: AuthRoutes.login.path,
        state: {
          successMsg: MESSAGES.loggedOutSuccess,
          warningMsg: query.get('warningMsg'),
        },
      }}
    />
  );
}

export default memo(Logout);
