import {View, Text, Modal, TouchableOpacity, StyleSheet, TextInput} from 'react-native'
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import DropDownPicker from 'react-native-dropdown-picker';



const FeedbackModalScreen = ({ openFeedbackModal, onClose, daySelected, menuItem }) => {

const [data, setData] = useState('')
const [header, setHeader] = useState('')
const [thaliNum, setThaliNum] = useState('')
const [foodQualityValue, setFoodQualityValue] = useState('');
const [open, setOpen] = useState(false);
const [foodQualityValues, setFoodQualityValues] = useState([
    {label: 'Disappointing', value: 'D'},
    {label: 'Satisfactory', value: 'S'},
    {label: 'Very Good', value: 'V'},
    {label: 'Extraordinary', value: 'E'}
  ]);


const fetchData = async () => {
    if(openFeedbackModal) {
        setHeader((daySelected+'').concat(' Feedback'))
        let thali_number = await retrieveThaliNumber()
        setThaliNum('Thali num '.concat(thali_number))
    }
}

const retrieveThaliNumber = async () => {
    try {
      const value = await AsyncStorage.getItem('thali_num');
      if (value !== null) {
        // We have data!!
        console.log('TN', value.trim())
        return value.trim()
      }
    } catch (error) {
      console.log(error)
    }
  };

  const onSubmit = () => {
    // Other submit logic here
    onClose()
  }

  const onQualityChange = (item) => {
  }

useEffect(effectFunction = () => {
    fetchData();
}, [openFeedbackModal]); // without openFeedbackModal in here, the fetchData is not called on each load: https://stackoverflow.com/questions/61410617/how-to-fetch-data-only-when-the-modal-loads


    return (
      <Modal 
      animationType="slide"
        visible={openFeedbackModal}>
        <View style={{alignItems:'center', alignSelf:'center', marginTop:100}}>
            <Text style={{fontWeight:'bold', fontSize:25, marginBottom:20}}>{header}</Text>
            <Text style={{ fontSize:20}}>{menuItem}</Text>
            <Text style={{ fontSize:20, marginTop:10}}>{thaliNum}</Text>
            <View style={{flexDirection:'row', alignItems:'center', marginTop:10, zIndex:1, alignSelf:'center'}}>
                         <Text style={{ fontSize: 18}}>Food Quality   </Text>
                         <DropDownPicker placeholder='Quality' containerStyle={{width: 150}} style={{zIndex:999}} 
                          value={foodQualityValue} 
                         items={foodQualityValues}  setValue={setFoodQualityValue} 
                         setItems={setFoodQualityValues} 
                         onSelectItem={(value) => {
                            onQualityChange(value) 
                        }} open={open} setOpen={setOpen}
                        />
                      </View>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', marginTop:30}}>
                <TouchableOpacity style={styles.button} onPress={onSubmit}>
                    <Text style={{color:'white'}}>Submit</Text>
                </TouchableOpacity>
                </View>
        </View>
      </Modal>
    );
}

var styles = StyleSheet.create({
      button: {
          alignItems: 'center',
          backgroundColor: '#4c7031',
          padding: 10,
          width:'30%',
          borderRadius:5
      },
      buttonDisabled: {
        alignItems: 'center',
        backgroundColor: '#4c7031',
        opacity:0.5,
        padding: 10,
        width:'30%',
        borderRadius:5
    }
    });

export default FeedbackModalScreen;