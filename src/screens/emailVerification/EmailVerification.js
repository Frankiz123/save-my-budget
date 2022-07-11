/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, { Component } from 'react';
import {
  Platform,
  Alert,
  Keyboard,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import Color from 'color';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { CommonActions } from '@react-navigation/native';

// import components
import ActivityIndicatorModal from '../../components/modals/ActivityIndicatorModal';
import Button from '../../components/buttons/Button';
import { Paragraph } from '../../components/text/CustomText';
import { actions } from '@actions';
import { utils } from '@utils';

import { connect } from 'react-redux';
import { logout } from '@reducers';
import HeaderIconButton from '../../components/navigation/HeaderIconButton';

// import colors
import Colors from '../../theme/colors';

const LOGOUT_ICON = IOS ? 'ios-log-out' : 'md-log-out';
// EditProfileA Config

const AVATAR_SIZE = 100;
const IOS = Platform.OS === 'ios';
const CAMERA_ICON = IOS ? 'ios-camera' : 'md-camera';
const INPUT_FOCUSED_BORDER_COLOR = Colors.primaryColor;

// resendEmailA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 64,
    paddingHorizontal: 24,
    // backgroundColor: 'red',
  },
  instructionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Color(Colors.primaryColor).alpha(0.16),
  },
  instruction: {
    marginTop: 32,
    marginBottom: 20,
    paddingHorizontal: 20,
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    paddingTop: 16,
  },
  inputStyle: {
    textAlign: 'center',
  },
  buttonContainer: {
    paddingTop: 22,
    width: '90%',
  },
  resendEmail: {
    paddingVertical: 23,
    flexDirection: 'row',
  },
  resendEmailText: {
    fontWeight: '500',
    fontSize: 13,
    color: 'black',
    textAlign: 'center',
  },
});

// resendEmailA
class EmailVerification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      isLoading: false,
    };
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    navigation.setOptions({
      headerLeft: () => (
        <HeaderIconButton
          onPress={this.logout}
          name={LOGOUT_ICON}
          color={Colors.secondaryColor}
        />
      ),
    });

    // this.keyboardDidShowListener = Keyboard.addListener(
    //   'keyboardDidShow',
    //   this.keyboardDidShow,
    // );
    // this.keyboardDidHideListener = Keyboard.addListener(
    //   'keyboardDidHide',
    //   this.keyboardDidHide,
    // );
  };

  onPressVerifyEmail = async () => {
    this.setState({
      isLoading: true,
    });
    const { userInformation } = this.props;
    const data = await actions.verifyEmail({
      token: userInformation.token,
    });

    if (!data.errors) {
      if (data.emailVerifiedAt !== null) {
        this.navigateTo('HomeNavigator');
      } else {
        utils.showAlert(
          'Email Verification',
          'Your email is not verified yet!',
        );
      }
      //   this.props.navigation.goBack();
    }
    this.setState({
      isLoading: false,
    });
  };
  //Resend email

  onPressResendEmail = async () => {
    this.setState({
      isLoading: true,
    });
    const { userInformation } = this.props;
    const data = await actions.resendEmail({
      email: userInformation.email,
      token: userInformation.token,
    });

    if (!data.errors) {
      utils.showAlert('Email Verification', data.message);
    } else {
      utils.showAlert('Email Verification', data.errors.message[0]);
    }
    this.setState({
      isLoading: false,
    });
  };

  navigateTo = (screen) => {
    const { navigation } = this.props;
    if (screen === 'HomeNavigator') {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: screen }],
        }),
      );
    }
    // if (screen === 'EmailVerification') {
    //   navigation.replace(screen);
    // }
    else {
      navigation.navigate(screen);
    }
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
          onPress: () => {
            this.props.logout();
            // this.props.navigation.navigate('SignIn');
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
    const userInfo = this.props.userInformation;

    return (
      <SafeAreaView
        forceInset={{ top: 'never' }}
        style={styles.screenContainer}
      >
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <ScrollView contentContainerStyle={styles.contentContainerStyle}>
          <View style={styles.instructionContainer}>
            <View style={styles.iconContainer}>
              <Icon
                name="email-outline"
                size={36}
                color={Colors.primaryColor}
              />
            </View>
            <Paragraph style={styles.instruction}>
              Email has been sent at{' '}
              <Text style={{ color: 'black' }}>{userInfo?.user?.email}</Text>{' '}
              check email and verify to active your account.
            </Paragraph>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              onPress={this.onPressVerifyEmail}
              title={'confirm email'.toUpperCase()}
            />
          </View>
          <View style={styles.resendEmail}>
            <Text style={{ color: '#6a6b6b' }}>Didn't get email? </Text>
            <Text
              // onPress={this.showInputModal(true)}
              onPress={this.onPressResendEmail}
              style={styles.resendEmailText}
            >
              Resend
            </Text>
          </View>

          <ActivityIndicatorModal
            statusBarColor={Color(Colors.primaryColor)
              .darken(0.52)
              .rgb()
              .string()}
            message="Please wait . . ."
            // onRequestClose={this.closeModal}
            title="Sending instructions"
            visible={this.state.isLoading}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userInformation: state.login.data,
  };
};

const mapDispatchToProps = { logout };

export default connect(mapStateToProps, mapDispatchToProps)(EmailVerification);
