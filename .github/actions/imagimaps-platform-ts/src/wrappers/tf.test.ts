import { exec, getExecOutput } from '@actions/exec';
import * as core from '@actions/core';

import Tf, { TfOutput } from './tf';
import CredentialsContext from '../aws/models/credentialsContext';
import { testServiceModule } from '../platform/models/module';
import { testCloudy } from '../platform/models/cloudy';

let awsAccountId = '123456789012';
let awsRegion = 'ap-southeast-2';
let awsCredsCtx = new CredentialsContext(awsAccountId, awsRegion, {
  AccessKeyId: 'accessKeyId',
  SecretAccessKey: 'secretAccessKey',
  SessionToken: 'sessionToken',
  Expiration: new Date(),
});
let tfModule = 'my_test_module';
let platformModule = testServiceModule;

jest.mock('@actions/exec', () => ({ exec: jest.fn(), getExecOutput: jest.fn().mockReturnValue(Promise.resolve({ stdout: "" })) }));
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>;

describe('Tf', () => {
  const _ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    setFailedMock = jest.spyOn(core, 'setFailed');
    (exec as jest.Mock).mockImplementation(() => Promise.resolve(0));
    
    process.env = { 
      ..._ENV,
      INPUT_ENVIRONMENT: 'local',
    };
  });

  afterAll(() => {
    process.env = _ENV;
  });

  it('should return a new instance of Tf', () => {
    const tf = new Tf(tfModule, platformModule, awsCredsCtx);
    
    expect(tf).toBeInstanceOf(Tf);
  })

  it('should init with backend and env vars', async () => {
    const tf = new Tf(tfModule, platformModule, awsCredsCtx);
    
    await tf.init();
    
    const backendVars = '-backend-config=\"region=ap-southeast-2\" -backend-config=\"bucket=tf-state-ap-southeast-2-123456789012\" -backend-config=\"key=my_test_project/service/my_test_service/terraform.tfstate\" -backend-config=\"dynamodb_table=tf-state-lock-ap-southeast-2-123456789012\"';
    expect(exec).toHaveBeenCalledWith(
      `terraform init ${backendVars}`,
      ['-reconfigure'],
      {
        cwd: expect.stringContaining(tfModule),
        env: expect.objectContaining(awsCredsCtx.asEnvVars())
      }
    );
  });

  it('should return module name if init failed', async () => {
    (exec as jest.Mock).mockReturnValueOnce(Promise.resolve(1));
    const tf = new Tf(tfModule, platformModule, awsCredsCtx);

    await expect(tf.init()).rejects.toMatchObject({
      reason: 'Tf init failed for my_test_module to account 123456789012',
      module: 'my_test_module',
      action: 'init',
    });
    
    expect(setFailedMock).toHaveBeenCalled();
  });

  it('should plan with custom backend vars', async () => {
    const tf = new Tf(tfModule, platformModule, awsCredsCtx);
    const backendVars = ['-backend-config=\"region=ap-southeast-4\"'];
    
    await tf.init(backendVars);
    
    expect(exec).toHaveBeenCalledWith(
      `terraform init -backend-config=\"region=ap-southeast-4\"`,
      ['-reconfigure'],
      {
        cwd: expect.stringContaining(tfModule),
        env: expect.objectContaining(awsCredsCtx.asEnvVars())
      }
    );
  });

  it('should be unable to set workspace if not initialised', async () => {
    const tf = new Tf(tfModule, platformModule, awsCredsCtx);
    
    await tf.workspace();

    expect(setFailedMock).toHaveBeenCalled();
  });

  it('should set workspace', async () => {
    const tf = new Tf(tfModule, platformModule, awsCredsCtx);
    
    await tf.init();
    await tf.workspace();

    const workspaceId = 'my_test_project-local-service-my_test_service-my_test_module';
    expect(exec).toHaveBeenCalledWith(
      'terraform',
      ['workspace', 'select', '-or-create', workspaceId],
      {
        cwd: expect.stringContaining(tfModule),
        env: expect.objectContaining(awsCredsCtx.asEnvVars())
      }
    );
  });

  it('should be unable to plan if not initialised', async () => {
    const tf = new Tf(tfModule, platformModule, awsCredsCtx);
    
    await tf.plan();

    expect(setFailedMock).toHaveBeenCalled();
  });

  it('should output planfile when there are changes to tf state', async () => {
    const tf = new Tf(tfModule, platformModule, awsCredsCtx);
    
    await tf.init();
    const planfileName = await tf.plan();

    expect(planfileName).toBe('service_my_test_service_my_test_module.plan');
    expect(getExecOutput).toHaveBeenCalledWith(
      'terraform',
      ['plan', "-var", "aws_region=ap-southeast-2", "-var", "project=my_test_project", "-var", "environment=local", "-out=service_my_test_service_my_test_module.plan"],
      {
        cwd: expect.stringContaining(tfModule),
        env: expect.objectContaining(awsCredsCtx.asEnvVars()),
      }
    );
  });

  it('should not output planfile when there are no changes to tf state', async () => {
    (getExecOutput as jest.Mock).mockReturnValueOnce(Promise.resolve({ stdout: "Your infrastructure matches the configuration." }));
    const tf = new Tf(tfModule, platformModule, awsCredsCtx);
    
    await tf.init();
    const planfileName = await tf.plan();

    expect(planfileName).toBeFalsy();
  });

  it('should apply with planfile', async () => {
    const tf = new Tf(tfModule, platformModule, awsCredsCtx);
    
    await tf.init();
    const planfileName = await tf.plan();
    await tf.apply();

    expect(exec).toHaveBeenCalledWith(
      'terraform',
      ['apply', planfileName],
      {
        cwd: expect.stringContaining(tfModule),
        env: expect.objectContaining(awsCredsCtx.asEnvVars())
      }
    );
  });

  it('should not apply without planfile', async () => {
    const tf = new Tf(tfModule, platformModule, awsCredsCtx);
    
    await tf.init();
    await tf.apply();

    expect(exec).not.toHaveBeenCalledWith(
      'terraform',
      ['apply', expect.anything()],
      expect.anything()
    );
  });

  it('should use a different tf engine', async () => {
    process.env.TF_ENGINE = 'tofu';
    const tf = new Tf(tfModule, platformModule, awsCredsCtx);
    
    await tf.init();
    
    expect(exec).toHaveBeenCalledWith(
      expect.stringContaining('tofu init'),
      ['-reconfigure'],
      {
        cwd: expect.stringContaining(tfModule),
        env: expect.objectContaining(awsCredsCtx.asEnvVars())
      }
    );
  });

  it('should generate outputs', async () => {
    (getExecOutput as jest.Mock).mockReturnValueOnce(Promise.resolve({ stdout: "key1 = value1\nkey2 = value2" }));
    const tf = new Tf(tfModule, platformModule, awsCredsCtx);
    
    await tf.init();
    const outputs: TfOutput = await tf.output() as TfOutput;

    expect(outputs.output.key1).toBe('value1');
    expect(outputs.output.key2).toBe('value2');
    expect(outputs.module).toBe(tfModule);
    expect(getExecOutput).toHaveBeenCalledWith(
      'terraform',
      ['output'],
      {
        cwd: expect.stringContaining(tfModule),
        env: expect.objectContaining(awsCredsCtx.asEnvVars())
      }
    );
  });

  it('should reject on output error', async () => {
    (getExecOutput as jest.Mock).mockReturnValueOnce(Promise.reject({ status: 'rejected', reason: 'Resource not found' }));
    const tf = new Tf(tfModule, platformModule, awsCredsCtx);
    
    await tf.init();
    await expect(tf.output()).rejects.toEqual({ status: 'rejected', reason: 'Resource not found' });
  });
});
