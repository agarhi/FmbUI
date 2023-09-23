import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { Box, FlatList, Center, NativeBaseProvider } from "native-base";
import DropDownPicker from 'react-native-dropdown-picker';
import { useState, useEffect } from 'react';
import Checkbox from 'expo-checkbox';
import Moment from 'moment';

const HomeGo = ({route}) => {
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
  const [jsonData, setJsonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState([]);
  const [menuItem, setMenuItem] = useState({});
  const [backgroundColor, setBackgroundColor] = useState('#E3E3E3');
  const [mainCourse, setMainCourse] = useState('');
  //const { pageheader, token } = route.params;
  const detailsArr = [
    {
        "date": "2023-09-18",
        "adults": 0,
        "kids": 0,
        "enabled": 1,
        "details": "Masoor Daal, Chawal",
        "rsvp": 1,
        "size": "L",
        "readonly": 1
    },
    {
        "date": "2023-09-19",
        "adults": 0,
        "kids": 0,
        "enabled": 1,
        "details": "Chicken Birria Tacos",
        "rsvp": 1,
        "size": "L",
        "readonly": 1
    },
    {
        "date": "2023-09-20",
        "adults": 0,
        "kids": 0,
        "enabled": 1,
        "details": "Veg Jalfrezi",
        "rsvp": 1,
        "size": "L",
        "readonly": 1
    },
    {
        "date": "2023-09-21",
        "niyaz": 1,
        "enabled": 1,
        "details": "Private Darees And Fateha Jaman",
        "size": "S",
        "readonly": 1
    },
    {
        "date": "2023-09-22",
        "adults": 0,
        "kids": 0,
        "enabled": 1,
        "details": "Homestyle Gosht Tarkari",
        "rsvp": 1,
        "size": "L",
        "readonly": 1
    },
    {
        "date": "2023-09-23",
        "adults": 3,
        "kids": 0,
        "niyaz": 1,
        "enabled": 1,
        "details": "Private Darees",
        "rsvp": 1,
        "size": "S"
    },
    {
        "date": "2023-09-24",
        "adults": 3,
        "kids": 0,
        "niyaz": 1,
        "enabled": 1,
        "details": "Private Darees",
        "rsvp": 1,
        "size": "S"
    }
  ]
  const [detailsData, setDetailsData] = useState(detailsArr)

  const initialArr = []
/*    {
      id: 1,
      color: "#e3e3e3",
      text: "Mon, 11",
      topRadius:5,
      bottomRadius:0
    },
    {
      id: 2,
      color: "#e3e3e3",
      text: "Tue, 12",
      topRadius:0,
      bottomRadius:0
    },
    {
      id: 3,
      color: "#e3e3e3",
      text: "Wed, 13",
      topRadius:0,
      bottomRadius:0
    },
    {
      id: 4,
      color: "#e3e3e3",
      text: "Thu, 14",
      topRadius:0,
      bottomRadius:0
    },
    {
      id: 5,
      color: "#e3e3e3",
      text: "Fri, 15",
      topRadius:0,
      bottomRadius:0
    },
    {
      id: 6,
      color: "#e3e3e3",
      text: "Sat, 16",
      topRadius:0,
      bottomRadius:0
    },
    {
      id: 7,
      color: "#e3e3e3",
      text: "Sun, 17",
      topRadius:0,
      bottomRadius:5
    }
  ];*/

  const fetchData = async () => {
    console.log('Fetching data ...')
    /*const requestOptions = {
      method: 'GET',
      headers: {  'Set-Cookie' : token }
    };

    const resp = await fetch("http://sfjamaat.org/sf/faiz/rsvp.php?date=&offset=0", requestOptions);
    const data = await resp.json();
    console.log(data.data);*/
    for(let i = 0; i < detailsData.length; i++) {

      const dayDtDt = Moment(detailsData[i].date).format('ddd, DD');
      menuItem[dayDtDt] = detailsData[i];

      
      const dayDtDay = Moment(detailsData[i].date).format('ddd');
      const dayDt = '{"day":"'.concat(dayDtDay).concat('","date":"'.concat(dayDtDt).concat('"}'));
      days.push(JSON.parse(dayDt));

      let topRadius = 0, bottomRadius = 0;
      if(i == 0) {
        topRadius = 5
      }
      if(i == detailsData.length - 1) {
        bottomRadius = 5
      }
      let initialArrCurr = '{"id":'.concat(i).concat(',"color":"#e3e3e3","text":"'.concat(dayDtDt).concat('","topRadius":'.concat(topRadius).concat(',"bottomRadius":'.concat(bottomRadius).concat('}'))))
      console.log(initialArrCurr)
      initialArr.push(JSON.parse(initialArrCurr))
    }
    console.log(menuItem);
    console.log(days);
    setMenuItem(menuItem);
    setLoading(false);
  };

  useEffect(() => {
    console.log("useEffect")
    fetchData();
  }, []);

const [buttonData, setButtonData] = useState(initialArr)

const changeColorB2 = (buttonInfo, index) =>(e) => {
    let newArrray = [] // You have to create a new object and set it for react to re-render
    for(let i = 0; i < buttonData.length; i++) {
      newArrray.push(buttonData[i])
      newArrray[i].color = '#e3e3e3'
    }
    newArrray[index].color = 'white'
    setButtonData(newArrray);
}

  const buttonsListArr = buttonData.map((buttonInfo, index) => 
  (
    <TouchableOpacity style={{backgroundColor:buttonInfo.color,flex:1, padding: 15, borderTopLeftRadius:buttonInfo.topRadius, borderBottomLeftRadius:buttonInfo.bottomRadius}} 
    onPress={changeColorB2(buttonInfo, index)} key={buttonInfo.id}>
        <Text>{buttonInfo.text}</Text>
    </TouchableOpacity>
  ));

  const onPress = () => {

  }
    return (
        <View style={{flexDirection:'column', flex:1}}>
             <View style={{flex:2}}>
                
             </View>
             <View style={{flexDirection:'row', flex:4.5, width:'90%', alignSelf:'center', marginTop:10}}>
                 <View style={{flex:1, marginRight: -1}}>
                    {buttonsListArr}
                 </View>
                 <View style={{backgroundColor: 'white', flex:5, borderTopRightRadius:10, borderBottomRightRadius:10}}>
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
    },
    text:{
      color:'white'
      },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
  });

export default HomeGo;
