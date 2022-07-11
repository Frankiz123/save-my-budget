import { createSlice } from '@reduxjs/toolkit';

export const cart = createSlice({
  name: 'cart',
  initialState: {
    data: [],
  },
  reducers: {
    addToCart: (state, action) => {
      return {
        ...state,
        data: [...state.data, action.payload],
      };
    },
    deleteFromCart: (state, action) => {
      return {
        ...state,
        data: action.payload,
      };
    },
    updateCart: (state, action) => {
      const { Obj } = action.payload;
      const { actionToDo } = action.payload;
      let newArray = action.payload.cart.data.filter((elem) => {
        return elem.id === Obj.id;
      });
      if (newArray.length > 0) {
        if (actionToDo === '+') {
          newArray = {
            ...newArray[0],
            quantity: newArray[0].quantity + 1,
          };
        } else if (newArray[0].quantity > 0) {
          newArray = {
            ...newArray[0],
            quantity: newArray[0].quantity - 1,
          };
        }

        return {
          ...state,
          data: state.data.map((elem) => {
            if (elem.id === newArray.id) {
              return newArray;
            }
            return elem;
          }),
        };
      }
    },
    resetCart: (state, action) => {
      return {
        ...state,
        data: [],
      };
    },
  },
});

export const {
  addToCart,
  deleteFromCart,
  resetCart,
  updateCart,
} = cart.actions;
