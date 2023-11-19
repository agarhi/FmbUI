import { View, Text, StyleSheet, TextInput, TouchableOpacity, CheckBox } from "react-native";
import { useState, useEffect } from 'react';
import Moment from 'moment';
import integrate from './integration';


const SetMenuScreen = ({ route, navigation }) => {
    
    const [niyaz, setNiyaz] = useState(false);
    const menuData = route.params.menuData;
    const [menuDate, setMenuDate] = useState(route.params.menuDate);
    const [menuDataLocal, setMenuDataLocal] = useState([])

    const fetchData = async () => {
        let resp;
        try {
            resp = await integrate('GET', 'http://localhost:8080/fmbApi/menu/'+menuDate, null, null, true)  
            console.log('resp ', resp)
          } catch (error) {
              // TypeError: Failed to fetch
              console.log('There was an error', error);
          }
          setMenuDataLocal(resp)
    }

    useEffect(() => {
       console.log('menuDate ', menuDate)
       fetchData()
    }, [menuDate]);

    const goBack = () => {
        navigation.goBack(null);
    }

    const dayOf= (date) => {
        return Moment(date).format('ddd');
    }

    const dataListArr = menuDataLocal.map((menuDataInfo, index) =>
    (
        <View style={styles.data} key={index}>
            <View style={styles.date}><Text >{menuDataInfo.date}, {dayOf(menuDataInfo.date)}</Text></View>
            <View style={styles.text}><TextInput value={menuDataInfo.item}></TextInput></View>
            <View style={styles.check}><CheckBox disabled={false} onValueChange={setNiyaz} value={menuDataInfo.niyaz} /></View>
            
        </View>
    ));

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Set Menu</Text>
            <View style={styles.data}>
                <View style={styles.date}><Text style={styles.header}>Date</Text></View>
                <View style={styles.textCenter} ><Text style={styles.header}>Item</Text></View>
                <View style={styles.check}><Text style={styles.header}>Niyaz</Text></View>
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
        marginBottom:30,
        width:'60%',
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
        flex:2,
        borderWidth:0,
        alignItems:'left'
    },
    text: {
        borderWidth:1,
        width:200,
        marginLeft:10,
        height:40,
        paddingLeft:5,
        paddingTop:5,
        flex:4
    },
    textCenter: {
        borderWidth:0,
        width:200,
        marginLeft:10,
        height:20,
        paddingLeft:5,
        flex:4,
        alignItems:'center',
    },
      check: {flex:2, alignSelf:'center', marginLeft:20, borderWidth:0, alignItems:'center' }
});


export default SetMenuScreen;