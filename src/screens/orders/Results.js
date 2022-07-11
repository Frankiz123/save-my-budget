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
import _, { isNull } from 'lodash';
import Colors from '../../theme/colors';
import { connect } from 'react-redux';
import {
  loginFailure,
  loginSuccess,
  addItem,
  resetShoppingList,
} from '@reducers';
import { actions } from '@actions';
import HeaderIconButton from '../../components/navigation/HeaderIconButton';
import { Heading6 } from '../../components/text/CustomText';
import Button from '../../components/buttons/Button';

const isRTL = I18nManager.isRTL;
const ARROW_ICON = 'ios-arrow-forward';

// SearchA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    marginTop: 20,
    height: 230,
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
  cardTitle: {
    fontWeight: '500',
    fontSize: 16,
    marginVertical: 17,
  },
  btn: {
    marginTop: 20,
    alignItems: 'center',
    marginHorizontal: '20%',
  },
});

// SearchA
class Results extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: [],
      searchItemResponse: [
        {
          name: 'Tesco',
          price: '35',
          currency: '£',
        },
        {
          name: 'Asda',
          price: '27.50',
          currency: '£',
        },
        {
          name: 'Waitrose',
          price: '30.50',
          currency: '£',
        },
        {
          name: 'Ocado',
          price: '25.00',
          currency: '£',
        },
        {
          name: 'Tesco',
          price: '35',
          currency: '£',
        },
        {
          name: 'Asda',
          price: '27.50',
          currency: '£',
        },
        {
          name: 'Waitrose',
          price: '30.50',
          currency: '£',
        },
        {
          name: 'Ocado',
          price: '25.00',
          currency: '£',
        },
        {
          name: 'Tesco',
          price: '35',
          currency: '£',
        },
        {
          name: 'Asda',
          price: '27.50',
          currency: '£',
        },
        {
          name: 'Waitrose',
          price: '30.50',
          currency: '£',
        },
        {
          name: 'Ocado',
          price: '25.00',
          currency: '£',
        },
      ],

      isLoading: false,
    };
  }
  componentDidMount() {
    const { navigation } = this.props;
    // navigation.setOptions({
    //   headerLeft: () => (
    //     <HeaderIconButton
    //       onPress={this.onBackPress}
    //       name={'chevron-back'}
    //       color={Colors.black}
    //     />
    //   ),
    // });
  }
  onBackPress = () => {
    const { navigation } = this.props;
    this.props.resetShoppingList();
    navigation.goBack();
  };
  //   serchItemAPICall = async (text) => {
  //     const { token } = this.props.userProfile;

  //     const searchItemResp = await actions.searchItem({
  //       text,
  //       token,
  //     });

  //     this.setState({ searchItemResponse: searchItemResp, isLoading: false });
  //   };
  //compare arrays

  //   are_arrs_match = (arr1, arr2) => {
  //     console.log('arrays are', arr1, arr2);
  //     return (
  //       arr1.length === arr2.length &&
  //       arr1.every(function (value, index) {
  //         return value === arr2[index];
  //       })
  //     );
  //   };

  navigateTo = (screen, params) => () => {
    const { navigation, shopingList } = this.props;
    Keyboard.dismiss();
    // if (screen === 'ShoppingLists') {
    //   const ifExist = shopingList.data.filter(
    //     (lst) =>
    //       lst.keyword === params.keyword &&
    //       this.are_arrs_match(
    //         lst.parentToChildCategories,
    //         params.parentToChildCategories,
    //       ),
    //   );

    //   if (ifExist.length < 1) {
    //     this.props.addItem(params);
    //   }
    //   navigation.navigate(screen);
    // }
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

  renderCategoryItem = ({ item, index }) => (
    <ScrollView style={styles.cardOverlay}>
      <TouchableItem
        onPress={() => {}}
        style={styles.cardContainer}
        // borderless
      >
        <View>
          <Text style={styles.cardTitle}>
            {item.name}.com - {item.price}
            {item.currency}
          </Text>
        </View>
      </TouchableItem>
    </ScrollView>
  );

  render() {
    const searchItemResult = this.state.searchItemResponse;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />
        <ScrollView>
          <View style={styles.titleContainer}>
            <Heading6 style={styles.headingsecondText}>13/03 List</Heading6>
            <Heading6 style={styles.titleText}>4 Shops compared:</Heading6>
          </View>

          {/* <View style={styles.inputContainer}>
          <ActivityIndicator
            small
            animating={this.state.isLoading}
            color="green"
          />
        </View> */}

          <View style={styles.container}>
            <FlatList
              data={searchItemResult}
              showsHorizontalScrollIndicator={false}
              alwaysBounceHorizontal={false}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderCategoryItem}
              contentContainerStyle={styles.categoriesList}
            />
          </View>
          <View style={styles.btn}>
            <Button
              onPress={() => {
                //   this.props.navigation.navigate('Compare');
              }}
              rounded
              title={'Select & Save Purchase'}
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
  };
};

const mapDispatchToProps = {
  loginFailure,
  loginSuccess,
  addItem,
  resetShoppingList,
};

export default connect(mapStateToProps, mapDispatchToProps)(Results);
