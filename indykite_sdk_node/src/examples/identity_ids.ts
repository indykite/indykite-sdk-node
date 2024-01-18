import { IdentityClient } from '../sdk/identity';
import { DigitalTwin } from '../grpc/indykite/identity/v1beta2/model';

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

    // Get Digital Twin using id
    const dtResp = await sdk.getDigitalTwin(
      DigitalTwin.create({
        id: dtId,
        tenantId: tId,
      }),
      [],
    );

    if (!dtResp.digitalTwin) {
      console.log('Missing DigitalTwin?');
      return;
    }

    const dt = dtResp.digitalTwin;

    // Examples of getting properties
    console.log('Get id:', dt.digitalTwin?.id);
    console.log('Get tenant:', dt.digitalTwin?.tenantId);
  })
  .catch((err) => {
    console.error(err);
  });
