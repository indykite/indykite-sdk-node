import * as grpcId from '../../../grpc/indykite/identity/v1beta2/identity_management_api';
import { generateRandomGID } from '../../utils/test_utils';
import { Consent } from '../consent';

describe('deserialize', () => {
  describe('when all properties are present', () => {
    const piiPrincipalId = generateRandomGID();
    let instance: Consent;

    beforeEach(() => {
      const serverResponse: grpcId.ListConsentsResponse = {
        consentReceipt: {
          piiPrincipalId,
          items: [
            {
              consentId: 'consent-123',
              properties: ['email'],
              piiController: {
                piiControllerId: 'pii-controller-123',
                displayName: 'Pii Controller',
              },
            },
          ],
          piiProcessor: {
            piiProcessorId: 'pii-processor-123',
            displayName: 'Pii Processor',
            description: 'description',
            owner: 'owner',
            policyUri: 'policyUri',
            termsOfServiceUri: 'https://example.com/terms',
            clientUri: 'https;//example.com/client',
            logoUri: 'https://example.com/logo.png',
            userSupportEmailAddress: 'support@example.com',
            additionalContacts: ['contact@example.com'],
          },
        },
      };
      instance = Consent.deserialize(serverResponse);
    });

    it('crates a correct instance', () => {
      expect(instance).toBeDefined();
      expect(instance.piiPrincipalId).toEqual(piiPrincipalId);
      expect(instance.items).toHaveLength(1);
      expect(instance.items[0].consentId).toEqual('consent-123');
      expect(instance.items[0].properties).toEqual(['email']);
      expect(instance.items[0].piiController).toBeDefined();
      expect(instance.items[0].piiController?.piiControllerId).toEqual('pii-controller-123');
      expect(instance.items[0].piiController?.displayName).toEqual('Pii Controller');
      expect(instance.items[0].consentedAt).toBeUndefined();
      expect(instance.piiProcessor).toBeDefined();
      expect(instance.piiProcessor?.piiProcessorId).toEqual('pii-processor-123');
      expect(instance.piiProcessor?.displayName).toEqual('Pii Processor');
      expect(instance.piiProcessor?.description).toEqual('description');
      expect(instance.piiProcessor?.owner).toEqual('owner');
      expect(instance.piiProcessor?.policyUri).toEqual('policyUri');
      expect(instance.piiProcessor?.termsOfServiceUri).toEqual('https://example.com/terms');
      expect(instance.piiProcessor?.clientUri).toEqual('https;//example.com/client');
      expect(instance.piiProcessor?.logoUri).toEqual('https://example.com/logo.png');
      expect(instance.piiProcessor?.userSupportEmailAddress).toEqual('support@example.com');
      expect(instance.piiProcessor?.additionalContacts.length).toEqual(1);
      expect(instance.piiProcessor?.additionalContacts[0]).toEqual('contact@example.com');
    });
  });

  describe('when only necessary properties are present', () => {
    const piiPrincipalId = generateRandomGID();
    let instance: Consent;

    beforeEach(() => {
      const serverResponse: grpcId.ListConsentsResponse = {
        consentReceipt: {
          piiPrincipalId,
          items: [
            {
              consentId: 'consent-123',
              properties: ['email'],
            },
          ],
        },
      };
      instance = Consent.deserialize(serverResponse);
    });

    it('crates a correct instance', () => {
      expect(instance).toBeDefined();
      expect(instance.piiPrincipalId).toEqual(piiPrincipalId);
      expect(instance.items).toHaveLength(1);
      expect(instance.items[0].consentId).toEqual('consent-123');
      expect(instance.items[0].properties).toEqual(['email']);
      expect(instance.items[0].piiController).toBe(undefined);
      expect(instance.items[0].consentedAt).toBeUndefined();
      expect(instance.piiProcessor).toBeUndefined();
    });
  });

  describe('when no property is present', () => {
    let caughtError: unknown;

    beforeEach(() => {
      try {
        Consent.deserialize({});
      } catch (err) {
        caughtError = err;
      }
    });

    it('throws an error', () => {
      expect(caughtError).toHaveProperty('message', "Can't deserialize consent receipt.");
    });
  });
});
