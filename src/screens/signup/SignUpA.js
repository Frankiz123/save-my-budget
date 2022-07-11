/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, { Component } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// import components
import Button from '../../components/buttons/Button';
import UnderlinePasswordInput from '../../components/textinputs/UnderlinePasswordInput';
import UnderlineTextInput from '../../components/textinputs/UnderlineTextInput';
import ActivityIndicatorModal from '../../components/modals/ActivityIndicatorModal';
import { CommonActions } from '@react-navigation/native';
import HeaderIconButton from '../../components/navigation/HeaderIconButton';

import Color from 'color';
import { actions } from '@actions';
import { utils } from '@utils';
import { connect } from 'react-redux';
import {
  signupFailure,
  signupSuccess,
  socialLoginSuccess,
  socialLoginFailure,
  addSuggestions,
} from '@reducers';

import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication';

// import Google Sign in
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
GoogleSignin.configure({
  // scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
  webClientId:
    '451216403874-2dvqgmqp81f0pd916h8qb3riet4uacj6.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  forceCodeForRefreshToken: false, // [Android] related to `serverAuthCode`, read the docs link below *.
  // accountName: '', // [Android] specifies an account name on the device that should be used
  andoidCliendId:
    '451216403874-b9e087gikcmr3bd8b9tlf29u0v00tl0o.apps.googleusercontent.com',
  iosClientId:
    '451216403874-ursutib012c93u3cvlu2392bouu4t040.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  // googleServicePlistPath: '', // [iOS] optional, if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
  offlineAccess: true,
});

// import fbsdk
// import fbsdk
import {
  LoginButton,
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

// import colors, layout
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

// SignUpA Config
const PLACEHOLDER_TEXT_COLOR = 'rgba(0, 0, 0, 0.4)';
const INPUT_TEXT_COLOR = 'rgba(0, 0, 0, 0.87)';
const INPUT_BORDER_COLOR = 'rgba(0, 0, 0, 0.2)';
const INPUT_FOCUSED_BORDER_COLOR = '#000';

// SignUpA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainerStyle: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  form: {
    paddingHorizontal: Layout.LARGE_PADDING,
  },
  inputContainer: { marginBottom: 7 },
  vSpacer: {
    height: 15,
  },
  buttonContainer: {
    paddingVertical: 23,
  },
  buttonsGroup: {
    paddingTop: 23,
  },
  separator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 64,
    height: 1,
    backgroundColor: INPUT_BORDER_COLOR,
  },
  orText: {
    top: -2,
    paddingHorizontal: 8,
    color: PLACEHOLDER_TEXT_COLOR,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  termsContainer: {
    flexDirection: 'row',
  },
  footerText: {
    fontWeight: '300',
    fontSize: 13,
    color: Colors.primaryText,
  },
  footerLink: {
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
  buttonApple: {
    width: '100%', // You must specify a width
    height: 45, // You must specify a height
    // backgroundColor: 'red',
  },
});

// SignUpA
class SignUpA extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      firstNameFocused: false,
      lastName: '',
      lastNameFocused: false,
      email: '',
      emailFocused: false,
      password: '',
      isLoading: false,
      passwordFocused: false,
      secureTextEntry: true,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setOptions({
      headerLeft: () => (
        <HeaderIconButton
          onPress={() => this.props.navigation.goBack()}
          name={'arrow-back'}
          color={Colors.black}
          size={18}
        />
      ),
    });
  }

  onAppleButtonPress = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    console.log('apple repsonse', appleAuthRequestResponse);

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );
    console.log('credentialState ->>>>>>', credentialState);

    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
      console.log('user authenticated ->>>>>>');
      this.doSocialLoginApiCall({
        accessToken: appleAuthRequestResponse.identityToken,
        provider: 'apple',
        first_name: appleAuthRequestResponse.fullName.givenName,
        last_name: appleAuthRequestResponse.fullName.familyName,
      });
    }
  };

  doSignupCall = async () => {
    const signupResp = await actions.Signup({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
    });

    if (!signupResp.errors) {
      this.navigateTo('EmailVerification');
      this.props.signupSuccess(signupResp);
      this.props.addSuggestions(signupResp.itemKeywordSuggestion);
    } else {
      const keys = Object.keys(signupResp.errors);
      const value = signupResp.errors[keys[0]];
      this.props.signupFailure({ ...signupResp, message: { value } });
      utils.showAlert('Signup Error', value[0]);
    }
    this.setState({
      isLoading: false,
    });
  };

  // Social Login
  doSocialLoginApiCall = async (params) => {
    this.setState({
      isLoading: true,
    });
    console.log('Value of params ====== ', params);
    const { accessToken, provider, first_name, last_name } = params;
    const loginResp = await actions.doSocialLoginApiCall({
      accessToken,
      provider,
      first_name,
      last_name,
    });
    if (!loginResp.errors) {
      this.props.socialLoginSuccess(loginResp);
      const emailVerified = loginResp.user.emailVerifiedAt;
      if (emailVerified !== null) {
        this.props.addSuggestions(loginResp.itemKeywordSuggestion);
        this.navigateTo('HomeNavigator');
      } else {
        this.navigateTo('EmailVerification');
      }
    } else {
      this.props.socialLoginFailure(loginResp);
      utils.showAlert('Login Error', loginResp.errors.message[0]);
    }
    this.setState({
      isLoading: false,
    });
  };

  firstNameChange = (text) => {
    this.setState({
      firstName: text,
    });
  };

  firstNameFocus = () => {
    this.setState({
      firstNameFocused: true,
      lastNameFocused: false,
      emailFocused: false,
      passwordFocused: false,
    });
  };
  lastNameChange = (text) => {
    this.setState({
      lastName: text,
    });
  };

  lastNameFocus = () => {
    this.setState({
      lastNameFocused: true,
      firstNameFocused: false,
      emailFocused: false,
      passwordFocused: false,
    });
  };

  emailChange = (text) => {
    this.setState({
      email: text,
    });
  };

  emailFocus = () => {
    this.setState({
      emailFocused: true,
      lastNameFocused: false,
      firstNameFocused: false,
      passwordFocused: false,
    });
  };

  passwordChange = (text) => {
    this.setState({
      password: text,
    });
  };

  passwordFocus = () => {
    this.setState({
      passwordFocused: true,
      firstNameFocused: false,
      lastNameFocused: false,
      emailFocused: false,
    });
  };

  onTogglePress = () => {
    const { secureTextEntry } = this.state;
    this.setState({
      secureTextEntry: !secureTextEntry,
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
    } else if (screen === 'EmailVerification') {
      navigation.replace(screen);
    }
    navigation.navigate(screen);
  };

  //FaceBook Signup/Login

  _fbLogin = async () => {};

  createAccount = () => {
    // const { email, phone, password } = this.state;
    this.setState({
      firstNameFocused: false,
      lastNameFocused: false,
      emailFocused: false,
      passwordFocused: false,
    });
    if (
      this.state.firstName &&
      this.state.lastName &&
      this.state.email &&
      this.state.password
    ) {
      this.setState({
        isLoading: true,
      });
      this.doSignupCall();
    } else {
      utils.showAlert('Signup', 'All fields are required');
    }
    // this.navigateTo('Verification');
  };

  focusOn = (nextFiled) => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };

  render() {
    const {
      firstNameFocused,
      lastNameFocused,
      emailFocused,
      password,
      passwordFocused,
      secureTextEntry,
    } = this.state;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <KeyboardAwareScrollView
          contentContainerStyle={styles.contentContainerStyle}
        >
          <View style={styles.content}>
            <View />

            <View style={styles.form}>
              <UnderlineTextInput
                onRef={(r) => {
                  this.firstName = r;
                }}
                onChangeText={this.firstNameChange}
                onFocus={this.firstNameFocus}
                inputFocused={firstNameFocused}
                onSubmitEditing={this.focusOn(this.lastName)}
                returnKeyType="next"
                blurOnSubmit={false}
                placeholder="First Name"
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                inputContainerStyle={styles.inputContainer}
              />
              <UnderlineTextInput
                onRef={(r) => {
                  this.lastName = r;
                }}
                onChangeText={this.lastNameChange}
                onFocus={this.lastNameFocus}
                inputFocused={lastNameFocused}
                onSubmitEditing={this.focusOn(this.email)}
                returnKeyType="next"
                blurOnSubmit={false}
                placeholder="Last Name"
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                inputContainerStyle={styles.inputContainer}
              />
              <UnderlineTextInput
                onRef={(r) => {
                  this.email = r;
                }}
                onChangeText={this.emailChange}
                onFocus={this.emailFocus}
                inputFocused={emailFocused}
                onSubmitEditing={this.focusOn(this.password)}
                returnKeyType="next"
                blurOnSubmit={false}
                keyboardType="email-address"
                placeholder="Email"
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                inputContainerStyle={styles.inputContainer}
              />
              <UnderlinePasswordInput
                onRef={(r) => {
                  this.password = r;
                }}
                onChangeText={this.passwordChange}
                onFocus={this.passwordFocus}
                inputFocused={passwordFocused}
                onSubmitEditing={this.createAccount}
                returnKeyType="done"
                placeholder="Password"
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                secureTextEntry={secureTextEntry}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                toggleVisible={password.length > 0}
                toggleText={secureTextEntry ? 'Show' : 'Hide'}
                onTogglePress={this.onTogglePress}
              />

              <View style={styles.buttonContainer}>
                <Button
                  onPress={this.createAccount}
                  title={'Create Account'.toUpperCase()}
                />
              </View>

              <View style={styles.separator}>
                <View style={styles.line} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.line} />
              </View>

              <View style={styles.buttonsGroup}>
                <Button
                  onPress={() => {
                    //=====000000=========
                    const loginCall = (accessToken, provider) =>
                      this.doSocialLoginApiCall(accessToken, provider);
                    LoginManager.setLoginBehavior('WEB_ONLY');
                    LoginManager.logInWithPermissions(['email'])
                      .then(function (result, doSocialLoginApiCall) {
                        AccessToken.getCurrentAccessToken()
                          .then((data) => {
                            console.log(
                              'Value of data in sign Up ====== ',
                              data,
                            );
                            loginCall({
                              accessToken: data.accessToken,
                              provider: 'facebook',
                            });

                            // new GraphRequestManager().addRequest(token).start();
                          })
                          .catch((err) => {
                            console.log('Facebook Catch Error => ', err);
                          });
                      })
                      .catch((err) => {
                        console.log(
                          'Facebook Login Error with permissions',
                          err,
                        );
                      });

                    //======999999=======
                  }}
                  color="#3b5998"
                  socialIconName="facebook-square"
                  iconColor={Colors.white}
                  title={'Sign up with Facebook'.toUpperCase()}
                />

                <View style={styles.vSpacer} />

                <Button
                  onPress={async () => {
                    const that = this;
                    try {
                      await GoogleSignin.hasPlayServices();
                      const response = await GoogleSignin.signIn();
                      let info = response.user;
                      const data = {
                        name: info.name,
                        email: info.email,
                        picture: info.photo,
                        user_id: info.id,
                      };

                      if (response.user) {
                        this.doSocialLoginApiCall({
                          accessToken: response.serverAuthCode,
                          provider: 'google',
                        });
                      }
                      console.log(
                        'Value of response gmail data ==== ',
                        response,
                      );
                      this.setState({ response });
                      console.log('Value of Data Gmail ===== ', data);
                    } catch (error) {
                      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                        that.setState({ verifying: false });
                        console.log(error.message);
                        // user cancelled the login flow
                      } else if (error.code === statusCodes.IN_PROGRESS) {
                        // operation (e.g. sign in) is in progress already
                        that.setState({ verifying: false });
                        console.log(
                          'Sign In Authentication is already in progress',
                        );
                      } else if (
                        error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
                      ) {
                        // play services not available or outdated
                        that.setState({ verifying: false });
                        console.log(
                          'Please install Google Play Services to use this feature',
                        );
                      } else {
                        // some other error happened
                        console.log(error.message);
                        that.setState({ verifying: false });
                      }
                    }
                  }}
                  color="#db4437"
                  socialIconName="google"
                  iconColor={Colors.white}
                  title={'Sign up with Google'.toUpperCase()}
                />
                {Platform.OS === 'ios' && (
                  <AppleButton
                    buttonStyle={AppleButton.Style.WHITE}
                    buttonType={AppleButton.Type.SIGN_IN}
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={styles.buttonApple}
                    onPress={() => this.onAppleButtonPress()}
                  />
                )}
              </View>
            </View>

            <TouchableWithoutFeedback
              onPress={() => this.navigateTo('TermsConditions')}
            >
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  By registering, you accepts our
                </Text>
                <View style={styles.termsContainer}>
                  <Text style={[styles.footerText, styles.footerLink]}>
                    Terms & Conditions
                  </Text>
                  <Text style={styles.footerText}> and </Text>
                  <Text style={[styles.footerText, styles.footerLink]}>
                    Privacy Policy
                  </Text>
                  <Text style={styles.footerText}>.</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </KeyboardAwareScrollView>
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
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state) => ({
  loginState: state.login,
});

const mapDispatchToProps = {
  signupFailure,
  signupSuccess,
  socialLoginSuccess,
  socialLoginFailure,
  addSuggestions,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpA);
