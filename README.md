<a href="https://indykite.com">
    <img src="logo.png" alt="IndyKite logo" title="IndyKite.ID" align="right" width="200"/>
</a>

# IndyKite Client Libraries for Node.js
IndyKite is a cloud identity platform built to secure and manage human & non-person (IoT) identities and their data. This repository contains the JavaScript Library packages for [IndyKite Platform](https://indykite.com/platform) Client SDK.

[![NPM version](https://img.shields.io/npm/v/@indykiteone/indykite-sdk-node.svg?style=flat-square)](https://www.npmjs.com/package/@indykiteone/indykite-sdk-node)
![npm type definitions](https://img.shields.io/npm/types/@indykiteone/indykite-sdk-node?style=flat-square)
[![codecov](https://codecov.io/gh/indykite/indykite-sdk-node/branch/master/graph/badge.svg?token=G6T2UWO9G1)](https://codecov.io/gh/indykite/indykite-sdk-node)

## Documentation
[IndyKite documentation](https://docs.indykite.com)

## Terminology

[IndyKite glossary](https://docs.indykite.com/docs/references/glossary)

## Getting started
Use these instructions to install the SDK and configure your environment.

### Prerequisites
* An installation of Node.js. See https://nodejs.org for instructions for how to install Node.js on your specific operating system.
* AppAgent credentials and Service account credentials. These can be obtained from the [Hub](https://indykite.id).


### Installation 
```shell 
npm i @indykiteone/indykite-sdk-node
```

or

```shell
yarn add @indykiteone/indykite-sdk-node
```

### Config 
The IndyKite SDK reads config properties from a JSON formatted configuration file. The path to this file is provided to your application via an environment variable  Once you have the config information (After you've registered and set up an application space) then you need to create the json file (you can find an example here: [example_config.json](https://github.com/indykite/indykite-sdk-node/blob/master/indykite_sdk_node/config_example.json)) then create the `INDYKITE_APPLICATION_CREDENTIALS_FILE` environment variable which will contain the path to the json configuration file (see the example below).

 Optional parameters:
 - baseUrl
 - defaultTenantId
 - endpoint
 - tokenLifetime

#### *tokenLifetime*
A token lifetime is 1h by default. You can change this time (from 2 minutes to 24h) by adding a tokenLifetime parameter.
It will have to be human-readable and Golang-like see -> https://pkg.go.dev/time#ParseDuration

Examples: 30m, 1.5h, 2h45m
```json
{
  ...
  "tokenLifetime": "30m"
}
```


```shell
export INDYKITE_APPLICATION_CREDENTIALS_FILE=<path_to_config_file>/config.json
```

### Service account config 
In order to make some changes to your spaces you have to have a file with your service account credentials. You can create this file using the indykite.id platform where you need to select your customer space, select the `Service accounts` item from the left menu and finally add a new service account. Then you have to create the `INDYKITE_SERVICE_ACCOUNT_CREDENTIALS_FILE` environment variable with the path to the credentials file you have downloaded.
```shell
export INDYKITE_SERVICE_ACCOUNT_CREDENTIALS_FILE=<path_to_service_account_file>/service_account.json
```

### Custom SSL certificate
In case you want to use your own SSL certificate for the communication with the server, you can create the `GRPC_DEFAULT_SSL_ROOTS_FILE_PATH` environment variable with the path to to the certificate.
```shell
export GRPC_DEFAULT_SSL_ROOTS_FILE_PATH=<path_to_certificate>/ca.pem
```

### Import the SDK into your application
```typescript
import { IdentityClient, TokenInfo } from '@indykiteone/indykite-sdk-node';
import { Property } from '@indykiteone/indykite-sdk-node';
```

### Creating a new client connection & reading the user token from env
```typescript
async function getConnection() {

  console.log("Starting Get Connection");
  const sdk = await IdentityClient.createInstance();

  return sdk;
}
```

### To introspect a user token
```typescript
async function tokenIntrospect(sdk:IdentityClient) {

  console.log("Starting tokenIntrospect");
  const tokenInfo = await sdk.introspectToken(userToken);
  console.log('Token introspection', JSON.stringify(tokenInfo, null, 2))
  console.log('Token Active: ', tokenInfo.active);
  console.log('Token appSpaceId: ', tokenInfo.appSpaceId);
  console.log('Token applicationId: ', tokenInfo.applicationId);
  console.log('Token authenticationTime: ', tokenInfo.authenticationTime);
  console.log('Token customerId: ', tokenInfo.customerId);
  console.log('Token expireTime: ', tokenInfo.expireTime);
  console.log('Token impersonated: ', tokenInfo.impersonated);
  console.log('Token issueTime: ', tokenInfo.issueTime);
  console.log('Token providerInfo: ', tokenInfo.providerInfo);
  console.log('Token subject: ', tokenInfo.subject);

  return tokenInfo;
}
```
The tokeninfo object has several methods that can be used to get a variety of details related to the introspected token.

**tokenInfo.active**: boolean (true/false) - will return true if the token is still active

**tokenInfo.subject.id**: The UUID formated id that identifies the subject of the token 

**tokenInfo.customerId**: The UUID formatted id that identifies the customer subscription

**tokenInfo.subject.tenantId**: The UUID formatted id that identifies the tenant that the subject belongs to

**tokenInfo.appSpaceId**: The UUID formatted id that identifies the Customer Application Space

**tokenInfo.applicationId**: The UUID formatted id that identifies the application profile that was created for the application that you are developing.

**tokenInfo.authenticationTime**: The time that the subject initially authenticated

**tokenInfo.expireTime**: The time that the token will expire.

**tokenInfo.impersonated**:

**tokenInfo.issueTime**: The time that the token was initially issued 

**tokenInfo.providerInfo**: The token provider url

### Retrieving a Digital Twin using a token
```typescript
async function getDT(sdk:IdentityClient) {

  console.log("Starting getDT");
  const dtByToken = await sdk.getDigitalTwinByToken(userToken, ['email']);

  return dtByToken;
}
```
### Implementing Forgot Password
```typescript
async function forgotPassword(sdk:IdentityClient) {

  console.log("Starting forgetPassword");
  // startForgottenPasswordFlow(digitalTwinId: Buffer, tenantId: Buffer): Promise<StartForgottenPasswordFlowResponse>

  const digitalTwin = getDT(sdk);
  const dt = (await digitalTwin).digitalTwin;

  if (!dt) {
    console.log('Missing DigitalTwin?');
    return;
  }

  const digitalTwinID = dt.id;
  const digitalTwinTenantID = dt.tenantId;
  
  const forgotPasswordResponse = await sdk.startForgottenPasswordFlow(Utils.uuidToString(digitalTwinID), Utils.uuidToString(digitalTwinTenantID));
}
```

### Changing DT passwords
```typescript
async function changePass(sdk:IdentityClient) {
  
  // changePassword(digitaltwinid, tenantid, password)
  // changePasswordByToken

  console.log("Starting changePass()");

  const digitalTwin = getDT(sdk);
  const dt = (await digitalTwin).digitalTwin;

  if (!dt) {
    console.log('Missing DigitalTwin?');
    return;
  }

  const digitalTwinID = dt.id
  const digitalTwinTenantID = dt.tenantId;
  var newPassword = 'MyNewPassword'; 

  // changePassword(digitaltwinid, tenantid, password)
  console.log("Digital Twin ID: ", digitalTwinID);
  console.log("Tenant ID: ", digitalTwinTenantID);
  console.log("Password: ", newPassword);

  console.log("changePassword() function called");
  const changePasswordResponse = await sdk.changePassword(digitalTwinID, digitalTwinTenantID, newPassword);
  console.log("Change Password Resp: ", changePasswordResponse);
}

```

### Fetch DT properties using a token
```typescript
async function getProperty(sdk:IdentityClient) {

  console.log("Starting Get Property");
  
  // TODO:
  // getDigitalTwin(digitalTwinId, tenantId, properties) 

  // Get Digital Twin using token
  const digitaltwin = getDT(sdk);
  const dt = (await digitaltwin).digitalTwin;
  console.log('Digital Twin By Token:', JSON.stringify(dt, null, 2));

  if (!dt) {
    console.log('Missing DigitalTwin?');
    return;
  }

  // Examples of getting properties
  console.log('Get email property:', dt.getProperty('email'));
  console.log('Get email value:', dt.getPropertyValue('email'));
  console.log('Get email value:', dt.getProperty('email')?.value);
  console.log('Get all email properties:', dt.getProperties('email'));
}
```
### Add properties to a DT 
```typescript
async function addProperty(sdk:IdentityClient) {

  console.log("Starting add Property");

  const digitaltwin = getDT(sdk);
  const dt = (await digitaltwin).digitalTwin;
  
  if (!dt) {
    console.log('Missing DigitalTwin?');
    return;
  }
  const tid = dt.tenantId;

  const email = getRandomEmail();

  dt.addProperty(new Property('email').withValue(email));

```

### Patching the database after adding a new property 
```typescript
  // patchProperties() 
  console.log("PatchProperties(): ");
  const patch = await sdk.patchProperties(dt.id, tid, dt);
  console.log('Patch Response: ', JSON.stringify(patch, null, 2));

  // or 

  // patchPropertiesByToken to save the changes to the remote database
  console.log("patchPropertiesByToken(): ")
  console.log("Get Patch Operation: " + JSON.stringify(dt.getPatchOperation(), null, 2));
  const patchByToken = await sdk.patchPropertiesByToken(userToken, dt); 
  console.log('Patch by token response:', JSON.stringify(patchByToken, null, 2));
```

### Updating existing DT properties
```typescript
async function updateProp(sdk:IdentityClient) {

  console.log("Starting updateProperty()");

  const digitalTwin = getDT(sdk);
  const dt = (await digitalTwin).digitalTwin;

  if (!dt) {
    console.log('Missing DigitalTwin?');
    return;
  }

  const digitalTwinID = dt.id
  const digitalTwinTenantID = dt.tenantId;
  const email = 'brad.tumy@indykite.com';
  
  console.log("Update the DT with this email: ", email);
  dt.updatePropertyValue(new Property('email'), email);
  console.log("Get Patch Operation: " + JSON.stringify(dt.getPatchOperation(), null, 2));
  
  const patch = await sdk.patchProperties(digitalTwinID, digitalTwinTenantID, dt);
  console.log('Get all email properties:', await dt.getProperties('email')); 
}
```

### Enriching access token

You can enrich an access token with token claims and session claims with the following code:
```typescript
async function enrichToken(sdk:IdentityClient) {
  const tokenClaims = {
    stringClaim: "stringValue",
    numberClaim: 42,
    mapClaim: {
      key: "value",
    },
  };

  const sessionClaims = {
    boolClaim: true,
    nullClaim: null,
    arrayClaim: ["stringValue"]
  };

  await sdk.enrichToken(userToken, tokenClaims, sessionClaims);
}
```

> Note: You need to refresh the access token so that the access token is enriched with the claims.

### Read after write consistency (Config client only)

To make sure you are not reading cached data, use the bookmark feature. Every function which makes a change in the database returns a bookmark. This will ensure that you are not getting data from before this bookmark was created. See the following examples for more information.
```ts
ConfigClient.createInstance()
  .then(async (sdk) => {
    const appSpace = await sdk.readApplicationSpaceByName('customer-id', 'my-app-space');
    appSpace.description = 'My new description';
    await sdk.updateApplicationSpace(appSpace);

    // This will return a bookmark created after the last call
    const bookmark = sdk.getLastBookmark();

    // Using the bookmark, we will use the database state after the `updateApplicationSpace` call
    const updatedAppSpace = await sdk.readApplicationSpaceByName(
      'customer-id',
      'my-app-space',
      [ bookmark ],
    );
  })
  .catch((err) => console.error(err));
```
a different approach
```ts
ConfigClient.createInstance()
  .then(async (sdk) => {
    const appSpace = await sdk.readApplicationSpaceByName('customer-id', 'my-app-space');
    appSpace.description = 'My new description';

    // This will create an empty array where all created bookmarks will be stored
    sdk.startBookmarkRecording();
    await sdk.updateApplicationSpace(appSpace);

    // This will return the list of bookmarks
    const bookmarks = sdk.stopBookmarkRecording();

    const updatedAppSpace = await sdk.readApplicationSpaceByName(
      'customer-id',
      'my-app-space',
      bookmarks,
    );
  })
  .catch((err) => console.error(err));
```

## SDK Development

Look into using `npm link` in case you want to develop the lib with the app  
https://medium.com/dailyjs/how-to-use-npm-link-7375b6219557

In case you update the response don't forget to update CommonJS docs and also
any typescript definitions.

Commit message follows [commit guidelines](./doc/guides/commit-message.md#commit-message-guidelines)

## Roadmap 
Check out our roadmap on our [issues page](https://github.com/indykite/indykite-sdk-node/issues)

## Contributing and connecting with developers
[Contribution guidelines for this project](contributing.md)

## Support and feedback
Feel free to file a bug, submit an issue, or give us feedback on our [issues page](https://github.com/indykite/indykite-sdk-node/issues)

## Vulnerability Reporting
[Responsible Disclosure](responsible_disclosure.md)

## Changelog 
Coming soon!

## Contributors / Acknowledgements
Coming soon!

## About IndyKite 
IndyKite is building the identity platform for Web 3.0.

IndyKite’s decentralized Identity Platform unlocks contextual insights from identity data to enable businesses to realize greater ROI. With products that securely manage human, IoT,and machine identity, the IndyKite Identity Platform leverages machine learning to deliver context-aware authorization, knowledge driven decisions and risk analytics.

Built on a knowledge graph data model, IndyKite enables developers with flexible APIs through a growing open-source ecosystem.

## License
[This project is licensed under the terms of the Apache 2.0 license.](LICENSE)
