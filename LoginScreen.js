import { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { StyleSheet, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'


const LoginScreen = ({navigation}) => {
    const  [username, setUsername] = useState('');
    const  [password, setPassword] = useState('');
    const  [isError, setError] = useState(false);
    const  [errorMsg, setErrorMsg] = useState('');

    const handleSubmitPress = async () => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept' : 'application/json' },
        body: JSON.stringify({"email": username, "pass" : password})
       };

      console.log('username', username);
      const resp = await fetch('http://sfjamaat.org/sf/faiz/login.php?offset=0&date=', requestOptions);
      const data = await resp.json();
      const headers = resp.headers;
      console.log('haider ', headers.get("set-cookie"))
      if(headers.get("set-cookie") == null) {
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

    return (
      <View style={styles.container}>
 <Image source={require('./images/FMB.png')}/>
      
        {isError ? (
            <View style={styles.logincontainer}>
              <Text style={{color:'red', marginBottom:10}}>{errorMsg}</Text>
              <TextInput
                  onChangeText={(username) => {
                    setUsername( username )
                    setError(false)
                  }}
                  placeholder={'Username'}
                  style={styles.input}
            />
            <TextInput
                  onChangeText={(password) => {
                    setPassword( password ),
                    setError(false)
                  }}
                  placeholder={'Password'}
                  secureTextEntry={true}
                  style={styles.input}
            />
            
            <TouchableOpacity style={styles.button} onPress={handleSubmitPress}>
                                  <Text style={{color:'white', width:70, textAlign:'center'}}>Login</Text>
                              </TouchableOpacity>
         </View>
          ) : (
           <View style={styles.logincontainer}>
            <Text style={{opacity:0.5, marginBottom:10}}>Enter Credentials</Text>
              <TextInput
                  onChangeText={(username) => setUsername( username )}
                  placeholder={'Username'}
                  style={styles.input}
                />
            <TextInput
                  onChangeText={(password) => setPassword( password )}
                  placeholder={'Password'}
                  secureTextEntry={true}
                  style={styles.input}
                />
            
            <TouchableOpacity style={styles.button} onPress={handleSubmitPress}>
                                  <Text style={{color:'white', width:70, textAlign:'center'}}>Login</Text>
                              </TouchableOpacity>
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
      alignSelf:'center',
      marginTop:200
    },
    logincontainer: {
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf:'center',
      padding:20,
      backgroundColor: '#ecf0f1',
      width: '65%',
      borderRadius:15,
      backgroundColor:'white',
      marginTop:15
      
    },
    logincontainerWithTopMargin: {
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf:'center',
      padding:20,
      paddingTop:40,
      backgroundColor: '#ecf0f1',
      width: '65%',
      borderRadius:15,
      backgroundColor:'white',
      marginTop:15
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
      width:'30%',
      borderRadius:5,
      marginTop:10
  },
  });
  
  export default LoginScreen;