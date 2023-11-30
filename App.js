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
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'

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
  
  var base64 = require("base-64");
  useEffect(() => { // All the code below is to mock responses so we can identify token expire scenario and handle it: https://dev.to/snigdho611/react-js-interceptors-with-fetch-api-1oei
    const storeData = async (key, value) => {
      try {
        await AsyncStorage.setItem(
          key,
          value,
        );
      } catch (error) {
        console.log(error)
      }
    }

    const hasTokenExpire = (respone) => {
      console.log('hasTokenExpire called ', JSON.stringify(respone))
      let expired = respone.hasOwnProperty("error_description") && respone.error_description.startsWith('Access token expired:')
      console.log('returning  1', respone.hasOwnProperty("error_description"))
      if(respone.hasOwnProperty("error_description"))
      console.log('returning 2', respone.error_description.startsWith('Access token expired:'))
      console.log('returning ', expired)
      return expired
    }
  
    const getAndSaveNewAccessToken = async () => {
      console.log('Getting new token')
      var details = {
        'grant_type': 'refresh_token',
        'refresh_token': await AsyncStorage.getItem('refresh_token')
      };
  
      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      const resp = await originalFetch('http://10.0.0.121:8080/fmbApi/oauth/token', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Authorization': 'Basic ' + base64.encode('fooClientId' + ':' + 'secret'),
        },
        body: formBody
      })
      const data = await resp.json()
      const access_token = data.access_token
      console.log('New access token ', access_token)
      storeData('access_token', access_token)
    }
  
    const resend = async (url, config) => {
      // Add the new token
      config.headers['Authorization'] = 'Bearer ' + await AsyncStorage.getItem('access_token')
      let resp = await originalFetch(url, config)
      return await resp.json()
    }

    // Mock fetch to intercept response
    const { fetch: originalFetch } = window;
    window.fetch = async (...args) => {
      let [resource, config] = args;
      console.log('Intercepted fetch')
      const response = await originalFetch(resource, config);
      const data = await response.json();
      if (hasTokenExpire(data)) {
        await getAndSaveNewAccessToken();
        return await resend(resource, config)
        console.log('Token expired')
      } 
      return data;
    };
  }, []);

  
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