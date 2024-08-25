const ServicesConfig = () => {
  const { SERVICE_LB_LISTENER_DNS_NAME } = process.env;

  return {
    entrypointUrl: SERVICE_LB_LISTENER_DNS_NAME ?? 'http://localhost:8080',
    authServiceBaseUrl: SERVICE_LB_LISTENER_DNS_NAME ?? 'http://localhost:8081',
    mapServiceBaseUrl: SERVICE_LB_LISTENER_DNS_NAME ?? 'http://localhost:8082',
    userServiceBaseUrl: SERVICE_LB_LISTENER_DNS_NAME ?? 'http://localhost:8083',
  };
};

export default ServicesConfig;
