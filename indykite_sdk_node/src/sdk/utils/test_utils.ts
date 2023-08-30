export const applicationTokenMock = {
  appAgentId: 'gid:mockedGid',
  endpoint: 'example.com',
  privateKeyJWK: {
    kty: 'EC',
    d: 'd-size',
    use: 'sig',
    crv: 'P-256',
    kid: 'kid-token',
    x: '2cx4aENdH7GTOj5hQCfvvAqZ3HwpFLfi4mo_nK7D4q0',
    y: 'eknOKcgBUdaak2ZS2NHCEBWcdoLiZ1u7vCIoWZCs8WI',
    alg: 'ES256',
  },
  tokenLifetime: '30m',
};

export const serviceAccountTokenMock = {
  serviceAccountId: 'gid:mocked-gid',
  endpoint: 'example.com',
  privateKeyJWK: {
    kty: 'EC',
    d: 'd-size',
    use: 'sig',
    crv: 'P-256',
    kid: 'kid-token',
    x: '2cx4aENdH7GTOj5hQCfvvAqZ3HwpFLfi4mo_nK7D4q0',
    y: 'eknOKcgBUdaak2ZS2NHCEBWcdoLiZ1u7vCIoWZCs8WI',
    alg: 'ES256',
  },
  tokenLifetime: '1h30m',
};

export const generateRandomGID = () => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-';
  for (let i = 0; i < 27; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return 'gid:' + result;
};
