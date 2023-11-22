import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import {StackActions} from '@react-navigation/native';

const ProfileScreen = ({navigation}) => {
    const handleLogout = async () => {
        // Navigation dispatch calls a navigation action, and popToTop will take
        // the user back to the very first screen of the stack
        navigation.dispatch(StackActions.popToTop());
    }

    return (
        <View style={{alignItems:'center', alignSelf:'center', marginTop:300}}>
            <Text>Profile Here!!</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={{color:'white', width:70, textAlign:'center'}}>Logout</Text>
            </TouchableOpacity>
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
      borderRadius:5,
      marginTop:10
  },
  });

export default ProfileScreen;