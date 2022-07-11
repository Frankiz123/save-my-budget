import React from 'react';
import { View, Text } from 'react-native';
import Button from '../../components/buttons/Button';

class Splash extends React.Component {
  constructor() {
    super();
    this.state = { color: 'red' };
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'green',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text> Splash </Text>
        <View>
          <Button onPress={this.welcome} title={'welcome'.toUpperCase()} />
        </View>
      </View>
    );
  }
}
