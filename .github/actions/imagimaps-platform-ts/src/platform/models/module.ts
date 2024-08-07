enum ModuleType {
  Service = 'service',
  WebApp = 'webapp',
};

class Module {
  constructor(readonly projectName: string, readonly path: string, readonly name: string, readonly type: ModuleType) {}
};

export default Module;

const testServiceModule = new Module('my_test_project', 'services/my_test_service', 'my_test_service', ModuleType.Service);

export {
  ModuleType,
  testServiceModule,
};
