import { exec } from '@actions/exec';
import { DefaultArtifactClient } from '@actions/artifact';

const planEcr = async (serviceName, contexts) => {
  const {
    runtime: { actionHome, tfEngine },
  } = contexts;
  const ecrTfWorkDir = `${actionHome}/tf`;

  console.log('Planning ECR for service:', serviceName);
  await exec(
    tfEngine,
    [
      'plan',
      `-var`,
      `project=imagimaps`,
      `-var`,
      `service_name=${serviceName}`,
      `-var`,
      `aws_region=${contexts.aws.region}`,
      `-out=${serviceName}.plan`,
    ],
    {
      cwd: ecrTfWorkDir,
    },
  );

  try {
    console.log('Uploading tf plan file');
    const artifact = new DefaultArtifactClient();

    const { id, size } = await artifact.uploadArtifact(
      `plan_${serviceName}.zip`,
      [`${ecrTfWorkDir}/${serviceName}.plan`, `${ecrTfWorkDir}/.terraform.lock.hcl`],
      ecrTfWorkDir,
      {
        retentionDays: 3,
      },
    );
    console.log(`Created artifact with id: ${id} (bytes: ${size}`);
  } catch {
    console.log(`Failed to upload tf plan file for ${serviceName}`);
  }
};

export { planEcr };
