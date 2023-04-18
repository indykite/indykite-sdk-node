import { v4 } from 'uuid';
import { ImportDigitalTwinResult } from '../../../grpc/indykite/identity/v1beta2/import';
import { DigitalTwinKind, DigitalTwinState } from '../../../grpc/indykite/identity/v1beta2/model';
import { DigitalTwin } from '../digitaltwin';
import { ImportDigitalTwin, ImportResult } from '../import_digitaltwin';
import { PatchPropertiesBuilder, Property } from '../property';

describe('when a new instance is created', () => {
  const tenantId = v4();
  let instance: ImportDigitalTwin;

  describe('when username and password are simple values', () => {
    describe('when properties are set', () => {
      describe('when metadata is set', () => {
        beforeEach(() => {
          const propertiesBuilder = new PatchPropertiesBuilder();
          propertiesBuilder.addProperty(new Property('email').withValue('admin@example.com'));
          const creationDate = new Date(Date.UTC(2022, 6, 18, 9, 42));
          const lastLoginDate = new Date(Date.UTC(2022, 6, 18, 9, 43));
          const lastRefreshDate = new Date(Date.UTC(2022, 6, 18, 9, 44));

          instance = new ImportDigitalTwin(
            tenantId,
            DigitalTwinKind.PERSON,
            DigitalTwinState.ACTIVE,
            [],
            undefined,
            {
              password: 'myAwesomePassword',
              uid: 'user-name',
            },
            [
              {
                displayName: 'Display Name',
                email: 'user@example.com',
                photoUrl: 'https://example.com/photo.png',
                providerId: 'provider-id',
                uid: 'uid-token',
              },
            ],
            {
              forceDelete: true,
              operations: propertiesBuilder,
            },
            creationDate,
            lastLoginDate,
            lastRefreshDate,
          );
        });

        it('correctly marshals the instance', () => {
          expect(instance.marshal()).toEqual({
            id: '',
            kind: DigitalTwinKind.PERSON,
            state: DigitalTwinState.ACTIVE,
            tags: [],
            tenantId,
            password: {
              password: {
                oneofKind: 'value',
                value: 'myAwesomePassword',
              },
              uid: {
                oneofKind: 'username',
                username: 'user-name',
              },
            },
            properties: {
              forceDelete: true,
              operations: [
                {
                  operation: {
                    oneofKind: 'add',
                    add: {
                      definition: {
                        context: '',
                        property: 'email',
                        type: '',
                      },
                      id: '',
                      value: {
                        oneofKind: 'objectValue',
                        objectValue: {
                          value: {
                            oneofKind: 'stringValue',
                            stringValue: 'admin@example.com',
                          },
                        },
                      },
                    },
                  },
                },
              ],
            },
            providerUserInfo: [
              {
                displayName: 'Display Name',
                email: 'user@example.com',
                photoUrl: 'https://example.com/photo.png',
                providerId: 'provider-id',
                uid: 'uid-token',
              },
            ],
            metadata: {
              creationTimestamp: '1658137320000',
              lastLogInTimestamp: '1658137380000',
              lastRefreshTimestamp: '1658137440000',
            },
          });
        });
      });
    });
  });

  describe('when username is email and password is a hash', () => {
    beforeEach(() => {
      instance = new ImportDigitalTwin(
        tenantId,
        DigitalTwinKind.PERSON,
        DigitalTwinState.ACTIVE,
        [],
        undefined,
        {
          uid: {
            email: 'user123@example.com',
            verified: true,
          },
          password: {
            hash: Buffer.from('hashed-password'),
            salt: Buffer.from('password-salt'),
          },
        },
      );
    });

    it('correctly marshals the instance', () => {
      expect(instance.marshal()).toEqual({
        id: '',
        kind: DigitalTwinKind.PERSON,
        state: DigitalTwinState.ACTIVE,
        tags: [],
        tenantId,
        password: {
          password: {
            oneofKind: 'hash',
            hash: {
              passwordHash: Buffer.from('hashed-password'),
              salt: Buffer.from('password-salt'),
            },
          },
          uid: {
            oneofKind: 'email',
            email: {
              email: 'user123@example.com',
              verified: true,
            },
          },
        },
        properties: {
          forceDelete: false,
          operations: [],
        },
        providerUserInfo: [],
      });
    });
  });

  describe('when username is mobile and password is a hash', () => {
    beforeEach(() => {
      instance = new ImportDigitalTwin(
        tenantId,
        DigitalTwinKind.PERSON,
        DigitalTwinState.ACTIVE,
        [],
        undefined,
        {
          uid: {
            mobile: '+421949949949',
            verified: true,
          },
          password: {
            hash: Buffer.from('hashed-password'),
          },
        },
      );
    });

    it('correctly marshals the instance', () => {
      expect(instance.marshal()).toEqual({
        id: '',
        kind: DigitalTwinKind.PERSON,
        state: DigitalTwinState.ACTIVE,
        tags: [],
        tenantId,
        password: {
          password: {
            oneofKind: 'hash',
            hash: {
              passwordHash: Buffer.from('hashed-password'),
              salt: Buffer.from(''),
            },
          },
          uid: {
            oneofKind: 'mobile',
            mobile: {
              mobile: '+421949949949',
              verified: true,
            },
          },
        },
        properties: {
          forceDelete: false,
          operations: [],
        },
        providerUserInfo: [],
      });
    });
  });

  describe('when the instance is created from existing digital twin instance', () => {
    describe('when no properties are set', () => {
      const dtId = v4();

      beforeEach(() => {
        const dt = new DigitalTwin(
          dtId,
          tenantId,
          DigitalTwinKind.THING,
          DigitalTwinState.DISABLED,
          [],
        );

        instance = ImportDigitalTwin.fromDigitalTwin(dt, {
          uid: 'user-name',
          password: 'password123',
        });
      });

      it('correctly marshals the instance', () => {
        expect(instance.marshal()).toEqual({
          id: dtId,
          kind: DigitalTwinKind.THING,
          state: DigitalTwinState.DISABLED,
          tags: [],
          tenantId,
          password: {
            password: {
              oneofKind: 'value',
              value: 'password123',
            },
            uid: {
              oneofKind: 'username',
              username: 'user-name',
            },
          },
          properties: {
            forceDelete: false,
            operations: [],
          },
          providerUserInfo: [],
        });
      });
    });

    describe('when a property is set', () => {
      const dtId = v4();

      beforeEach(() => {
        const dt = new DigitalTwin(
          dtId,
          tenantId,
          DigitalTwinKind.THING,
          DigitalTwinState.DISABLED,
          [],
        );

        dt.addProperty(new Property('mobile').withValue('+421949949949'));

        instance = ImportDigitalTwin.fromDigitalTwin(
          dt,
          undefined,
          undefined,
          undefined,
          undefined,
          false,
        );
      });

      it('correctly marshals the instance', () => {
        expect(instance.marshal()).toEqual({
          id: dtId,
          kind: DigitalTwinKind.THING,
          state: DigitalTwinState.DISABLED,
          tags: [],
          tenantId,
          properties: {
            forceDelete: false,
            operations: [
              {
                operation: {
                  oneofKind: 'add',
                  add: {
                    definition: {
                      context: '',
                      property: 'mobile',
                      type: '',
                    },
                    id: '',
                    value: {
                      oneofKind: 'objectValue',
                      objectValue: {
                        value: {
                          oneofKind: 'stringValue',
                          stringValue: '+421949949949',
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
          providerUserInfo: [],
        });
      });
    });
  });
});

describe('ImportResult', () => {
  let result: ImportResult | null;

  describe('when the result is successful', () => {
    describe('when the result has neither dt not results values', () => {
      beforeEach(() => {
        result = ImportResult.deserialize({
          index: '0',
          result: {
            oneofKind: 'success',
            success: {} as { results: [] },
          },
        });
      });

      it('returns a correct instance', () => {
        expect(result).toBeDefined();
        expect(result?.index).toBe('0');
        expect(result?.isSuccess() && result.digitalTwin).toBeUndefined();
        expect(result?.isSuccess() && result.propertiesResult).toBeUndefined();
      });
    });

    describe('when the result has both dt and results values defined', () => {
      const dtId = v4();
      const tenantId = v4();

      beforeEach(() => {
        result = ImportResult.deserialize({
          index: '0',
          result: {
            oneofKind: 'success',
            success: {
              digitalTwin: {
                id: dtId,
                tenantId,
                kind: DigitalTwinKind.INVALID,
                state: DigitalTwinState.INVALID,
                tags: [],
              },
              results: [
                {
                  index: '0',
                  result: {
                    oneofKind: 'success',
                    success: {
                      propertyId: 'prop-id',
                    },
                  },
                },
              ],
            },
          },
        });
      });

      it('returns a correct instance', () => {
        expect(result).toBeDefined();
        expect(result?.index).toBe('0');
        expect(result?.isSuccess() && result.digitalTwin).toEqual({
          id: dtId,
          tenantId,
          kind: DigitalTwinKind.INVALID,
          state: DigitalTwinState.INVALID,
          tags: [],
        });
        expect(result?.isSuccess() && result.propertiesResult).toEqual([
          {
            index: '0',
            propertyId: 'prop-id',
            status: 'success',
          },
        ]);
      });
    });
  });

  describe('when the result is error', () => {
    beforeEach(() => {
      result = ImportResult.deserialize({
        index: '0',
        result: {
          oneofKind: 'error',
          error: {
            message: ['Error message'],
          },
        },
      });
    });

    it('returns a correct instance', () => {
      expect(result).toBeDefined();
      expect(result?.index).toBe('0');
      expect(result?.isError() && result.message).toEqual(['Error message']);
    });
  });

  describe('when the result is invalid', () => {
    beforeEach(() => {
      result = ImportResult.deserialize({
        index: '0',
        result: {
          oneofKind: 'invalid',
        } as unknown as ImportDigitalTwinResult['result'],
      });
    });

    it('returns a correct instance', () => {
      expect(result).toBeDefined();
      expect(result?.index).toBe('0');
      expect(result?.isError()).toBe(false);
      expect(result?.isSuccess()).toBe(false);
    });
  });
});
