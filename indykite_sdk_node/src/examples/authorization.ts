import { AuthorizationClient } from '../sdk/authorization';
import { AuthorizationResource, DigitalTwinIdentifier } from '../sdk/model';

const userToken = process.env.USER_TOKEN || 'MISSING_TOKEN';

AuthorizationClient.createInstance()
  .then(async (sdk) => {
    const resp = await sdk.isAuthorized(
      DigitalTwinIdentifier.fromToken(userToken),
      [
        new AuthorizationResource('lotA', 'ParkingLot'),
        new AuthorizationResource('lotB', 'ParkingLot'),
      ],
      ['HAS_FREE_PARKING'],
    );
    console.log(JSON.stringify(resp, null, 2));
  })
  .catch((err) => {
    console.error(err);
  });
