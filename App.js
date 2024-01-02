import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './ui/LoginScreen'
import LandingTabs from './ui/LandingTabs'
import ProfileScreen from './ui/ProfileScreen'
import SignUpScreen from './ui/SignUpScreen'
import SetMenuScreen from './ui/SetMenuScreen'
import { enGB, registerTranslation } from 'react-native-paper-dates'
registerTranslation('en-GB', enGB)
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import ViewFeedbackScreen from './ui/ViewFeedbackScreen';

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
    case 'Approve Raza':
      return 'Approve Raza'
    case 'View Feedback':
      return 'View Feedback'
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

    const hasAccessTokenExpire = (respone) => {
      let expired = respone.hasOwnProperty("error_description") && respone.error_description.startsWith('Access token expired:')
      if (respone.hasOwnProperty("error_description"))
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
      let statusCode = resp.status
      const data = await resp.json()
      console.log('data to get new access toekn ', data)
      if (statusCode === 200) {
        const access_token = data.access_token
        console.log('New access token ', access_token)
        storeData('access_token', access_token)
        return true
      }
      return false
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
      const response = await originalFetch(resource, config);
      const data = await response.json();
      if (hasAccessTokenExpire(data)) {
        let successful = await getAndSaveNewAccessToken();
        if (successful) {
          return await resend(resource, config)
        } else {
          console.log('Refresh Token expired')
          let refrTokenExpiredResp = {}
          refrTokenExpiredResp["status"] = 999
          refrTokenExpiredResp["reason"] = 'refreshTokenExpired'
          return refrTokenExpiredResp
        }
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
        <Stack.Screen name="ViewFeedbackScreen" component={ViewFeedbackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;