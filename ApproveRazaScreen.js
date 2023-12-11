import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import integrate from './integration';
import { useState, useEffect } from 'react';
import Moment from 'moment';
import alert from './alert'


const ApproveRazaScreen = ({ navigation }) => {
  const [pendingApprovalResp, setPendingApprovalResp] = useState([])
  const [noData, setNoData] = useState(false)
  const fetchData = async () => {
    let pendingApprovalJson = await integrate('GET', 'http://10.0.0.121:8080/fmbApi/raza/pending', null, null, true, navigation)
    console.log('pendingApprovalJson ', pendingApprovalJson)
    setPendingApprovalResp(pendingApprovalJson)
    if (pendingApprovalJson.length === 0) {
      setNoData(true)
    } else {
      setNoData(false)
    }
  }

  const format = (date) => {
    return Moment(date).format('yyyy-MM-DD');
  }

  const approveRaza = async (its) => {
    let approvalRequest = await integrate('PUT', 'http://10.0.0.121:8080/fmbApi/raza/approve/' + its, null, null, true, navigation);
    if (approvalRequest.razaReceived) {
      fetchData() // Fetch the new pending records 
    }
  }

  const approvalUiMap = pendingApprovalResp.map((viewInfo, index) =>
  (

    <View key={index} style={styles.data}>
      <View style={styles.dataElement}>
        <Text style={styles.textElement}>
          {viewInfo.fname}  {viewInfo.lname}
        </Text>
      </View>

      <View style={styles.dataElement}>
        <Text style={styles.textElement}>
          {viewInfo.its}
        </Text>
      </View>

      <View style={styles.dataElement}>
        <Text style={styles.textElement}>
          {format(viewInfo.createdDate)}
        </Text>
      </View>

      <View style={{ justifyContent: 'center', flex: 0.6 }}>
        <TouchableOpacity style={styles.buttonTO} onPress={() => approveRaza(viewInfo.its)}>
          <Text style={{ color: 'white', width: 70, textAlign: 'center' }}>Approve</Text>
        </TouchableOpacity>
      </View>

    </View>
  ));

  useEffect(() => {
    fetchData()
  }, []);

  return (
    <View>
      {noData ? (
        <View style={styles.container}>
          <Text>No Pending approvals</Text>
        </View>) : (
        <View style={styles.container}>
          <View style={styles.data}>
            <View style={styles.dataElement}>
              <Text style={styles.textElementBold}>
                Name
              </Text>
            </View>

            <View style={styles.dataElement}>
              <Text style={styles.textElementBold}>
                ITS
              </Text>
            </View>

            <View style={styles.dataElement}>
              <Text style={styles.textElementBold}>
                Created On
              </Text>
            </View>
            <View style={{ justifyContent: 'center', flex: 0.6 }} />
          </View>
          {approvalUiMap}
        </View>
      )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 0,
    marginTop: 100,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 30,
    width: '70%'
  },
  data: {
    flexDirection: 'row',
    marginTop: 20,
    borderWidth: 0,
    width: '70%'
  },
  dataElement: {
    flex: 1, borderWidth: 0, justifyContent: 'center'
  },
  textElement: {
    textAlign: 'left', fontSize: 18, alignSelf: 'left'
  },
  textElementBold: {
    textAlign: 'left', fontSize: 18, alignSelf: 'left', fontWeight: 'bold'
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
    borderWidth: 0,
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


export default ApproveRazaScreen;