import 'aws-sdk-client-mock-jest';
import * as core from '@actions/core';
import { STSClient, AssumeRoleWithWebIdentityCommand } from '@aws-sdk/client-sts';
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';
import { expect } from '@jest/globals';

import AwsCredentials from './awsCredentials';

let setFailedMock: jest.SpiedFunction<typeof core.setFailed>;
let getIDTokenMock: jest.SpiedFunction<typeof core.getIDToken>;

let stsClientSendMock: AwsClientStub<STSClient> = mockClient(STSClient);

let futureDate: Date;

describe('AwsCredentials', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    stsClientSendMock.reset();

    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation();
    getIDTokenMock = jest.spyOn(core, 'getIDToken').mockResolvedValue('oidcIdToken');

    futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 1);

    stsClientSendMock.on(AssumeRoleWithWebIdentityCommand).resolves({
      Credentials: {
        AccessKeyId: 'accessKeyId',
        SecretAccessKey: 'secretAccessKey',
        SessionToken: 'sessionToken',
        Expiration: futureDate,
      }
    });
  })

  it('should return a new instance of AwsCredentials with default region', () => {
    const awsCredentials = new AwsCredentials();
    expect(awsCredentials).toBeInstanceOf(AwsCredentials);
  })

  it('should return a new instance of AwsCredentials with specified options', () => {
    const awsCredentials = new AwsCredentials({
      region: 'ap-southeast-2',
    });
    expect(awsCredentials).toBeInstanceOf(AwsCredentials);
  })

  it('should fail the action if an invalid AWS account ID is provided', () => {
    const awsAccountId = '12345678901';
    const awsCredentials = new AwsCredentials();

    awsCredentials.authenticate(awsAccountId);

    expect(setFailedMock).toHaveBeenCalledTimes(1);
  })

  it('should get temporary OIDC credentials for a valid AWS account', async () => {
    const awsAccountId = '123456789012';
    const awsCredentials = new AwsCredentials();

    const authContext = await awsCredentials.authenticate(awsAccountId);

    expect(authContext!.region).toBe('ap-southeast-2');
    expect(authContext!.accountId).toBe(awsAccountId);
    expect(authContext!.accessKeyId).toBeTruthy();
    expect(authContext!.secretAccessKey).toBeTruthy();
    expect(authContext!.sessionToken).toBeTruthy();
    expect(authContext!.expiration).toBeInstanceOf(Date);
  })

  it('should fail the action if an error occurs while retrieving credentials', async () => {
    const awsAccountId = '123456789012';
    const awsCredentials = new AwsCredentials();

    stsClientSendMock.on(AssumeRoleWithWebIdentityCommand).rejects(new Error('Failed to retrieve credentials'));

    await expect(awsCredentials.authenticate(awsAccountId)).rejects.toEqual('Failed to retrieve credentials for account ID: 123456789012');

    expect(setFailedMock).toHaveBeenCalledTimes(1);
  })

  it('should fail the action if there are no credentials returned in the response payload', async () => {
    stsClientSendMock.reset();
    const awsAccountId = '123456789012';
    const awsCredentials = new AwsCredentials();

    stsClientSendMock.on(AssumeRoleWithWebIdentityCommand).resolves({});

    await expect(awsCredentials.authenticate(awsAccountId)).rejects.toEqual('Response yielded no credentials for account ID: 123456789012');

    expect(setFailedMock).toHaveBeenCalled();
  })

  it('should return credentials from cache on multiple calls', async () => {
    const awsAccountId = '123456789012';
    const awsCredentials = new AwsCredentials();

    const authContext = await awsCredentials.authenticate(awsAccountId);
    const cachedContext = await awsCredentials.authenticate(awsAccountId);

    expect(authContext).toEqual(cachedContext);
    expect(stsClientSendMock).toHaveReceivedCommandTimes(AssumeRoleWithWebIdentityCommand, 1);
  })

  it('should be able to authenticate with multiple AWS accounts', async () => {
    const awsAccountId1 = '123456789012';
    const awsAccountId2 = '123456789013';
    const awsCredentials = new AwsCredentials();

    const authContext1 = await awsCredentials.authenticate(awsAccountId1);
    const authContext2 = await awsCredentials.authenticate(awsAccountId2);

    expect(authContext1!.accountId).toBe(awsAccountId1);
    expect(authContext2!.accountId).toBe(awsAccountId2);
    expect(stsClientSendMock).toHaveReceivedCommandTimes(AssumeRoleWithWebIdentityCommand, 2);
  });
})
