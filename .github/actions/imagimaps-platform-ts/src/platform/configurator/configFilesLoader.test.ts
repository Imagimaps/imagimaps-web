import * as core from '@actions/core';
import { glob } from 'glob';
import fs from 'fs';
import * as asyncFs from 'fs/promises';
import { when } from 'jest-when';

import ConfigFilesLoader from "./configFilesLoader";
import { testServiceModule } from '../models/module';

jest.mock('glob');
jest.mock('fs/promises', () => {
  return {
    readFile: jest.fn(),
  };
});
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>;
let warningMock: jest.SpiedFunction<typeof core.warning>;
let existsSyncMock: jest.SpiedFunction<typeof fs.existsSync>;

describe('configLoader', () => {
  const _ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    setFailedMock = jest.spyOn(core, 'setFailed');
    warningMock = jest.spyOn(core, 'warning');
    existsSyncMock = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    process.env = { ..._ENV };
  });
  
  it('should scan the entire repository for all instances of cloudy.yml', async () => {
    (glob.glob as jest.Mock).mockReturnValueOnce(Promise.resolve(['/services/auth/cloudy.yml']));
    const configLoader = new ConfigFilesLoader();

    const confFiles = await configLoader.scanRepository();

    expect(configLoader).toBeInstanceOf(ConfigFilesLoader);
    expect(confFiles).toEqual(['/services/auth/cloudy.yml']);
    expect(setFailedMock).not.toHaveBeenCalled();
  });

  it('should set a failure message if no cloudy.yml files are found', async () => {
    (glob.glob as jest.Mock).mockReturnValueOnce(Promise.resolve([]));
    const configLoader = new ConfigFilesLoader();

    const configFiles = await configLoader.scanRepository();

    expect(configFiles).toEqual([]);
    expect(setFailedMock).toHaveBeenCalled();
  });

  it('should set an error message if the platform configuration file is missing', async () => {
    when(existsSyncMock).calledWith(`${__dirname}/cloudy.yml`).mockReturnValue(false);
    
    new ConfigFilesLoader();

    expect(setFailedMock).toHaveBeenCalled();
  });

  it('should set a warning that selected module is missing a cloudy.yml file', async () => {
    process.env.GITHUB_WORKSPACE = '/gh/workspace';
    process.env.INPUT_MODULE_PATH = 'test-service';
    when(existsSyncMock).calledWith('/gh/workspace/test-service/cloudy.yml').mockReturnValue(false);
    
    new ConfigFilesLoader();

    expect(warningMock).toHaveBeenCalled();
  });

  it('should load the platform configuration file', async () => {
    when(asyncFs.readFile as jest.Mock).calledWith(`${__dirname}/cloudy.yml`, 'utf-8').mockResolvedValue(PLATFORM_CONFIG);
    const configLoader = new ConfigFilesLoader();

    const platformConfig = await configLoader.loadPlatformConfig();

    expect(configLoader).toBeInstanceOf(ConfigFilesLoader);
    expect(platformConfig).toBeDefined();
    expect(platformConfig.projectName).toBe('test');
    expect(platformConfig.tfState).toEqual({ bucketPrefix: 'tf-state', lockTablePrefix: 'tf-state-lock' });
    expect(platformConfig.environment).toHaveLength(2);
    expect(platformConfig.environment[0]).toEqual({ name: 'test', shortName: 'tst' });
    expect(platformConfig.environment[1]).toEqual({ name: 'development', shortName: 'dev', domain: 'dev.localhost', vpcCidr: '192.168.0.0/16' });
  });

  it('should set a failure message if the platform configuration file cannot be loaded', async () => {
    when(asyncFs.readFile as jest.Mock).calledWith(`${__dirname}/cloudy.yml`, 'utf-8').mockRejectedValue(new Error('Failed to open file'));
    
    const configLoader = new ConfigFilesLoader();

    await expect(configLoader.loadPlatformConfig()).rejects.toBeTruthy();
    expect(setFailedMock).toHaveBeenCalled();
  });
});

const PLATFORM_CONFIG = `
project:
  name: test
platform:
  tf_state:
    bucket_prefix: tf-state
    lock_table_prefix: tf-state-lock
  environments:
  - name: test
    short_name: tst
  - name: development
    short_name: dev
    domain: dev.localhost
    vpc_cidr: 192.168.0.0/16
`