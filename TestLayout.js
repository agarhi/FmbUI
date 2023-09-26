
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, Image, StyleSheet} from "react-native";
import { Box, FlatList, Center, NativeBaseProvider } from "native-base";
import Home  from './Home';
import HomeGo  from './HomeGo';


const TestLayout = ({route}) => {
  const { token, message } = route.params;

const Tab = createBottomTabNavigator();

  return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeGo} options={{headerShown: false}} initialParams={{token:token, message:message}} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{headerShown: false}}/>
      </Tab.Navigator>
    
  );
}
  
  function SettingsScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
      </View>
    );
  }

export default TestLayout;
