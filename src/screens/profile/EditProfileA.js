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
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Color from 'color';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HeaderIconButton from '../../components/navigation/HeaderIconButton';

// import components
import Avatar from '../../components/avatar/Avatar';
import Icon from '../../components/icon/Icon';
import { Subtitle2 } from '../../components/text/CustomText';
import TouchableItem from '../../components/TouchableItem';
import UnderlineTextInput from '../../components/textinputs/UnderlineTextInput';
import ActivityIndicatorModal from '../../components/modals/ActivityIndicatorModal';

// import colors
import Colors from '../../theme/colors';
//connect states
import { connect } from 'react-redux';
import { loginFailure, loginSuccess, updateProfile } from '@reducers';

import { actions } from '@actions';
import { utils } from '@utils';
//Camera
import { RNCamera } from 'react-native-camera';
const SAVE_ICON = Platform.OS === 'ios' ? 'ios-checkmark' : 'md-checkmark';
// EditProfileA Config

const AVATAR_SIZE = 100;
const IOS = Platform.OS === 'ios';
const CAMERA_ICON = IOS ? 'ios-camera' : 'md-camera';
const INPUT_FOCUSED_BORDER_COLOR = Colors.primaryColor;

// EditProfileA Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  avatarSection: {
    // marginVertical: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  whiteCircle: {
    marginTop: -18,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  cameraButtonContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primaryColor,
    overflow: 'hidden',
  },
  cameraButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 34,
    height: 34,
  },
  editForm: {
    paddingHorizontal: 20,
  },
  overline: {
    color: Color(Colors.secondaryText).alpha(0.6),
    textAlign: 'left',
  },
  inputContainerStyle: {
    marginTop: 0,
    marginBottom: 17,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  preview: {
    // flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

// EditProfileA
class EditProfileA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      first_name: '',
      firstNameFocused: false,
      last_name: '',
      lastNameFocused: false,
      email: '',
      emailFocused: false,
    };
  }

  componentDidMount() {
    const { userProfile, navigation } = this.props;
    navigation.setOptions({
      headerLeft: () => (
        <HeaderIconButton
          onPress={this.onSavePress}
          name={'arrow-back'}
          color={Colors.black}
          size={18}
        />
      ),
      headerRight: () => (
        <HeaderIconButton
          show={false}
          onPress={this.onSavePress}
          name={SAVE_ICON}
          color={Colors.primaryColor}
        />
      ),
    });

    this.setState({
      email: userProfile.user.email,
      first_name: userProfile.user.firstName,
      last_name: userProfile.user.lastName,
    });
  }

  onSavePress = () => {
    this.setState({
      isLoading: true,
    });
    this.saveData();
  };
  saveData = async () => {
    const { userProfile } = this.props;
    this.setState({
      isLoading: true,
    });
    const data = await actions.updateProfile({
      firstName: this.state.first_name,
      lastName: this.state.last_name,
      token: userProfile.token,
    });
    if (!data.errors) {
      this.props.updateProfile({
        firstName: this.state.first_name,
        lastName: this.state.last_name,
      });
      utils.showAlert('Edit Profile', data.message, () =>
        this.props.navigation.goBack(),
      );
    } else {
      utils.showAlert(
        'Edit Profile',
        'Profile is not updated successfully, please try again',
      );
    }
    this.setState({
      isLoading: false,
    });
  };

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };
  firstNameChange = (text) => {
    this.setState({
      first_name: text,
    });
  };

  firstNameFocus = () => {
    this.setState({
      firstNameFocused: true,
      emailFocused: false,
      phoneFocused: false,
    });
  };
  lastNameChange = (text) => {
    this.setState({
      last_name: text,
    });
  };

  lastNameFocus = () => {
    this.setState({
      lastNameFocused: true,
      emailFocused: false,
      phoneFocused: false,
    });
  };

  emailChange = (text) => {
    this.setState({
      email: text,
    });
  };

  emailFocus = () => {
    this.setState({
      nameFocused: false,
      emailFocused: true,
      phoneFocused: false,
    });
  };

  focusOn = (nextFiled) => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };

  render() {
    const {
      first_name,
      firstNameFocused,
      last_name,
      lastNameFocused,
      email,
      emailFocused,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <KeyboardAwareScrollView enableOnAndroid>
          <View style={styles.avatarSection}></View>

          <View style={styles.editForm}>
            <Subtitle2 style={styles.overline}>First Name</Subtitle2>
            <UnderlineTextInput
              onRef={(r) => {
                this.first_name = r;
              }}
              value={first_name}
              onChangeText={this.firstNameChange}
              onFocus={this.firstNameFocus}
              inputFocused={firstNameFocused}
              onSubmitEditing={this.focusOn(this.last_name)}
              returnKeyType="next"
              focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
              inputContainerStyle={styles.inputContainerStyle}
            />
            <Subtitle2 style={styles.overline}>Last Name</Subtitle2>
            <UnderlineTextInput
              onRef={(r) => {
                this.last_name = r;
              }}
              value={last_name}
              onChangeText={this.lastNameChange}
              onFocus={this.lastNameFocus}
              inputFocused={lastNameFocused}
              onSubmitEditing={this.focusOn(this.email)}
              returnKeyType="next"
              focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
              inputContainerStyle={styles.inputContainerStyle}
            />

            <Subtitle2 style={styles.overline}>E-mail Address</Subtitle2>
            <UnderlineTextInput
              onRef={(r) => {
                this.email = r;
              }}
              value={email}
              onChangeText={this.emailChange}
              onFocus={this.emailFocus}
              inputFocused={emailFocused}
              onSubmitEditing={this.focusOn(this.phone)}
              returnKeyType="next"
              keyboardType="email-address"
              focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
              inputContainerStyle={styles.inputContainerStyle}
              editable={false}
              // value={this.props.userProfile.email}
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
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userProfile: state.login.data,
  };
};

const mapDispatchToProps = { loginFailure, loginSuccess, updateProfile };

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileA);
