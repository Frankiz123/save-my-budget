import { createSlice } from '@reduxjs/toolkit';

export const shoppinglistarr = createSlice({
  name: 'shoppinglistarr',
  initialState: {
    data: [],
    key: null,
    status: null,
    suggestions: [],
    priceComparison: [],
  },
  reducers: {
    addItem: (state, action) => {
      return {
        ...state,
        data: [...state.data, action.payload],
      };
    },
    deleteItem: (state, action) => {
      return {
        ...state,
        data: state.data.filter((slst) => {
          if (
            slst.keyword === action.payload.keyword &&
            slst.categoryId === action.payload.categoryId
          ) {
            return false;
          } else {
            return true;
          }
        }),
      };
    },
    deleteKeyword: (state, action) => {
      return {
        ...state,
        suggestions: action.payload,
      };
    },
    resetShoppingList: (state, action) => {
      return {
        ...state,
        data: [],
        key: null,
        status: null,
      };
    },
    addSuggestions: (state, action) => {
      console.log('action is', action);

      return {
        ...state,
        suggestions: action.payload,
      };
    },

    savePriceComparison: (state, action) => {
      return {
        ...state,
        key: null,
        status: null,
        priceComparison: action.payload,
      };
    },
  },
});

export const {
  addItem,
  deleteItem,
  resetShoppingList,
  addSuggestions,
  deleteKeyword,
  savePriceComparison,
} = shoppinglistarr.actions;
