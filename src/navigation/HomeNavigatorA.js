/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';

// import components
import TabBadgeIcon from '../components/navigation/TabBadgeIcon';

// import Home screen
import Home from '../screens/home/HomeA';

// import Search screen
import Search from '../screens/search/SearchA';

// import Favorites screen
import Favorites from '../screens/favorites/FavoritesA';

// import Cart screen
import Cart from '../screens/cart/CartA';

// import Settings screen
import Settings from '../screens/settings/SettingsA';

// import AddItems screen
import AddItems from '../screens/orders/AddItems';

// import colors
import Colors from '../theme/colors';
import webView from '../screens/chat/chat';

// HomeNavigator Config

type Props = {
  color: string,
  focused: string,
  size: number,
};

// create bottom tab navigator
const Tab = createBottomTabNavigator();

// HomeNavigator
function HomeNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="initialRoute"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused, size }: Props) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = `home${focused ? '' : '-outline'}`;
          } else if (route.name === 'Search') {
            iconName = 'magnify';
          } else if (route.name === 'Favorites') {
            iconName = `star${focused ? '' : '-outline'}`;
          } else if (route.name === 'Chat') {
            iconName = 'wechat';
          } else if (route.name === 'Settings') {
            iconName = `gear${focused ? '' : ''}`;

            return <FAIcon name={iconName} size={size} color={color} />;
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: Colors.primaryColor,
        inactiveTintColor: Colors.secondaryText,
        showLabel: false, // hide labels
        style: {
          backgroundColor: Colors.surface, // TabBar background
        },
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      {/* <Tab.Screen name="Search" component={Search} />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarIcon: (props) => (
            <TabBadgeIcon
              name={`cart${props.focused ? '' : '-outline'}`}
              badgeCount={5}
              {...props}
            />
          ),
        }}
      />
      <Tab.Screen name="Favorites" component={Favorites} /> */}
      <Tab.Screen name="Chat" component={webView} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

export default HomeNavigator;
