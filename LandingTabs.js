
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image, StyleSheet} from "react-native";
import RsvpScreen  from './RsvpScreen';


const LandingTabs = ({route}) => {
  const { token, message } = route.params;

const Tab = createBottomTabNavigator();

  return (
      <Tab.Navigator>
        <Tab.Screen name="Menu" component={RsvpScreen} options={{headerShown: false}} initialParams={{token:token, message:message}} />
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

export default LandingTabs;
