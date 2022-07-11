/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, { Component } from 'react';
import { Alert, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';

// import components
import Button from '../../components/buttons/Button';
import Logo from '../../components/logo/Logo';
import ActivityIndicatorModal from '../../components/modals/ActivityIndicatorModal';
import Color from 'color';

// import colors
import Colors from '../../theme/colors';

import { actions } from '@actions';
import { connect } from 'react-redux';
import { login } from '@reducers';
import { utils } from '@utils';
import { CommonActions } from '@react-navigation/native';
import { Platform, Linking } from 'react-native';

// WelcomeA Config

// WelcomeA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  logoContainer: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsGroup: {
    flex: 3,
    alignItems: 'center',
    paddingHorizontal: 32,
    width: '100%',
  },
  vspace16: {
    height: 16,
  },
  vspace32: {
    height: 32,
  },
  linkButtonText: {
    color: Colors.onSurface,
    textAlign: 'center',
  },
});

// WelcomeA Screen
class WelcomeA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }
  componentDidMount() {
    const { userData, navigation } = this.props;
    Linking.addEventListener('url', this.handleOpenURL);
    // if (Platform.OS === 'android') {
    Linking.getInitialURL().then((url) => {
      this.navigate(url);
    });
    // } else {
    //   Linking.addEventListener('url', this.handleOpenURL);
    // }

    if (userData.data !== null) {
      if (userData.data.user?.emailVerifiedAt !== null) {
        // navigation.navigate('HomeNavigator');
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: 'HomeNavigator' }],
          }),
        );
      } else {
        this.onPressVerifyEmail();
      }
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }
  navigate = (url) => {
    const { navigate } = this.props.navigation;
    let route = url.replace(/.*?:\/\//g, 'password/reset');
    const idToken = route.match(/\/([^\/]+)\/?$/)[1].split('?')[0];
    let routEmail = route.match(/\/([^\/]+)\/?$/)[1].split('?email=')[1];
    routEmail = decodeURIComponent(routEmail);
    navigate('ResetPassword', { token: idToken, email: routEmail });
  };

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }
  handleOpenURL = (event) => {
    this.navigate(event.url);
  };

  onPressVerifyEmail = async () => {
    this.setState({
      isLoading: true,
    });
    const { userData, navigation } = this.props;
    if (userData.data) {
      const data = await actions.verifyEmail({
        token: userData.data.token,
      });
      if (!data.errors) {
        if (data.emailVerifiedAt !== null) {
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: 'HomeNavigator' }],
            }),
          );
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: 'EmailVerification' }],
            }),
          );
        }
      }
    }
    this.setState({
      isLoading: false,
    });
  };

  navigateTo = (screen) => () => {
    const { navigation } = this.props;
    navigation.navigate(screen);
  };

  render() {
    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <View style={styles.logoContainer}>
          <Logo size={200} />
        </View>

        <View style={styles.buttonsGroup}>
          <Button onPress={this.navigateTo('SignUp')} title={'Sign up'} />

          <View style={styles.vspace16} />

          <Button
            onPress={this.navigateTo('SignIn')}
            title={'Log in'}
            outlined
          />

          <View style={styles.vspace32} />
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
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userData: state.login,
  };
};
const mapDispatchToProps = { login };

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeA);
