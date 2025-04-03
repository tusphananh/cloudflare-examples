interface IEnvironmentConfig {
  [key: string]: {
    apiGateWayUrl: string;
    chatServiceUrl: string;
  };
}

const EnvironmentConfig: IEnvironmentConfig = {
  local: {
    apiGateWayUrl: 'http://localhost:8602',
    chatServiceUrl: 'ws://localhost:8600',
  },
  development: {
    apiGateWayUrl: 'https://api-gateway.tusphananh.workers.dev',
    chatServiceUrl: 'wss://chat-service.tusphananh.workers.dev',
  },
  production: {
    apiGateWayUrl: 'https://api-gateway.tusphananh.workers.dev',
    chatServiceUrl: 'wss://chat-service.tusphananh.workers.dev',
  },
};

export const getConfig = () => {
  const env = process.env.APP_ENV || 'local';

  return EnvironmentConfig[env];
};
