/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, { Component } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// import utils
import getImgSource from '../../utils/getImgSource.js';

// import components
import { ButtonText } from '../text/CustomText';
import TouchableItem from '../TouchableItem';

// import colors, layout
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

// ActionProductCard Config
const IOS = Platform.OS === 'ios';
const MINUS_ICON = IOS ? 'ios-remove' : 'md-remove';
const PLUS_ICON = IOS ? 'ios-add' : 'md-add';
const imgHolder = require('../../assets/img/imgholder.png');
// import { Checkbox, RadioButton } from 'react-native-paper';
import CheckBox from 'react-native-check-box';
import Color from 'color';

// ActionProductCard Styles
const styles = StyleSheet.create({
  horizContainer: {
    margin: 4,
    // width: (Layout.SCREEN_WIDTH - 5 * 8) / 2,
    width: wp(90),
    flexDirection: 'row',
    // height: hp(40),
  },
  container: {
    margin: 4,
    // width: (Layout.SCREEN_WIDTH - 5 * 8) / 2,
    width: wp(30),
    // height: hp(40),
  },
  borderContainer: {
    flex: 1,

    // borderWidth: 1,
    // borderBottomWidth: 0,
    // borderColor: 'rgba(0, 0, 0, 0.08)',
    // borderTopLeftRadius: 4,
    // borderTopRightRadius: 4,
    // backgroundColor: Colors.surface,
    // overflow: 'hidden',
  },
  productImg: {
    width: 100,
    height: hp(10),
    resizeMode: 'cover',
  },
  titleContainer: {
    paddingTop: 7,
    paddingHorizontal: 10,
    height: 63,
  },
  title: {
    fontWeight: '500',
    fontSize: 15,
    color: Colors.primaryText,
    letterSpacing: 0.15,
    textAlign: 'left',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  oldPriceContainer: { marginLeft: 5, paddingTop: 2 },
  oldPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#8e8e8e',
  },
  hr: {
    position: 'absolute',
    top: 13,
    width: '100%',
    height: 1,
    backgroundColor: '#8e8e8e',
  },
  price: {
    fontWeight: '700',
    fontSize: 15,
    color: Colors.black,
  },
  actionContainer: {
    // borderBottomLeftRadius: 4,
    // borderBottomRightRadius: 4,
    // backgroundColor: Colors.secondaryColor,
    overflow: 'hidden',
    borderRadius: 20,
  },
  action: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 42,
    // paddingHorizontal: 0,
    overflow: 'hidden',
  },
  actionTitle: {
    color: Colors.onSecondaryColor,
    textAlign: 'center',
  },
  quantity: {
    top: -1,
    paddingHorizontal: 13,
    fontSize: 18,
    color: Colors.black,
    textAlign: 'center',
  },
  iconContainer: {
    // left: wp(1),
    backgroundColor: Colors.primaryColor,
    borderRadius: 25,
    // margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: 25,
    height: 25,
  },
  newLabelContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    // left: wp(27),
    borderRadius: 2,
    paddingVertical: 2,
    paddingHorizontal: 6,
    backgroundColor: Colors.white,
  },
  discountLabelContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    borderRadius: 2,
    paddingVertical: 2,
    paddingHorizontal: 6,
    backgroundColor: Colors.tertiaryColor,
  },
  label1: {
    fontSize: 11,
    fontWeight: 'bold',
    left: wp(1.5),
    color: Colors.black,
  },
  label: {
    fontSize: 8,
    color: Colors.black,
  },
  checkBox: {
    flex: 1,
    padding: 10,
  },
});

// ActionProductCard State
type State = {
  /**
   * Product in cart quantity
   */
  quantity: number,
};

// ActionProductCard Props
type Props = {
  activeOpacity: number,
  /**
   * Product image uri
   */
  imageUri: string,
  /**
   * Product name
   */
  title: string,

  /**
   * Product price
   */
  price: number,
  currency: String,

  /**
   * Product discount percentage
   */
  discountPercentage: number,

  /**
   * Handler to be called when the user taps on product card
   */
  onPress: () => void,
  label: 'new',
};

// ActionProductCard
export default class CompareProductCard extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      quantity: 0,
      toggle: false,
    };
  }
  onPressAdd = () => {
    const { quantity } = this.state;
    const newQuantity = quantity + 1;

    this.setState({
      quantity: newQuantity,
    });
  };

  onPressRemove = () => {
    const { quantity } = this.state;
    const newQuantity = quantity - 1;
    if (newQuantity > 0) {
      this.setState({
        quantity: newQuantity,
      });
    }
  };

  renderLabel = (label, discountPercentage) => {
    if (label === 'new') {
      return (
        <View style={styles.newLabelContainer}>
          <Text style={styles.label1}>1+ </Text>
          <Text style={styles.label}>weeks </Text>
        </View>
      );
    }
    if (discountPercentage) {
      return (
        <View style={styles.newLabelContainer}>
          <Text style={styles.label1}>1+ </Text>
          <Text style={styles.label}>weeks </Text>
        </View>
        // <View style={styles.discountLabelContainer}>
        //   <Text style={styles.label}>{`- ${discountPercentage}%`}</Text>
        // </View>
      );
    }

    return <View />;
  };

  render() {
    const {
      activeOpacity,
      onPlusClick,
      onMinusClick,
      imageUri,
      title,
      price = 0,
      currency,
      discountPercentage,
      label,
      ifExist,
      onQuantityPlus,
      onQuantityMinus,
      quantity,
      horizontal,
    } = this.props;

    return (
      <View style={horizontal ? styles.horizContainer : styles.container}>
        <View style={[styles.borderContainer]}>
          <TouchableItem activeOpacity={activeOpacity} borderless useForeground>
            <View style={{ flexDirection: horizontal ? 'row' : 'column' }}>
              <Image
                defaultSource={imgHolder}
                source={getImgSource(imageUri)}
                style={styles.productImg}
              />

              <View style={styles.titleContainer}>
                <Text numberOfLines={3} style={styles.title}>
                  {title}
                </Text>
              </View>

              {/* {discountPercentage ? (
                <View style={styles.productFooter}>
                  <Text style={styles.price}>
                    {`$ ${(((100 - discountPercentage) / 100) * price).toFixed(
                      2,
                    )}`}
                  </Text>
                  <TouchableItem
                    onPress={ifExist ? onMinusClick : onPlusClick}
                    borderless
                  >
                    <View style={styles.iconContainer}>
                      <Icon
                        name={PLUS_ICON}
                        size={20}
                        style={{ left: wp(0.7) }}
                        color={Colors.white}
                      />
                    </View>
                  </TouchableItem>
                </View>
              ) : ( */}
              <View style={styles.productFooter}>
                <Text
                  style={[
                    styles.price,
                    {
                      alignSelf: horizontal ? 'flex-start' : 'center',
                      left: horizontal ? 35 : 0,
                    },
                  ]}
                >
                  {currency}
                  {` ${price.toFixed(2)}`}
                </Text>
                {/* {!horizontal && (
                  <View>
                    <CheckBox
                      style={styles.checkBox}
                      onClick={ifExist ? onMinusClick : onPlusClick}
                      isChecked={ifExist}
                      checkBoxColor={Colors.primaryColor}
                    />
                  </View>
                )} */}
              </View>
              {/* )} */}

              {this.renderLabel(label, discountPercentage)}
            </View>
          </TouchableItem>
        </View>

        <View
          style={[
            styles.actionContainer,
            {
              marginLeft: horizontal ? 38 : 0,
              marginTop: horizontal ? 50 : -10,
            },
          ]}
        >
          <View style={styles.action}>
            {!horizontal && (
              <TouchableItem onPress={onQuantityMinus} borderless>
                <View
                  style={[styles.iconContainer, { backgroundColor: 'red' }]}
                >
                  <Icon
                    name={MINUS_ICON}
                    size={20}
                    color={Colors.onPrimaryColor}
                  />
                </View>
              </TouchableItem>
            )}

            <Text style={styles.quantity}>
              {/* {this.state.quantity ? this.state.quantity : 1} */}
              {horizontal ? `Quantity: ${quantity}` : quantity}
            </Text>
            {!horizontal && (
              <TouchableItem onPress={onQuantityPlus} borderless>
                <View style={styles.iconContainer}>
                  <Icon
                    name={PLUS_ICON}
                    size={20}
                    color={Colors.onPrimaryColor}
                  />
                </View>
              </TouchableItem>
            )}
          </View>
        </View>
      </View>
    );
  }
}
