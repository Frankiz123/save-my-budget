/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
  I18nManager,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

const isRTL = I18nManager.isRTL;

// import utils
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// import components
import CompareProductCard from '../../components/cards/CompareProductCard';
import Button from '../../components/buttons/Button';
import LinkButton from '../../components/buttons/LinkButton';
import { Heading6 } from '../../components/text/CustomText';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { actions } from '@actions';
import {
  logout,
  addItem,
  addToCart,
  deleteFromCart,
  deleteItem,
  resetShoppingList,
  savePriceComparison,
  resetCart,
  updateCart,
} from '@reducers';
import Color from 'color';
import HeaderIconButton from '../../components/navigation/HeaderIconButton';
import TabBadgeIcon from '../../components/navigation/TabBadgeIcon';
import { utils } from '@utils';

// import colors
import Colors from '../../theme/colors';
import ActivityIndicatorModal from '../../components/modals/ActivityIndicatorModal';

const Compare = (props) => {
  const Data = props.route.params;
  const selectedItems = props.cart.data;

  // const [selectedItems, setSelectedItems] = useState(0);
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemIndex, setIndex] = useState(0);
  const [products, setProducts] = useState(null);

  useEffect(() => {
    const { navigation } = props;
    navigation.setOptions({
      headerLeft: () => (
        <HeaderIconButton
          onPress={() => {
            navigation.navigate('Home');
            props.resetCart();
            props.resetShoppingList();
          }}
          name={'arrow-back'}
          color={Colors.black}
          size={18}
        />
      ),
    });
  }, [selectedItems]);

  useEffect(() => {
    setLoading(true);
    comparePriceAPICall();
  }, []);

  const comparePriceAPICall = async () => {
    const token = props.userProfile.data.token;

    const comparePricesRes = await actions.comparePrice({
      token,
      shopping_list_id: Data.id,
    });
    console.log('compare products are', comparePricesRes);

    if (!comparePricesRes.errors) {
      setProducts(comparePricesRes);
      setLoading(false);
    } else {
      console.log(
        'Compare pricesresponse error is ....',
        comparePricesRes.errors.message[0],
      );
    }
  };

  const paginationAPICall = async (marketIndex) => {
    const token = props.userProfile.data.token;
    let currentProduct = products[itemIndex].market[marketIndex];
    console.log('products[itemIndex]', products[itemIndex]);
    const paginationResp = await actions.pagination({
      token,
      keyword: products[itemIndex].keyword,
      market_name: currentProduct.name,
      category_id: products[itemIndex].categoryId,
      page: currentProduct.products.currentPage + 1,
    });
    console.log('paginationAPICall  response is', paginationResp);

    currentProduct = currentProduct.products.data.concat(paginationResp.data);
    const updateArray = products.map((elem, index) => {
      if (index === itemIndex) {
        elem.market.map((innerElem, innerIndex) => {
          if (innerIndex === marketIndex) {
            innerElem.products.data = currentProduct;
            innerElem.products.currentPage = paginationResp.current_page;
            return innerElem;
          }
          return innerElem;
        });
      }
      return elem;
    });

    if (!paginationResp.errors) {
      setProducts(updateArray);
    } else {
      console.log(
        'Compare pricesresponse error is ....',
        paginationResp.errors.message[0],
      );
    }
    setLoading(false);
  };
  const loadNextSetOfData = (marketIndex) => {
    setLoading(true);
    paginationAPICall(marketIndex);
  };

  const onPressNext = () => {
    let newArray = selectedItems;
    newArray = newArray.filter(
      (v, i, a) =>
        a.findIndex(
          (t) => t.marketId === v.marketId && t.itemId === v.itemId,
        ) === i,
    );
    if (newArray.length >= products[itemIndex].market.length) {
      setIndex(itemIndex + 1);
    } else {
      utils.showAlert(
        'Compared Items',
        'Please select one item from each market',
      );
    }
  };

  const onPressSubmit = async () => {
    const { token } = props.userProfile.data;
    const shopping_list_id = props.route.params.id;
    const cartData = selectedItems;
    let detailObj = [];
    cartData.forEach((element) => {
      detailObj.push({
        market_id: element.marketId,
        shopping_list_detail_id: element.itemId,
        product_id: element.id,
        quantity: element.quantity ? element.quantity : 0,
      });
    });
    let length = 0;
    for (let i = 0; i < products.length; i++) {
      length = length + products[i].market.length;
    }
    let newArray = selectedItems;
    newArray = newArray.filter(
      (v, i, a) =>
        a.findIndex(
          (t) => t.marketId === v.marketId && t.itemId === v.itemId,
        ) === i,
    );
    if (newArray.length >= length) {
      setLoading(true);
      const compareMarketProduct = await actions.compareMarketProduct({
        token,
        shopping_list_id,
        detail: detailObj,
      });
      console.log('compare market resp is', compareMarketProduct);

      let newObj = {
        ...compareMarketProduct,
        shopping_list_id: props.route.params.id,
      };
      setLoading(false);

      if (!compareMarketProduct.error) {
        props.navigation.navigate('ComparedResults', newObj);
        setIndex(0);
      } else {
        utils.showAlert(
          'Compared Items',
          compareMarketProduct.errors.message[0],
        );
      }
    } else {
      utils.showAlert(
        'Compared Items',
        'Please select one item from each market',
      );
    }
  };

  const keyExtractor = (item, keyInex) => keyInex.toString();
  // const onPlusClick = (Obj) => {
  //   const { cart } = props;
  //   const ifExist = cart.data.filter(
  //     (elem) => elem.itemId === Obj.itemId && elem.marketId === Obj.marketId,
  //   );

  //   if (ifExist.length < 1) {
  //     props.addToCart(Obj);
  //   } else {
  //     onMinusClick(ifExist[0]);
  //     props.addToCart(Obj);
  //   }
  // };
  // const onMinusClick = (Obj) => {
  //   const { cart } = props;
  //   let arry = [...cart.data];
  //   let index = arry.findIndex((elem) => {
  //     return elem.marketId === Obj.marketId && elem.itemId === Obj.itemId;
  //   });
  //   if (index >= 0) {
  //     arry.splice(index, 1);
  //     props.deleteFromCart(arry);
  //   }
  // };
  const onQuantityPlus = (Obj) => {
    const actionToDo = '+';
    const { cart } = props;
    const ifExist = cart.data.filter((elem) => elem.id === Obj.id);
    if (ifExist.length < 1) {
      props.addToCart({ ...Obj, quantity: 1 });
      setFlag(!flag);
    } else {
      props.updateCart({ cart, Obj, actionToDo });

      let newArray = products[itemIndex].market;
      newArray = newArray.filter((element, index) => {
        const elemIndex = element.products.data.findIndex(
          (elem) => elem.id === Obj.id && element.id && Obj.marketId,
        );
        if (elemIndex >= 0) {
          var item = newArray[index].products.data[elemIndex];
          let quantity = 0;
          if (item.quantity) {
            quantity = item.quantity;
          }
          item.quantity = quantity + 1;
          newArray[index].products.data[elemIndex] = item;
        }
        return newArray;
      });

      let newProcuts = products;
      newProcuts[itemIndex].market = newArray;
      setProducts(newProcuts);
      setFlag(!flag);
    }
  };
  const onQuantityMinus = (Obj) => {
    const actionToDo = '-';
    const { cart } = props;
    if (Obj.quantity === 0) {
      let arry = [...cart.data];
      let index = arry.findIndex((elem) => {
        return elem.id === Obj.id;
      });
      if (index >= 0) {
        arry.splice(index, 1);
        props.deleteFromCart(arry);
      }
    } else if (Obj.quantity > 0) {
      props.updateCart({ cart, Obj, actionToDo });
      let newArray = products[itemIndex].market;
      newArray = newArray.filter((element, index) => {
        const elemIndex = element.products.data.findIndex(
          (elem) => elem.id === Obj.id && element.id && Obj.marketId,
        );
        if (elemIndex >= 0) {
          var item = newArray[index].products.data[elemIndex];
          let quantity = 0;
          if (item.quantity) {
            quantity = item.quantity;
          }
          if (quantity > 0) {
            item.quantity = quantity - 1;
          }
          newArray[index].products.data[elemIndex] = item;
        }
        return newArray;
      });

      let newProcuts = products;
      newProcuts[itemIndex].market = newArray;
      setProducts(newProcuts);
      setFlag(!flag);
    }
  };

  const RenderProductItem = (params) => {
    const { name } = props.route.params;
    const { cart } = props;
    const { item, index } = params.item;
    const { productItem, marktetItem } = params;
    const itemObj = {
      ...item,
      shopping_list_name: name,
      itemId: productItem.id,
      itemKeyword: productItem.keyword,
      marketName: marktetItem.name,
      marketId: marktetItem.id,
      quantity: item.quantity ?? item.quantity,
    };
    const ifExist = cart.data.filter((elem) => elem.id === itemObj.id);

    return (
      <CompareProductCard
        // onPlusClick={() => onPlusClick(itemObj)}
        // onMinusClick={() => onMinusClick(itemObj)}
        onQuantityPlus={() => onQuantityPlus(itemObj)}
        onQuantityMinus={() => onQuantityMinus(itemObj)}
        key={index}
        // ifExist={ifExist[0].quantity}
        imageUri={item.image}
        title={item.name}
        price={item.retailPrice}
        currency={item.currency}
        discountPercentage={item.discountPercentage}
        quantity={ifExist[0]?.quantity ? ifExist[0].quantity : 0}
        // label={'new'}
      />
    );
  };
  useEffect(() => {
    console.log('cart is', props.cart);
  }, [props.cart]);
  return (
    <SafeAreaView style={styles.screenContainer}>
      <StatusBar
        backgroundColor={Colors.statusBarColor}
        barStyle="dark-content"
      />

      <View style={styles.container}>
        <View>
          <Heading6 style={styles.headingsecondText}>
            {Data.name} List - Item {itemIndex + 1} of {products?.length}
          </Heading6>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={products ? products[itemIndex].keyword : ''}
              editable={false}
            />
          </View>
        </View>

        <ScrollView>
          {products &&
            products[itemIndex].market.map((item, index) => {
              const marktetItem = item;
              const productItem = products[itemIndex];
              return (
                <>
                  <View style={styles.shoplinkdiv}>
                    <Heading6 style={styles.shoplinkText}>
                      {item.name}.com
                    </Heading6>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <FlatList
                      data={item.products?.data}
                      alwaysBounceHorizontal={false}
                      keyExtractor={keyExtractor}
                      renderItem={(items) => (
                        <RenderProductItem
                          item={items}
                          marktetItem={marktetItem}
                          productItem={productItem}
                        />
                      )}
                      contentContainerStyle={styles.productsList}
                      horizontal={true}
                      onEndReached={() => loadNextSetOfData(index)}
                      onEndReachedThreshold={0.2}
                      ListFooterComponent={() => (
                        <ActivityIndicator
                          animating={loading}
                          color={Colors.primaryCoxlor}
                          size="small"
                        />
                      )}
                    />
                  </View>
                </>
              );
            })}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.btnNext,
              {
                backgroundColor: itemIndex === 0 ? 'grey' : Colors.primaryColor,
              },
            ]}
            disabled={itemIndex === 0 ? true : false}
            onPress={() => {
              if (itemIndex >= 1) {
                setIndex(itemIndex - 1);
              }
            }}
          >
            <View style={{ right: wp(1) }}>
              <MaterialCommunityIcons
                name="arrow-left"
                color={Colors.white}
                size={15}
              />
            </View>
            <View>
              <Text style={styles.bottomtextno}> Previous item</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnNext}
            onPress={
              itemIndex < products?.length - 1 ? onPressNext : onPressSubmit
            }
          >
            <View>
              <Text style={styles.bottomtextno}>
                {itemIndex < products?.length - 1 ? 'Next item ' : 'Submit'}
              </Text>
            </View>
            {itemIndex < products?.length - 1 && (
              <View style={{ left: wp(1) }}>
                <MaterialCommunityIcons
                  name="arrow-right"
                  color={Colors.white}
                  size={15}
                />
              </View>
            )}
          </TouchableOpacity>
          <ActivityIndicatorModal
            statusBarColor={Color(Colors.primaryColor)
              .darken(0.52)
              .rgb()
              .string()}
            message="Please wait . . ."
            visible={loading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingTop: hp(1),
    justifyContent: 'center',
  },

  viewAllText: {
    color: Colors.primaryColor,
    fontSize: 18,
  },
  HeadingText: {
    fontWeight: 'bold',
    fontSize: 26,
  },
  header: {
    width: wp(100),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerRight: {
    height: 10,
    width: 28,
    right: 20,
    alignContent: 'center',
  },
  headerCart: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
    width: 28,
    right: 20,
  },
  linkbox: {
    top: hp(0.5),
    marginHorizontal: wp(3),
  },
  secondHeading: {
    top: hp(2),
    borderBottomWidth: 2,
    width: wp(59),
    left: wp(3),
  },
  headingsecondText: {
    fontWeight: 'bold',
    marginHorizontal: hp(2),
    top: hp(2),
  },
  shoplinkdiv: {
    top: hp(2.5),
    left: wp(3),
  },
  shoplinkText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputContainer: {
    top: hp(4),

    marginHorizontal: 16,
    paddingBottom: 35,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 25,
    borderColor: '#F0F3F4',
    backgroundColor: '#F0F3F4',
    color: 'black',
    paddingLeft: 15,
    paddingRight: 51,
    height: 46,
    fontSize: 16,
    textAlignVertical: 'center',
    textAlign: isRTL ? 'right' : 'left',
  },
  productsList: {
    top: hp(4),
    paddingHorizontal: 12,
    marginBottom: hp(5),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: '5%',
    marginVertical: hp(3),
    backgroundColor: Colors.background,
  },
  bottomtextno: {
    fontWeight: '500',
    color: Colors.white,
  },
  btnNext: {
    flexDirection: 'row',
    width: wp(35),
    height: hp(5),
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryColor,
  },
});
const mapStateToprops = (state) => {
  return {
    userProfile: state.login,
    cart: state.cart,
    shopingList: state.shoppinglistarr,
  };
};
const mapDispatchToprops = {
  logout,
  addItem,
  deleteItem,
  addToCart,
  deleteFromCart,
  resetShoppingList,
  savePriceComparison,
  resetCart,
  updateCart,
};

export default connect(mapStateToprops, mapDispatchToprops)(Compare);
