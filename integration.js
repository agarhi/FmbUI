import AsyncStorage from '@react-native-async-storage/async-storage'
import alert from './alert'

const integrate = async (method, url, headers, body, authorizationRequired) => {

  const hasTokenExpire = (respone) => {
      return respone.hasOwnProperty("error_description") && respone.error_description.startsWith('Access token expired:')
  }
    const requestOptions = {
      method: method,
      credentials: 'include', // Sends Set-Cookie's Cookie in all further request by default
      withCredentials: true
    }
    
    if(headers!=null) {
      requestOptions.headers = headers
    }

    if(authorizationRequired) {
      if(requestOptions.headers == null)
        requestOptions.headers = {}
        requestOptions.headers['Authorization'] = 'Bearer ' + await AsyncStorage.getItem('token') 
    }

    if(body!=null) {
      requestOptions.body = body
      requestOptions.headers['Content-Type'] = 'application/json'
    }

    console.log('Executing '+ method + ' ' + url)
    let resp
    try {
        resp = await fetch(url, requestOptions)
      } catch (error) {
        console.log('There was an error', error);
      }
      const response = await resp.json();
      if(hasTokenExpire(response)) {
        alert('Do you want to sign off?','',[
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Ok',
            onPress: () => {
              // Delete the item
              console.log('Ok Pressed');
            },
            style: 'ok',
          },
        ],
        { cancelable: false })
    }
      return response;
}

export default integrate;