interface IEnvironmentConfig {
  [key: string]: {
    apiGateWayUrl: string;
  };
}

const EnvironmentConfig: IEnvironmentConfig = {
  local: {
    apiGateWayUrl: 'https://api-gateway.tusphananh.workers.dev',
  },
  development: {
    apiGateWayUrl: 'http://localhost:58636/api',
  },
  production: {
    apiGateWayUrl: 'https://api-gateway.tusphananh.workers.dev',
  },
};

export const getConfig = () => {
  const env = process.env.APP_ENV || 'local';

  return EnvironmentConfig[env];
};
