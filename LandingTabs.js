
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image, StyleSheet} from "react-native";
import RsvpScreen  from './RsvpScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PlayGround from './PlayGround'


const LandingTabs = ({route}) => {
  const { welcomeMessage, userId } = route.params;

const Tab = createBottomTabNavigator();

  return (
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Menu') {
            iconName = focused
              ? 'fast-food'
              : 'fast-food-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings-sharp' : 'settings-sharp';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}>
        <Tab.Screen name="Menu" component={RsvpScreen} options={{headerShown: false}} initialParams={{welcomeMessage:welcomeMessage, userId:userId}} />
        <Tab.Screen name="Settings" component={PlayGround} options={{headerShown: false}}/>
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
