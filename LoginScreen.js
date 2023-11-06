import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { StyleSheet, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native';
import Dialog from "react-native-dialog";



const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const isFocused = useIsFocused(); // sets to true when screen comes back in focus: https://stackoverflow.com/questions/46504660/refresh-previous-screen-on-goback
  const [dialogVisible, setDialogVisible] = useState(false);
  const [its, setIts]  = useState(false);

  const showDialog = () => {
    setDialogVisible(true);
  };

  const handleCancel = () => {
    setDialogVisible(false);
  };

  const handleOk = async () => {
    const requestOptions = { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    };

    const url = "http://10.0.0.121:8080/fmbApi/raza/status/"+its
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
    if(data.requestDate == null) { // When there is no user found, server returns an object with no requestDate
      // This means you have to register
      navigation.navigate("SignUp", {
        its: its
      })
    } else if(!data.razaReceived) {
      // User is registered but raza has not been received
      Alert.alert("Waiting for raza")
    } else if(data.razaReceived) {
      // Ok to login - do nothing?
      Alert.alert("Proceed to login")
    }
    setDialogVisible(false);
  };

  const handleSubmitPress = async () => {
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
      <Image source={require('./images/FMB.png')} />

      {isError ? (
        <View style={styles.logincontainer}>
          <Text style={{ color: 'red', marginBottom: 10 }}>{errorMsg}</Text>
          <TextInput
            onChangeText={(username) => {
              setUsername(username)
              setError(false)
            }}
            placeholder={'Username'}
            style={styles.input}
          />
          <TextInput
            onChangeText={(password) => {
              setPassword(password),
                setError(false)
            }}
            placeholder={'Password'}
            secureTextEntry={true}
            style={styles.input}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmitPress}>
            <Text style={{ color: 'white', width: 70, textAlign: 'center' }}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.link} onPress={showDialog}>
            <Text style={{ textAlign: 'center' }}>Sign Up</Text>
          </TouchableOpacity>
          <Dialog.Container visible={dialogVisible}>
            <Dialog.Title>Enter HOF ITS</Dialog.Title>
            <Dialog.Input onChangeText={(text) => setIts(text)}/>
            <Dialog.Button label="Cancel" onPress={handleCancel} />
            <Dialog.Button label="Ok" onPress={handleOk} />
          </Dialog.Container>
        </View>
      ) : (
        <View style={styles.logincontainer}>
          <Text style={{ opacity: 0.5, marginBottom: 10 }}>Enter Credentials</Text>
          <TextInput
            onChangeText={(username) => setUsername(username)}
            placeholder={'Username'}
            style={styles.input}
          />
          <TextInput
            onChangeText={(password) => setPassword(password)}
            placeholder={'Password'}
            secureTextEntry={true}
            style={styles.input}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmitPress}>
            <Text style={{ color: 'white', width: 70, textAlign: 'center' }}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link} onPress={showDialog}>
            <Text style={{ textAlign: 'center' }}>Sign Up</Text>
          </TouchableOpacity>
          <Dialog.Container visible={dialogVisible}>
            <Dialog.Title>Enter HOF ITS</Dialog.Title>
            <Dialog.Input onChangeText={(text) => setIts(text)}/>
            <Dialog.Button label="Cancel" onPress={handleCancel} />
            <Dialog.Button label="Ok" onPress={handleOk} />
          </Dialog.Container>
        </View>
      )
      }
    </View>

  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 200
  },
  logincontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 20,
    backgroundColor: '#ecf0f1',
    width: '65%',
    borderRadius: 15,
    backgroundColor: 'white',
    marginTop: 15

  },
  logincontainerWithTopMargin: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#ecf0f1',
    width: '65%',
    borderRadius: 15,
    backgroundColor: 'white',
    marginTop: 15
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#4c7031',
    padding: 10,
    width: '30%',
    borderRadius: 5,
    marginTop: 10
  },
  link: {
    alignItems: 'center',
    marginTop: 15
  },
});

export default LoginScreen;