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
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  // Share,
} from 'react-native';
import Color from 'color';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

import TouchableItem from '../../components/TouchableItem';
import _, { isNull } from 'lodash';
import Colors from '../../theme/colors';
import { connect } from 'react-redux';
import { resetShoppingList, resetCart } from '@reducers';
import { actions } from '@actions';
import HeaderIconButton from '../../components/navigation/HeaderIconButton';
import { Heading6 } from '../../components/text/CustomText';
import Button from '../../components/buttons/Button';
import { utils } from '@utils';
import ActivityIndicatorModal from '../../components/modals/ActivityIndicatorModal';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import CheckBox from 'react-native-check-box';

// SearchA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    // marginTop: 10,
    // height: 230,
  },
  titleContainer: {
    marginTop: 30,
    paddingLeft: 28,
  },
  titleText: {
    marginTop: 30,
    paddingBottom: 50,
  },

  cardOverlay: {
    backgroundColor: Color(Colors.overlayColor).alpha(0.2),
    overflow: 'hidden',
    paddingHorizontal: 30,
  },
  cardContainer: {
    height: 55,
    borderBottomWidth: 1,
    borderColor: '#D0D3D4',
    alignContent: 'center',
  },
  card: { flexDirection: 'row', justifyContent: 'space-between' },
  cardTitle: {
    fontWeight: '500',
    fontSize: 16,
    marginVertical: 17,
  },
  cardTitleRight: {
    fontWeight: '400',
    fontSize: 14,
    marginVertical: 17,
    color: Colors.primaryColor,
  },
  btn: {
    marginTop: '10%',
    marginBottom: 20,
    alignItems: 'center',
    marginHorizontal: '20%',
  },
  share: {
    marginHorizontal: '8%',
    marginVertical: '5%',
  },
  headingShare: { fontSize: 22, fontWeight: '600' },
  bottomDesc: { fontWeight: '500', color: '#474444', fontSize: 16 },
  bottomStatus: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#D0D3D4',
    // backgroundColor: '#F6FAFA',
    // height: '20%',
    marginHorizontal: '8%',
    paddingVertical: 5,
  },
  checkBox: {
    flex: 1,
    padding: 10,
  },
  btnCompare: {
    marginHorizontal: '10%',
    marginVertical: '5%',
    alignItems: 'center',
  },
});

// Compared Result Component
class comparedResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: true,
      indicator: false,
      searchText: [],
      comparisonDetail: null,
      selectedShop: [],
      isLoading: false,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setOptions({
      headerLeft: () => (
        <HeaderIconButton
          onPress={() => {
            this.props.resetCart();
            navigation.goBack();
          }}
          name={'arrow-back'}
          color={Colors.black}
          size={18}
        />
      ),
    });
    let newState = this.props.route.params.marketComparison;
    console.log('new State Value ==== ', newState);

    newState = newState.map((elem) => {
      return {
        ...elem,
        selected: false,
      };
    });

    this.setState({
      comparisonDetail: newState,
    });
  }
  onItemPress = (indexx) => {
    const data = this.state.comparisonDetail[indexx];
    let newArray = this.state.comparisonDetail;
    newArray = newArray.map((elem, index) => {
      if (index === indexx) {
        return {
          ...elem,
          selected: true,
        };
      } else {
        return {
          ...elem,
          selected: false,
        };
      }
    });
    this.setState({
      selectedShop: data,
      comparisonDetail: newArray,
    });
  };
  saveAPICall = async () => {
    const { token } = this.props.userProfile;
    const listId = this.props.route.params.shopping_list_id;
    const marketId = this.state.selectedShop.market.id;

    const res = await actions.saveComparedResult({
      token,
      shopping_list_id: listId,
      market_id: marketId,
      status: this.state.status ? 'completed' : 'pending',
    });
    this.setState({ isLoading: false });
    if (!res.error) {
      utils.showAlert('Compared Items', res.message, () => {
        this.props.navigation.navigate('Home');
        this.props.resetShoppingList();
        this.props.resetCart();
      });
    } else {
      utils.showAlert('Compared Items', res.errors.message[0]);
    }
  };
  showProducts = (item) => {
    const listId = this.props.route.params.shopping_list_id;
    this.props.navigation.navigate('ShowProducts', {
      item,
      shopping_list_id: listId,
      status: this.state.status ? 'completed' : 'pending',
    });
  };
  onPressShare = () => {
    const { image, description } = this.props.route.params.sharedDetail;
    RNFetchBlob.fetch('GET', image)
      .then((resp) => {
        this.setState({ indicator: false });

        let base64image = resp.data;
        share('data:image/png;base64,' + base64image);
      })
      .catch((err) => console.log('error is ', err));

    const share = (base64image) => {
      let shareOptions = {
        title: 'Title',
        url: base64image,
        message: description,
        subject: 'Subject',
      };

      Share.open(shareOptions)
        .then()
        .catch((err) => {
          err && console.log(err);
        });
    };
  };
  updateStatus = () => {
    this.setState({
      status: !this.state.status,
    });

    // status: this.state.status ? 'pending' : 'completed',
  };

  onBackPress = () => {
    const { navigation } = this.props;
    this.props.resetShoppingList();
    navigation.goBack();
  };

  navigateTo = (screen, key) => () => {
    const { navigation } = this.props;
    Keyboard.dismiss();
    navigation.navigate(screen);
  };

  keyExtractor = (item, index) => index.toString();

  renderCategoryItem = ({ item, index }) => {
    return (
      <ScrollView style={styles.cardOverlay}>
        <TouchableItem
          onPress={() => this.onItemPress(index)}
          style={[
            styles.cardContainer,

            {
              backgroundColor: item.selected ? 'yellow' : 'white',
            },
          ]}
          // borderless
        >
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {item.market.name}.com - {item.product?.currency}{' '}
              {(item.price * 1).toFixed(2)}
              {item.currency}
            </Text>
            {item.selected && (
              <Text
                style={styles.cardTitleRight}
                onPress={() => this.showProducts(item)}
              >
                {' '}
                (Show Products){' '}
              </Text>
            )}
          </View>
        </TouchableItem>
      </ScrollView>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />
        <ScrollView>
          <View pointerEvents={this.state.indicator ? 'none' : 'auto'}>
            <View style={styles.titleContainer}>
              <Heading6 style={styles.headingsecondText}>
                {this.props.cartData
                  ? this.props.cartData?.shopping_list_name
                  : this.props.route.params.shopping_list_name}{' '}
                list
              </Heading6>
              <Heading6 style={styles.titleText}>
                {this.state.comparisonDetail?.length} Shops compared:
              </Heading6>
            </View>

            <View style={styles.container}>
              <FlatList
                data={this.state.comparisonDetail}
                showsHorizontalScrollIndicator={false}
                alwaysBounceHorizontal={false}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderCategoryItem}
                contentContainerStyle={styles.categoriesList}
              />
            </View>

            <View style={styles.share}>
              <TouchableItem
                onPress={() => {
                  this.onPressShare();
                  this.setState({ indicator: true });
                }}
              >
                <View style={{ flexDirection: 'row', marginVertical: '2%' }}>
                  <FontAwesome
                    name={'share-square-o'}
                    size={26}
                    color="black"
                  />
                  <Text style={styles.headingShare}> {'Spread the word!'}</Text>
                  <ActivityIndicator
                    animating={this.state.indicator}
                    size="small"
                    color={Colors.primaryColor}
                    style={{ paddingLeft: 15 }}
                  />
                </View>
              </TouchableItem>
              <View>
                <Text style={styles.bottomDesc}>
                  {' '}
                  {this.props.route.params.sharedDetail.description}
                </Text>
              </View>
            </View>

            <View style={styles.bottomStatus}>
              <View style={{ marginVertical: 2 }}>
                <CheckBox
                  style={styles.checkBox}
                  onClick={this.updateStatus}
                  isChecked={this.state.status}
                  checkBoxColor={Colors.primaryColor}
                />
              </View>
              <View style={{ marginVertical: 10, width: '80%' }}>
                <Text style={styles.bottomDesc}>
                  Mark as Completed to track your shopping expenses
                </Text>
              </View>
            </View>
            <View style={styles.btnCompare}>
              <Button
                onPress={() => {
                  this.setState({ isLoading: true });
                  this.saveAPICall();
                }}
                disabled={this.state.selectedShop.length < 1 && true}
                socialIconName={'diamond'}
                title={'Select & Save Purchase'}
                iconcolor={'white'}
                color={this.state.selectedShop.length < 1 ? 'gray' : '#4C7ED5'}
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
              visible={this.state.isLoading}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userProfile: state.login.data,
    shopingList: state.shoppinglistarr,
    cartData: state.cart.data[0],
  };
};

const mapDispatchToProps = {
  resetShoppingList,
  resetCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(comparedResults);
