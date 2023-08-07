import NetInfo from '@react-native-community/netinfo';


 NetInfo.addEventListener((state) => {
    console.log({state});
  });

