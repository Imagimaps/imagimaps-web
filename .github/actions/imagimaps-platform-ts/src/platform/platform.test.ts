import Platform from './platform';
import ConfigFilesLoader from './configurator/configFilesLoader';
import { testServiceModule } from './models/module';

jest.mock('./configurator/configFilesLoader');

xdescribe('platform', () => {
  const _ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    
    process.env = {
      ..._ENV,
      ARTIFACTS_AWS_ACCOUNT_ID: '987654321098',
    };
  });

  it('should return a new instance of Platform', () => {
    const platform = new Platform();

    expect(platform).toBeInstanceOf(Platform);
  });

  it('should load the platform configuration', async () => {
    const platform = new Platform();
    
    await platform.loadConfig();

    // expect(platform.config).toBeTruthy();
  });

  it('should check for all platform aws infrastructure related to building the active module', async () => {
    process.env.INPUT_ACTION = 'build';
    const module = testServiceModule;
    const platform = new Platform();

    await platform.loadConfig();
    await platform.checkPreRequisiteInfrastructure(module);
  });
});
