import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StyleSheet, TextInput } from 'react-native';

const LoginScreen = ({navigation}) => {
    const  [username, setUsername] = useState('');
    const  [password, setPassword] = useState('');

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
      navigation.navigate('TestLayout', {
        token: headers.get("set-cookie"),
        message: data.data
      });
    }

    return (
      <View style={styles.container}>
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
      
      <TouchableOpacity
          title="Go to Details"
          onPress={handleSubmitPress}>
              <Text>LOGIN</Text>
        </TouchableOpacity>
    </View>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
    },
    input: {
      width: 200,
      height: 44,
      padding: 10,
      borderWidth: 1,
      borderColor: 'black',
      marginBottom: 10,
    },
  });
  
  export default LoginScreen;