<a href="https://indykite.com">
    <img src="logo.png" alt="IndyKite logo" title="IndyKite.ID" align="right" width="200"/>
</a>

# IndyKite Client Libraries for Node.js
IndyKite is a cloud identity platform built to secure and manage human & non-person (IoT) identities and their data. This repository containts the JavaScript Library packages for [IndyKite Platform](https://indykite.com/platform) Client SDK.

[![NPM version](https://img.shields.io/npm/v/@indykiteone/jarvis-sdk-node.svg?style=flat-square)](https://www.npmjs.com/package/@indykiteone/jarvis-sdk-node)
![npm type definitions](https://img.shields.io/npm/types/@indykiteone/jarvis-sdk-node?style=flat-square)
[![codecov](https://codecov.io/gh/indykite/jarvis-sdk-node/branch/master/graph/badge.svg?token=G6T2UWO9G1)](https://codecov.io/gh/indykite/jarvis-sdk-node)


Examples of functionality available in SDK:
* Token Introspection
* CRUD Operations on Digital Twins 
* Change Password 
* Limited Configuration Management

In order to access to the platform you must obtain an API key first. This key can be obtained either from the [Admin Console](https://indykite.id) or request one from your point of contact at IndyKite.

## Terminology

| Definition | Description |
| ---------- | ----------- |
| Digital Twin | A digital twin is the digital identity of a physical entity on/in a software/identity system |
| Application Space ID | ID of the application where the digital twin belongs to |
| Application Agent ID | ID of the agent which makes the application available for the different calls |
| Tenant ID | ID of the tenant where the digital twin belongs to. The tenant is belong to an application space |
| Private Key and Settings | The secret which required to reach the system. Indykite provides the necessary secrets |
| Property | The digital twin's property (eg.: email, name) |
| JWT | JSON Web Tokens |
| Introspect | A process used to validate the token and to retrieve properties assigned to the token |
| Patch property | Add, change or delete a property of a digital twin |

## Documentation
Visit the IndyKite One Developer Community site for official [IndyKite documentation](https://indykite.one/blog?category=5e3e9297-3451-4b52-91ee-8027dcd1789c) and to find out how to use the entire platform for your project.

## Installation 
```shell 
npm i @indykiteone/jarvis-sdk-node
```

## Getting Started

### Trial
For a trial please contact [IndyKite](https://www.indykite.com/contact-us) to setup and
configure the platform.

### Config 
The IndyKite SDK reads config properties from a JSON formatted configuration file. The path to this file is provided to your application via an environment variable  Once you have the config information (After you've registered and setup an application space) then you need to create the json file (you can find an example here: [example_config.json](jarvis-proto-sdk/config_example.json)) then create the `INDYKITE_APPLICATION_CREDENTIALS_FILE` environment variable which will contain the path to the json configuration file (see the example below).

```shell
export INDYKITE_APPLICATION_CREDENTIALS_FILE=<path_to_config_file>/config.json
```

### Service account config 
In order to make some changes to your spaces you have to have a file with your service account credentials. You can create this file using the indykite.id platform where you need to select your customer space, select the `Service accounts` item from the left menu and finally add a new service account. Then you have to create the `INDYKITE_SERVICE_ACCOUNT_CREDENTIALS_FILE` environment variable with the path to the credentials file you have downloaded.
```shell
export INDYKITE_SERVICE_ACCOUNT_CREDENTIALS_FILE=<path_to_service_account_file>/service_account.json
```

### Import the SDK into your application
```typescript
import { IdentityClient, TokenInfo } from '@indykiteone/jarvis-sdk-node';
import { Property } from '@indykiteone/jarvis-sdk-node';
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








## Roadmap 
Checkout our roadmap on our [issues page](https://github.com/indykite/jarvis-sdk-nodejs-proto/issues)

## Contributing 
[Contribution guidelines for this project](contributing.md)

## Support, Feedback, Connect with other developers
We'd love to have you connect with us or other community developers over at [IndyKite.one](https://indykite.one) 

Feel free to file a bug, submit an issue or give us feedback on our [issues page](https://github.com/indykite/jarvis-sdk-node/issues)

## Vulnerability Reporting
[Responsible Disclosure](responsible_disclosure.md)

## Changelog 
Coming Soon!

## Contributers / Acknowledgements
Coming Soon!

## What is IndyKite 
IndyKite is a cloud identity platform built to secure and manage human & non-person (IoT) identities and their data. Based on open source standards, the cloud platform gives developers the ability to secure data and embed identity controls into their Web 3.0 applications. Empowering the world’s 23 million developers without the need to involve security and identity specialists.

## License
[This project is licensed under the terms of the Apache 2.0 license.](LICENSE)