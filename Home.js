import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, Dimensions} from "react-native";
import { Box, FlatList, Center, NativeBaseProvider } from "native-base";
import DropDownPicker from 'react-native-dropdown-picker';
import { useState, useEffect } from 'react';
import Checkbox from 'expo-checkbox';
import { TouchableOpacity } from 'react-native';


const Home = ({route}) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
    {label: 'X Small', value: 'xs'},
    {label: 'Small', value: 'small'},
    {label: 'Medium', value: 'medium'},
    {label: 'Large', value: 'large'},
    {label: 'X Large', value: 'xl'}
  ]);

  const [data, setData] = useState([]);
  const [days, setDays] = useState([]);
  const [days1, setDays1] = useState([]);
  const [days2, setDays2] = useState([]);
  const [jsonData, setJsonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState([]);
  const [menuItem, setMenuItem] = useState({});
  const [backgroundColor, setBackgroundColor] = useState('#E3E3E3');

  const fetchData = async () => {
    days.push(JSON.parse('{"displayDate":"Mon, 1"}'));
    days.push(JSON.parse('{"displayDate":"Tue, 2"}'));
    days.push(JSON.parse('{"displayDate":"Wed, 3"}'));
    days.push(JSON.parse('{"displayDate":"Thu, 4"}'));
    days.push(JSON.parse('{"displayDate":"Fri, 5"}'));
    days.push(JSON.parse('{"displayDate":"Sat, 6"}'));
    days.push(JSON.parse('{"displayDate":"Sun, 7"}'));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onPress = () => {

  }

  const renderItem = ({ item }) => {
    return (
      <View style={{backgroundColor, height:60, justifyContent:'center'}} onStartShouldSetResponder={() => setBackgroundColor('#D3D3D3')}><Text style={{textAlign:'center'}}>{item.displayDate}</Text></View> 
    );
  }

    return (
        <View style={{flexDirection:'column', flex:1}}>
             <View style={{flex:2}}>
                <Image source={require('./images/image-450x180.jpg')} style={styles.backgroundImage}/>
             </View>
             <View style={{flexDirection:'row', flex:4.5, width:'90%', alignSelf:'center', marginTop:10}}>
                 <View style={{backgroundColor: '#E3E3E3', flex:1, borderTopLeftRadius:5, borderBottomLeftRadius:5}}>
                    <NativeBaseProvider>
                        <FlatList data={days} renderItem={renderItem} keyExtractor={(item) => item.displayDate.toString()}/>
                    </NativeBaseProvider>
                 </View>
                 <View style={{backgroundColor: '#D3D3D3', flex:5, borderTopRightRadius:5, borderBottomRightRadius:5}}>
                    <View style={{marginTop:20}}>
                      <Text style={{textAlign:'center', fontWeight: 'bold', fontSize: 18}}>Chicken Stew, Sourdough Bread</Text>
                      <Text>{"\n"}</Text>
                      <View style={{flexDirection:'row', alignItems:'center', zIndex:1, alignSelf:'center'}}>
                         <Text style={{ fontSize: 18}}>Size / Count   </Text>
                        <DropDownPicker placeholder='Size' containerStyle={{width: 100}} style={{zIndex:999}} open={open} value={value} items={items} setOpen={setOpen} setValue={setValue} setItems={setItems}/>
                      </View>
                      <Text>{"\n"}</Text>
                      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                         <Checkbox />
                         <Text style={{textAlign:'center', fontSize: 18, width:'35%'}}>No rice / bread</Text>
                      </View>
                      <Text>{"\n"}</Text>
                      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                        <TouchableOpacity style={styles.button} onPress={onPress}>
                            <Text style={{color:'white'}}>RSVP</Text>
                        </TouchableOpacity>
                      </View>
                      <Text>{"\n"}</Text>
                      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                        <Text style={{flex:1, textAlign:'center', color:'blue'}}>Special Instructions</Text>
                        <Text style={{flex:1, textAlign:'center', color:'blue'}}>Provide Feedback</Text>
                      </View>
                      <Text>{"\n"}</Text>
                      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                        <Text style={{flex:1, textAlign:'center', color:'blue'}}>{'<<'} Prev week</Text>
                        <Text style={{flex:1, textAlign:'center', color:'blue'}}>Next week {'>>'}</Text>
                      </View>
                    </View>
                 </View>
             </View>
             <View style={{flex:1}}></View>
        </View>
      
    );

}

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
      elevation: 5
    },
    list: {
      flexDirection: 'row'
    },
    listContents: {
      flexDirection: 'row',
      width: '100%'
    },
    button: {
        alignItems: 'center',
        backgroundColor: 'purple',
        padding: 10,
        width:'30%',
        borderRadius:5
    }
  });

  
export default Home;