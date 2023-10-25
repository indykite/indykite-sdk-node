import { IdentityClient } from '../sdk/identity';
import { Property } from '../sdk/model';

const userToken = process.env.USER_TOKEN || 'MISSING_TOKEN';

IdentityClient.createInstance()
  .then(async (sdk) => {
    const tokenInfo = await sdk.introspectToken(userToken);
    console.log('Token introspection', JSON.stringify(tokenInfo, null, 2));
    if (!tokenInfo.active || !tokenInfo.subject) {
      console.log('Inactive token, or missing subject, boring...');
      return;
    }

    const dtId = tokenInfo.subject.id;
    const tId = tokenInfo.subject.tenantId;
    console.log(`Digital Twin UUID: ${dtId}, Tenant UUID: ${tId}`);

    // Get Digital Twin using token
    const dtResp = await sdk.getDigitalTwin(dtId, tId, ['email']);
    console.log('Digital Twin:', JSON.stringify(dtResp, null, 2));

    if (!dtResp.digitalTwin) {
      console.log('Missing DigitalTwin?');
      return;
    }

    const dt = dtResp.digitalTwin;

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

    const patchResp = await sdk.patchProperties(dtId, tId, dt);
    console.log('Patch by token response:', JSON.stringify(patchResp, null, 2));

    // const randPwd = Math.random().toString(36).slice(2);
    // console.log(`Random generated password: ${randPwd}`);

    // const delResp = await sdk.deleteDigitalTwin(dtId, tId);
    // console.log('Delete by token', JSON.stringify(delResp, null, 2));
  })
  .catch((err) => {
    console.error(err);
  });
