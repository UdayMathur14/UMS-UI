import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { MsalInterceptorConfiguration, MsalGuardConfiguration } from '@azure/msal-angular';

export const msalConfig = {
  auth: {
    clientId: '051e23d2-1d46-4e6b-8656-19e31cc7fc60', // Replace with your Azure AD Application (client) ID
    authority: 'https://login.microsoftonline.com/0b0b99a4-2164-4f92-ba18-f39001796420', // Replace with your Azure AD Tenant ID
    redirectUri: 'http://localhost:4200/', // Replace with your redirect URI
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false, // For IE11 or Edge compatibility
  },
};

// export const loginRequest = {
//   scopes: ['openid', 'profile', 'email'], // Adjust scopes based on your requirements
// };
export const loginRequest = {
    scopes: ['User.Read'],
  };
export const msalGuardConfig: MsalGuardConfiguration = {
  interactionType: InteractionType.Redirect, // or InteractionType.Popup
  authRequest: loginRequest,
};

export const msalInterceptorConfig: MsalInterceptorConfiguration = {
  interactionType: InteractionType.Redirect,
  protectedResourceMap: new Map([
    ['https://graph.microsoft.com/v1.0/me', ['user.read']],
  ]),
};
