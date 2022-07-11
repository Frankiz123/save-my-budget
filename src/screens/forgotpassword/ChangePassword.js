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
// import components
import ActivityIndicatorModal from '../../components/modals/ActivityIndicatorModal';
import HeaderIconButton from '../../components/navigation/HeaderIconButton';
import Button from '../../components/buttons/Button';
import UnderlineTextInput from '../../components/textinputs/UnderlineTextInput';
import { actions } from '@actions';
import { utils } from '@utils';

import { connect } from 'react-redux';
import { loginFailure, loginSuccess } from '@reducers';

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
    textAlign: 'center',
  },
  inputContainer: {
    paddingTop: 16,
  },
  inputStyle: {
    padding: 7,
  },
  buttonContainer: {
    paddingTop: 25,
    width: '95%',
    // backgroundColor: 'green',
  },
});

// ForgotPasswordA
class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      oldPassword: '',
      oldPasswordFocused: false,
      newPassword: '',
      newPasswordFocused: false,
      modalVisible: false,
      isLoading: false,
    };
  }
  componentDidMount = () => {
    const { navigation } = this.props;
    navigation.setOptions({
      headerLeft: () => (
        <HeaderIconButton
          onPress={() => navigation.goBack()}
          name={'arrow-back'}
          color={Colors.black}
          size={18}
        />
      ),
    });
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

  onPressSave = async () => {
    const userInfo = this.props.userProfile;
    this.setState({
      isLoading: true,
    });

    let data = null;

    if (userInfo.user.setPassword === 0) {
      data = await actions.setChangePassword({
        newPassword: this.state.newPassword,
        token: userInfo.token,
        email: userInfo.user.email,
      });
    } else {
      data = await actions.setChangePassword({
        oldPassword: this.state.oldPassword,
        newPassword: this.state.newPassword,
        token: userInfo.token,
        email: userInfo.user.email,
      });
    }

    if (!data.errors) {
      this.props.loginSuccess({
        ...userInfo,
        user: { ...userInfo.user, setPassword: 1 },
      });
      utils.showAlert(
        'Change Password',
        'Your password has been changed successfully',
        () => this.props.navigation.goBack(),
      );
    } else {
      const keys = Object.keys(data.errors);
      const value = data.errors[keys[0]];
      utils.showAlert('Change Password Error', value[0]);
    }
    this.setState({
      isLoading: false,
    });
  };

  keyboardDidShow = () => {
    this.setState({
      oldPasswordFocused: true,
    });
  };

  keyboardDidHide = () => {
    this.setState({
      oldPasswordFocused: false,
    });
  };

  oldPasswordChange = (text) => {
    this.setState({
      oldPassword: text,
    });
  };

  oldPasswordFocus = () => {
    this.setState({
      oldPasswordFocused: true,
      newPasswordFocused: false,
    });
  };
  newPasswordChange = (text) => {
    this.setState({
      newPassword: text,
    });
  };
  newPasswordFocus = () => {
    this.setState({
      newPasswordFocused: true,
      oldPasswordFocused: false,
    });
  };

  navigateTo = (screen) => {
    const { navigation } = this.props;
    navigation.navigate(screen);
  };

  ChangePassword = () => {
    Keyboard.dismiss();
  };
  focusOn = (nextFiled) => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };
  render() {
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
            {this.props.userProfile.user.setPassword !== 0 && (
              <UnderlineTextInput
                onChangeText={this.oldPasswordChange}
                inputFocused={this.state.oldPasswordFocused}
                onSubmitEditing={this.focusOn(this.newPassword)}
                onFocus={this.oldPasswordFocus}
                returnKeyType="next"
                blurOnSubmit={false}
                placeholder="Old Password"
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                inputStyle={styles.inputStyle}
              />
            )}

            <UnderlineTextInput
              onRef={(r) => {
                this.newPassword = r;
              }}
              onFocus={this.newPasswordFocus}
              onChangeText={this.newPasswordChange}
              inputFocused={this.state.newPasswordFocused}
              onSubmitEditing={this.onPressSave}
              returnKeyType="next"
              blurOnSubmit={false}
              placeholder="New Password"
              placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
              inputTextColor={INPUT_TEXT_COLOR}
              borderColor={INPUT_BORDER_COLOR}
              focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
              inputStyle={styles.inputStyle}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button onPress={this.onPressSave} title={'Save'.toUpperCase()} />
          </View>

          <ActivityIndicatorModal
            statusBarColor={Color(Colors.primaryColor)
              .darken(0.52)
              .rgb()
              .string()}
            message="Please wait . . ."
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
