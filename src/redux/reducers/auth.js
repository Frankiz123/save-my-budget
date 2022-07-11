import { createSlice } from '@reduxjs/toolkit';

export const login = createSlice({
  name: 'login',
  initialState: {
    data: null,
    message: null,
    status: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      return {
        ...state,
        data: action.payload,
        message: null,
        status: 200,
      };
    },
    loginFailure: (state, action) => {
      return {
        ...state,
        data: null,
        message: action.payload.errors.message[0],
        status: 401,
      };
    },
    signupSuccess: (state, action) => {
      return {
        ...state,
        data: action.payload,
        message: null,
        status: 200,
      };
    },
    signupFailure: (state, action) => {
      return {
        ...state,
        data: null,
        message: action.payload.message,
        status: 401,
      };
    },
    updateProfile: (state, action) => {
      return {
        ...state,
        data: {
          ...state.data,
          user: {
            ...state.data.user,
            firstName: action.payload.firstName,
            lastName: action.payload.lastName,
          },
        },
      };
    },
    socialLoginSuccess: (state, action) => {
      console.log('response in action', action);
      return {
        ...state,
        data: action.payload,
        message: null,
        status: 200,
      };
    },
    socialLoginFailure: (state, action) => {
      return {
        ...state,
        data: null,
        message: action.payload.message,
        status: 401,
      };
    },
    logout: (state, action) => {
      return {
        ...state,
        data: null,
        message: null,
        status: null,
      };
    },
  },
});
export const {
  loginSuccess,
  loginFailure,
  signupSuccess,
  signupFailure,
  socialLoginSuccess,
  socialLoginFailure,
  updateProfile,
  logout,
} = login.actions;
