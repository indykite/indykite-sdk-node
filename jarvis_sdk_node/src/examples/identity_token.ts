import { IdentityClient } from '../sdk/identity';
import { Property } from '../sdk/model';

const userToken = process.env.USER_TOKEN || 'MISSING_TOKEN';

IdentityClient.createInstance()
  .then(async (sdk) => {
    const tokenInfo = await sdk.introspectToken(userToken);
    console.log('Token introspection', JSON.stringify(tokenInfo, null, 2));
    if (!tokenInfo.active) {
      console.log('Inactive token, boring...');
      return;
    }

    // Get Digital Twin using token
    const dtByToken = await sdk.getDigitalTwinByToken(userToken, ['email']);
    console.log('Digital Twin By Token:', JSON.stringify(dtByToken, null, 2));

    if (!dtByToken.digitalTwin) {
      console.log('Missing DigitalTwin?');
      return;
    }

    const dt = dtByToken.digitalTwin;

    // Examples of getting properties
    console.log('Get email property:', dt.getProperty('email'));
    console.log('Get email value:', dt.getPropertyValue('email'));
    console.log('Get email value:', dt.getProperty('email')?.value);
    console.log('Get all email properties:', dt.getProperties('email'));

    const randString = Math.random().toString(36).slice(2);
    const email = `test+example_${randString}@indykite.com`;
    console.log(`Generated email: ${email}`);

    // Delete all email those value starts with test+example_
    dt.getProperties('email')
      .filter((p) => (p.value as string).startsWith('test+example_'))
      .forEach((p) => {
        dt.deleteProperty(p);
      });

    // Add new property or value
    dt.addProperty(new Property('email').withValue(email));

    // Change property metadata (primary)
    const primaryEmail = dt.getProperty('email');
    if (primaryEmail) {
      dt.updatePropertyMetadata(primaryEmail, false);
    }

    console.log(JSON.stringify(dt.getPatchOperation(), null, 2));
    const patchByToken = await sdk.patchPropertiesByToken(userToken, dt);
    console.log('Patch by token response:', JSON.stringify(patchByToken, null, 2));

    // const randPwd = Math.random().toString(36).slice(2);
    // console.log(`Random generated password: ${randPwd}`);

    // sdk
    //   .changePasswordByToken(userToken, randPwd)
    //   .then(() => console.log('Password changed'))
    //   .catch((err) => console.log('Password not changed due to:', JSON.stringify(err, null, 2)));

    // const delByToken = await sdk.deleteDigitalTwinByToken(userToken);
    // console.log('Delete by token', JSON.stringify(delByToken, null, 2));
  })
  .catch((err) => {
    console.error(err);
  });
