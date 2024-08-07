import * as core from '@actions/core'

import CredentialsContext from "./models/credentialsContext";

class CredentialsCache {
    private cache: Map<string, CredentialsContext>;
    
    constructor() {
        this.cache = new Map();
    }
    
    get(awsAccountId: string, region: string) {
        const key = `${awsAccountId}/${region}`;
        const fetched = this.cache.get(key);

        if (fetched) {
            const expiration = fetched.expiration;
            if (expiration && expiration < new Date()) {
                core.info(`Credentials for account ID: ${awsAccountId} have expired`);
                core.debug(`Removing expired credentials from cache: ${JSON.stringify(fetched)}`);
                this.cache.delete(key);
                return undefined;
            }
        }

        return fetched;
    }
    
    set(awsAccountId: string, region: string, credentials: CredentialsContext) {
        const key = `${awsAccountId}/${region}`;
        this.cache.set(key, credentials);
    }
}

export default CredentialsCache;
