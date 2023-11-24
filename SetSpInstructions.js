import * as React from 'react'
import { Button } from 'react-native-paper'
import { DatePickerModal } from 'react-native-paper-dates'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { useState, useEffect } from 'react';
import Moment from 'moment';
import integrate from './integration';
import { Icon } from 'react-native-elements'
import Checkbox from 'expo-checkbox';


const SetSpInstructions = ({ navigation }) => {
  const [visible, setVisible] = React.useState(false)
  const [isDataAvailable, setDataAvailable] = React.useState(false)
  const [menuDataLocal, setMenuDataLocal] = useState([])
  const [niyaz, setNiyaz] = useState(false);
  const date = new Date()
  const [currDate, setCurrDate] = useState(date);
  const [result, setResult] = useState('')

  const onDismiss = React.useCallback(() => {
    setVisible(false)
  }, [setVisible])

  const nextWeekFrom = (date, nextOrPrev) => {
    var time = date.getTime();
    var newDate = new Date();
    time = time + (nextOrPrev * 7 * 24 * 60 * 60 * 1000);
    newDate.setTime(time);
    setCurrDate(newDate)
    return newDate
  }

  const onChange = async ({ date }) => {
    fetch(date)
  }

  const fetch =  async (date) => {
    setVisible(false)
    const dateFormat = 'YYYY-MM-DD'
    var selected_date = Moment(date).format(dateFormat);
    let resp;
    try {
      resp = await integrate('GET', 'http://10.0.0.121:8080/fmbApi/menu/' + selected_date, null, null, true)
      console.log('resp ', resp)
    } catch (error) {
      // TypeError: Failed to fetch
      console.log('There was an error', error);
    }
    console.log(resp)
    setMenuDataLocal(resp)
    setDataAvailable(true)
    setResult('')
  }

  const dayOf = (date) => {
    return Moment(date).format('ddd');
  }

  const changeMenuItem = (index, text) => {
    let localArr = []
    for(let i = 0; i < menuDataLocal.length; i++) {
      localArr[i] = menuDataLocal[i]
      if(i === index) {
        localArr[i].item = text
      }
    }
    setMenuDataLocal(localArr)
  }

  const onSubmit = async () => {
    console.log(menuDataLocal)
    const resp = await integrate('PUT', 'http://10.0.0.121:8080/fmbApi/menu', {}, JSON.stringify(menuDataLocal), true)
    setResult(resp.result)
  }

  const setNiyazValue = (val, index) => {
    let localArr = []
    for(let i = 0; i < menuDataLocal.length; i++) {
      localArr[i] = menuDataLocal[i]
      if(i === index) {
        console.log('Setting to', index, val)
        localArr[i].niyaz = val
      }
    }
    setMenuDataLocal(localArr)
  }

  const dataListArr = menuDataLocal.map((menuDataInfo, index) =>
  (
    <View style={styles.data} key={index}>
      <View style={styles.date}><Text >{menuDataInfo.date}, {dayOf(menuDataInfo.date)}</Text></View>
      <View style={styles.text}><TextInput style={styles.input} value={menuDataInfo.item} onChangeText={(text) => changeMenuItem(index, text)}></TextInput></View>
      <View style={styles.check}><Checkbox disabled={false} onValueChange={(val) => setNiyazValue(val, index)} value={menuDataInfo.niyaz} /></View>

    </View>
  ));

  return (
    <ScrollView>
      <>
        <DatePickerModal
          mode="single"
          visible={visible}
          onDismiss={onDismiss}
          date={currDate}
          onConfirm={onChange}
          saveLabel="Save" // optional
          label="Select date" // optional
          animationType="slide" // optional, default is 'slide' on ios/android and 'none' on web
          locale='en-GB'
        />
        <Button onPress={() => setVisible(true)}>
          Select date
        </Button>

        {
          isDataAvailable ? (
            <View style={styles.container}>
              <View style={styles.data}>
                <View style={styles.date}><Text style={styles.header}>Date</Text></View>
                <View style={styles.textCenter} ><Text style={styles.header}>Item</Text></View>
                <View style={styles.check}><Text style={styles.header}>Niyaz</Text></View>
              </View>
              {dataListArr}
              <View style={{ flexDirection: 'row', borderWidth: 0, justifyContent: 'center', marginTop: 10 }}>
                <TouchableOpacity style={styles.buttonTO} onPress={onSubmit}>
                  <Text style={{ color: 'white', width: 70, textAlign: 'center' }}>Submit</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', borderWidth: 0, justifyContent: 'center', marginTop: 10 }}>
              <TouchableOpacity style={{ flexDirection: 'row', marginRight:20 }} onPress={() => fetch(nextWeekFrom(currDate, -1))}>
                  <Icon name="arrow-left" size={20} />
                  <Text style={styles.nextPrev}>Prev week</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', marginLeft:20 }} onPress={() => fetch(nextWeekFrom(currDate, 1))}>
                  <Text style={styles.nextPrev}>Next week</Text>
                  <Icon name="arrow-right" size={20} />
                </TouchableOpacity>
              </View>
              {result == '' ? (<View style={{marginTop:27}}/>) : (<Text style={{color:'green', marginTop:10}}>{result}</Text>)}
            </View>
          ) : (<View />)
        }
      </>
    </ScrollView>)
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 0,
    marginTop: 30,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 30,
    width: '60%',
  },
  data: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    borderWidth: 0
  },
  header: {
    fontWeight: 'bold'
  },
  buttonTO: {
    backgroundColor: '#4c7031',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  date: {
    alignSelf: 'center',
    flex: 2,
    borderWidth: 0,
    alignItems: 'left'
  },
  text: {
    width: 200,
    marginLeft: 10,
    height: 40,
    paddingLeft: 5,
    paddingTop: 5,
    flex: 4
  },
  textCenter: {
    borderWidth: 0,
    width: 200,
    marginLeft: 10,
    height: 20,
    paddingLeft: 5,
    flex: 4,
    alignItems: 'center',
  },
  check: { flex: 2, alignSelf: 'center', marginLeft: 20, borderWidth: 0, alignItems: 'center' },
  input: {
    width: '100%',
    height: '100%',
    borderColor: 'black',
    borderWidth: 1,
    paddingLeft:5,
    borderRadius:5
  },
});

export default SetSpInstructions;