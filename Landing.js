import { View, Text, TouchableOpacity } from 'react-native';

function LandingScreen({route}) {
    const { pageheader, token } = route.params;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{JSON.stringify(pageheader)}</Text>
        <Text>Your token is {JSON.stringify(token)}</Text>
      </View>
    );
  }

  export default LandingScreen;