# How to - Configure and Implement forgot password flow in React

This How-to explains how to create an application that supports the end user forgotten password flow. This enables an end user to reset their password.

A visual representation of the  forgot password flow is available here: https://github.com/indykite/jarvis-doc-proto/blob/master/forgot-password.md

You will follow these steps to implement a “forgot password” flow within your application:

* Configure Backend Service
* Configure Email Templates
* Configure Front-end Application
    * Install dependencies
    * Initialize application properties
    * Add forgot password flow to your application
      * Import from indykite-ui-sdk
      * Create the required routes
      * Call sendResetPasswordEmail() function
      * Code to handle the callback (link from email)
    * Optional - Login with new credentials

## Configure Backend Service
First, you will need to configure your backend service.
1. Add and connect the inputReset node to your Authentication flow.
2. Add and connect the forgottenPassword node to your Authentication flow.
3. Set up a new email template in Sendgrid for the “reset_password_message.” This template will receive dynamic variables which can be used for building the email {"referenceId":"OTP”}
4. Construct the URL using the example (https://host/set/new/password/{{referenceId}}) in the email template.   
5. Configure a new EmailService.  (You can use Sendgrid and Amazon SES in addition to (what other email services are supported?))

## Configure Email Templates
6 and 7 is at https://app.sendgrid.com/login or AWS CLI
aws-cli ses create-template --cli-input-json file:///template.json
aws-cli ses send-templated-email --cli-input-json file:///send-input.json


Example send-input.json
```JSON
{
    "Source": "NoReply<noreply@example.com>",
    "Template": "ForgottenPassword",
    "ConfigurationSetName": "ConfigSet",
    "Destination": {
        "ToAddresses": [
            "test@example.com"
        ]
    },
    "TemplateData": "{ \"referenceId\":\"OAGqydQRcMTaah3ghROKM03g\" }"
}
```

Template.json:
```JSON
{
    "Template": {
        "TemplateName": "ForgottenPassword",
        "SubjectPart": "Greetings, {{name}}!",
        "HtmlPart": "<h1>Hello User,</h1><p>Please visit <a href=\"http://localhost:4000/set/new/password/{{referenceId}}\">link</a>.</p>",
        "TextPart": "Dear User,\r\nPlease visit http://localhost:4000/set/new/password/{{referenceId}}."
    }
}
```


## Configure Front-end Application
### Install dependencies:
Install the dependencies by using npm or edit package.json manually then use yarn or npm to install. You must have version 1.0.8 or higher installed.
* Indykite-ui-sdk minimum version 1.0.8




**Hint:**

Running yarn or npm without any additional parameters is the equivalent to running yarn install or npm install.


**Option 1: Npm install:**
```bash
npm install indykite-ui-sdk --save-dev
```

**Option 2: Edit the package.json:**

Create or open package.json and add indykite-ui-sdk (v1.0.8) under dependencies (see example below)

Example package.json
```JSON
{
  "name": "sample-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "indykite-ui-sdk": "^1.0.8"
   }
}
```


Then run “yarn” or “npm”

### Initialize application properties:
In the base folder of your application include an .env file to set the application specific properties required to connect to the correct tenant and application in the platform. We will read these properties when we initialize [??] at the app entry point.

The property values, for your application, can be retrieved from your IndyKite point of contact or the IndyKite Console (Coming Soon!).

Example .env:
```bash
REACT_APP_BASE_URI=https://jarvis-dev.indykite.com
REACT_APP_APPLICATION_ID=696e6479-6b69-4465-8000-020F00000000
REACT_APP_TENANT_ID=696e6479-6b69-4465-8000-030F00000002
```


Init
```typescript
import { IKUIInit } from "indykite-ui-sdk";

IKUIInit({
  baseUri: process.env.REACT_APP_BASE_URI,
  applicationId: process.env.REACT_APP_APPLICATION_ID,
  tenantId: process.env.REACT_APP_TENANT_ID,
});
```

## Add forgot password flow to your application
### Import from indykite-ui-sdk
```typescript
import { IKUICore } from "indykite-ui-sdk";
```

### Create the required routes
In your application, create a dedicated route (for example https://host/forgotten-password) to handle the change password callback.. This path will receive the OTP which will be  forwarded to the UI SDK.

*ee a sample application here: https://github.com/indykite/indykite-ui-sdk-sample-react*

* Create a new route (e.g. “/forgot/password”) where you want the user to be able to reset their password.
* Add this route to the call login render so the buttons are correctly connected:

```typescript
import { IKUICore } from "indykite-ui-sdk";

const Login = () => {
  return (
    <div>
      <div id="login-container" />
      {IKUICore.renderLogin({
        labels: {
          username: "Custom Username",
          password: "Custom Password",
          loginButton: "Custom Login with us!",
          registerButton: "Custom Register",
          forgotPasswordButton: "Custom Forgot Password",
        }, // Optional custom labels
        renderElementSelector: "#login-container",
        redirectUri: "/callback", // Optional - Needed only if you use OIDC (Google, FB etc) login buttons
        registrationPath: "/registration", // Optional - In case you want different one
        forgotPasswordPath: "/forgot/password", // Optional - In case you want different one
        onSuccessLogin: (data) => {
          console.log(data.token);
          console.log(data.refresh_token);
          console.log(data.token_type); // For example "bearer"
          console.log(data.expiration_time); // Timestamp
          console.log(data.expires_in); // In x seconds
        },
      })}
    </div>
  );
};
```

### Call sendResetPasswordEmail() function:
* On the route “/forgot/password” in your component call function IKUICore.renderForgotPasswordForm

```typescript
import { IKUICore } from "indykite-ui-sdk";

const ForgotPassword = () => (
  <div>
    <div id="forgot-password-container" />
    {IKUICore.renderForgotPasswordForm({
      renderElementSelector: "#forgotten-password-container",
      labels:
        username: "Custom Email address",
        submitButton: "Custom Send password reset email",
        backToLogin: "Custom Go back to login"
      }
    })}
  </div>
);
```

### Code to handle the callback (link from email):
* Once the user provides their email address and clicks the send button, an email should be sent to the user
* Your email templates needs to include the link to your app route where you allow the user to set their new password, for example “/set/new/password”
* On this route you need to accept the token (for example referenceID)

```typescript
<Route path="/set/new/password/:referenceId">
   <SetNewPassword/>
</Route>
```

* In the component on the set new password route call function IKUICore.renderSetNewPasswordForm which is where you will pass the token (referenceId).

```typescript
import { IKUICore } from "indykite-ui-sdk";
import { useParams } from "react-router-dom"; // Or any other way how to extract url parameters

const SetNewPassword = () => {
  const { referenceId } = useParams();

  return (
    <div>
      <div id="set-new-password-container" />
      {IKUICore.renderSetNewPasswordForm({
        labels: {
          newPassword: "Custom Password",
          confirmNewPassword: "Custom Password confirm",
          submitButton: "Custom set new password",
        },
        renderElementSelector: "#set-new-password-container",
        token: referenceId,
      })}
    </div>
  );
};
```

## Optional - Login with new credentials
Once the user has submitted their new password, in the previous step, you can present the user with the option of re-authenticating with the new credentials.

```typescript
import { IKUIUserAPI } from "indykite-ui-sdk";

IKUIUserAPI.login("valid@username.com", "Validpassword")
  .then((data) => {
    console.log(data["@type"]);
    console.log(data.token);
    console.log(data.refresh_token);
    console.log(data.token_type); // For example "bearer"
    console.log(data.expiration_time); // Timestamp
    console.log(data.expires_in); // In x seconds
  })
  .catch((err) => {
    console.log(err["@type"]);
    console.log(err["~error"].code);
    console.log(err["~error"].msg);
  });
```
