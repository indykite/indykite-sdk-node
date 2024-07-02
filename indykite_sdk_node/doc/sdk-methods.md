# IndyKite SDK Documentation
The IndyKite SDK contains documentation and samples that can be useful when developing an applicaton that integrates with the IndyKite identity fabric.

## Importing the SDK

```javascript
import { IdentityClient } from '@indykiteone/indykite-sdk-node';
import { PatchPropertiesBuilder, Property } from '@indykiteone/indykite-sdk-node';
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
