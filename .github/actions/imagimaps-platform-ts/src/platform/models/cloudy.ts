class Cloudy {
  constructor(readonly projectName: string, readonly tfState: { bucketPrefix: string, lockTablePrefix: string }, readonly environment: { name: string, shortName: string, domain?: string, vpcCidr?: string }) {}
}

export default Cloudy;

const testCloudy = new Cloudy(
  'Test Project',
  { bucketPrefix: 'tf-state-ap-southeast-2', lockTablePrefix: 'tf-state-lock-ap-southeast-2' },
  { name: 'local', shortName: 'test', domain: 'test.com', vpcCidr: '10.0.0.0/24'}
);

export { testCloudy };
