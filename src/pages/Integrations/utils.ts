import * as interfaces from './interfaces';

export const generateDefaultIntegrations = () => {
  const integrations: interfaces.IIntegrations = {
    rm: {
      dbId: '',
      username: '',
      password: '',
      locations: [],
      isActive: false,
      updatedAt: undefined,
    },
  };

  return integrations;
};
