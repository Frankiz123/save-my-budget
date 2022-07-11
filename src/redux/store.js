import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import hardSet from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import reducer from '@reducers';
const whiteList = createTransform(
  (inboundState, key) => {
    if (key === 'shoppinglistarr') {
      // This is saving to storage
      // Save only the counter field for second reducer
      return inboundState.suggestions;
    }
    return inboundState;
  },
  (outBoundState, key) => {
    if (key === 'shoppinglistarr') {
      // Receiving data from storage
      // add the saved counter field in reducer object
      return {
        name: 'shoppinglistarr',
        suggestions: outBoundState,
      };
    }
    return outBoundState;
  },
);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  transforms: [whiteList],
  blacklist: ['cart'],
  stateReconciler: hardSet,

  debug: true,
};
const pReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: pReducer,
});
export const persistor = persistStore(store);

export default store;
