import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, ImageBackground } from 'react-native'
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import DropDownPicker from 'react-native-dropdown-picker';
import Checkbox from 'expo-checkbox';
import integrate from '../integration';


const FeedbackModalScreen = ({ openFeedbackModal, onClose, daySelected, menuItem, beneficiary, navigation }) => {

  const [data, setData] = useState('')
  const [header, setHeader] = useState('')
  const [thaliNum, setThaliNum] = useState('')
  const [foodQualityValue, setFoodQualityValue] = useState('');
  const [open, setOpen] = useState(false);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [result, setResult] = useState(false);
  const [isResult, setIsResult] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [foodQualityValues, setFoodQualityValues] = useState([
    { label: 'Disappointing', value: 'Disappointing' },
    { label: 'Satisfactory', value: 'Satisfactory' },
    { label: 'Very Good', value: 'Very Good' },
    { label: 'Extraordinary', value: 'Extraordinary' }
  ]);


  const fetchData = async () => {
    if (openFeedbackModal) {
      setHeader((daySelected + '').concat(' Feedback'))
      let thali_number = await retrieveThaliNumber()
      setThaliNum('Thali num '.concat(thali_number))
    }
  }

  const retrieveThaliNumber = async () => {
    try {
      const value = await AsyncStorage.getItem('thali_num');
      if (value !== null) {
        // We have data!!
        return value.trim()
      }
    } catch (error) {
      console.log(error)
    }
  };

  const onSubmit = async () => {
    if (foodQualityValue.trim() == '') {
      setResult('Please choose Quality')
      setIsResult(true)
    } else {
      let postBody = {}
      postBody["quality"] = foodQualityValue
      postBody["comment"] = feedbackComment.text
      postBody["menuId"] = menuItem.id
      postBody["anonymous"] = anonymous
      console.log(JSON.stringify(postBody))
      let resp = await integrate('POST', 'http://10.0.0.121:8080/fmbApi/feedback', null, JSON.stringify(postBody), true, navigation)
      console.log(resp)
      setResult(resp.result)
      setIsResult(true)
    }

  }

  const onQualityChange = (item) => {
  }

  useEffect(() => {
    fetchData();
  }, [openFeedbackModal]); // without openFeedbackModal in here, the fetchData is not called on each load: https://stackoverflow.com/questions/61410617/how-to-fetch-data-only-when-the-modal-loads


  return (
    <Modal style={styles.modal}
      animationType="slide"
      visible={openFeedbackModal}>
      <View style={styles.mainView}></View>
      <View style={styles.container}>
        <View style={{ alignContent: 'center', alignSelf: 'center', marginTop: 20 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 25, marginBottom: 15 }}>{header}</Text>
        </View>
        <View >
          <Text style={styles.textHeader}>Menu</Text>
          <Text style={styles.text}>{menuItem.item}</Text>
        </View>
        <View >
          <Text style={styles.textHeader}>Beneficiary</Text>
          <Text style={styles.text}>{beneficiary}</Text>
        </View>
        <View style={{ marginTop: 10, zIndex: 1 }}>
          <Text style={styles.textHeader}>Food Quality   </Text>
          <DropDownPicker placeholder='Quality' containerStyle={{ width: 150 }} style={{ zIndex: 999 }}
            value={foodQualityValue}
            items={foodQualityValues} setValue={setFoodQualityValue}
            setItems={setFoodQualityValues}
            onSelectItem={(label, value) => {
              setFoodQualityValue(label)
            }} open={open} setOpen={setOpen}
          />
        </View>
        <View >
          <Text style={styles.textHeader}>Comments</Text>
          <TextInput style={styles.input}
            multiline={true}
            numberOfLines={4}
            onChangeText={(text) => setFeedbackComment({ text })}
          />
        </View>
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <Checkbox value={anonymous} onValueChange={setAnonymous} />
          <Text style={styles.textHeaderInline}>Anonymous</Text>

        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', marginTop: 30 }}>
          <TouchableOpacity style={styles.button} onPress={onSubmit}>
            <Text style={{ color: 'white' }}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { marginLeft: 10 }]} onPress={onSubmit}>
            <Text style={{ color: 'white' }}>Submit</Text>
          </TouchableOpacity>
        </View>
        {
          isResult ? (<View><Text style={{ color: 'red', marginTop: 10 }}>{result}</Text></View>) : (<View style={{ marginTop: 10, marginBottom: 15 }}></View>)
        }
      </View>
    </Modal>
  );
}

var styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#4c7031',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#4c7031',
    padding: 10,
    width: '30%',
    borderRadius: 5
  },
  buttonDisabled: {
    alignItems: 'center',
    backgroundColor: '#4c7031',
    opacity: 0.5,
    padding: 10,
    width: '30%',
    borderRadius: 5
  },
  input: {
    backgroundColor: 'white',
    height: 70,
    width: 250,
    borderWidth: 1,
    padding: 10,
  },
  container: {
    width: '90%',
    flexDirection: 'column',
    alignItems: 'left',
    alignSelf: 'center',
    marginTop: 100,
    borderRadius: 15,
    paddingLeft: 20,
    paddingBottom: 30,
    backgroundColor: '#ecf0f1'
  },
  text: {
    fontSize: 16,
  },
  textHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20
  },
  textHeaderInline: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10
  },
  modal: {
    backgroundColor: '#ecf0f1'
  }
});

export default FeedbackModalScreen;