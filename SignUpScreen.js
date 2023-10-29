import {View, Text, StyleSheet , TextInput, TouchableOpacity, Alert} from 'react-native'
import { useState , useEffect } from 'react';

const SignUpScreen = ({navigation}) => {

    const  [fnmae, setFname] = useState('');
    const  [lnmae, setLname] = useState('');
    const  [its, setIts] = useState('');
    const  [addr1, setAddr1] = useState('');
    const  [addr2, setAddr2] = useState('');
    const  [city, setCity] = useState('');
    const  [zip, setZip] = useState('');
    const  [state, setState] = useState('');
    const  [phone, setPhone] = useState('');
    const  [email, setEmail] = useState('');

    const handleSubmit = () => {
        let jsonObj = {}
        jsonObj['fname'] = fnmae
        jsonObj['lname'] = lnmae
        jsonObj['its'] = its
        jsonObj['addr1'] = addr1
        jsonObj['addr2'] = addr2
        jsonObj['city'] = city
        jsonObj['state'] = state
        jsonObj['zip'] = zip
        jsonObj['email'] = email
        jsonObj['phone'] = phone
        Alert.alert(JSON.stringify(jsonObj))
    }

    return (
        <View style={{flexDirection:'column',flex:1,marginTop:30, borderWidth:0}}>
            <View style={{alignSelf:'center', marginBottom:20, borderWidth:0}}>
                <Text style={{fontWeight:'bold', fontSize:'20'}}>Thali Registration</Text>
            </View>
            <View style={styles.columnItem}>
                <View style={{flex:1,borderWidth:0}}><Text style={styles.textContainer}>Name</Text></View>
                <View style={{flex:2, alignItems:'left',flexDirection:'row', borderWidth:0}}>
                    <TextInput style={styles.inputHalf} placeholder={'First'} onChangeText={(text) => {setFname( text )}}/>
                    <TextInput style={styles.inputHalf} placeholder={'Last'} onChangeText={(text) => {setLname( text )}}/>
                </View>
            </View>
            <View style={styles.columnItem}>
                <View style={{flex:1, borderWidth:0}}><Text style={styles.textContainer}>ITS</Text></View>
                <View style={{flex:2, alignItems:'left',borderWidth:0}}><TextInput style={styles.input} placeholder={'ITS'} onChangeText={(text) => {setIts( text )}}/></View>
            </View>
            <View style={styles.columnItem}>
                <View style={{flex:1, borderWidth:0}}><Text style={styles.textContainer}>Addr Line 1</Text></View>
                <View style={{flex:2, alignItems:'left',borderWidth:0}}><TextInput style={styles.input} placeholder={'Addr Line 1'} onChangeText={(text) => {setAddr1( text )}}/></View>
            </View>
            <View style={styles.columnItem}>
                <View style={{flex:1, borderWidth:0}}><Text style={styles.textContainer}>Addr Line 2</Text></View>
                <View style={{flex:2, alignItems:'left',borderWidth:0}}><TextInput style={styles.input} placeholder={'Addr Line 2'} onChangeText={(text) => {setAddr2( text )}}/></View>
            </View>
            <View style={styles.columnItem}>
                <View style={{flex:1, borderWidth:0}}><Text style={styles.textContainer}>City</Text></View>
                <View style={{flex:2, alignItems:'left',borderWidth:0}}><TextInput style={styles.input} placeholder={'City'} onChangeText={(text) => {setCity( text )}}/></View>
            </View>
            <View style={styles.columnItem}>
                <View style={{flex:1, borderWidth:0}}><Text style={styles.textContainer}>Zip</Text></View>
                <View style={{flex:2, alignItems:'left',borderWidth:0}}><TextInput style={styles.input} placeholder={'Zip'} onChangeText={(text) => {setZip( text )}}/></View>
            </View>
            <View style={styles.columnItem}>
                <View style={{flex:1, borderWidth:0}}><Text style={styles.textContainer}>State</Text></View>
                <View style={{flex:2, alignItems:'left',borderWidth:0}}><TextInput style={styles.input} placeholder={'State'} onChangeText={(text) => {setState( text )}}/></View>
            </View>
            <View style={styles.columnItem}>
                <View style={{flex:1, borderWidth:0}}><Text style={styles.textContainer}>Phone</Text></View>
                <View style={{flex:2, alignItems:'left',borderWidth:0}}><TextInput style={styles.input} placeholder={'Phone'} onChangeText={(text) => {setPhone( text )}}/></View>
            </View>
            <View style={styles.columnItem}>
                <View style={{flex:1, borderWidth:0}}><Text style={styles.textContainer}>Email</Text></View>
                <View style={{flex:2, alignItems:'left',borderWidth:0}}><TextInput style={styles.input} placeholder={'Email'} onChangeText={(text) => {setEmail( text )}}/></View>
            </View>
            <View style={{alignSelf:'center', marginBottom:20, borderWidth:0}}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={{color:'white', width:70, textAlign:'center'}}>Submit</Text>
            </TouchableOpacity>
            </View>
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
    textContainer: {
        textAlign:'right', 
        marginRight:25
    },
    columnItem: {
        flexDirection:'row', 
        alignItems:'center', 
        borderWidth:0
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
    inputHalf: {
        width: 97,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
        marginRight:6
      },
    button: {
      alignItems: 'center',
      backgroundColor: '#4c7031',
      padding: 10,
      width:'30%',
      borderRadius:5,
      marginTop:10
  },
  link: {
    alignItems: 'center',
    marginTop:15
},
  });
  

export default SignUpScreen;