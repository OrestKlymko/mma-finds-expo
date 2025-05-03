// import messaging from '@react-native-firebase/messaging';
// import { useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
//
// const useNotifications = () => {
//   const [notifications, setNotifications] = useState([]);
//
//   useEffect(() => {
//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//       console.log('FCM Message received:', remoteMessage);
//       // remoteMessage.data містить метадані
//       var notification = await AsyncStorage.getItem('notification');
//       AsyncStorage.setItem('notifications', JSON.stringify(notifications));
//       setNotifications(prev => [remoteMessage, ...prev]);
//     });
//     return unsubscribe;
//   }, []);
//
//   return notifications;
// };
//
// export default useNotifications;
