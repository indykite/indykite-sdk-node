import { WebAuthnProviderConfig } from '../../../../grpc/indykite/config/v1beta1/model';
import { Utils } from '../../../utils/utils';
import { WebAuthnProvider } from './webauthn_provider';

export class WebAuthnProviderFactory {
  static createInstance(name: string, config: WebAuthnProviderConfig): WebAuthnProvider {
    const client = new WebAuthnProvider({
      ...config,
      name,
      registrationTimeout: Utils.durationToNumber(config.registrationTimeout),
      authenticationTimeout: Utils.durationToNumber(config.authenticationTimeout),
    });
    return client;
  }
}
