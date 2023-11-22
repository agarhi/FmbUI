import { View, Text, Modal } from 'react-native'
import { useState, useEffect } from 'react';
import integrate from './integration';

const SpInsModalScreen = ({ openSpInsModal, onClose, daySelected, fullMenuDate }) => {

  const [data, setData] = useState([])
  const [header, setHeader] = useState('')
  const [dataCache, setDataCache] = useState({})

  const fetchData = async () => {
    if (openSpInsModal) {
      let instruction = dataCache[fullMenuDate]
      setHeader((daySelected + '').concat(' Special Instructions'))
      if (instruction == null) {
        console.log('Fetching from integrate')
        const resp = await integrate("GET", "http://localhost:8080/fmbApi/spInstructions/" + fullMenuDate, null, null, true)
        instruction = resp.instructions
        dataCache[fullMenuDate] = instruction
      }
      console.log("instruction ", instruction)
      console.log("data ", instruction.split(";;;"))
      setData(instruction.split(";;;"))
    }
  }

  const dataArr = data.map((dataInfo, index) =>
  (
    <Text style={{ fontSize: 20 }} key={index}>{dataInfo}</Text>
  ));

  useEffect(() => {
    fetchData();
  }, [openSpInsModal]); // without openSpInsModal in here, the fetchData is not called on each load: https://stackoverflow.com/questions/61410617/how-to-fetch-data-only-when-the-modal-loads


  return (
    <Modal
      animationType="slide"
      visible={openSpInsModal}>
      <View style={{ alignItems: 'center', alignSelf: 'center', marginTop: 100 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 25, marginBottom: 20 }}>{header}</Text>
        {dataArr}
        <Text style={{ color: 'blue', marginTop: 20, fontSize: 20 }} onPress={onClose}>Close</Text>
      </View>
    </Modal>
  );
}

export default SpInsModalScreen;