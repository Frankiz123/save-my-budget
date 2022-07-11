import analytics from '@react-native-firebase/analytics';

export const logEvent = async (event, params) => {
  // console.log('event is-------------=-', event);
  // console.log('params is-------------=-', params);
  await analytics().logEvent(event, params);
};
