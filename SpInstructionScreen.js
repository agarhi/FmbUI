import {View, Text, Modal} from 'react-native'
import { useState, useEffect } from 'react';

const SpInsModalScreen = ({ openSpInsModal, onClose, daySelected }) => {

const [data, setData] = useState('')
const [header, setHeader] = useState('')

const fetchData = async () => {
    if(openSpInsModal) {
        setHeader((daySelected+'').concat(' Special Instructions'))
         setData('Salawat on Fruit - Panjatan Pak!')
    }
}

useEffect(() => {
    fetchData();
}, [openSpInsModal]); // without openSpInsModal in here, the fetchData is not called on each load: https://stackoverflow.com/questions/61410617/how-to-fetch-data-only-when-the-modal-loads


    return (
      <Modal 
      animationType="slide"
        visible={openSpInsModal}>
        <View style={{alignItems:'center', alignSelf:'center', marginTop:100}}>
            <Text style={{fontWeight:'bold', fontSize:25, marginBottom:20}}>{header}</Text>
           <Text style={{ fontSize:20}}>{data}</Text>
           <Text style={{color:'blue', marginTop:20, fontSize:20}} onPress={onClose}>Close</Text>
        </View>
      </Modal>
    );
}

export default SpInsModalScreen;