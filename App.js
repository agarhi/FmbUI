import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
import LoginScreen from './Login'
import Landing from './Landing'

const Stack = createStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Landing" options={{ title: 'Menu & RSVP' }} component={Landing} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;