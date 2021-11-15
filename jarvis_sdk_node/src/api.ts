// import { ArgumentParser } from 'argparse';
// import { IdentityClient } from './sdk/identity';
// import { PatchPropertiesBuilder, Property } from './sdk/model';

// async function main() {
//   const parser = new ArgumentParser({
//     description: 'Identity client API.',
//   });

//   const subparsers = parser.add_subparsers({
//     dest: 'command',
//     help: 'sub-command help',
//   });

//   // Introspect token parser
//   const introspectParser = subparsers.add_parser('introspect');
//   introspectParser.add_argument('userToken', {
//     help: 'JWT bearer token',
//   });

//   // Introspect token parser
//   const digitalTwinParser = subparsers.add_parser('getDT');
//   digitalTwinParser.add_argument('digitalTwinId', {
//     help: 'UUID4 ID of the digital twin',
//   });
//   digitalTwinParser.add_argument('tenantId', {
//     help: 'UUID4 ID of the tenant',
//   });
//   digitalTwinParser.add_argument('--propertyList', {
//     nargs: '+',
//     help: 'Array list of the required properties',
//   });
//   // Introspect token parser
//   const digitalTwinByTokenParser = subparsers.add_parser('getDTByToken');
//   digitalTwinByTokenParser.add_argument('digitalTwinToken', {
//     help: 'JWT bearer token',
//   });
//   digitalTwinByTokenParser.add_argument('--propertyList', {
//     nargs: '+',
//     help: 'Array list of the required properties',
//   });

//   // Verify digital twin email id
//   const verifyParser = subparsers.add_parser('verify');
//   verifyParser.add_argument('verificationToken', {
//     help: 'verification token',
//   });

//   // Verify digital twin email id
//   const startDTEmailVerificationParser = subparsers.add_parser('startDTEmailVerification');
//   startDTEmailVerificationParser.add_argument('digitalTwinId', {
//     help: 'UUID4 of the digital twin',
//   });
//   startDTEmailVerificationParser.add_argument('tenantId', {
//     help: 'UUID4 of the tenant',
//   });
//   startDTEmailVerificationParser.add_argument('email', {
//     help: 'Email address to validate',
//   });

//   // Verify digital twin email id
//   const startForgottenPasswordFlowParser = subparsers.add_parser('startForgottenPasswordFlow');
//   startForgottenPasswordFlowParser.add_argument('digitalTwinId', {
//     help: 'UUID4 of the digital twin',
//   });
//   startForgottenPasswordFlowParser.add_argument('tenantId', {
//     help: 'UUID4 of the tenant',
//   });

//   // Change password parser
//   const changePassWordParser = subparsers.add_parser('changePassword');
//   changePassWordParser.add_argument('token', {
//     help: 'JWT bearer token',
//   });
//   changePassWordParser.add_argument('password', {
//     help: 'New password for the user',
//   });

//   // Change password of user parser
//   const changePasswordOfUserParser = subparsers.add_parser('changePasswordOfUser');
//   changePasswordOfUserParser.add_argument('tenantId', {
//     help: 'UUID4 ID of the tenant id',
//   });
//   changePasswordOfUserParser.add_argument('uid', {
//     help: 'UUID4 ID of the digital twin for password change',
//   });
//   changePasswordOfUserParser.add_argument('password', {
//     help: 'New password for the user',
//   });

//   // Delete digital twin
//   const deleteDigitalTwinParser = subparsers.add_parser('deleteDigitalTwin');
//   deleteDigitalTwinParser.add_argument('digitalTwinId', {
//     help: 'UUID4 ID of the digital twin for password change',
//   });
//   deleteDigitalTwinParser.add_argument('tenantId', {
//     help: 'UUID4 ID of the tenant id',
//   });

//   // Delete digital twin by admin token
//   const deleteDigitalTwinByAdminTokenParser = subparsers.add_parser('deleteDigitalTwinByToken');
//   deleteDigitalTwinByAdminTokenParser.add_argument('token', {
//     help: 'JWT bearer token',
//   });

//   // Patch properties
//   const patchProperties = subparsers.add_parser('patchProperties');
//   patchProperties.add_argument('digitalTwinId', {
//     help: 'UUID4 ID of the digital twin',
//   });
//   patchProperties.add_argument('tenantId', {
//     help: 'UUID4 ID of the tenant',
//   });
//   patchProperties.add_argument('--add', {
//     nargs: '+',
//     help: 'Name and value of the property to add (--add email x@x.x)',
//   });
//   patchProperties.add_argument('--replace', {
//     nargs: '+',
//     help: 'Property ID and new value (--replace 111 a@a.a)',
//   });
//   patchProperties.add_argument('--remove', {
//     nargs: '+',
//     help: 'Remove the properties with the given ID',
//   });

//   // Patch properties by token
//   const patchPropertiesByToken = subparsers.add_parser('patchPropertiesByToken');
//   patchPropertiesByToken.add_argument('token', {
//     help: 'JWT bearer token',
//   });
//   patchPropertiesByToken.add_argument('--add', {
//     nargs: '+',
//     help: 'Name and value of the property to add (--add email=x@x.x)',
//   });
//   patchPropertiesByToken.add_argument('--replace', {
//     nargs: '+',
//     help: 'Property ID and new value (--replace 111=a@a.a)',
//   });
//   patchPropertiesByToken.add_argument('--remove', {
//     nargs: '+',
//     help: 'Remove the properties with the given ID',
//   });

//   const args = parser.parse_args();
//   // const { local } = args;

//   try {
//     const client = await IdentityClient.newClient();

//     const { command } = args;

//     switch (command) {
//       case 'introspect': {
//         const { userToken } = args;
//         const introspectResponse = await client.introspectToken(userToken);
//         // if (introspectResponse.tokenInfo) {
//         console.log(introspectResponse);
//         // }
//         break;
//       }
//       case 'getDT': {
//         const { digitalTwinId, tenantId, propertyList } = args;
//         const tokenInfo = await client.getDigitalTwin(digitalTwinId, tenantId, propertyList);
//         if (tokenInfo) {
//           console.log(tokenInfo);
//         }
//         break;
//       }
//       case 'getDTByToken': {
//         const { digitalTwinToken, propertyList } = args;
//         const token = digitalTwinToken;
//         const tokenInfo = await client.getDigitalTwinByToken(token, propertyList);
//         if (tokenInfo) {
//           console.log(tokenInfo);
//         }
//         break;
//       }
//       case 'verify': {
//         const { verificationToken } = args;
//         const digitalTwinInfo = await client.verifyDigitalTwinEmail(verificationToken);
//         if (digitalTwinInfo !== null) {
//           console.log(digitalTwinInfo);
//         }
//         break;
//       }
//       case 'startDTEmailVerification': {
//         const { digitalTwinId, tenantId, email } = args;
//         const digitalTwinInfo = await client.startEmailVerification(digitalTwinId, tenantId, email);
//         if (digitalTwinInfo !== null) {
//           console.log(digitalTwinInfo);
//         }
//         break;
//       }
//       case 'startForgottenPasswordFlow': {
//         const { digitalTwinId, tenantId } = args;
//         const digitalTwinInfo = await client.startForgottenPasswordFlow(digitalTwinId, tenantId);
//         if (digitalTwinInfo !== null) {
//           console.log(digitalTwinInfo);
//         }
//         break;
//       }
//       case 'changePassword': {
//         const { token, password } = args;
//         const passwordChange = await client.changeMyPassword(token, password);
//         if (passwordChange) {
//           console.log(passwordChange);
//         }
//         break;
//       }
//       case 'changePasswordOfUser': {
//         const { tenantId, uid, password } = args;
//         const passwordChange = await client.changePasswordOfDigitalTwin(tenantId, uid, password);
//         if (passwordChange) {
//           console.log(passwordChange);
//         }
//         break;
//       }
//       case 'deleteDigitalTwin': {
//         const { tenantId, digitalTwinId } = args;
//         const deleteDT = await client.deleteDigitalTwin(tenantId, digitalTwinId);
//         if (deleteDT) {
//           console.log(deleteDT);
//         }
//         break;
//       }
//       case 'deleteDigitalTwinByToken': {
//         const { token } = args;
//         const deleteDT = await client.deleteDigitalTwinByToken(token);
//         if (deleteDT) {
//           console.log(deleteDT);
//         }
//         break;
//       }
//       case 'patchProperties': {
//         const { digitalTwinId, tenantId } = args;
//         const builder = PatchPropertiesBuilder.newBuilder();
//         args.add.forEach((v: string) => {
//           const arg = v.split('=');
//           if (arg.length == 2) {
//             builder.addProperty(new Property(arg[0], arg[1]));
//           }
//         });
//         args.replace.forEach((v: string) => {
//           const arg = v.split('=');
//           if (arg.length == 2) {
//             builder.updateProperty(new Property('', arg[0]).withValue(arg[1]));
//           }
//         });
//         args.remove.forEach((v: string) => {
//           builder.deleteProperty(new Property('', v));
//         });

//         const properties = await client.patchProperties(digitalTwinId, tenantId, builder);
//         console.log(properties);
//         break;
//       }
//       case 'patchPropertiesByToken': {
//         const { token } = args;
//         const builder = PatchPropertiesBuilder.newBuilder();
//         args.add.forEach((v: string) => {
//           const arg = v.split('=');
//           if (arg.length == 2) {
//             builder.addProperty(new Property(arg[0], arg[1]));
//           }
//         });
//         args.replace.forEach((v: string) => {
//           const arg = v.split('=');
//           if (arg.length == 2) {
//             builder.updateProperty(new Property('', arg[0]).withValue(arg[1]));
//           }
//         });
//         args.remove.forEach((v: string) => {
//           builder.deleteProperty(new Property('', v));
//         });

//         const properties = await client.patchPropertiesByToken(token, builder);
//         console.log(properties);
//         break;
//       }
//       default:
//         console.log('No command given');
//         break;
//     }
//   } catch (err) {
//     console.error(err);
//   }
// }

// main();
