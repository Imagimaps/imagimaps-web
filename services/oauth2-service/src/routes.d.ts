type HealthCheckResponse = {
  status: 'UP' | 'DOWN';
  info?: any;
  dependencies?: any;
};

export { HealthCheckResponse };
