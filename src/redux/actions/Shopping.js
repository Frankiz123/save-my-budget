import apiActions from '@apis';
import { DELETE_SHOPINGLIST } from '../../apis/urls';
import { addItem } from '@reducers';

export const searchItem = (params) => {
  return apiActions
    .searchItem(params)
    .then((resp) => {
      return resp;
    })
    .catch((e) => {
      console.log('search Item errr is -------------------=-', e);
      throw e;
    });
};

export const addShoppingItem = (params) => {
  return addItem(params);
};

export const deleteShoppingItem = (params) => {
  return {
    type: DELETE_SHOPINGLIST,
    key: params,
  };
};
export const addShoppingList = (params) => {
  return apiActions
    .addShoppingList(params)
    .then((resp) => {
      return resp;
    })
    .catch((e) => {
      console.log('Add shopping list error is -------------------=-', e);
      throw e;
    });
};

export const comparePrice = (params) => {
  return apiActions
    .comparePrice(params)
    .then((resp) => {
      return resp;
    })
    .catch((e) => {
      console.log('Compare prices error is -------------------=-', e);
      throw e;
    });
};

export const getShoppinList = (params) => {
  return apiActions
    .getShoppinList(params)
    .then((resp) => {
      return resp;
    })
    .catch((e) => {
      console.log('get shopping list error is -------------------=-', e);
      throw e;
    });
};

export const updateShoppingList = (params) => {
  return apiActions
    .updateShoppingList(params)
    .then((resp) => {
      return resp;
    })
    .catch((e) => {
      console.log('update shopping list error is -------------------=-', e);
      throw e;
    });
};

export const deleteShoppingList = (params) => {
  return apiActions
    .deleteShoppingList(params)
    .then((resp) => {
      return resp;
    })
    .catch((e) => {
      console.log('delete shopping list error is -------------------=-', e);
      throw e;
    });
};

export const lastComparison = (params) => {
  return apiActions
    .lastComparison(params)
    .then((resp) => {
      return resp;
    })
    .catch((e) => {
      console.log('last comparison  error is -------------------=-', e);
      throw e;
    });
};
export const pagination = (params) => {
  return apiActions
    .pagination(params)
    .then((resp) => {
      return resp;
    })
    .catch((e) => {
      console.log('Compared list pagination error is -------------------=-', e);
      throw e;
    });
};
export const compareMarketProduct = (params) => {
  return apiActions
    .compareMarketProduct(params)
    .then((resp) => {
      return resp;
    })
    .catch((e) => {
      console.log('Compare market product error is -------------------=-', e);
      throw e;
    });
};

export const getComparedListResults = (params) => {
  return apiActions
    .getComparedListResults(params)
    .then((resp) => {
      return resp;
    })
    .catch((e) => {
      console.log('Get Compared List Results error is ------------=-', e);
      throw e;
    });
};

export const saveComparedResult = (params) => {
  return apiActions
    .saveComparedResult(params)
    .then((resp) => {
      return resp;
    })
    .catch((e) => {
      console.log('save compared result error is ------------=-', e);
      throw e;
    });
};

export const markAsComplete = (params) => {
  console.log('params are-----', params);
  return apiActions
    .markAsComplete(params)
    .then((resp) => {
      return resp;
    })
    .catch((e) => {
      console.log('mark as complete error is ------------=-', e);
      throw e;
    });
};

export const comparisonReuslt = (params) => {
  return apiActions
    .comparisonReuslt(params)
    .then((resp) => {
      return resp;
    })
    .catch((e) => {
      console.log('Comparison Result error is ------------=-', e);
      throw e;
    });
};
