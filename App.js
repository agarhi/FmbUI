import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
import LoginScreen from './LoginScreen'
import LandingTabs from './LandingTabs'
import ProfileScreen from './ProfileScreen'
import SignUpScreen from './SignUpScreen'

function getHeaderTitle(route) { // https://snack.expo.dev/?platform=web
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Menu';
  switch (routeName) {
    case 'Menu':
      return 'Menu & Rsvp';
    case 'Settings':
      return 'My Settings';
  }
}


const Stack = createStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
        <Stack.Screen name="LandingTabs" options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
            headerLeft: ()=> null
          })} component={LandingTabs} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;