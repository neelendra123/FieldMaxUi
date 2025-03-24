import Joi from 'joi';

import { apiURLV1 } from '../../config';

export const IntegrationsApiRoutes = {
  getIntegrations: `${apiURLV1}/integrations`,
  rentManager: `${apiURLV1}/integrations/rentManager`,
  rentManagerSync: `${apiURLV1}/integrations/rentManager/sync`,
  rmLocationDefault: `integrations/rentManager/location/:locationId`,
};

export const RMCredentialsUpdateJoiSchema = Joi.object().keys({
  dbId: Joi.string().required().label('DbId'),
  username: Joi.string().required().label('Username'),
  password: Joi.string().required().label('Password'),
});
