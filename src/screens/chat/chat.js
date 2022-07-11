import React, { useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import Color from 'color';
import Colors from '../../theme/colors';

import ActivityIndicatorModal from '../../components/modals/ActivityIndicatorModal';

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
});

// ...
// setTimeout(function () {
//   Tawk_API.setAttributes({ name: 'ahsan', email: 'ahsan@devnack.com' });
// }, 7000);
const Chat = () => {
  const [isLoading, setIsLoading] = useState(true);
  let webView;
  let firstmsg = `
  setTimeout(function () {
    // let val =  JSON.stringify({ name: 'ahsan', email: 'ahsan@devnack.com' });
    // alert(val)
    var person = prompt("Please enter your name", "Harry Potter");
    alert(person);
  let value = Tawk_API.setAttributes({ name: 'ahsan', email: 'ahsan@devnack.com' });
  alert(value);
}, 7000)
  `;
  let lodingRederingg = () => (
    <ActivityIndicatorModal
      statusBarColor={Color(Colors.primaryColor).darken(0.52).rgb().string()}
      message="Please wait . . ."
      // onRequestClose={this.closeModal}
      title="Sending instructions"
      visible={isLoading}
    />
  );
  return (
    <SafeAreaView style={styles.screenContainer}>
      <WebView
        // ref={(ref) => (webView = ref)}
        startInLoadingState={isLoading}
        onLoadEnd={() => {
          setIsLoading(false);
        }}
        javaScriptEnabled={true}
        renderLoading={lodingRederingg}
        injectedJavaScript={firstmsg}
        onMessage={(event) => {}}
        source={{ uri: 'https://www.tawk.to/' }}
      />
    </SafeAreaView>
  );
};
export default Chat;
