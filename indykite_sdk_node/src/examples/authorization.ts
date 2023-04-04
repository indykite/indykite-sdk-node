import { AuthorizationClient } from '../sdk/authorization';

const userToken = process.env.USER_TOKEN || 'MISSING_TOKEN';

AuthorizationClient.createInstance()
  .then(async (sdk) => {
    const resp = await sdk.isAuthorizedByToken(userToken, [
      {
        type: 'ParkingLot',
        id: 'lotA',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        id: 'lotB',
        actions: ['HAS_FREE_PARKING'],
      },
    ]);
    console.log(JSON.stringify(resp, null, 2));
  })
  .catch((err) => {
    console.error(err);
  });
