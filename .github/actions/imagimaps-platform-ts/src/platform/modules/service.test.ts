import { when } from "jest-when";

import Service from "./service";
import TF from "../../wrappers/tf";
import { testServiceModule } from "../models/module";
import AwsCredentials from '../../aws/awsCredentials';
import CredentialsContext from "../../aws/models/credentialsContext";
import CredentialsCache from "../../aws/credentialsCache";

jest.mock('../../wrappers/tf');
jest.mock('../../aws/awsCredentials');

const mainAccCtx = new CredentialsContext('123456789012', 'ap-southeast-2', {
  AccessKeyId: 'accessKeyId',
  SecretAccessKey: 'secretAccess',
  SessionToken: 'sessionToken',
  Expiration: new Date(),
});
const artifactsAccCtx = new CredentialsContext('987654321098', 'ap-southeast-2', {
  AccessKeyId: 'accessKeyId',
  SecretAccessKey: 'secretAccess',
  SessionToken: 'sessionToken',
  Expiration: new Date(),
});

let tfInitMock: jest.SpiedFunction<typeof TF.prototype.init>;
let tfOutputMock: jest.SpiedFunction<typeof TF.prototype.output>;

let awsCredsAuthMock = jest.fn();
let awsCredsMock: jest.Mocked<AwsCredentials> = {
  region: '',
  credentialsCache: new CredentialsCache(),
  authenticate: awsCredsAuthMock,
};

describe('service platform module', () => {
  const _ENV = process.env;
  let service: Service;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    tfInitMock = jest.spyOn(TF.prototype, 'init').mockImplementation(() => Promise.resolve());
    tfOutputMock = jest.spyOn(TF.prototype, 'output').mockImplementation(() => Promise.resolve({ output: {}, module: 'ecr' }));
    awsCredsMock.authenticate.mockImplementation(() => Promise.resolve(mainAccCtx));

    process.env = {
      ..._ENV,
      ARTIFACTS_AWS_ACCOUNT_ID: '987654321098',
    };

    service = new Service(testServiceModule, awsCredsMock, { tfAccountMappings: { ecr: '987654321098' } });
  });

  afterAll(() => {
    process.env = _ENV;
  });

  it('should instantiate', () => {

    expect(service).toBeInstanceOf(Service);
  });

  it('should fail dependent infra check if unable to authenticate with any dependent infra aws account', async () => {
    awsCredsMock.authenticate.mockRejectedValue('Failed to retrieve credentials for account ID: 123456789012');

    await expect(service.checkDependentInfrastructure()).rejects.toEqual('Failed to retrieve credentials for account ID: 123456789012');
  });

  it('should fail dependent infra check if any tf inits fail', async () => {
    tfInitMock.mockRejectedValue({reason: 'Tf init failed for my_test_service', module: 'ecr', action: 'init'});
    awsCredsMock.authenticate.mockResolvedValue(artifactsAccCtx);

    await expect(service.checkDependentInfrastructure()).rejects.toEqual('Failed to init dependent infrastructure');
  });
  
  it('should scan and return all missing service dependent infrastructure', async () => {
    tfOutputMock.mockRejectedValue({reason: 'Tf output failed for my_test_service to account 987654321098', module: 'ecr', action: 'output'});
    awsCredsMock.authenticate.mockResolvedValue(artifactsAccCtx);

    const missingInfra = await service.checkDependentInfrastructure();

    expect(missingInfra).toContain('ecr');
  });

  it('should return empty array if all dependent infra is present', async () => {
    awsCredsMock.authenticate.mockResolvedValue(artifactsAccCtx);

    const missingInfra = await service.checkDependentInfrastructure();

    expect(missingInfra).toEqual([]);
  });
});