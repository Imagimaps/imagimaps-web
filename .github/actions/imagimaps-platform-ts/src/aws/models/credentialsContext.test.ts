
import CredentialsContext from './credentialsContext';

let awsAccountId = '123456789012';
let awsRegion = 'ap-southeast-2';
let futureDate: Date;

describe('CredentialsContext', () => {
    beforeEach(() => {
        futureDate = new Date();
        futureDate.setHours(futureDate.getHours() + 1);
    });

    it('should return a new instance of CredentialsContext', () => {
        const credentialsContext = new CredentialsContext(awsAccountId, awsRegion, {
            AccessKeyId: 'accessKeyId',
            SecretAccessKey: 'secretAccess',
            SessionToken: 'sessionToken',
            Expiration: futureDate,
        });

        expect(credentialsContext).toBeInstanceOf(CredentialsContext);
    });

    it('should be able to destructure the credentials context', () => {
        const credentialsContext = new CredentialsContext(awsAccountId, awsRegion, {
            AccessKeyId: 'accessKeyId',
            SecretAccessKey: 'secretAccess',
            SessionToken: 'sessionToken',
            Expiration: futureDate,
        });

        const { accountId, region, accessKeyId, secretAccessKey, sessionToken, expiration } = credentialsContext;

        expect(accountId).toBe(awsAccountId);
        expect(region).toBe(awsRegion);
        expect(accessKeyId).toBeTruthy
        expect(secretAccessKey).toBeTruthy
        expect(sessionToken).toBeTruthy
        expect(expiration).toBeInstanceOf(Date);
    });

    it('should be able to transform the credentials context to directly usable env variables', () => {
        const credentialsContext = new CredentialsContext(awsAccountId, awsRegion, {
            AccessKeyId: 'accessKeyId',
            SecretAccessKey: 'secretAccess',
            SessionToken: 'sessionToken',
            Expiration: futureDate,
        });

        const env = credentialsContext.asEnvVars();

        expect(env.AWS_ACCESS_KEY_ID).toBeTruthy();
        expect(env.AWS_SECRET_ACCESS_KEY).toBeTruthy();
        expect(env.AWS_SESSION_TOKEN).toBeTruthy();
        expect(env.AWS_REGION).toBe(awsRegion);
    });
});
