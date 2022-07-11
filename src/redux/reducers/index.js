export {
  loginSuccess,
  loginFailure,
  signupSuccess,
  signupFailure,
  socialLoginSuccess,
  socialLoginFailure,
  logout,
  updateProfile,
} from './auth';
export {
  addItem,
  deleteItem,
  resetShoppingList,
  addSuggestions,
  deleteKeyword,
  savePriceComparison,
} from './shoppinglistarr';
export { addToCart, deleteFromCart, resetCart, updateCart } from './cart';
import { cart } from './cart';
import { login } from './auth';
import { shoppinglistarr } from './shoppinglistarr';
import { combineReducers } from 'redux';

export default combineReducers({
  cart: cart.reducer,
  login: login.reducer,
  shoppinglistarr: shoppinglistarr.reducer,
});
