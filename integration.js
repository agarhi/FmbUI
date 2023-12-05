import AsyncStorage from '@react-native-async-storage/async-storage'

const integrate = async (method, url, headers, body, authorizationRequired, navigation) => {

  var base64 = require("base-64");

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(
        key,
        value,
      );
    } catch (error) {
      console.log(error)
    }
  };

  const requestOptions = {
    method: method,
    credentials: 'include', // Sends Set-Cookie's Cookie in all further request by default
    withCredentials: true
  }

  if (headers != null) {
    requestOptions.headers = headers
  }

  if (authorizationRequired) {
    if (requestOptions.headers == null)
      requestOptions.headers = {}
    requestOptions.headers['Authorization'] = 'Bearer ' + await AsyncStorage.getItem('access_token')
  }

  if (body != null) {
    requestOptions.body = body
    if (requestOptions.headers == null)
      requestOptions.headers = {}
    if(requestOptions.headers['Content-Type'] == null) {
      requestOptions.headers['Content-Type'] = 'application/json'
    }
  }

  console.log('Executing ' + method + ' ' + url + ' with '+ JSON.stringify(requestOptions))
  let response
  let loggedOut 
  try {
    response = await fetch(url, requestOptions) // This wii be intercepted by the code in App.js
    console.log('Response before logoutIfRequired ', JSON.stringify(response))
    loggedOut = logoutIfRequired(navigation, response)
    console.log('after fetch ', loggedOut)
  } catch (error) {
    console.log('There was an error', error);
  }
  console.log('response ', response)
  if(!loggedOut){
    console.log('Inside ret res')
    return response;
  }
}

const hasRefreshTokenExpired = (respone) => {
  let expired = respone.hasOwnProperty("status") && respone.status === 999 // check App.js for 999
  return expired
}

const logoutIfRequired = (nav, resp) => {
  if(nav) {
    if(hasRefreshTokenExpired(resp)) {
      console.log('About to Logout')
      AsyncStorage.clear()
      nav.navigate('Login', {
        logOutMessage : 'Session Expired'
      })
      return true
    }
    return false
  }
  return false
}

export default integrate;