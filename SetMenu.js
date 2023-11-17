import { View, Text, StyleSheet, TextInput, TouchableOpacity, CheckBox } from "react-native";
import { useState, useEffect } from 'react';


const SetMenuScreen = ({ route, navigation }) => {
    const [niyaz, setNiyaz] = useState(false);
    const menuData = route.params.menuData;
    const goBack = () => {
        navigation.goBack(null);
    }

    const dataListArr = menuData.map((menuDataInfo, index) =>
    (
        <View style={styles.data} key={index}>
            <Text style={styles.date}>{menuDataInfo.date}</Text>
            <TextInput style={styles.text} value={menuDataInfo.item}></TextInput>
            <CheckBox style={styles.check} disabled={false} onValueChange={setNiyaz} value={menuDataInfo.niyaz} />
        </View>
    ));

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Set Menu</Text>
            <View style={styles.data}>
                <Text style={styles.dateBold}>Date</Text>
                <Text style={styles.textBold}>Item</Text>
                <Text style={styles.checkBold}>Niyaz</Text>
            </View>
            {dataListArr}
            <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'center', marginTop:10 }}>
                <TouchableOpacity style={styles.buttonTO} onPress={goBack}>
                  <Text style={{ color: 'white', width: 70, textAlign: 'center' }}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonTO}>
                  <Text style={{ color: 'white', width: 70, textAlign: 'center' }}>Submit</Text>
                </TouchableOpacity>
              </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 0,
        marginTop: 100,
        backgroundColor: 'white',
        padding:20,
        borderRadius:10,
        justifyContent:'center',
        marginBottom:30
    },
    data: {
        flexDirection:'row',
        marginTop:20,
        width:'100%',
        borderWidth:0
    },
    
    header: {
        fontWeight:'bold'
    },
    buttonTO: {
        backgroundColor: '#4c7031',
        padding: 10,
        borderRadius: 5,
        margin: 10,
      },
    date : {
        alignSelf:'center',
        borderWidth:0,
        flex:5,
        borderWidth:0
    },
    text: {
        borderWidth:1,
        width:200,
        marginLeft:10,
        height:40,
        paddingLeft:5,
        flex:11,
    },
      check: {flex:1, alignSelf:'center', marginLeft:20 },
      dateBold : {
        alignSelf:'center',
        borderWidth:0,
        flex:5,
        borderWidth:0,
        fontWeight:'bold'
    },
    textBold: {
        borderWidth:0,
        width:200,
        marginLeft:10,
        height:40,
        paddingLeft:5,
        flex:11,
        fontWeight:'bold'
    },
      checkBold: {flex:1, alignSelf:'center', marginLeft:20,fontWeight:'bold' }
});


export default SetMenuScreen;