const config = {
  screens: {
    Welcome: {
      path: 'Welcome/:id',
      //   parse: {
      //     id: (id) => `${id}`,
      //   },
    },
    ForgotPassword: {
      path: 'ForgotPassword/:id',
      parse: {
        id: (id) => `${id}`,
      },
    },
    SignIn: 'SignIn',
    SignUp: 'SignUp',
    TermsConditions: 'TermsConditions',
  },
};

const linking = {
  prefixes: ['password://app'],
  config,
};

export default linking;
