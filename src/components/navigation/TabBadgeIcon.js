/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

// import colors
import Colors from '../../theme/colors';

// TabBadgeIcon Config

// TabBadgeIcon Styles
const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    justifyContent: 'center',
    alignItems: 'center',
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: Colors.secondaryColor,
  },
  badgeText: {
    top: -0.5,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.onSecondaryColor,
  },
});

// TabBadgeIcon
const TabBadgeIcon = ({ badgeCount, color, focused, name, size }) => (
  <View>
    <Icon name={name} size={size} color={color} />
    {badgeCount > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badgeCount}</Text>
      </View>
    )}
  </View>
);

export default TabBadgeIcon;
