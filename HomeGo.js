import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { Box, FlatList, Center, NativeBaseProvider } from "native-base";
import DropDownPicker from 'react-native-dropdown-picker';
import { useState, useEffect } from 'react';
import Checkbox from 'expo-checkbox';
import Moment from 'moment';
import DateObject from "react-date-object";

const HomeGo = ({route}) => {
    const token = route.params.token
    const message = route.params.message
    const [open, setOpen] = useState(false);
    const [foodSizeValue, setFoodSizeValue] = useState(null);
    const [foodSizeValues, setFoodSizeValues] = useState([
    {label: 'X Small', value: 'XS'},
    {label: 'Small', value: 'S'},
    {label: 'Medium', value: 'M'},
    {label: 'Large', value: 'L'},
    {label: 'X Large', value: 'XL'}
  ]);

  const [data, setData] = useState([]);
  const [days, setDays] = useState([]);
  const [jsonData, setJsonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState([]);
  const [menuItem, setMenuItem] = useState({});
  const [backgroundColor, setBackgroundColor] = useState('#E3E3E3');
  const [mainCourse, setMainCourse] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');
  const [currMenuObj, setCurrMenuObj] = useState('')
  const [isNoCarbsSelected, setNoCarbsSelection] = useState(false);
  
  const horizTabArr = []

  const fetchData = async () => {
    console.log('Fetching data ...')
    const requestOptions = {
      method: 'GET',
      headers: {  'Set-Cookie' : token }
    };

    const resp = await fetch("http://sfjamaat.org/sf/faiz/rsvp.php?date=&offset=0", requestOptions);
    const data = await resp.json();
    let detailsData = data.data
    var dateToday = new DateObject();
    setCurrentMonth(Moment(dateToday).format('MMM'))
    var dateTodayInFormat = Moment(dateToday).format('ddd, DD');
    let currentDayIdx = 0;
    console.log("detailsData ", detailsData);

    
    for(let i = 0; i < detailsData.length; i++) {

      const dayDtDt = Moment(detailsData[i].date).format('ddd, DD');
      if(dayDtDt == dateTodayInFormat) {
        currentDayIdx = i;
      }
      menuItem[dayDtDt] = detailsData[i];

      const dayDtDay = Moment(detailsData[i].date).format('ddd');
      const dayDt = '{"day":"'.concat(dayDtDay).concat('","date":"'.concat(dayDtDt).concat('"}'));
      days.push(JSON.parse(dayDt));

      let topRadius = 0, bottomRadius = 0;
      
      if(i == detailsData.length - 1) {
        bottomRadius = 5
      }
      let initialArrCurr = '{"id":'.concat(i).concat(',"color":"#e3e3e3","text":"'.concat(dayDtDt).concat('","topRadius":'.concat(topRadius).concat(',"bottomRadius":'.concat(bottomRadius).concat('}'))))
      console.log(initialArrCurr)
      horizTabArr.push(JSON.parse(initialArrCurr))
    }

    console.log("currentDayIdx  ------>",  currentDayIdx);
    console.log("horizTabArr[currentDayIdx] ------>",  horizTabArr[currentDayIdx]);
    console.log("horizTabArr[currentDayIdx].text ------>",  horizTabArr[currentDayIdx].text);
    console.log("menuItem[horizTabArr[currentDayIdx].text ------>",  menuItem[horizTabArr[currentDayIdx].text]);

    horizTabArr[currentDayIdx].color = 'white'; // default day 
    setCurrMenuObj(menuItem[horizTabArr[currentDayIdx].text])
    console.log("currMenuObj ", currMenuObj);
    setMenuItem(menuItem);
    setFoodSizeValue(currMenuObj.size)
    console.log(foodSizeValue)
    setLoading(false);
  };

  useEffect(() => {
    console.log("useEffect")
    fetchData();
  }, []);

const [buttonData, setButtonData] = useState(horizTabArr)

const changeColorB2 = (buttonInfo, index) =>(e) => {
    let newArrray = [] // You have to create a new object and set it for react to re-render
    for(let i = 0; i < buttonData.length; i++) {
      newArrray.push(buttonData[i])
      newArrray[i].color = '#e3e3e3'
    }
    newArrray[index].color = 'white'
    setCurrMenuObj(menuItem[newArrray[index].text])
    setFoodSizeValue(menuItem[newArrray[index].text].size)
    setButtonData(newArrray);
}

  const buttonsListArr = buttonData.map((buttonInfo, index) => 
  (
    <TouchableOpacity style={{backgroundColor:buttonInfo.color,flex:1, padding: 15, borderTopLeftRadius:buttonInfo.topRadius, borderBottomLeftRadius:buttonInfo.bottomRadius,justifyContent:'center'}} 
    onPress={changeColorB2(buttonInfo, index)} key={buttonInfo.id}>
        <Text style={{fontSize:10}}>{buttonInfo.text}</Text>
    </TouchableOpacity>
  ));

  const onPress = () => {

  }
    return (
        <View style={{flexDirection:'column', flex:1}}>
             <View style={{flex:2}}>
                <Image source={require('./images/image-450x180.jpg')} style={styles.backgroundImage}/>
             </View>
             <View style={{flex:0.5, width:'90%', alignSelf:'center'}}>
                <Text style={{position:'absolute', bottom:0, right:5, fontSize: 18, fontFamily:'Futura'}}>{message}</Text>
             </View>
             <View style={{flexDirection:'row', flex:4.5, width:'90%', alignSelf:'center', marginTop:10}}>
                 <View style={{flex:1, marginRight: -1}}>
                 <View style={{backgroundColor:'purple', flex:1, padding: 15, borderTopLeftRadius:5, justifyContent:'center'}}>
                          <Text style={{fontSize:15, fontWeight:'bold', color:'white'}}>{currentMonth}</Text>
                  </View>
                    {buttonsListArr}
                 </View>
                 <View style={{backgroundColor: 'white', flex:5, borderTopRightRadius:10, borderBottomRightRadius:10}}>
                    <View style={{marginTop:20}}>
                      <Text style={{textAlign:'center', fontWeight: 'bold', fontSize: 18}}>{currMenuObj.details}</Text>
                      <Text>{"\n"}</Text>
                      <View style={{flexDirection:'row', alignItems:'center', zIndex:1, alignSelf:'center'}}>
                         <Text style={{ fontSize: 18}}>Size / Count   </Text>
                        <DropDownPicker placeholder='Size' containerStyle={{width: 100}} style={{zIndex:999}} open={open} value={foodSizeValue} items={foodSizeValues} setOpen={setOpen} setValue={setFoodSizeValue} setItems={setFoodSizeValues}/>
                      </View>
                      <Text>{"\n"}</Text>
                      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                         <Checkbox value={isNoCarbsSelected} onValueChange={setNoCarbsSelection}/>
                         <Text style={{textAlign:'center', fontSize: 18, width:'35%'}}>No rice / bread</Text>
                      </View>
                      <Text>{"\n"}</Text>
                      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                        <TouchableOpacity style={currMenuObj.readonly == 1 ? styles.buttonDisabled : styles.button} onPress={onPress} disabled={currMenuObj.readonly == 1}>
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
    buttonDisabled: {
      alignItems: 'center',
      backgroundColor: 'purple',
      opacity:0.5,
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
