
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, Image, StyleSheet} from "react-native";
import { Box, FlatList, Center, NativeBaseProvider } from "native-base";
import Home  from './Home';
import HomeGo  from './HomeGo';


const TestLayout = ({route}) => {


const Tab = createBottomTabNavigator();

  return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
        <Tab.Screen name="HomeGo" component={HomeGo} />
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
