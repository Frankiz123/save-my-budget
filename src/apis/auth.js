import XHR from './api';
import * as ROUTES from './urls';
export const Login = async (params) => {
  const { email, password, deviceToken } = params;

  const body = JSON.stringify({
    email,
    password,
    deviceToken,
  });
  const res = await XHR.post(ROUTES.LOGIN, body, null);
  return res;
};
export const Signup = async (params) => {
  const { email, password, firstName, lastName, deviceToken } = params;
  const body = JSON.stringify({
    email,
    password,
    firstName,
    lastName,
    deviceToken,
  });
  const res = await XHR.post(ROUTES.SIGNUP, body, null);
  return res;
};
export const updateProfile = async (params) => {
  const { firstName, lastName, deviceToken, token } = params;
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const body = JSON.stringify({
    first_name: firstName,
    last_name: lastName,
    deviceToken,
  });
  const res = await XHR.post(ROUTES.ACCOUNT_INFO, body, headers);
  return res;
};

export const socialLoginFB = async (params) => {
  const { accessToken, provider } = params;
  const headers = {
    // Accept: 'application/json',
    // Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  };
  const body = JSON.stringify({
    code: accessToken,
    provider: provider,
  });

  const res = await XHR.post(ROUTES.SOCIAL_LOGIN, body, headers);
  return res;
};

export const doSocialLoginApiCall = async (params) => {
  const { accessToken, provider, first_name, last_name } = params;
  const headers = {
    'Content-Type': 'multipart/form-data',
  };
  let body = new FormData();
  body.append('code', accessToken);
  body.append('provider', provider);
  body.append('first_name', first_name);
  body.append('last_name', last_name);

  const res = await XHR.post(ROUTES.SOCIAL_LOGIN, body, headers);
  return res;
};

export const resetPassword = async (params) => {
  const { email, deviceToken, token } = params;
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const body = JSON.stringify({
    email: email,
    deviceToken,
  });
  const res = await XHR.post(ROUTES.RESET_PASSWORD, body, headers);
  return res;
};
export const verifyEmail = async (params) => {
  const { token } = params;
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const res = await XHR.get(ROUTES.ACCOUNT_INFO, headers);
  return res;
};
export const resendEmail = async (params) => {
  const { email, deviceToken, token } = params;
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const body = JSON.stringify({
    email: email,
    deviceToken,
  });
  const res = await XHR.post(ROUTES.RESEND_EMAIL, body, headers);
  return res;
};
export const setResetPassword = async (params) => {
  const { password, confirmPassword, token, email } = params;
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const body = JSON.stringify({
    password,
    password_confirmation: confirmPassword,
    email,
    token,
  });
  const res = await XHR.post(ROUTES.SET_RESET_PASSWORD, body, headers);
  return res;
};
export const setChangePassword = async (params) => {
  const { oldPassword, newPassword, token, email } = params;
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const body = JSON.stringify({
    oldPassword,
    newPassword,
    email,
  });
  const res = await XHR.post(ROUTES.SET_CHANGE_PASSWORD, body, headers);
  return res;
};
