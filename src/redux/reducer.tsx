import { combineReducers } from 'redux';

import authReducer from './auth/auth.reducers';
import userOwnerReducer from './userOwners/userOwners.reducers';
import propertyReducer from './properties/properties.reducers';
import redirectReducer from './redirects/redirects.reducers';
import notificationReducer from './notifications/notifications.reducers';
import jobReducer from './jobs/jobs.reducers';

const rootReducer = combineReducers({
  auth: authReducer,
  userOwner: userOwnerReducer,
  property: propertyReducer,
  redirect: redirectReducer,
  notifications: notificationReducer,
  job: jobReducer,
});

export type IAppReduxState = ReturnType<typeof rootReducer>;

export default rootReducer;
