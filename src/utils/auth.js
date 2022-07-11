import apiActions from '@apis';
export const LoginHandler = params => {
  return apiActions
    .Login(params)
    .then(resp => {
      return resp;
    })
    .catch(e => {
      console.log('login errr is ---', e);
      throw e;
    });
};
