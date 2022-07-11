/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, { Component } from 'react';
import {
  FlatList,
  I18nManager,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from 'react-native';
import Button from '../../components/buttons/Button';
import Color from 'color';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import HeaderIconButton from '../../components/navigation/HeaderIconButton';
import { logEvent } from '../Analytics';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// map to state/function
import { connect } from 'react-redux';
import {
  deleteItem,
  resetShoppingList,
  savePriceComparison,
  addSuggestions,
  addToCart,
  resetCart,
} from '@reducers';
import { utils } from '@utils';

// import components
import TouchableItem from '../../components/TouchableItem';
import Feather from 'react-native-vector-icons/dist/Feather';

// import colors
import Colors from '../../theme/colors';
import { actions } from '@actions';
import ActivityIndicatorModal from '../../components/modals/ActivityIndicatorModal';
import CompareProductCard from '../../components/cards/CompareProductCard';
// SearchA Config
const isRTL = I18nManager.isRTL;
const PRODUCT_ICON = 'remove-circle';

// SearchA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignContent: 'flex-end',
  },
  flatListContainer: {
    // top: hp(10),
    height: '70%',
    // marginBottom: Platform.OS === 'ios' ? '7%' : '5%',
  },

  cardOverlay: {
    backgroundColor: Color(Colors.overlayColor).alpha(0.2),
    overflow: 'hidden',
    paddingHorizontal: 30,
  },
  cardContainer: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#D0D3D4',
  },
  textContainer: {
    justifyContent: 'space-between',
    // alignItems: 'center',
    flexDirection: 'row',
    width: '95%',
  },
  cardTitle: {
    fontWeight: '500',
    fontSize: 16,
    // paddingLeft: 10,
    width: '80%',
  },
  subItem: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
  cardTitleRight: {
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'right',
  },

  btnContainer: {
    marginVertical: '10%',
    alignItems: 'center',
  },
  messageText: {
    top: hp(-16),
    alignItems: 'center',
  },
  btnCompare: {
    marginHorizontal: '10%',
    marginVertical: '5%',
    alignItems: 'center',
  },
});

// Shopping List
class ShowProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listingDetail: [],
      isLoading: false,
      flag: false,
    };
  }

  componentDidMount() {
    const cartData = this.props.route.params.item;

    this.setState({
      listingDetail: cartData,
    });
    const { navigation } = this.props;
    navigation.setOptions({
      headerLeft: () => (
        <HeaderIconButton
          onPress={this.onBackPress}
          name={'arrow-back'}
          color={Colors.black}
          size={18}
        />
      ),
    });
  }
  saveAPICall = async () => {
    const { token } = this.props.userProfile;
    const listId = this.props.route.params.shopping_list_id;
    const marketId = this.props.route.params.item.market.id;
    const status = this.props.route.params.status;

    this.setState({
      isLoading: true,
    });
    const res = await actions.saveComparedResult({
      token,
      shopping_list_id: listId,
      market_id: marketId,
      status: status,
    });
    this.setState({ isLoading: false });
    if (!res.error) {
      utils.showAlert('Save purchase', res.message, () => {
        this.props.navigation.navigate('Home');
        this.props.resetShoppingList();
        this.props.resetCart();
      });
    } else {
      utils.showAlert('Alert', res.errors.message[0]);
    }
  };

  onBackPress = () => {
    const { navigation } = this.props;

    navigation.goBack();
  };

  navigateTo = (screen, key) => () => {
    const { navigation } = this.props;
    Keyboard.dismiss();
    navigation.navigate(screen);
  };
  onQuantityPlus = (item) => {
    let newArray = this.state.listingDetail.products;
    newArray.forEach((element) => {
      if (element.id === item.id) {
        let quantity = element.quantity;
        quantity = quantity + 1;
        element.quantity = quantity;
        console.log('new array is', quantity);
      }
    });

    this.setState({
      listingDetail: {
        ...this.state.listingDetail,
        products: newArray,
      },
      flag: !this.state.flag,
    });
    this.forceUpdate(() => true);
  };
  onQuantityMinus = (item) => {
    let newArray = this.state.listingDetail.products;
    newArray.forEach((element) => {
      if (element.id === item.id) {
        let quantity = element.quantity;
        if (quantity > 0) {
          quantity = quantity - 1;
        }
        element.quantity = quantity;
      }
    });

    this.setState({
      listingDetail: {
        ...this.state.listingDetail,
        products: newArray,
      },
      flag: !this.state.flag,
    });
    this.forceUpdate(() => true);
  };

  delHandler = (keyword, categoryId) => {};

  keyExtractor = (item, index) => index.toString();

  renderCategoryItem = ({ item, index }) => {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <CompareProductCard
          // onPlusClick={() => onPlusClick(itemObj)}
          // onMinusClick={() => onMinusClick(itemObj)}
          onQuantityPlus={() => {
            this.onQuantityPlus(item);
          }}
          onQuantityMinus={() => {
            this.onQuantityMinus(item);
          }}
          key={index}
          ifExist={true}
          imageUri={item.image}
          title={item.name}
          price={item.retail_price}
          currency={item.currency}
          // discountPercentage={item.discountPercentage}
          quantity={item.quantity ? item.quantity : 1}
          horizontal={true}
          // label={'new'}
        />
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <View style={styles.flatListContainer}>
          <FlatList
            data={this.state.listingDetail.products}
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal={false}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderCategoryItem}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        <View>
          <View style={styles.btnCompare}>
            <Button
              onPress={this.saveAPICall}
              socialIconName={'diamond'}
              title={'Save purchase'}
              iconcolor={'white'}
              color={'#4C7ED5'}
              iconsize={23}
              rounded
            />
          </View>

          <ActivityIndicatorModal
            statusBarColor={Color(Colors.primaryColor)
              .darken(0.52)
              .rgb()
              .string()}
            message="Please wait . . ."
            // onRequestClose={this.closeModal}
            title="Sending instructions"
            visible={this.state.isLoading}
          />
        </View>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userProfile: state.login.data,
    shopingList: state.shoppinglistarr,
    carts: state.cart.data,
  };
};
const mapDispatchToProps = {
  deleteItem,
  resetShoppingList,
  savePriceComparison,
  addSuggestions,
  addToCart,
  resetCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShowProducts);
