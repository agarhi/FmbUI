import {View, Text, Modal} from 'react-native'
import { useState, useEffect } from 'react';

const FeedbackModalScreen = ({ openFeedbackModal, onClose, daySelected, menuItem }) => {

const [data, setData] = useState('')
const [header, setHeader] = useState('')


const fetchData = async () => {
    if(openFeedbackModal) {
        setHeader((daySelected+'').concat(' Feedback'))
         
    }
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
           <Text style={{color:'blue', marginTop:20, fontSize:20}} onPress={onClose}>Close</Text>
        </View>
      </Modal>
    );
}

export default FeedbackModalScreen;