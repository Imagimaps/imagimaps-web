type PlatformConfigFile = {
  project: { name: string };
  platform: {
    tf_state: { bucketPrefix: string, lockTablePrefix: string };
    environments: { name: string, shortName: string, domain?: string, vpc_cidr?: string }[];
  }
}

class PlatformConfig {
  constructor(
    readonly projectName: string,
    readonly tfState: { bucketPrefix: string, lockTablePrefix: string },
    readonly environment: { name: string, shortName: string, domain?: string, vpcCidr?: string }[]
  ) {};
}

export default PlatformConfig;

const testPlatformConfig = new PlatformConfig(
  'Test Project',
  { bucketPrefix: 'tf-state-ap-southeast-2', lockTablePrefix: 'tf-state-lock-ap-southeast-2' },
  [{ name: 'local', shortName: 'lcl', domain: 'dev.localhost', vpcCidr: '192.168.0.0/24'}]
);

export {
  PlatformConfigFile,
  testPlatformConfig as testCloudy,
};
