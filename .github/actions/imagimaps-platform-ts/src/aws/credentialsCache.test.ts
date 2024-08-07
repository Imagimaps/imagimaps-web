import { Credentials } from '@aws-sdk/client-sts';
import CredentialsCache from './credentialsCache';
import CredentialsContext from './models/credentialsContext';

let awsAccountId = '123456789012';
let region = 'ap-southeast-2';

describe('CredentialsCache', () => {
    it('should return a new instance of CredentialsCache', () => {
        const credentialsCache = new CredentialsCache();
        expect(credentialsCache).toBeInstanceOf(CredentialsCache);
    });

    it('should return nothing if there is nothing in cache', () => {
        const credentialsCache = new CredentialsCache();

        const fetched = credentialsCache.get(awsAccountId, region);

        expect(fetched).toBeUndefined();
    });

    it('should return cached credentials', () => {
        const credentialsCache = new CredentialsCache();
        const futureDate = new Date();
        futureDate.setHours(futureDate.getHours() + 1);
        const stsCredentials: Credentials = {
            AccessKeyId: 'accessKeyId',
            SecretAccessKey: 'secretAccessKey',
            SessionToken: 'sessionToken',
            Expiration: futureDate,
        };
        const credentialsContext = new CredentialsContext(awsAccountId, region, stsCredentials);

        credentialsCache.set(awsAccountId, region, credentialsContext);

        const fetched = credentialsCache.get(awsAccountId, region);

        expect(fetched).toEqual(credentialsContext);
    });

    it('should return nothing if cached credentials are expired', () => {
        const credentialsCache = new CredentialsCache();
        const expiredDate = new Date();
        expiredDate.setSeconds(expiredDate.getSeconds() - 1);
        const stsCredentials: Credentials = {
            AccessKeyId: 'accessKeyId',
            SecretAccessKey: 'secretAccessKey',
            SessionToken: 'sessionToken',
            Expiration: expiredDate,
        };
        const credentialsContext = new CredentialsContext(awsAccountId, region, stsCredentials);

        credentialsCache.set(awsAccountId, region, credentialsContext);

        const fetched = credentialsCache.get(awsAccountId, region);

        expect(fetched).toBeUndefined();
    });
});
