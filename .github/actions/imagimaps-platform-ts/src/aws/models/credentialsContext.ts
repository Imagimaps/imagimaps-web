import { Credentials } from "@aws-sdk/client-sts";

class CredentialsContext {
  region: string;
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
  expiration: Date;
  
  constructor(accountId: string, region: string, credentials: Credentials) {
    this.accountId = accountId;
    this.region = region;
    this.accessKeyId = credentials.AccessKeyId || '';
    this.secretAccessKey = credentials.SecretAccessKey || '';
    this.sessionToken = credentials.SessionToken || '';
    this.expiration = credentials.Expiration || new Date();
  }
  
  asEnvVars() {
    return {
      AWS_ACCESS_KEY_ID: this.accessKeyId,
      AWS_SECRET_ACCESS_KEY: this.secretAccessKey,
      AWS_SESSION_TOKEN: this.sessionToken,
      AWS_REGION: this.region,
    }
  }
}

export default CredentialsContext;
