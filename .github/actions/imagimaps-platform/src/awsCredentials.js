// @ts-check
'use strict';

import core from '@actions/core';
import { STSClient, AssumeRoleWithWebIdentityCommand } from '@aws-sdk/client-sts';

/**
 * Represents AWS credentials used for authentication and authorization.
 * @class
 */
class AwsCredentials {
  /**
   * Represents the common properties of the issued AWS Credentials
   * @constructor
   * @param {Object} opts - The options for the AWS credentials.
   * @param {string} [opts.region='ap-southeast-2'] - The AWS region.
   */
  constructor(opts) {
    this.region = opts?.region || 'ap-southeast-2';

    // Note: Tokens are issued for an hour. Given how quickly the action runs,
    // we can effectively ignore the expiry of the cached credentials.
    this.credentials = new Map();
  }

  /**
   * Authenticates with AWS using OIDC web identity.
   *
   * @param {string} accountId - The AWS account ID.
   * @param {Object} opts - Optional parameters.
   * @param {string} opts.region - The AWS region. If not provided, the default region will be used.
   * @param {boolean} opts.debug - Whether to enable debug mode. Default is false.
   * @returns {Promise<Object>} - A promise that resolves to the AWS credentials.
   * @throws {Error} - If the AWS account ID format is invalid.
   */
  async authWithWebIdentity(accountId, opts) {
    if (!/^[0-9]{12}$/.test(accountId)) {
      throw new Error('Invalid AWS account ID format');
    }
    const region = opts?.region || this.region;
    const debug = opts?.debug || false;

    const cachedCredentials = this.credentials.get(`${accountId}/${region}`);
    if (cachedCredentials) {
      console.log('Using cached credentials...');
      return cachedCredentials;
    }

    const oidcIdToken = await core.getIDToken("sts.amazonaws.com");
    const params = {
      RoleArn: `arn:aws:iam::${accountId}:role/imagimaps/automation/service-deploy-role`,
      RoleSessionName: 'platform-deploy-action',
      WebIdentityToken: oidcIdToken,
    };
    console.log('Assume Role Params:', params);
    const stsClient = new STSClient({ region });
    const assumeRoleWithWebIdentityCommand = new AssumeRoleWithWebIdentityCommand(params);

    try {
      console.log('Retrieving session token...')
      const data = await stsClient.send(assumeRoleWithWebIdentityCommand);

      const awsEcrContext = {
        accountId,
        region,
        accessKeyId: data.Credentials.AccessKeyId,
        secretAccessKey: data.Credentials.SecretAccessKey,
        sessionToken: data.Credentials.SessionToken,
        expiriation: data.Credentials.Expiration,
      };
      this.credentials.set(`${accountId}/${region}`, awsEcrContext);
      debug && console.debug(awsEcrContext);

      console.log('Session token retrieved! Expires at:', data.Credentials.Expiration);
      return awsEcrContext;
    } catch (err) {
      console.error('Error retrieving session token:', err);
      console.log(err, err.stack);
    }
  }

  /**
   * Retrieves AWS credentials as environment variables.
   *
   * @param {string} accountId - The AWS account ID.
   * @param {Object} opts - Optional parameters.
   * @param {string} opts.region - The AWS region.
   * @returns {Object} - An object containing the AWS credentials as environment variables.
   * @throws {Error} - If credentials are not found.
   */
  getCredentialsAsEnvVars(accountId, opts) {
    const region = opts?.region || this.region;
    const awsEcrContext = this.credentials.get(`${accountId}/${region}`);
    if (!awsEcrContext) {
      throw new Error('Credentials not found. Ensure you have called "authWithWebIdentity" first.');
    }

    return {
      AWS_REGION: awsEcrContext.region,
      AWS_ACCESS_KEY_ID: awsEcrContext.accessKeyId,
      AWS_SECRET_ACCESS_KEY: awsEcrContext.secretAccessKey,
      AWS_SESSION_TOKEN: awsEcrContext.sessionToken,
    };
  }
}

export default AwsCredentials;
