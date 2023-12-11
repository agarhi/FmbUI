
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image, StyleSheet} from "react-native";
import RsvpScreen  from './RsvpScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SetMenuScreen from './SetMenuScreen'
import SetSpInstructions from './SetSpInstructions';
import ApproveRazaScreen from './ApproveRazaScreen';

const LandingTabs = ({route}) => {
  const { welcomeMessage, userId, isAdmin, isAamil } = route.params;

const Tab = createBottomTabNavigator();

  return (
      <Tab.Navigator 
        sceneContainerStyle={{backgroundColor: '#ecf0f1'}}
        screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Menu') {
            iconName = focused
              ? 'fast-food'
              : 'fast-food-outline';
          } else if (route.name === 'Set Menu') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Set Sp Instructions') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          } else if (route.name === 'Approve Raza') {
            iconName = focused ? 'checkbox' : 'checkbox-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}>
        <Tab.Screen name="Menu" component={RsvpScreen} options={{headerShown: false}} initialParams={{welcomeMessage:welcomeMessage, userId:userId}} />
        {isAdmin ? (<Tab.Screen name="Set Menu" component={SetMenuScreen} options={{headerShown: false}} initialParams={{welcomeMessage:welcomeMessage, userId:userId}}/>) : (null)}
        {isAdmin ? (<Tab.Screen name="Set Sp Instructions" component={SetSpInstructions} options={{headerShown: false}} initialParams={{welcomeMessage:welcomeMessage, userId:userId}}/>) : (null)}
        {isAamil ? (<Tab.Screen name="Approve Raza" component={ApproveRazaScreen} options={{headerShown: false}}/>) : (null)}
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
