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
  ImageBackground,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Color from 'color';

// import utils
import getImgSource from '../../utils/getImgSource.js';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// import components
import ActionProductCard from '../../components/cards/ActionProductCard';
import ActionProductCardHorizontal from '../../components/cards/ActionProductCardHorizontal';
import { Heading6 } from '../../components/text/CustomText';
import ActivityIndicatorModal from '../../components/modals/ActivityIndicatorModal';

import TouchableItem from '../../components/TouchableItem';
import Button from '../../components/buttons/Button';
import { connect } from 'react-redux';
import { logout, addItem } from '@reducers';
import { actions } from '@actions';

// import colors
import Colors from '../../theme/colors';
import moment from 'moment';

// HomeA Config
const imgHolder = require('../../assets/img/imgholder.png');

// HomeA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  titleText: {
    fontWeight: '700',
    fontSize: 26,
  },
  titleNameContainer: {
    paddingTop: 16,
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '55%',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: hp(1.5),
  },
  titleName: {
    fontWeight: '500',
    paddingLeft: 20,
  },
  titlePlaning: {
    fontWeight: '500',
    fontSize: 14,
    paddingLeft: 20,
  },

  cardImg: { borderRadius: 4 },
  card: {
    marginLeft: 8,
    width: 104,
    height: 72,
    resizeMode: 'cover',
  },
  cardOverlay: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: Color(Colors.overlayColor).alpha(0.2),
    overflow: 'hidden',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cardTitle: {
    padding: 12,
    fontWeight: '500',
    fontSize: 16,
    color: Colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },

  popularProductsList: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
});

class HomeA extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shoppingList: [],
      isLoading: true,
      loading: false,
      page: 1,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this._unsubscribe = navigation.addListener('focus', () => {
      this.getListsAPICall(1);

      this.setState({
        isLoading: true,
        shoppingList: [],
      });

      this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
    });
  }
  componentWillUnmount() {
    // Remove the event listener
    this._unsubscribe();
  }

  navigateTo = (screen, params) => () => {
    const { navigation } = this.props;
    navigation.navigate(screen);
  };

  onPressRemove = (item) => () => {
    let { quantity } = item;
    quantity -= 1;

    const { popularProducts } = this.state;
    const index = popularProducts.indexOf(item);

    if (quantity < 0) {
      return;
    }
    popularProducts[index].quantity = quantity;

    this.setState({
      popularProducts: [...popularProducts],
    });
  };

  onPressAdd = (item) => () => {
    const { quantity } = item;
    const { popularProducts } = this.state;

    const index = popularProducts.indexOf(item);
    popularProducts[index].quantity = quantity + 1;

    this.setState({
      popularProducts: [...popularProducts],
    });
  };
  getListsAPICall = async (pageNbr) => {
    const { token } = this.props.userProfile.data;

    const getShoppingListRes = await actions.getShoppinList({
      token,
      page: pageNbr,
    });

    this.setState({
      loading: false,
      isLoading: false,
      shoppingList: this.state.shoppingList.concat(getShoppingListRes.data),
    });
  };

  handleRefresh() {
    this.setState({ page: 1, isLoading: true }, () => {
      this.getListsAPICall();
    });
  }
  loadNextSetOfData = () => {
    this.setState({ loading: true, page: this.state.page + 1 });
    this.getListsAPICall(this.state.page + 1);
  };

  keyExtractor = (item, index) => index.toString();

  renderCategoryItem = ({ item, index }) => (
    <ImageBackground
      key={index}
      defaultSource={imgHolder}
      source={getImgSource(item.imageUri)}
      imageStyle={styles.cardImg}
      style={styles.card}
    >
      <View style={styles.cardOverlay}>
        <TouchableItem
          onPress={this.navigateTo('Category')}
          style={styles.cardContainer}
          // borderless
        >
          <Text style={styles.cardTitle}>{item.name}</Text>
        </TouchableItem>
      </View>
    </ImageBackground>
  );

  renderProductItem = ({ item, index }) => (
    <ActionProductCard
      onPress={this.navigateTo('Product')}
      key={index}
      imageUri={item.imageUri}
      title={item.name}
      price={item.price}
      discountPercentage={item.discountPercentage}
      label={item.label}
    />
  );

  onItemPress = (item) => {
    const { navigation } = this.props;
    item.shoppingListDetails.forEach((elem) => {
      this.props.addItem(elem);
    });

    navigation.navigate('ShoppingLists', item);
  };

  renderPopularProductItem = ({ item, index }) => {
    let desc = '';
    item.shoppingListDetails.forEach((elem) => {
      desc = desc + elem.keyword + ',';
    });

    return (
      <ActionProductCardHorizontal
        onPress={() => this.onItemPress(item)}
        onPressRemove={this.onPressRemove(item)}
        onPressAdd={this.onPressAdd(item)}
        swipeoutDisabled
        key={index}
        imageUri={item.logo}
        title={item.name}
        text={item.createdTime}
        description={desc}
        rating={4}
        price={item.price}
        currency={item.price !== null && item.currency}
        discountPercentage={5}
        label={item.status}
        swipeoutOnPressRemove={() => {
          console.log('data deleted');
        }}
      />
    );
  };

  render() {
    const userInfo = this.props.userProfile.data;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Heading6 style={styles.titleText}>Shopping Lists</Heading6>
          </View>
          <View style={styles.titleNameContainer}>
            <Heading6 style={styles.titleName}>
              Hello {userInfo?.user?.lastName} ,{' '}
            </Heading6>
            <Heading6 style={styles.titlePlaning}>
              Planning to shop today?
            </Heading6>
            <View style={styles.titleContainer}>
              <View style={styles.buttonContainer}>
                <Button
                  onPress={this.navigateTo('AddItems')}
                  socialIconName={'plus'}
                  title={'New List'}
                  iconcolor={'#fff'}
                  iconsize={10}
                  borderRadius={25}
                  fontWeight={'bold'}
                />
              </View>
            </View>
          </View>

          <FlatList
            ref={(ref) => {
              this.flatListRef = ref;
            }}
            data={this.state.shoppingList}
            onEndReached={this.loadNextSetOfData}
            keyExtractor={this.keyExtractor}
            onEndReachedThreshold={0.2}
            renderItem={this.renderPopularProductItem}
            contentContainerStyle={styles.popularProductsList}
            scrollToIndex={{ viewPosition: 0 }}
          />
        </View>
        <ActivityIndicator
          animating={this.state.loading}
          color={Colors.primaryColor}
          size="small"
        />
        <ActivityIndicatorModal
          statusBarColor={Color(Colors.primaryColor)
            .darken(0.52)
            .rgb()
            .string()}
          message="Please wait . . ."
          title="Sending instructions"
          visible={this.state.isLoading}
        />
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userProfile: state.login,
    shopingList: state.shoppinglistarr,
  };
};
const mapDispatchToProps = {
  logout,
  addItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeA);
