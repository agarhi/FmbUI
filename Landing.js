import React, { useState, useEffect } from "react";
import { Box, FlatList, Center, NativeBaseProvider } from "native-base";
import { View, Text, Image, StyleSheet} from "react-native";
import Checkbox from 'expo-checkbox';

const LandingScreen = ({route}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { pageheader, token } = route.params;

  const fetchData = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {  'Set-Cookie' : token }
    };

    const resp = await fetch("http://sfjamaat.org/sf/faiz/rsvp.php?date=&offset=0", requestOptions);
    const data = await resp.json();
    setData(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <Box style={styles.rsvpbox}  rounded="md" bg="primary.200" my={1}> 
        <Text>{item.date}</Text> 
        <Text>{item.details}</Text> 
        <View style={{flexDirection: 'row'}}><Checkbox /><Text style={{fontSize: 10}}> No rice {"\n"} Bread</Text><Text> XS S M L XL</Text></View>
        </Box>
     </View>
      
    );
  };

  return (
    <NativeBaseProvider>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF', borderBottomColor: 'red', borderBottomWidth: 1, borderTopWidth: 1}}> 
      <Image source={require('./images/image-450x180.jpg')} style={styles.backgroundImage}/>
      </View>
      <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF'}}> 
        <Center flex={1}>
        <Box> Fetch API</Box>
          {loading && <Box>Loading..</Box>}
          {data && (
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.date.toString()}
            />
          )}
        </Center>
      </View>
    </NativeBaseProvider>
  );
}
var styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  rsvpbox: {
    width: '60%',
    height: '80'
  }
});

export default LandingScreen;