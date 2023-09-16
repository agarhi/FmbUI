import React, { useState, useEffect } from "react";
import { Box, FlatList, Center, NativeBaseProvider } from "native-base";
import { View, Text, Image, StyleSheet} from "react-native";
import Checkbox from 'expo-checkbox';
import Moment from 'moment';

const LandingScreen = ({route}) => {
  const [data, setData] = useState([]);
  const [days, setDays] = useState([]);
  const [jsonData, setJsonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { pageheader, token } = route.params;
  const [menu, setMenu] = useState([]);
  const [menuItem, setMenuItem] = useState({});

  const fetchData = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {  'Set-Cookie' : token }
    };

    const resp = await fetch("http://sfjamaat.org/sf/faiz/rsvp.php?date=&offset=0", requestOptions);
    const data = await resp.json();
    for(let i = 0; i < data.data.length; i++) {

      const dayDtDt = Moment(data.data[i].date).format('MMM DD');
      menuItem[dayDtDt] = data.data[i];

      
      const dayDtDay = Moment(data.data[i].date).format('ddd');
      const dayDt = '{"day":"'.concat(dayDtDay).concat('","date":"'.concat(dayDtDt).concat('"}'));
      days.push(JSON.parse(dayDt));
      
    }
    console.log(menuItem);
    setMenuItem(menuItem);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /*const renderItem = ({ item }) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <Box style={styles.rsvpbox}  rounded="md" bg="primary.200" my={2}> 
        <Text>{item.date}</Text> 
        <Text>{item.details}</Text> 
        <View style={{flexDirection: 'row'}}><Checkbox /><Text style={{fontSize: 10}}> No rice {"\n"} Bread</Text><Text> XS S M L XL</Text></View>
        </Box>
     </View>
      
    );
  };*/

  const renderItem = ({ item }) => {
    return (
      <View onStartShouldSetResponder=
      {() => {
        console.log("item:", item);
        console.log('You click by View ', menuItem[item.date]);
        setMenu(menuItem[item.date]);
      }}
         style={{ padding:'4.3%'}}><Text>{item.day}{"\n"}{item.date}</Text></View> 
    );
  }

  return (
    <NativeBaseProvider>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF', borderBottomColor: 'red', borderBottomWidth: 1, borderTopWidth: 1}}> 
      <Image source={require('./images/image-450x180.jpg')} style={styles.backgroundImage}/>
      </View>
      <View style={{ flex: 2, backgroundColor: 'red'}}> 
        {loading && <Box>Loading..</Box>}
          {data && (
            <View style={styles.container}>
            <FlatList style={styles.list}
            contentContainerStyle={styles.listContents}
            horizontal={true}
              data={days}
              renderItem={renderItem}
              keyExtractor={(item) => item.date.toString()}
            />
            </View>
          )}
      <View style={styles.daymenu}>
       <Text>{menu.details}</Text>
       <View style={{flexDirection: 'row'}}><Checkbox /><Text style={{}}> No rice or bread</Text></View>
       <Text> XS S M L XL</Text>
      </View>
      </View>
    </NativeBaseProvider>
  );
}

/*

return (
    <NativeBaseProvider>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF', borderBottomColor: 'red', borderBottomWidth: 1, borderTopWidth: 1}}> 
      <Image source={require('./images/image-450x180.jpg')} style={styles.backgroundImage}/>
      </View>
      <View style={{ flex: 2,  flexDirection: 'row', backgroundColor: 'red'}}> 
        <Center flex={1}>
          {loading && <Box>Loading..</Box>}
          {data && (
            <FlatList
              data={days}
              renderItem={renderItem}
              keyExtractor={(item) => item.name.toString()}
            />
          )}
        </Center>
      </View>
    </NativeBaseProvider>
  );
}

            */
           
var styles = StyleSheet.create({
  daymenu: {
    height:250,
    backgroundColor: 'white',
    margin:5,
    borderRadius: 5,
    fontSize:40
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  container: {
    flexShrink: 1,
    margin: 5,
    padding: 5,
    backgroundColor: '#fffffa',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  list: {
    flexDirection: 'column'
  },
  listContents: {
    flexDirection: 'row',
    width: '100%'
  }
});

export default LandingScreen;