# IndyKite SDK Documentation
The IndyKite SDK contains documentation and samples that can be useful when developing an applicaton that integrates with the IndyKite identity fabric.

## Importing the SDK

```javascript
import { IdentityClient } from '@martinkite/jarvis-client-sdk';
import { PatchPropertiesBuilder, Property } from '@martinkite/jarvis-client-sdk';
```
---
## newClient()

### Description
Initializes a new instance of the IdentityClient class which is then used to call the following methods listed below.

### Examples

```typescript
const sdk = await IdentityClient.newClient();
```

### Arguments:
None

### Responses:

#### Success:
instantiated object is returned.

#### Failure:

###### Missing Application Credentials:
When the SDK is unable to locate the application credentials. These credentials created from the IndyKite console and are typically provided to the SDK in the config.json. The SDK looks for an environment variable that contains the path or the config objects.

**Example**:

```json
{
  "code": 1,
  "description": "missing application credentials"
}
```
---

## changeMyPassword() (changePasswordByToken)
### Description
Change a users password by providing a bearer token which was created after authenticating the user. Returns a promise.

### Examples
```typescript
const changeMyPwd = await sdk.changeMyPassword(userToken, 'Password');
```

### Parameters
```text
token: (string) - bearer token received when user authenticated.
```
```text
password: (string) - A string representation of the new password to update for a given digital twin. Must be at least the minimum length based on the current policy.
```
---
## changePasswordOfDigitalTwin() (changePassword)
### Description
Returns a promise.

### Examples
```typescript
const changePwd = await sdk.changePasswordOfDigitalTwin(dtId, tId, 'Password');
```

### Parameters

```text
digitalTwinId: (Buffer) - This is the UUID formatted id that uniquely identifies this user within a tenant.  Can be found in the Access Token as subject.id.
```
```text
tenantId: (Buffer) - The UUID formatted id that uniquely identifies the tenant for which a given subject can be found. Can be found in the Access Token as subject.tenantId.
```
```text
password: (string) - A string representation of the new password to update for a given digital twin. Must be at least the minimum length based on the current policy.
```
---

## getDigitalTwinByToken()
### Description
Return the properties/attributes of a digital twin

### Examples
```typescript
const dtByToken = await sdk.getDigitalTwinByToken(userToken, [
        'email',
        '_test0011',
        'mobile',
      ]);
```
### Responses

#### Success:
If token is valid the response will return a JSON formatted payload similar to this example below:

```JSON
{
  "digitalTwin": {
    "id": "9936cb51-dc35-4749-a748-6a7c7d5918a3",
    "tenantId": "696e6479-6b69-4465-8000-030f00000002",
    "kind": 0,
    "state": 0,
    "createTime": "2021-06-28T20:18:27.202Z",
    "properties": {
      "email": [
        {
          "id": "4a989c48379ef4e3",
          "property": "email",
          "value": "arielle.bahringer@gmail.com",
          "meta": {
            "primary": true,
            "assuranceLevel": 1,
            "issuer": "app:aW5keWtpRGWAAAIPAAAAAA"
          }
        }
      ]
    }
  },
  "tokenInfo": {
    "appSpaceId": "696e6479-6b69-4465-8000-010f00000000",
    "applicationId": "696e6479-6b69-4465-8000-020f00000000",
    "authenticationTime": "2021-06-28T20:18:31.327Z",
    "customerId": "696e6479-6b69-4465-8000-00000000000f",
    "expireTime": "2021-06-28T21:18:30.438Z",
    "issueTime": "2021-06-28T20:18:31.327Z",
    "subject": {
      "id": "9936cb51-dc35-4749-a748-6a7c7d5918a3",
      "tenantId": "696e6479-6b69-4465-8000-030f00000002",
      "kind": 0,
      "state": 0
    },
    "providerInfo": [
      {
        "type": "password",
        "issuer": "indykite.id"
      }
    ]
  }
}
```
---
## introspectToken()
### Description
Verify a bearer token has not expired or been revoked and also can be used to retrieve claims (properties) from this token.

### Example:
```typescript
const tokenInfoResponse = await sdk.introspectToken(userToken);
```

### Arguments:
userToken (JWT bearer token)

### Additional Methods:
##### tokenInfoResponse.active
Returns true/false

##### tokenInfoResponse.appSpaceId
Returns UUID formated application space id
AppSpaceId: 696e6479-6b69-4465-8000-010f00000000

##### tokenInfoResponse.applicationId
Returns UUID formated application id
 ApplicationId: 696e6479-6b69-4465-8000-020f00000000,

##### tokenInfoResponse.authenticationTime
Returns long format date of time the credential was authenticated and token was generated

AuthenticationTime: Wed Jun 23 2021 09:31:32 GMT-0400 (Eastern Daylight Time)

##### tokenInfoResponse.customerId
Customer Id: 696e6479-6b69-4465-8000-00000000000f

##### tokenInfoResponse.expireTime
Expire Time: Wed Jun 23 2021 10:31:31 GMT-0400 (Eastern Daylight Time)

##### tokenInfoResponse.impersonated
Impersonated: undefined

##### tokenInfoResponse.issueTime
Issue Time: Wed Jun 23 2021 09:31:32 GMT-0400 (Eastern Daylight Time)

##### tokenInfoResponse.providerInfo
Provider Info: [object Object]

##### tokenInfoResponse.subject
Subject: [object Object]


### Responses:

#### Success:
###### Active Token
You can view the contents of the token by converting the token into a JSON string and then printing that object:

###### Examples
```json
console.log('Token introspection', JSON.stringify(tokenInfo, null, 2));
```

##### Output

```json
{
  "active": true,
  "appSpaceId": "696e6479-6b69-4465-8000-010f00000000",
  "applicationId": "696e6479-6b69-4465-8000-020f00000000",
  "authenticationTime": "2021-06-12T16:22:19.931Z",
  "customerId": "696e6479-6b69-4465-8000-00000000000f",
  "expireTime": "2021-06-12T17:22:19.574Z",
  "issueTime": "2021-06-12T16:22:19.931Z",
  "subject": {
    "id": "30a2e386-0e99-43c8-90b5-4374186e574e",
    "tenantId": "696e6479-6b69-4465-8000-030f00000002",
    "kind": 0,
    "state": 0
  },
  "providerInfo": [
    {
      "type": "password",
      "issuer": "indykite.id"
    }
  ]
}
```

### Failure:

###### Inactive Token
When the user token is not provided or is no longer active (e.g. has expired)

###### Example

```json
Token introspection {
  "active": false
}
Inactive token. No further actions
```

Invalid or Expired Token:
```json
{
  "code": 3,
  "details": "invalid or expired access_token",
  "metadata": {
    "internalRepr": {},
    "options": {}
  }
}
```

###### Missing Token
```json
Token introspection {
  "active": false
}
{}
Error: Token must be 32 chars or more.
```

###### No Connection Established
When the client is unable to connect to the backend services.  Check to see if you are using the correct certificates or have have overridden the defaults with an incorrect environment variable.

```json
{
  "code": 14,
  "details": "No connection established",
  "metadata": {
    "internalRepr": {},
    "options": {}
  }
}
```
