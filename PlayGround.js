import * as React from 'react'
import { Button } from 'react-native-paper'
import { DatePickerModal } from 'react-native-paper-dates'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, CheckBox, ScrollView } from "react-native";
import { useState, useEffect } from 'react';
import Moment from 'moment';
import integrate from './integration';


const PlayGround = ({ navigation }) => {
  const [visible, setVisible] = React.useState(false)
  const [isDataAvailable, setDataAvailable] = React.useState(false)
  const [menuDataLocal, setMenuDataLocal] = useState([])
  const [niyaz, setNiyaz] = useState(false);
  const onDismiss = React.useCallback(() => {
    setVisible(false)
  }, [setVisible])

  const onChange = async ({ date }) => {
    setVisible(false)
    const dateFormat = 'YYYY-MM-DD'
    var selected_date = Moment(date).format(dateFormat);
    let resp;
    try {
      resp = await integrate('GET', 'http://localhost:8080/fmbApi/menu/' + selected_date, null, null, true)
      console.log('resp ', resp)
    } catch (error) {
      // TypeError: Failed to fetch
      console.log('There was an error', error);
    }
    setMenuDataLocal(resp)
    /* navigation.navigate('SetMenu', {
       menuDate: selected_date
     }) */
    setDataAvailable(true)
  }
  const date = new Date()

  const dayOf = (date) => {
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
    <ScrollView>
    <>
      <DatePickerModal
        mode="single"
        visible={visible}
        onDismiss={onDismiss}
        date={date}
        onConfirm={onChange}
        saveLabel="Save" // optional
        label="Select date" // optional
        animationType="slide" // optional, default is 'slide' on ios/android and 'none' on web
        locale='en-US'
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
              <TouchableOpacity style={styles.buttonTO}>
                <Text style={{ color: 'white', width: 70, textAlign: 'center' }}>Submit</Text>
              </TouchableOpacity>
            </View>
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
    borderWidth: 1,
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
  check: { flex: 2, alignSelf: 'center', marginLeft: 20, borderWidth: 0, alignItems: 'center' }
});

export default PlayGround;