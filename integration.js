import AsyncStorage from '@react-native-async-storage/async-storage'
import alert from './alert'

const integrate = async (method, url, headers, body, authorizationRequired) => {

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
    if(requestOptions.headers['Content-Type'] == null) {
      requestOptions.headers['Content-Type'] = 'application/json'
    }
  }

  console.log('Executing ' + method + ' ' + url + ' with '+ JSON.stringify(requestOptions))
  let response
  try {
    response = await fetch(url, requestOptions)
  } catch (error) {
    console.log('There was an error', error);
  }
  console.log('response ', response)
    return response;
}

export default integrate;