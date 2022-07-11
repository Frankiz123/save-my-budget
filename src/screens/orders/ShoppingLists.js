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
  Platform,
  SafeAreaView,
  Alert,
  TextInput,
  ScrollView,
  BackHandler,
} from 'react-native';
import Button from '../../components/buttons/Button';
import Color from 'color';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import HeaderIconButton from '../../components/navigation/HeaderIconButton';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// map to state/function
import { connect } from 'react-redux';
import {
  logout,
  addItem,
  deleteItem,
  resetShoppingList,
  savePriceComparison,
  addSuggestions,
} from '@reducers';
import { utils } from '@utils';

// import components
import TouchableItem from '../../components/TouchableItem';
import Feather from 'react-native-vector-icons/dist/Feather';
import CheckBox from 'react-native-check-box';

// import colors
import Colors from '../../theme/colors';
import { actions } from '@actions';
import ActivityIndicatorModal from '../../components/modals/ActivityIndicatorModal';
import moment from 'moment';

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
    height: Platform.OS === 'android' ? '35.5%' : '45%',
  },
  RenameContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: '5%',
    marginTop: '5%',
    flexDirection: 'row',
    borderWidth: 1,
    height: 40,
  },
  titleText: {
    paddingLeft: 30,
    fontWeight: '600',
    fontSize: 20,
  },
  renameBtn: {
    backgroundColor: Colors.primaryColor,
    borderRadius: 25,
    width: Platform.OS === 'android' ? hp(10) : hp(8),
    height: Platform.OS === 'android' ? hp(4) : hp(3),
    alignItems: 'center',
    justifyContent: Platform.OS === 'ios' ? 'center' : 'space-evenly',
  },
  renameText: {
    color: 'white',
    fontWeight: '500',
    bottom: Platform.OS === 'android' ? 2 : 0,
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
    alignItems: 'center',
    flexDirection: 'row',
    width: '95%',
  },
  cardTitle: {
    fontWeight: '500',
    fontSize: 14,
    paddingLeft: 10,
  },
  subItem: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
  cardTitleRight: {
    fontWeight: '500',
    fontSize: 12,
    textAlign: 'right',
  },
  compText: {
    fontWeight: '500',
    fontSize: 15,
    paddingTop: Platform.OS === 'ios' ? '6%' : '1%',
    paddingLeft: '4%',
  },
  compTextx: {
    fontWeight: '500',
    fontSize: 11,
    paddingLeft: '5%',
    textDecorationLine: 'underline',
  },
  textContainer1: {
    flexDirection: 'row',
    marginBottom: '3%',
    width: '95%',
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
  },
  compText1: {
    fontWeight: '500',
    fontSize: 11,
    textDecorationLine: 'underline',
  },
  compText2: {
    paddingLeft: 5,
    fontWeight: '500',
    fontSize: 15,
    color: '#9DD68C',
  },

  empContainer: {
    marginVertical: '10.9%',
  },
  btnCompare: {
    marginHorizontal: '10%',
    marginVertical: '5%',
    alignItems: 'center',
  },
  btnSet1: {
    flexDirection: 'row',
    marginVertical: Platform.OS === 'ios' ? '2%' : '1%',
    justifyContent: 'space-evenly',
  },
  btnSet2: {
    marginHorizontal: '5%',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '55%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp(1),
  },
  textInput: {
    borderRadius: 40,
    borderColor: '#ECF0F9',
    fontSize: 15,
    fontWeight: '500',
    paddingLeft: 7,
    color: '#000',
    textAlignVertical: 'center',
    textAlign: isRTL ? 'right' : 'left',
  },
  bottomDesc: {
    fontWeight: '500',
    color: '#474444',
    fontSize: 16,
  },
  bottomStatus: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#D0D3D4',
    marginHorizontal: '8%',
    paddingTop: 3,
  },
  checkBox: {
    flex: 1,
    padding: 10,
  },
});

// Shopping List
class ShoppingList extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      searchText: `${moment().format('DD/MM/YYYY')} list`,
      status: false,
      Rename: false,
      change: [],
      createListResp: [],
      lastComparison: null,
      listingDetail: null,
      isLoading: false,
      back: true,
    };
  }

  componentDidMount() {
    const listData = this.state.listingDetail || this.props.route.params;
    console.log('listin Data is', listData);

    if (listData) {
      this.setState({
        listingDetail: listData,
        status: listData.status === 'pending' ? false : true,
        searchText: this.props.route.params.name,
        change: this.props.shopingList.data,
      });
    }

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

      headerRight: () => {
        return (
          this.state.listingDetail && (
            <HeaderIconButton
              show={false}
              customeText={'Delete'}
              onPress={() => this.deleteShoppingList()}
              name={'trash-outline'}
              color={'red'}
              size={18}
            />
          )
        );
      },
    });

    this.lastComparisonAPICall();
  }

  //=================ooo=====================//
  //handle back button on device
  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick() {
    this.props.resetShoppingList();
    this.props.navigation.goBack(null);

    return true;
  }

  //=================ooo=====================//

  lastComparisonAPICall = async () => {
    const { token } = this.props.userProfile.data;
    const shopingList = this.props.shopingList.data;
    let itemObj = [];
    shopingList.forEach((element) => {
      itemObj.push({
        keyword: element.keyword,
        category_id: element.categoryId,
      });
    });
    const comparisonResp = await actions.lastComparison({
      items: itemObj,
      token,
    });
    if (!comparisonResp.errors) {
      this.setState({
        lastComparison: comparisonResp,
      });
    } else {
      utils.showAlert('Add Items', comparisonResp.errors.message[0]);
    }
  };
  onBackPress = () => {
    const shopingList = this.props.shopingList.data.length;
    if (this.state.change.length === shopingList) {
      this.goBack();
    } else {
      Alert.alert(
        'Shopping lists',
        `${
          this.state.listingDetail
            ? 'Do you want to update your list ?'
            : 'Do you want to save your list ?'
        }`,
        [
          {
            text: 'No',
            onPress: () => {
              this.goBack();
            },
          },
          {
            text: 'Yes',
            onPress: () => {
              if (this.state.listingDetail) {
                this.updateShoppingListAPICall();
                this.goBack();
              } else {
                this.setState({ back: false });
                this.addShoppingListAPICall();
              }
            },
            style: 'confirm',
          },
        ],
      );
    }
  };

  goBack = () => {
    const { navigation } = this.props;
    this.props.resetShoppingList();
    navigation.navigate('Home');
  };
  navigateTo = (screen, key) => () => {
    const { navigation } = this.props;
    Keyboard.dismiss();
    navigation.navigate(screen);
  };
  onPressRename = () => {
    this.setState({ Rename: !this.state.Rename });
    this.ref.focus();
  };

  delHandler = (keyword, categoryId) => {
    this.props.deleteItem({ keyword, categoryId });
    this.lastComparisonAPICall();
  };

  markAsComplete = async () => {
    const { token } = this.props.userProfile.data;

    this.setState({
      isLoading: true,
    });
    const Res = await actions.markAsComplete({
      //passing id to API
      token,
      id: this.state.listingDetail.id,
      status: this.state.status ? 'pending' : 'completed',
    });
    this.setState({
      isLoading: false,
    });

    if (!Res.errors) {
      utils.showAlert('Shopping lists', Res.message);
      this.setState({
        status: !this.state.status,
      });
    } else {
      utils.showAlert('Error...', Res.errors.message[0]);
    }
  };
  seeSelection = async () => {
    const { token } = this.props.userProfile.data;
    const shopping_list_id = this.state.lastComparison.comparisonResult
      .shopping_list_id;
    const listName = this.state.lastComparison.comparisonResult.shop_name;
    this.setState({
      isLoading: true,
    });
    const Res = await actions.comparisonReuslt({
      shopping_list_id: shopping_list_id,
      token,
    });
    this.setState({
      isLoading: false,
    });

    if (!Res.errors) {
      let obj = {
        ...Res,
        shopping_list_id: shopping_list_id,
        shopping_list_name: listName,
      };

      this.props.navigation.navigate('ComparedResults', obj);
    } else {
      utils.showAlert('Shopping lists', Res.errors.message[0]);
    }
  };
  addShoppingListAPICall = async (text) => {
    const { token } = this.props.userProfile.data;
    const data = this.props.shopingList.data;
    this.setState({
      isLoading: true,
    });
    let itemObj = [];
    data.forEach((element) => {
      itemObj.push({
        keyword: element.keyword,
        category_id: element.categoryId,
      });
    });
    const addShoppingListRes = await actions.addShoppingList({
      name: this.state.searchText,
      items: itemObj,
      token,
    });

    if (!addShoppingListRes.errors) {
      this.props.addSuggestions(addShoppingListRes.itemKeywordSuggestions);
      if (this.state.back) {
        this.props.navigation.navigate('Compare', addShoppingListRes);
      } else {
        this.goBack();
        this.setState({ back: true });
      }
    } else {
      utils.showAlert('Shopping lists', addShoppingListRes.errors.message[0]);
    }
    this.setState({
      isLoading: false,
    });
  };
  onPressCompare = () => {
    const shopingList = this.props.shopingList.data;
    const list = this.state.listingDetail;
    if (this.state.change.length === shopingList.length) {
      if (shopingList.length !== 0) {
        this.props.navigation.navigate('Compare', list);
      } else {
        utils.showAlert('Shopping lists', 'no item to compare');
      }
    } else {
      Alert.alert('Shopping lists', 'Do you want to update your list ?', [
        {
          text: 'No',
          onPress: () => {
            this.props.navigation.navigate('Compare', list);
          },
        },
        {
          text: 'Yes',
          onPress: () => {
            this.updateShoppingListAPICall();
            this.props.navigation.navigate('Compare', list);
          },
          style: 'Yes',
        },
      ]);
    }
  };
  updateShoppingListAPICall = async (text) => {
    const { token } = this.props.userProfile.data;
    const data = this.props.shopingList.data;
    if (data.length !== 0) {
      this.setState({
        isLoading: true,
      });
      let itemObj = [];
      data.forEach((element) => {
        itemObj.push({
          keyword: element.keyword,
          category_id: element.categoryId,
        });
      });
      const updateShoppingListRes = await actions.updateShoppingList({
        name: this.state.searchText,
        items: itemObj,
        token,
        id: this.state.listingDetail.id,
      });
      this.setState({
        isLoading: false,
        Rename: false,
      });

      if (updateShoppingListRes.errors) {
        utils.showAlert(
          'Shopping lists',
          updateShoppingListRes.errors.message[0],
        );
      }
    } else {
      utils.showAlert('Shopping lists', 'no item to update');
    }
  };
  deleteShoppingList = () => {
    Alert.alert('Delete', 'Are you sure you want to delete shopping list?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'confirm',
        onPress: () => {
          this.deleteShoppingListAPICall();
        },
      },
    ]);
  };
  deleteShoppingListAPICall = async (text) => {
    const { token } = this.props.userProfile.data;

    this.setState({
      isLoading: true,
    });

    const deleteShoppingListRes = await actions.deleteShoppingList({
      //passing id to API
      token,
      id: this.state.listingDetail.id,
    });
    this.setState({
      isLoading: false,
    });

    if (!deleteShoppingListRes.errors) {
      utils.showAlert('Shopping lists', deleteShoppingListRes.message, () => {
        this.goBack();
      });
    } else {
      utils.showAlert(
        'Shopping lists',
        deleteShoppingListRes.errors.message[0],
      );
    }
  };

  keyExtractor = (item, index) => index.toString();

  renderCategoryItem = ({ item, index }) => {
    return (
      <View style={styles.cardOverlay}>
        <ScrollView>
          <TouchableItem>
            <View style={styles.cardContainer}>
              <View>
                <Ionicons
                  onPress={() => {
                    this.delHandler(item.keyword, item.categoryId);
                  }}
                  name={PRODUCT_ICON}
                  size={25}
                  color="red"
                />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{item.keyword}</Text>
                <Text style={styles.cardTitleRight}>{item.categoryName}</Text>
              </View>
            </View>
          </TouchableItem>
        </ScrollView>
      </View>
    );
  };

  render() {
    const currentDate = moment().format('DD/MM/YYYY');
    const { lastComparison } = this.state;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />
        {/* <ScrollView> */}
        <View
          style={[
            styles.RenameContainer,
            { borderColor: this.state.Rename ? '#d3d3d3' : 'white' },
          ]}
        >
          <View
            style={{
              width: '74%',
            }}
          >
            <TextInput
              ref={(ref) => (this.ref = ref)}
              onChangeText={(text) => {
                this.setState({
                  searchText: text,
                });
              }}
              placeholder={this.state.listingDetail?.name || currentDate}
              value={this.state.searchText}
              style={[
                styles.textInput,
                { height: Platform.OS === 'android' ? 37 : 25 },
              ]}
              // editable={this.state.Rename}
              selectTextOnFocus={true}
              returnKeyType="next"
              maxLength={50}
              onFocus={() => this.setState({ Rename: true })}
              onEndEditing={() => {
                this.state.listingDetail
                  ? this.updateShoppingListAPICall()
                  : this.setState({
                      Rename: false,
                    });
              }}
              // clearTextOnFocus={true}
            />
          </View>

          {this.state.listingDetail && (
            <View style={{ paddingRight: 10 }}>
              <TouchableItem
                onPress={
                  this.updateShoppingListAPICall
                  // this.state.Rename
                  //   ? this.updateShoppingListAPICall
                  //   : this.onPressRename
                }
                style={styles.renameBtn}
              >
                <Text style={styles.renameText}>
                  {'Save'}

                  {/* {this.state.Rename ? 'Save' : 'Rename'} */}
                </Text>
              </TouchableItem>
            </View>
          )}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.buttonContainer}>
            <Button
              onPress={this.navigateTo('AddItems')}
              socialIconName={'plus'}
              title={'Select Item'}
              iconcolor={'#fff'}
              iconsize={10}
              borderRadius={25}
              fontWeight={'bold'}
            />
          </View>
        </View>

        <View style={styles.flatListContainer}>
          <FlatList
            data={this.props.shopingList.data}
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal={false}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderCategoryItem}
            // windowSize={21}
          />
        </View>
        {lastComparison?.comparisonResult && (
          <View>
            <Text style={styles.compText}> Last comparison:</Text>
            <Text style={styles.compTextx}>
              {lastComparison?.comparisonResult?.shop_name}
            </Text>
          </View>
        )}
        {lastComparison?.comparisonResult ? (
          <View style={styles.textContainer1}>
            <Text style={styles.compText1}>
              Best cart : {lastComparison?.comparisonResult?.market?.name}.com
            </Text>

            <TouchableItem
              style={{ paddingRight: '10%' }}
              onPress={this.seeSelection}
            >
              <View style={{ flexDirection: 'row' }}>
                <View>
                  <Feather name={'arrow-up-right'} size={18} color="#9DD68C" />
                </View>

                <View>
                  <Text style={styles.compText2}>See selection</Text>
                </View>
              </View>
            </TouchableItem>
          </View>
        ) : (
          <View style={styles.empContainer}></View>
        )}
        {this.state.listingDetail && (
          <View style={styles.bottomStatus}>
            <View style={{ marginVertical: 2 }}>
              <CheckBox
                style={styles.checkBox}
                onClick={this.markAsComplete}
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
        )}

        <View style={styles.btnCompare}>
          <Button
            onPress={
              !this.state.listingDetail
                ? this.addShoppingListAPICall
                : this.onPressCompare
            }
            socialIconName={!this.state.listingDetail && 'diamond'}
            title={'Compare prices'}
            iconcolor={'white'}
            color={'#4C7ED5'}
            iconsize={23}
            rounded
          />
        </View>

        <View>
          <ActivityIndicatorModal
            statusBarColor={Color(Colors.primaryColor)
              .darken(0.52)
              .rgb()
              .string()}
            message="Please wait . . ."
            title="Sending instructions"
            visible={this.state.isLoading}
          />
        </View>
        {/* </ScrollView> */}
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
  deleteItem,
  resetShoppingList,
  savePriceComparison,
  addSuggestions,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingList);
