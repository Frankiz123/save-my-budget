import XHR from './api';
import * as ROUTES from './urls';
export const searchItem = async (params) => {
  const { text, token } = params;
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    keyword: text,
  });

  const res = await XHR.post(ROUTES.SEARCH_ITEM, body, headers);
  console.log('search resp is ', res);

  return res;
};

export const addShoppingList = async (params) => {
  const { name, items, token } = params;
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    name,
    items,
  });

  const res = await XHR.post(ROUTES.ADD_SHOPPING_LIST, body, headers);
  return res;
};

export const comparePrice = async (params) => {
  const { shopping_list_id, token } = params;
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    shopping_list_id,
  });

  const res = await XHR.post(ROUTES.COMPARE_PRICES, body, headers);
  return res;
};

export const getShoppinList = async (params) => {
  const { token, page } = params;
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  let apiurl = ROUTES.GET_SHOPPING_LIST;
  apiurl = apiurl.concat(`?page=${page}`);
  console.log('Value of Page URL ==== ', apiurl);
  const res = await XHR.get(apiurl, headers);
  return res;
};
export const updateShoppingList = async (params) => {
  const { name, items, token, id } = params;
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    id,
    name,
    items,
  });

  const res = await XHR.post(ROUTES.UPDATE_SHOPPING_LIST, body, headers);
  return res;
};

export const deleteShoppingList = async (params) => {
  const { token, id } = params;
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    id,
  });

  const res = await XHR.post(ROUTES.DELETE_SHOPPING_LIST, body, headers);
  return res;
};

export const lastComparison = async (params) => {
  const { token, items } = params;
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    items,
  });

  const res = await XHR.post(ROUTES.LAST_COMPARISON, body, headers);
  return res;
};
export const pagination = async (params) => {
  const { token, page, market_name, keyword, category_id } = params;
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const body = JSON.stringify({
    keyword,
    market_name,
    page,
    category_id,
  });
  const res = await XHR.post(ROUTES.ITEM_COMPARISON_PAGINATION, body, headers);
  return res;
};
export const compareMarketProduct = async (params) => {
  const { token, shopping_list_id, detail } = params;
  console.log('compare market product params are', params);
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    shopping_list_id,
    detail,
  });
  const res = await XHR.post(ROUTES.COMPARE_MARKET_PRODUCT, body, headers);
  return res;
};

export const getComparedListResults = async (params) => {
  const { token, shopping_list_id } = params;
  console.log('compare market product params are', params);
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    shopping_list_id,
  });
  const res = await XHR.get(ROUTES.GET_COMPARED_LIST_RESULT, body, headers);
  return res;
};

export const saveComparedResult = async (params) => {
  const { token, shopping_list_id, market_id, status } = params;
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    shopping_list_id,
    market_id,
    status,
  });
  const res = await XHR.post(ROUTES.SAVE_COMPARE_MARKET_RESULT, body, headers);
  return res;
};

export const markAsComplete = async (params) => {
  console.log('params are ', params);
  const { token, status, id } = params;
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    id,
    status,
  });
  const res = await XHR.post(ROUTES.MARK_AS_COMPLETE, body, headers);
  return res;
};

export const comparisonReuslt = async (params) => {
  const { token, shopping_list_id } = params;
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    shopping_list_id,
  });
  const res = await XHR.post(ROUTES.COMPARISON_RESULT, body, headers);
  return res;
};
