/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';

// import components
import Icon from '../icon/Icon';
import TouchableItem from '../TouchableItem';

// HeaderIconButton Config
const IOS = Platform.OS === 'ios';

// HeaderIconButton Styles
const styles = StyleSheet.create({
  androidButtonWrapper: {
    marginHorizontal: 13,
    backgroundColor: 'transparent',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  icon: IOS
    ? {
        flexDirection: 'row',
        height: 26, // 24
        width: 70, // 24
        // marginRight: 14,
        marginHorizontal: 8,
        marginVertical: 8, // 10
        justifyContent: 'space-evenly',
        alignItems: 'center',
      }
    : {
        flexDirection: 'row',
        height: 24,
        width: 60,
        // margin: 3,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        // backgroundColor: 'green',
      },
});

const renderIcon = (name, size, color, show, customeText, hide) => (
  //Back will  show if show !== false
  <View style={styles.icon}>
    <Icon name={name} size={size} color={color} show={show} />

    {show !== false && <Text style={{ fontWeight: '500' }}>Back</Text>}
    {show === false && (
      <Text style={{ fontWeight: '400', color: 'red' }}>{customeText}</Text>
    )}
  </View>
);
const HeaderIconButton = (props) => {
  const {
    onPress = () => null,
    rippleColor = 'rgba(0, 0, 0, 0.32)',
    customeText,
    name,
    hide,
    show,
    size = IOS ? 26 : 24,
    color = Platform.OS === 'android' ? 'rgba(0, 0, 0, 0.52)' : '#037aff',
  } = props;

  const button = (
    <TouchableItem
      accessibilityComponentType="button"
      accessibilityTraits="button"
      delayPressIn={0}
      onPress={onPress}
      rippleColor={rippleColor}
      style={styles.container}
      useForeground
      borderless
    >
      {renderIcon(name, size, color, show, customeText)}
    </TouchableItem>
  );

  if (Platform.OS === 'android') {
    return <View style={styles.androidButtonWrapper}>{button}</View>;
  }
  return button;
};

export default HeaderIconButton;
