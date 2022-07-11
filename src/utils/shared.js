// import dependencies
import { Alert } from 'react-native';

export const showAlert = (title, desc, onPress) => {
  Alert.alert(title, desc, [{ text: 'OK', onPress: onPress }]);
};
