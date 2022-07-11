/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, { Component } from 'react';
import {
  Alert,
  I18nManager,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

// import components
import Avatar from '../../components/avatar/Avatar';
import Divider from '../../components/divider/Divider';
import Icon from '../../components/icon/Icon';
import { CommonActions } from '@react-navigation/native';

import {
  Heading6,
  Subtitle1,
  Subtitle2,
} from '../../components/text/CustomText';
import TouchableItem from '../../components/TouchableItem';

// import colors
import Colors from '../../theme/colors';
// map to state/function
import { connect } from 'react-redux';
import { logout } from '@reducers';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// SettingsA Config
const isRTL = I18nManager.isRTL;
const IOS = Platform.OS === 'ios';
const DIVIDER_MARGIN_LEFT = 60;
const ARROW_ICON = 'ios-arrow-forward';
const ADDRESS_ICON = 'md-lock-closed-outline';
const TERMS_ICON = 'paper-plane-outline';
const ABOUT_ICON = IOS
  ? 'ios-information-circle-outline'
  : 'md-information-circle-outline';
const LOGOUT_ICON = IOS ? 'ios-log-out' : 'md-log-out';

// SettingsA Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainerStyle: {
    paddingBottom: 16,
  },
  titleContainer: {
    paddingHorizontal: 16,
  },
  titleText: {
    paddingTop: 16,
    paddingBottom: 24,
    fontWeight: '700',
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  profileContainer: {
    paddingVertical: 16,
  },
  leftSide: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  profileInfo: {
    paddingLeft: 16,
  },
  name: {
    fontWeight: '500',
    textAlign: 'left',
  },
  email: {
    paddingVertical: 2,
  },
  mediumText: {
    fontWeight: '500',
  },
  setting: {
    height: 56,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    width: 28,
    height: 28,
  },
  extraDataContainer: {
    top: -8,
    marginLeft: DIVIDER_MARGIN_LEFT,
    paddingBottom: 8,
  },
  extraData: {
    textAlign: 'left',
  },
  logout: { color: Colors.secondaryColor },
});

// SettingsA Props
type Props = {
  icon: string,
  title: String,
  onPress: () => {},
  extraData: React.Node,
};

// SettingsA Components
const Setting = ({ icon, title, onPress, extraData }: Props) => (
  <TouchableItem onPress={onPress}>
    <View>
      <View style={[styles.row, styles.setting]}>
        <View style={styles.leftSide}>
          {icon !== undefined && (
            <View style={styles.iconContainer}>
              <Icon name={icon} size={24} color={Colors.primaryColor} />
            </View>
          )}
          <Subtitle1 style={styles.mediumText}>{title}</Subtitle1>
        </View>

        <View style={isRTL && { transform: [{ scaleX: -1 }] }}>
          <Icon name={ARROW_ICON} size={16} color="rgba(0, 0, 0, 0.16)" />
        </View>
      </View>

      {extraData ? (
        <View style={styles.extraDataContainer}>{extraData}</View>
      ) : (
        <View />
      )}
    </View>
  </TouchableItem>
);

// SetingsA
class SettingsA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationsOn: true,
      firstName: '',
      lastName: '',
      email: '',
    };
  }
  componentDidMount() {
    const { userProfile } = this.props;
    if (userProfile?.data != null) {
      const { user } = userProfile.data;
      if (user) {
        this.setState({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
      }
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.userProfile.data) {
      if (
        prevProps.userProfile.data.user.firstName !==
          this.props.userProfile.data.user.firstName ||
        prevProps.userProfile.data.user.lastName !==
          this.props.userProfile.data.user.lastName
      ) {
        const { userProfile } = this.props;
        const { user } = userProfile.data;
        this.setState({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
      }
    }
  }

  navigateTo = (screen) => () => {
    const { navigation } = this.props;
    navigation.navigate(screen);
  };

  toggleNotifications = (value) => {
    this.setState({
      notificationsOn: value,
    });
  };

  logout = () => {
    const { navigation } = this.props;
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            this.props.logout();
            try {
              await GoogleSignin.revokeAccess();
              await GoogleSignin.signOut();
            } catch (error) {
              console.error(error);
            }

            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{ name: 'Welcome' }],
              }),
            );
          },
        },
      ],
      { cancelable: false },
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <ScrollView contentContainerStyle={styles.contentContainerStyle}>
          <View style={styles.titleContainer}>
            <Heading6 style={styles.titleText}>Settings</Heading6>
          </View>

          <TouchableItem useForeground onPress={this.navigateTo('EditProfile')}>
            <View style={[styles.row, styles.profileContainer]}>
              <View style={styles.leftSide}>
                <Avatar
                  // imageUri={require('../../assets/img/profile_1.jpeg')}

                  rounded
                  size={60}
                />
                <View style={styles.profileInfo}>
                  <Subtitle1 style={styles.name}>
                    {this.state.firstName} {this.state.lastName}
                  </Subtitle1>
                  <Subtitle2 style={styles.email}>{this.state.email}</Subtitle2>
                </View>
              </View>
            </View>
          </TouchableItem>

          <Divider />

          <Setting
            onPress={this.navigateTo('ChangePassword')}
            icon={ADDRESS_ICON}
            title="Change Password"
          />

          <Divider type="inset" marginLeft={DIVIDER_MARGIN_LEFT} />

          <Setting
            onPress={this.navigateTo('TermsConditions')}
            icon={TERMS_ICON}
            title="Terms and Conditions"
          />
          <Divider type="inset" marginLeft={DIVIDER_MARGIN_LEFT} />

          <Setting
            onPress={this.navigateTo('TermsConditions')}
            icon={ABOUT_ICON}
            title="Privacy Policy"
          />
          <Divider type="inset" marginLeft={DIVIDER_MARGIN_LEFT} />

          <TouchableItem onPress={this.logout}>
            <View style={[styles.row, styles.setting]}>
              <View style={styles.leftSide}>
                <View style={styles.iconContainer}>
                  <Icon
                    name={LOGOUT_ICON}
                    size={24}
                    color={Colors.secondaryColor}
                  />
                </View>
                <Subtitle1 style={[styles.logout, styles.mediumText]}>
                  Logout
                </Subtitle1>
              </View>
            </View>
          </TouchableItem>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userProfile: state.login,
  };
};
const mapDispatchToProps = { logout };

export default connect(mapStateToProps, mapDispatchToProps)(SettingsA);
