import { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, Image, Pressable } from 'react-native';
import { StyleSheet, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native';



const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const isFocused = useIsFocused(); // sets to true when screen comes back in focus: https://stackoverflow.com/questions/46504660/refresh-previous-screen-on-goback
  const [its, setIts] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

 
  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleOk = async () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    };

    const url = "http://10.0.0.121:8080/fmbApi/raza/status/" + its
    console.log(url)
    let resp
    try {
      resp = await fetch(url, requestOptions)
    } catch (error) {
      // TypeError: Failed to fetch
      console.log('There was an error', error);
    }
    const data = await resp.json();
    console.log(data)
    if (data.requestDate == null) { // When there is no user found, server returns an object with no requestDate
      // This means you have to register
      navigation.navigate("SignUp", {
        its: its
      })
    } else if (!data.razaReceived) {
      // User is registered but raza has not been received
      Alert.alert("Waiting for raza")
    } else if (data.razaReceived) {
      // Ok to login - do nothing?
      Alert.alert("Proceed to login")
    }
    setModalVisible(!modalVisible);
  };

  const handleSubmitPress = async () => {
    console.log('u ', username)
    console.log('p ', password)
    if(username == '' || password == '') {
      setError(true)
      setErrorMsg('Invalid credentials')
    } else {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ "email": username, "pass": password })
      };
  
      console.log('username', username);
      const resp = await fetch('http://sfjamaat.org/sf/faiz/login.php?offset=0&date=', requestOptions);
      const data = await resp.json();
      const headers = resp.headers;
      console.log('haider ', headers.get("set-cookie"))
      if (headers.get("set-cookie") == null) {
        setError(true)
        setErrorMsg(data.msg)
      } else {
        setError(false)
        storeData('thali_num', password)
        navigation.navigate('LandingTabs', {
          token: headers.get("set-cookie"),
          message: data.data
        });
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

  return (
    <View style={styles.container}>
       <View><Image style={{width: 170, height: 170}} source={require('./images/FMB.png')} /></View>
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
            onFocus={() => {setError(false)}}
            onChangeText={(username) => setUsername(username)}
            placeholder={'Username'}
            style={styles.input}
          />
        </View>
        <View >
          <TextInput
            onFocus={() => {setError(false)}}
            onChangeText={(password) => setPassword(password)}
            placeholder={'Password'}
            secureTextEntry={true}
            style={styles.input}
          />
        </View>
        <View >
          <TouchableOpacity style={styles.buttonTO} onPress={handleSubmitPress}>
            <Text style={{ color: 'white', textAlign: 'center', paddingRight:20, paddingLeft:20 }}>Login</Text>
          </TouchableOpacity>
        </View>
        <View >
          <TouchableOpacity style={styles.link} onPress={() => 
          {
            setError(false)
            setModalVisible(true)
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
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Enter HOF ITS</Text>
              <TextInput
                style={styles.inputModal}
                placeholder=" ITS"
                keyboardType="numeric"
                onChangeText={(its) => setIts(its)}
              />
              <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'center' }}>
                <TouchableOpacity style={styles.buttonTO} onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={{ color: 'white', width: 70, textAlign: 'center' }}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonTO} onPress={handleOk}>
                  <Text style={{ color: 'white', width: 70, textAlign: 'center' }}>Submit</Text>
                </TouchableOpacity>
              </View>
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
    justifyContent:'space-between',
    marginTop:100
  },
  logincontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 20,
    backgroundColor: '#ecf0f1',
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
    width:200
  },
});

export default LoginScreen;