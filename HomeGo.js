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
    const [foodSizeValues, setFoodSizeValues] = useState([
    {label: 'X Small', value: 'XS'},
    {label: 'Small', value: 'S'},
    {label: 'Medium', value: 'M'},
    {label: 'Large', value: 'L'},
    {label: 'X Large', value: 'XL'}
  ]);

  const [loading, setLoading] = useState(true);
  const [menuItemMap, setmenuItemMap] = useState({});
  const [backgroundColor, setBackgroundColor] = useState('#006400');
  const [currentMonth, setCurrentMonth] = useState('');
  const [currMenuObj, setCurrMenuObj] = useState('')
  const [isNoCarbsSelected, setNoCarbsSelection] = useState(false);
  const [currMenuPgOffset, setCurrMenuPgOffset] = useState(0)
  const [isFetchMode, setFetchMode] = useState(false)
  const [postBody, setPostBody] = useState(null)
  const [userIdxChoice, setUserIdxChoice] = useState(0)
  
  const verticalTabArr = []

  const fetchData = async () => { // Called on first render, when you click next or prev (fetchMode = false);;; and on rsvp change (fetchMode = true)
        
    const requestOptions = {
      method: isFetchMode ? 'POST' : 'GET',
      headers: {  'Set-Cookie' : token },
      body: isFetchMode ? postBody : null
    };
    if(isFetchMode) {
      requestOptions.headers['Content-Type'] = 'application/json'
      requestOptions.headers['Accept'] = '*/*'
    }
    const url = "http://sfjamaat.org/sf/faiz/rsvp.php?date=&offset="+currMenuPgOffset
    console.log('Fetching data', url)
    let resp
    try {
      resp = await fetch(url, requestOptions);
    } catch (error) {
      // TypeError: Failed to fetch
      console.log('There was an error', error);
    }
    const data = await resp.json();
    let detailsData = data.data
    console.log('detailsData ', detailsData)
    var dateToday = new DateObject();
    
    var dateTodayInFormat = Moment(dateToday).format('ddd, DD');
    let currentDayIdx = 0;

    setCurrentMonth(Moment( detailsData[0].date).format('MMM')) // Month to be displayed in the top left of main view
    for(let i = 0; i < detailsData.length; i++) {

      // Get the index of current date in the data so we can show that date white
      const dayDtDt = Moment(detailsData[i].date).format('ddd, DD');
      if(currMenuPgOffset == 0 && dayDtDt == dateTodayInFormat) {
        currentDayIdx = i;
      }

      // menuItemMap is a dictionary that uses dates as keys and full menu object as values
      menuItemMap[dayDtDt] = detailsData[i];

      // start forming the vertical tab array 
      let topRadius = 0, bottomRadius = 0;
      if(i == detailsData.length - 1) {
        bottomRadius = 5
      }
      let initialArrCurr = '{"id":'.concat(i).concat(',"color":"#e3e3e3","text":"'.concat(dayDtDt).concat('","topRadius":'.concat(topRadius).concat(',"bottomRadius":'.concat(bottomRadius).concat('}'))))
      verticalTabArr.push(JSON.parse(initialArrCurr))
    }

    // Just setting a bunch of state variables based on data received
    verticalTabArr[isFetchMode ? userIdxChoice : currentDayIdx].color = 'white'; // default day 
    setCurrMenuObj(menuItemMap[verticalTabArr[isFetchMode ? userIdxChoice : currentDayIdx].text])
    setmenuItemMap(menuItemMap);
    setButtonData(verticalTabArr)
    setLoading(false);
  };

  useEffect(effectFunction = () => {
    fetchData();
  }, [currMenuPgOffset, postBody]);

const [buttonData, setButtonData] = useState([])

const changeColor = (buttonInfo, index) =>(e) => {
    let newArrray = [] // You have to create a new object and set it for react to re-render
    for(let i = 0; i < buttonData.length; i++) {
      newArrray.push(buttonData[i])
      newArrray[i].color = '#e3e3e3'
    }
    newArrray[index].color = 'white'
    setCurrMenuObj(menuItemMap[newArrray[index].text])
    setButtonData(newArrray);
    setUserIdxChoice(index)
}

const changeMenuWeek = (offset) => {
  let newMenuPgOffset = currMenuPgOffset + offset;
  setCurrMenuPgOffset(newMenuPgOffset)
  setFetchMode(false)
}


  const buttonsListArr = buttonData.map((buttonInfo, index) => 
  (
    <TouchableOpacity style={{backgroundColor:buttonInfo.color,flex:1, padding: 15, borderTopLeftRadius:buttonInfo.topRadius, borderBottomLeftRadius:buttonInfo.bottomRadius,justifyContent:'center'}} 
    onPress={changeColor(buttonInfo, index)} key={buttonInfo.id}>
        <Text style={{fontSize:10}}>{buttonInfo.text}</Text>
    </TouchableOpacity>
  ));

  const onRsvpPress = () => {
    let rsvpValue = currMenuObj.rsvp == 1 ? "false" : "true"
    let postBody ='{"'.concat(currMenuObj.date).concat('":{"rsvp":'.concat(rsvpValue).concat('}}'));
    setPostBody(postBody)
    setFetchMode(true)
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
                        <DropDownPicker placeholder='Size' containerStyle={{width: 100}} style={{zIndex:999}} open={open} value={currMenuObj.size} items={foodSizeValues} setOpen={setOpen} setValue={currMenuObj.size} setItems={setFoodSizeValues}/>
                      </View>
                      <Text>{"\n"}</Text>
                      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                         <Checkbox value={isNoCarbsSelected} onValueChange={setNoCarbsSelection}/>
                         <Text style={{textAlign:'center', fontSize: 18, width:'35%'}}>No rice / bread</Text>
                      </View>
                      <Text>{"\n"}</Text>
                      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                        <TouchableOpacity style={currMenuObj.readonly == 1 ? styles.buttonDisabled : styles.button} onPress={onRsvpPress} disabled={currMenuObj.readonly == 1}>
                            <Text style={{color:'white'}}>{currMenuObj.rsvp == 1 ? 'Yes' : 'No'}</Text>
                        </TouchableOpacity>
                      </View>
                      <Text>{"\n"}</Text>
                      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                        <Text style={{flex:1, textAlign:'center', color:'blue'}}>Special Instructions</Text>
                        <Text style={{flex:1, textAlign:'center', color:'blue'}}>Provide Feedback</Text>
                      </View>
                      <Text>{"\n"}</Text>
                      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                        <Text style={{flex:1, textAlign:'center', color:'blue'}} onPress={() =>{changeMenuWeek(-7)}}>{'<<'} Prev week</Text>
                        <Text style={{flex:1, textAlign:'center', color:'blue'}} onPress={() =>{changeMenuWeek(7)}}>Next week {'>>'}</Text>
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