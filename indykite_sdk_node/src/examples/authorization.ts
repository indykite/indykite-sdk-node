import { AuthorizationClient } from '../sdk/authorization';

const userToken = process.env.USER_TOKEN || 'MISSING_TOKEN';

AuthorizationClient.createInstance()
  .then(async (sdk) => {
    const resp = await sdk.isAuthorizedByToken(userToken, [
      {
        type: 'ParkingLot',
        externalId: 'lotA',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        externalId: 'lotB',
        actions: ['HAS_FREE_PARKING'],
      },
    ]);
    console.log(JSON.stringify(resp, null, 2));
  })
  .catch((err) => {
    console.error(err);
  });

AuthorizationClient.createInstance()
  .then(async (sdk) => {
    const resp = await sdk.IsAuthorizedByExternalID(
      {
        type: 'Individual',
        externalId: '125478',
      },
      [
        {
          type: 'ParkingLot',
          externalId: 'parking-lot-id1',
          actions: ['HAS_FREE_PARKING'],
        },
        {
          type: 'ParkingLot',
          externalId: 'parking-lot-id2',
          actions: ['HAS_FREE_PARKING'],
        },
      ],
    );
    console.log(JSON.stringify(resp, null, 2));
  })
  .catch((err) => {
    console.error(err);
  });
