/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, { Component } from 'react';
import {
  ActivityIndicator,
  FlatList,
  I18nManager,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Color from 'color';
import Icon from '../../components/icon/Icon';
import TouchableItem from '../../components/TouchableItem';
import _, { forEach, isNull } from 'lodash';
import Colors from '../../theme/colors';
import { connect } from 'react-redux';
import {
  loginFailure,
  loginSuccess,
  addItem,
  resetShoppingList,
  addSuggestions,
  deleteKeyword,
} from '@reducers';
import { actions } from '@actions';
import HeaderIconButton from '../../components/navigation/HeaderIconButton';

const isRTL = I18nManager.isRTL;
const ARROW_ICON = 'ios-arrow-forward';

// SearchA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 16,
  },
  titleText: {
    // paddingTop: 8,
    paddingBottom: 5,
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: '7%',
    color: 'gray',
    // textDecorationLine: 'underline',
  },
  inputContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 20,
    // paddingBottom: 10,
    borderWidth: 2,
    borderColor: '#ECF0F9',
    height: 50,
    backgroundColor: Color(Colors.overlayColor).alpha(0.2),
  },
  textInput: {
    paddingLeft: 12,
    // marginVertical: '1%',
    height: 50,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    width: '85%',
  },
  iconContainer: {
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: '12%',
  },

  cardOverlay: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: Color(Colors.overlayColor).alpha(0.2),
    paddingHorizontal: 30,
  },
  cardContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#D0D3D4',
  },
  cardTitle: {
    paddingTop: 10,
    fontWeight: '700',
    fontSize: 16,
  },
  cardSubTitle: {
    fontWeight: '500',
    fontSize: 14,
    // width: '62%',
  },
  subItem: {
    flexDirection: 'row',
    // height: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: 'green',
  },
  cardSubTitleRight: {
    // width: '30%',
    // marginRight: '10%',
    fontWeight: '500',
    fontSize: 14,
    alignContent: 'space-between',
    textAlign: 'right',
  },
  listItem: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
});

// SearchA
class AddItems extends Component {
  constructor(props) {
    super(props);
    this.search = _.debounce((e) => {
      this.serchItemAPICall(e);
    }, 500);

    this.state = {
      searchText: [],
      searchItemResponse: [],
      Suggestions: [],
      isLoading: false,
    };
  }
  componentDidMount() {
    this.showSuggestions();
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
    console.log('props are', this.props);
  }
  showSuggestions = () => {
    this.setState({
      // Suggestions: this.props.shopingList.suggestions[0],
      Suggestions: this.props.userProfile.itemKeywordSuggestion,
    });
  };
  onBackPress = () => {
    const { navigation } = this.props;
    if (this.props.shopingList.data.length < 1) {
      this.props.resetShoppingList();
      navigation.navigate('Home');
    } else {
      navigation.navigate('ShoppingLists');
    }
  };
  serchItemAPICall = async (text) => {
    const { token } = this.props.userProfile;

    const searchItemResp = await actions.searchItem({
      text,
      token,
    });
    this.setState({ searchItemResponse: searchItemResp, isLoading: false });
  };

  //compare arrays

  are_arrs_match = (arr1, arr2) => {
    if (arr1 !== undefined) {
      return (
        arr1.length === arr2.length &&
        arr1.every(function (value, index) {
          return value === arr2[index];
        })
      );
    } else {
      return true;
    }
  };
  deleteKeyword = (params) => {
    let arry = [...this.state.Suggestions];
    let index = arry.findIndex(
      (elem) =>
        elem.keyword === params.keyword &&
        this.are_arrs_match(
          elem.parentToChildCategories,
          params.parentToChildCategories,
        ),
    );
    arry.splice(index, 1);
    this.setState({
      Suggestions: arry,
    });
  };
  navigateTo = (screen, params) => () => {
    const { navigation, shopingList } = this.props;
    this.deleteKeyword(params);
    if (screen === 'ShoppingLists') {
      const ifExist = shopingList.data.filter(
        (lst) =>
          lst.keyword === params.keyword &&
          this.are_arrs_match(
            lst.parentToChildCategories,
            params.parentToChildCategories,
          ),
      );

      if (ifExist.length < 1) {
        this.props.addItem(params);
      }
      navigation.navigate(screen);
    }
  };
  closeModal = () => {
    // for demo purpose clear timeout if user request close modal before 3s timeout
    clearTimeout(this.timeout);
    this.setState(
      {
        modalVisible: false,
      },
      () => {
        this.goBack();
      },
    );
  };
  keyExtractor = (item, index) => index.toString();

  renderCategoryItem = (item) => {
    return (
      <TouchableItem
        onPress={this.navigateTo('ShoppingLists', item)}
        style={styles.cardContainer}
        // borderless
      >
        <View>
          <Text style={styles.cardTitle}> {item.keyword}</Text>
          <View style={styles.subItem}>
            <View style={styles.listItem}>
              {item.parentToChildCategories.map((item) => {
                return (
                  <>
                    <Icon
                      name={ARROW_ICON}
                      size={15}
                      color="rgba(0, 0, 0, 0.75)"
                    />
                    <Text style={styles.cardSubTitle}>{item}</Text>
                  </>
                );
              })}
            </View>
            <View>
              <Text style={styles.cardSubTitleRight}>{item.count} results</Text>
            </View>
          </View>
        </View>
      </TouchableItem>
    );
  };

  render() {
    const searchItemResult = this.state.searchItemResponse;
    const listToRender =
      searchItemResult.length > 0 ? searchItemResult : this.state.Suggestions;
    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={(text) => {
              this.setState({
                searchText: text,
                isLoading: true,
                Suggestions: [],
              });
              this.search(text);
              if (text.length === 0) {
                this.showSuggestions();
              }
            }}
            placeholder="Search item"
            returnKeyType="search"
            style={styles.textInput}
            autoFocus={true}
            maxLength={50}
          />
          <View style={styles.iconContainer}>
            <View style={{ alignSelf: 'center', marginVertical: '25%' }}>
              <Icon name={'search'} size={18} color="white" />
            </View>
          </View>
        </View>
        <ActivityIndicator
          small
          animating={this.state.isLoading}
          color="green"
        />

        {!this.state.isLoading && (
          <Text style={styles.titleText}>
            {this.state.Suggestions.length > 0
              ? 'Suggestions'
              : this.state.Suggestions.length < 0
              ? 'No suggestions found'
              : searchItemResult.length > 0
              ? 'Search results'
              : searchItemResult.length === 0
              ? 'No item found'
              : ''}
          </Text>
        )}

        <View style={styles.container}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            style={styles.cardOverlay}
          >
            {listToRender.map((elem) => {
              return this.renderCategoryItem(elem);
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userProfile: state.login.data,
    shopingList: state.shoppinglistarr,
  };
};

const mapDispatchToProps = {
  loginFailure,
  loginSuccess,
  addItem,
  resetShoppingList,
  addSuggestions,
  deleteKeyword,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddItems);
