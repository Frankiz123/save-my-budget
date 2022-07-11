/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, { Component } from 'react';
import {
  Keyboard,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Color from 'color';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

// import components
import ActivityIndicatorModal from '../../components/modals/ActivityIndicatorModal';
import Button from '../../components/buttons/Button';
import { Paragraph } from '../../components/text/CustomText';
import UnderlineTextInput from '../../components/textinputs/UnderlineTextInput';
import { actions } from '@actions';
import { utils } from '@utils';

import { connect } from 'react-redux';
import { loginFailure, loginSuccess } from '@reducers';
import { CommonActions } from '@react-navigation/native';

// import colors
import Colors from '../../theme/colors';

// ForgotPasswordA Config
const PLACEHOLDER_TEXT_COLOR = 'rgba(0, 0, 0, 0.4)';
const INPUT_TEXT_COLOR = 'rgba(0, 0, 0, 0.87)';
const INPUT_BORDER_COLOR = 'rgba(0, 0, 0, 0.2)';
const INPUT_FOCUSED_BORDER_COLOR = '#000';

// ForgotPasswordA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainerStyle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 64,
    paddingHorizontal: 24,
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
    paddingHorizontal: 16,
    fontSize: 14,
    padding: 7,
  },
  inputContainer: {
    paddingTop: 16,
  },
  inputStyle: {
    padding: 7,
  },
  buttonContainer: {
    paddingTop: 22,
    width: '95%',
  },
});

// ForgotPasswordA
class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      passwordFocused: false,
      confirmPassword: '',
      confirmPasswordFocused: false,
      modalVisible: false,
      isLoading: false,
    };
  }

  componentDidMount = () => {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );
  };

  // avoid memory leak
  componentWillUnmount = () => {
    clearTimeout(this.timeout);
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  };

  onPressResetPassword = async () => {
    if (this.state.password && this.state.confirmPassword) {
      if (this.state.password === this.state.confirmPassword) {
        this.doResetPasswordCall();
      } else {
        utils.showAlert(
          'Reset Password',
          "Password and Confirm password doesn't match",
        );
      }
    } else {
      utils.showAlert('Reset Password', 'All fields are required');
    }
  };
  doResetPasswordCall = async () => {
    const { email, token } = this.props.route.params;
    this.setState({
      isLoading: true,
    });
    const data = await actions.setResetPassword({
      email: email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      token: token,
    });
    if (!data.errors) {
      this.props.loginSuccess(data);

      utils.showAlert(
        'Reset Password',
        'Your password has been updated successfully',
        () => this.props.navigation.navigate('HomeNavigator'),
      );
    } else {
      const keys = Object.keys(data.errors);
      const value = data.errors[keys[0]];
      utils.showAlert('Reset Password', value[0]);
    }
    this.setState({
      isLoading: false,
    });
  };

  keyboardDidShow = () => {
    this.setState({
      passwordFocused: true,
    });
  };

  keyboardDidHide = () => {
    this.setState({
      passwordFocused: false,
    });
  };

  passwordChange = (text) => {
    this.setState({
      password: text,
    });
  };
  confirmPasswordChange = (text) => {
    this.setState({
      confirmPassword: text,
    });
  };
  confirmPasswordFocus = () => {
    this.setState({
      confirmPasswordFocused: true,
      passwordFocused: false,
    });
  };
  passwordFocus = () => {
    this.setState({
      passwordFocused: true,
      confirmPasswordFocused: false,
    });
  };

  navigateTo = (screen) => {
    const { navigation } = this.props;
    navigation.navigate(screen);
  };

  resetPassword = () => {
    Keyboard.dismiss();
  };
  focusOn = (nextFiled) => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };
  render() {
    const { modalVisible } = this.state;
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
          <View style={styles.inputContainer}>
            <UnderlineTextInput
              onChangeText={this.passwordChange}
              inputFocused={this.state.passwordFocused}
              onSubmitEditing={this.focusOn(this.confirmPassword)}
              onFocus={this.passwordFocus}
              returnKeyType="next"
              blurOnSubmit={false}
              placeholder="Password"
              placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
              inputTextColor={INPUT_TEXT_COLOR}
              borderColor={INPUT_BORDER_COLOR}
              focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
              inputStyle={styles.inputStyle}
            />
            <UnderlineTextInput
              onRef={(r) => {
                this.confirmPassword = r;
              }}
              onFocus={this.confirmPasswordFocus}
              onChangeText={this.confirmPasswordChange}
              inputFocused={this.state.confirmPasswordFocused}
              onSubmitEditing={this.onPressReset}
              returnKeyType="next"
              blurOnSubmit={false}
              placeholder="Confirm Password"
              placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
              inputTextColor={INPUT_TEXT_COLOR}
              borderColor={INPUT_BORDER_COLOR}
              focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
              inputStyle={styles.inputStyle}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              onPress={this.onPressResetPassword}
              title={'Reset password'.toUpperCase()}
            />
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
    userProfile: state.login.data,
  };
};

const mapDispatchToProps = { loginFailure, loginSuccess };

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
