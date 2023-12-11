import { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, Image, Pressable } from 'react-native';
import { StyleSheet, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native';
import alert from '../alert'
import integrate from '../integration';



const LoginScreen = ({ route, navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorMsgModal, setErrorMsgModal] = useState('');
  const [isErrorModal, setErrorModal] = useState(false);
  const isFocused = useIsFocused(); // sets to true when screen comes back in focus: https://stackoverflow.com/questions/46504660/refresh-previous-screen-on-goback
  const [its, setIts] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  var base64 = require("base-64");

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSignUpOk = async () => {
    if (its == '') {
      setErrorModal(true)
      setErrorMsgModal('ITS is required')
    } else {
      const razaResponse = await integrate('GET', 'http://10.0.0.121:8080/fmbApi/raza/status/' + its, null, null, false)
      if (razaResponse.requestDate == null) { // When there is no user found, server returns an object with no requestDate
        // This means you have to register
        navigation.navigate("SignUp", {
          its: its
        })
      } else if (!razaResponse.razaReceived) {
        // User is registered but raza has not been received
        alert("Waiting for raza")
      } else if (razaResponse.razaReceived) {
        // Ok to login - do nothing?
        alert("Proceed to login")
      }
      setModalVisible(!modalVisible);
    }
  };

  const handleLogin = async () => {
    if (username == '' || password == '') {
      setError(true)
      setErrorMsg('Invalid credentials')
    } else {
      var details = {
        'username': username,
        'password': password,
        'grant_type': 'password'
      };

      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      const data = await integrate('POST', 'http://10.0.0.121:8080/fmbApi/oauth/token', {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': 'Basic ' + base64.encode('fooClientId' + ':' + 'secret'),
      }, formBody, false)
      console.log('--->', data)
      const access_token = data.access_token
      let refresh_token = data.refresh_token
      console.log('access_token ', access_token)
      if (access_token == null) {
        setError(true)
        setErrorMsg('Invalid credentials')
      } else {
        storeData('access_token', access_token)
        storeData('refresh_token', refresh_token)
        setError(false)
        // another fetch call for get user
        const response = await integrate('GET', 'http://10.0.0.121:8080/fmbApi/user/' + username, { 'Authorization': 'Bearer ' + access_token }, null, true)
        if (response.hasOwnProperty("status") && response.status === 500) {
          setError(true)
          setErrorMsg(response.errorMessage)
        } else {
          storeData('thali_num', response.thalinum + '') // since Asynchsotrage works bette with strings
          navigation.navigate('LandingTabs', {
            welcomeMessage: response.fname + " " + response.lname + ', #' + response.thalinum,
            userId: response.id,
            isAdmin: response.credentials.role === 'ADMIN',
            isAamil: response.credentials.role === 'AAMIL'
          });
        }

      }
    }
  }

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

  const handleSignUp = () => {
    navigation.navigate('SignUp')
  }

  useEffect(() => {
    isFocused && setError(false)
  }, [isFocused]);

  useEffect(() => {
    if (route.params) {
      setError(true)
      setErrorMsg(route.params.logOutMessage)
      console.log('route.params.logOutMessage ', route.params.logOutMessage)
    }
  });

  return (
    <View style={styles.container}>
      <View><Image style={{ width: 170, height: 170 }} source={require('../images/FMB.png')} /></View>
      <View style={styles.logincontainer}>
        <View >
          {isError ? (
            <Text style={{ color: 'red', marginBottom: 20 }}>{errorMsg}</Text>

          ) : (
            <Text style={{ opacity: 0.5, marginBottom: 20 }}>Enter Credentials</Text>
          )
          }
        </View>
        <View >
          <TextInput
            onFocus={() => { setError(false) }}
            onChangeText={(username) => setUsername(username)}
            placeholder={'Username'}
            style={styles.input}
          />
        </View>
        <View >
          <TextInput
            onFocus={() => { setError(false) }}
            onChangeText={(password) => setPassword(password)}
            placeholder={'Password'}
            secureTextEntry={true}
            style={styles.input}
          />
        </View>
        <View >
          <TouchableOpacity style={styles.buttonTO} onPress={handleLogin}>
            <Text style={{ color: 'white', textAlign: 'center', paddingRight: 20, paddingLeft: 20 }}>Login</Text>
          </TouchableOpacity>
        </View>
        <View >
          <TouchableOpacity style={styles.link} onPress={() => {
            setError(false)
            setModalVisible(true)
            setErrorMsgModal('')
            setErrorModal(false)
          }

          }>
            <Text style={{ textAlign: 'center' }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Enter HOF ITS</Text>
              <TextInput
                onFocus={() => { setErrorModal(false) }}
                style={styles.inputModal}
                placeholder=" ITS"
                keyboardType="numeric"
                onChangeText={(its) => setIts(its)}
              />
              <View style={{ flexDirection: 'row', borderWidth: 0, justifyContent: 'center' }}>
                <TouchableOpacity style={styles.buttonTO} onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={{ color: 'white', width: 70, textAlign: 'center' }}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonTO} onPress={handleSignUpOk}>
                  <Text style={{ color: 'white', width: 70, textAlign: 'center' }}>Submit</Text>
                </TouchableOpacity>
              </View>
              {
                isErrorModal ? (<Text style={{ color: 'red', marginTop: 5 }}>{errorMsgModal}</Text>)
                  :
                  (<View style={{ marginTop: 20 }} />)
              }

            </View>
          </View>
        </Modal>
      </View>
    </View>

  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 0,
    justifyContent: 'space-between',
    marginTop: 100,
  },
  logincontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'white',
    marginTop: 15,
    borderWidth: 0
  },

  inputModal: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  link: {
    alignItems: 'center',
    marginTop: 10
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    flex: 1
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    flex: 1
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  buttonTO: {

    backgroundColor: '#4c7031',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  inputModal: {
    height: 35,
    margin: 12,
    borderWidth: 1,
    width: 200
  },
});

export default LoginScreen;