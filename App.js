import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen'
import LandingTabs from './LandingTabs'
import ProfileScreen from './ProfileScreen'
import SignUpScreen from './SignUpScreen'
import SetMenuScreen from './SetMenu'
import { enGB, registerTranslation } from 'react-native-paper-dates'
registerTranslation('en-GB', enGB)

function getHeaderTitle(route) { // https://snack.expo.dev/?platform=web
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Menu';
  switch (routeName) {
    case 'Menu':
      return 'Menu & Rsvp';
    case 'Set Menu':
      return 'Set Menu';
    case 'Set Sp Instructions':
      return 'Special Instructions'
  }
}


const Stack = createStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerStyle: { elevation: 0 },
        cardStyle: { backgroundColor: '#ecf0f1' }
      }}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LandingTabs" options={({ route }) => ({
          headerTitle: getHeaderTitle(route),
          headerLeft: () => null
        })} component={LandingTabs} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="SetMenu" component={SetMenuScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;