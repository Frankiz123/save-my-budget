import apiActions from '@apis';

export const Login = (params) => {
  return apiActions
    .Login(params)
    .then((resp) => {
      return resp;
    })
    .catch((e) => {
      console.log('login errr is ---', e);
      throw e;
    });
};

export const Signup = (params) => {
  return apiActions
    .Signup(params)
    .then((resp) => {
      return resp;
    })
    .catch((e) => {
      console.log('Signup errr is ---', e);
      throw e;
    });
};
export const updateProfile = (params) => {
  return apiActions
    .updateProfile(params)
    .then((resp) => {
      return resp;
    })
    .catch((e) => {
      console.log('updateProfile errr is ---', e);
      throw e;
    });
};

export const doSocialLoginApiCall = (params) => {
  return apiActions
    .doSocialLoginApiCall(params)
    .then((resp) => {
      return resp;
    })
    .catch((e) => {
      console.log('doSocialLoginApiCall errr is ---', e);
      throw e;
    });
};
export const resetPassword = (params) => {
  return apiActions
    .resetPassword(params)
    .then((resp) => {
      return resp;
    })
    .catch((e) => {
      console.log('reset Password erorr is ---', e);
      throw e;
    });
};
export const verifyEmail = (params) => {
  return apiActions
    .verifyEmail(params)
    .then((resp) => {
      return resp;
    })
    .catch((e) => {
      console.log('verify email error is ---', e);
      throw e;
    });
};
export const resendEmail = (params) => {
  return apiActions
    .resendEmail(params)
    .then((resp) => {
      return resp;
    })
    .catch((e) => {
      console.log('resend email error is ---', e);
      throw e;
    });
};
export const setResetPassword = (params) => {
  return apiActions
    .setResetPassword(params)
    .then((resp) => {
      return resp;
    })
    .catch((e) => {
      console.log('Reset Password error is ---', e);
      throw e;
    });
};
export const setChangePassword = (params) => {
  return apiActions
    .setChangePassword(params)
    .then((resp) => {
      return resp;
    })
    .catch((e) => {
      console.log('Change Password error is ---', e);
      throw e;
    });
};

export const setProductSearch = (params) => {
  return apiActions
    .setProductSearch(params)
    .then((resp) => {
      return resp;
    })
    .catch((e) => {
      console.log('Change Search Product error is ---', e);
      throw e;
    });
};
