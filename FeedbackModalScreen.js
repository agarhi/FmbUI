import {View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, ImageBackground} from 'react-native'
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import DropDownPicker from 'react-native-dropdown-picker';



const FeedbackModalScreen = ({ openFeedbackModal, onClose, daySelected, menuItem, beneficiary }) => {

const [data, setData] = useState('')
const [header, setHeader] = useState('')
const [thaliNum, setThaliNum] = useState('')
const [foodQualityValue, setFoodQualityValue] = useState('');
const [open, setOpen] = useState(false);
const [feedbackComment, setFeedbackComment] = useState('');
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

  useEffect(() => {
    fetchData();
}, [openFeedbackModal]); // without openFeedbackModal in here, the fetchData is not called on each load: https://stackoverflow.com/questions/61410617/how-to-fetch-data-only-when-the-modal-loads


    return (
      <Modal style={styles.modal}
      animationType="slide"
        visible={openFeedbackModal}>
            <View style={styles.mainView}></View>
        <View style={styles.container}>
            <View style={{alignContent:'center', alignSelf:'center', marginTop:20 }}>
                 <Text style={{fontWeight:'bold', fontSize:25, marginBottom:15}}>{header}</Text>
            </View>
            <View >
                <Text style={styles.textHeader}>Menu</Text>
                 <Text style={styles.text}>{menuItem}</Text>
            </View>
            <View >
                <Text style={styles.textHeader}>Beneficiary</Text>
                 <Text style={styles.text}>{beneficiary}</Text>
             </View>
            <View style={{ marginTop:10, zIndex:1}}>
                         <Text style={styles.textHeader}>Food Quality   </Text>
                         <DropDownPicker placeholder='Quality' containerStyle={{width: 150}} style={{zIndex:999}} 
                          value={foodQualityValue} 
                         items={foodQualityValues}  setValue={setFoodQualityValue} 
                         setItems={setFoodQualityValues} 
                         onSelectItem={(value) => {
                            onQualityChange(value) 
                        }} open={open} setOpen={setOpen}
                        />
            </View>
            <View >
                    <Text style={styles.textHeader}>Comments</Text>
                      <TextInput style={styles.input}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={(text) => setFeedbackComment({text})}
                        />
          </View>
            <View style={{flexDirection:'row', alignItems:'center', alignContent:'center', marginTop:30}}>
            <TouchableOpacity style={styles.button} onPress={onSubmit}>
                    <Text style={{color:'white'}}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, {marginLeft:10}]} onPress={onSubmit}>
                    <Text style={{color:'white'}}>Submit</Text>
                </TouchableOpacity>
                </View>
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
    },
    input: {
        backgroundColor:'white',
        height:70,
        width:250,
        borderWidth: 1,
        padding: 10,
      },
      container: {
        width:'90%',
        flexDirection:'column', 
        alignItems:'left',
         alignSelf:'center', 
         marginTop:100,
         borderRadius:15,
         paddingLeft:20,
         paddingBottom:20,
         backgroundColor: '#ecf0f1'
      },
      text: {
        fontSize:16, 
      },
      textHeader: {
        fontSize:16, 
        fontWeight:'bold',
        marginTop:20
      },
      modal: {
        backgroundColor: '#ecf0f1'
      }
    });

export default FeedbackModalScreen;