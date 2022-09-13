import { ConfigClient } from '../sdk/config';
import { EmailMessage } from '../sdk/model/config/email/message';
import { SendgridEmailProvider } from '../sdk/model/config/email/providers/sendgrid';

ConfigClient.createInstance()
  .then(async (sdk) => {
    /** CREATE new Email Configuration **/
    const sendgrid = new SendgridEmailProvider(
      'nodejs-ec-1',
      '263343b5-983e-4d73-b666-069a98f1ef55',
      true,
    );
    sendgrid.setMessage(
      'authentication',
      new EmailMessage([{ address: 'test+to@indykite.com', name: 'Test To' }], 'subject'),
    );
    sendgrid.defaultFromAddress = {
      address: 'test+config@indykite.com',
      name: 'Test Config',
    };
    sendgrid.description = 'description-';

    let cResp;
    try {
      cResp = await sdk.createEmailServiceConfiguration(
        'gid:KAEyEGluZHlraURlgAAAAAAAAA8',
        sendgrid,
      );
      console.log('created config: ', JSON.stringify(cResp, null, 2));
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }

    /** READ existing configuration  */
    let rResp;
    if (cResp) {
      rResp = await sdk.readEmailServiceConfiguration(cResp.id as string);
      console.log('read config: ', JSON.stringify(rResp, null, 2));
    }

    /** UPDATE description of the configuration */
    if (rResp) {
      rResp.description = rResp.description + '1';
      const uResp = await sdk.updateEmailServiceConfiguration(rResp);
      console.log('updated config: ', JSON.stringify(uResp, null, 2));
    }

    // /** DELETE description of the configuration */
    // const dResp = await sdk.deleteEmailServiceConfiguration(uResp);
    // console.log('deleted config: ', JSON.stringify(dResp, null, 2));
  })
  .catch((err) => console.error(err));
