import { getGlobalConfig } from '../../config.js';

const backendConfig = () => {
  const { aws, module, project, tf, runtime } = getGlobalConfig();
  const { accountId, region } = aws;
  const { name: projectName } = project;
  const { type: moduleType, name: moduleName } = module;
  const { engine: tfEngine } = tf;
  const { debug } = runtime;

  const tfBackendVars = [
    `-backend-config="region=${region}"`,
    `-backend-config="bucket=tf-state-${region}-${accountId}"`,
    `-backend-config="key=${projectName}/${moduleType}/${moduleName}/terraform.tfstate"`,
    `-backend-config="dynamodb_table=tf-state-lock-${region}-${accountId}"`,
  ];

  debug && console.log(`Using ${tfEngine} backend config: ${tfBackendVars.join(' ')}`);

  return {
    asInlineString: () => tfBackendVars.join(' '),
  }
}

export {
  backendConfig
}
