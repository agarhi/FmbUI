import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { Box, FlatList, Center, NativeBaseProvider } from "native-base";
import DropDownPicker from 'react-native-dropdown-picker';
import { useState, useEffect } from 'react';
import Moment from 'moment';
import DateObject from "react-date-object";
import { Icon } from 'react-native-elements'
import Checkbox from 'expo-checkbox';
import SpInsModal from './SpInstruction'

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
  const [isLessCarbsSelected, setLessCarbsSelection] = useState(true);
  const [currMenuPgOffset, setCurrMenuPgOffset] = useState(0)
  const [reverseMenuPgOffset, setReverseCurrMenuPgOffset] = useState(0)
  const [isFetchMode, setFetchMode] = useState(false)
  const [postBody, setPostBody] = useState(null)
  const [userIdxChoice, setUserIdxChoice] = useState(0)
  const [daySelected, setDaySelected] = useState();
  const [lessRiceMap, setLessRiceMap] = useState({});
  const [weekInfo, setWeekInfo] = useState('');
  const [foodSizeValue, setFoodSizeValue] = useState('');
  const [rsvpAllPayloadMap, setRsvpAllPayloadMap] = useState({})
  const [noDataForTheWeek, setNoDataForTheWeek] = useState(false)
  const [openSpIns, setOpenSpIns] = useState(false)
  
  const verticalTabArr = []

  const fetchData = async () => { // Called on first render, when you click next or prev (fetchMode = false);;; and on rsvp change (fetchMode = true)
    console.log("ndftw ", noDataForTheWeek)
    if(!noDataForTheWeek) { // Do not fetch if last attempt was unsuccessful; if you don't do this even reverting offset will call useEffect and redo the whole fetch
      const requestOptions = {
        method: isFetchMode ? 'POST' : 'GET',
        headers: {  'Set-Cookie' : token },
        body: isFetchMode ? postBody : null
      };
      if(isFetchMode) {
        requestOptions.headers['Content-Type'] = 'application/json'
        requestOptions.headers['Accept'] = '*/*'
        requestOptions.headers['Content-Type'] = 'application/json;charset=UTF-8'
      }
      const url = "http://sfjamaat.org/sf/faiz/rsvp.php?date=&offset="+currMenuPgOffset
      console.log('Fetching data', url)
      console.log('Fetch mode', isFetchMode)
      let resp
      try {
        resp = await fetch(url, requestOptions);
      } catch (error) {
        // TypeError: Failed to fetch
        console.log('There was an error', error);
      }
      const data = await resp.json();
     if(data.data!=null) {
        let detailsData = data.data
        console.log('detailsData ', detailsData)
        var dateToday = new DateObject();
        
        var dateTodayInFormat = Moment(dateToday).format('ddd, DD');
        let currentDayIdx = 0;
  
        setCurrentMonth(Moment( detailsData[0].date).format('MMM')) // Month to be displayed in the top left of main view
        let rsvpTruStr = {"rsvp":true};
        for(let i = 0; i < detailsData.length; i++) {
          let menuDate = detailsData[i].date;
          rsvpAllPayloadMap[menuDate] = rsvpTruStr;
          // Get the index of current date in the data so we can show that date white
          const dayDtDt = Moment(menuDate).format('ddd, DD');
          if(currMenuPgOffset == 0 && dayDtDt == dateTodayInFormat) {
            currentDayIdx = i;
          }
  
          // menuItemMap is a dictionary that uses dates as keys and full menu object as values
          menuItemMap[dayDtDt] = detailsData[i];
          lessRiceMap[dayDtDt] = detailsData[i].lessRice == 1 ? true : false;
          // start forming the vertical tab array 
          let topRadius = 0, bottomRadius = 0;
          if(i == detailsData.length - 1) {
            bottomRadius = 15
          }
          let initialArrCurr = '{"id":'.concat(i).concat(',"color":"#e3e3e3","text":"'.concat(dayDtDt).concat('","topRadius":'.concat(topRadius).concat(',"bottomRadius":'.concat(bottomRadius).concat('}'))))
          verticalTabArr.push(JSON.parse(initialArrCurr))
        }
        // Just setting a bunch of state variables based on data received
        let idx = isFetchMode ? userIdxChoice : currentDayIdx
        verticalTabArr[idx].color = 'white'; // default day 
        setCurrMenuObj(menuItemMap[verticalTabArr[idx].text])
        setFoodSizeValue(menuItemMap[verticalTabArr[idx].text].size)
        setmenuItemMap(menuItemMap);
        setButtonData(verticalTabArr)
        setDaySelected(verticalTabArr[idx].text)
        setLoading(false);
        let weekInfo = Moment( detailsData[0].date).format('MMM').concat(verticalTabArr[0].text.split(',')[1].concat(' - ')).concat(Moment( detailsData[0].date).format('MMM')).concat(verticalTabArr[verticalTabArr.length-1].text.split(',')[1])
        console.log(weekInfo)
        setWeekInfo(weekInfo)
        setRsvpAllPayloadMap(rsvpAllPayloadMap)
        setNoDataForTheWeek(false)
     } else {
        alert(data.msg);
        setNoDataForTheWeek(true)
        setCurrMenuPgOffset(reverseMenuPgOffset)
     }
    }
    
   
  };

  useEffect(effectFunction = () => {
    fetchData();
  }, [currMenuPgOffset, postBody]);


const [buttonData, setButtonData] = useState([])

// Change the color of menu tab user taps on
const changeColor = (buttonInfo, index) =>(e) => {
    let newArrray = [] // You have to create a new object and set it for react to re-render
    for(let i = 0; i < buttonData.length; i++) {
      newArrray.push(buttonData[i])
      newArrray[i].color = '#e3e3e3'
    }
    newArrray[index].color = 'white'
    setCurrMenuObj(menuItemMap[newArrray[index].text])
    setFoodSizeValue(menuItemMap[newArrray[index].text].size)
    setButtonData(newArrray);
    setUserIdxChoice(index);
    setDaySelected(newArrray[index].text)
}

// Change menu view week
const changeMenuWeek = (offset) => {
  let oldMenuPgOffset = currMenuPgOffset + 0
  setReverseCurrMenuPgOffset(oldMenuPgOffset)
  let newMenuPgOffset = currMenuPgOffset + offset;
  setCurrMenuPgOffset(newMenuPgOffset)
  setFetchMode(false)
  setNoDataForTheWeek(false)
}

const checkboxClicked = () => {
  let postBody ='{"'.concat(currMenuObj.date).concat('":{"lessRice":'.concat(!lessRiceMap[daySelected])).concat('}}');
    console.log("postBody lessRice ", postBody)
    setPostBody(postBody)
    setFetchMode(true)
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
    console.log('"lessRice":'.concat(lessRiceMap[daySelected]))
    let postBody ='{"'.concat(currMenuObj.date).concat('":{"rsvp":'.concat(rsvpValue).concat(',"lessRice":'.concat(lessRiceMap[daySelected])).concat('}}'));
    console.log("postBody rsvp ", postBody)
    setPostBody(postBody)
    setFetchMode(true)
  }

  const onSizeChangeRsvp = (item) => {
    console.log("v ", item.value)
    let postBody ='{"'.concat(currMenuObj.date).concat('":{"size":"'.concat(item.value).concat('"}}'));
    console.log("pppppppppostBody size ", postBody)
    setPostBody(postBody)
    setFetchMode(true)
  }

  const onRsvpAll = () => {
    console.log('rsvp all body ', rsvpAllPayloadMap)
    let tempStr = rsvpAllPayloadMap
    setPostBody(JSON.stringify(tempStr))
    setFetchMode(true)
  }

    return (
        <View style={{flexDirection:'column', flex:1, backgroundColor: '#ecf0f1'}}>
          <View style={{flex:0.5}} />
          <View style={{flex:2.5, alignSelf:'center', borderWidth:0}}>
                <Image source={require('./images/FMB.png')}/>
             </View>
             <View style={{flex:0.2, width:'90%', alignSelf:'center', justifyContent:'center', flexDirection:'row'}}>
               <Text style={{flex:2, fontSize: 16, fontFamily:'Futura', marginLeft:15}}>{message}</Text>
               <Text style={{flex:1,fontSize: 14, fontFamily:'Futura', textAlign:'right', marginRight:15}}>{weekInfo}</Text>
             </View>
             <View style={{flexDirection:'row', flex:4.5, width:'90%', alignSelf:'center', marginTop:15}}>
                 <View style={{flex:1, marginRight: -1}}>
                 <View style={{backgroundColor:'#4c7031',  flex:1, padding: 15, borderTopLeftRadius:10, justifyContent:'center'}}>
                          <Text style={{fontSize:15, fontWeight:'bold', color:'white'}}>{currentMonth}</Text>
                  </View>
                    {buttonsListArr}
                 </View>
                 <View style={{backgroundColor: 'white', flex:5, borderTopRightRadius:15, borderBottomRightRadius:15}}>
                    <View style={{marginTop:20}}>
                      <Text style={{textAlign:'center', fontWeight: 'bold', fontSize: 18}}>{currMenuObj.details}</Text>
                      <Text>{"\n"}</Text>
                      <View style={{flexDirection:'row', alignItems:'center', zIndex:1, alignSelf:'center'}}>
                         <Text style={{ fontSize: 18}}>Size / Count   </Text>
                         <DropDownPicker placeholder='Size' containerStyle={{width: 100}} style={{zIndex:999}} 
                          open={open} value={foodSizeValue} 
                         items={foodSizeValues} setOpen={setOpen} setValue={setFoodSizeValue} 
                         setItems={setFoodSizeValues} 
                         onSelectItem={(value) => {
                            onSizeChangeRsvp(value) 
                        }} disabled={currMenuObj.readonly == 1 || currMenuObj.rsvp != 1}
                        />
                      </View>
                      <Text>{"\n"}</Text>
                      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                         <Checkbox disabled={currMenuObj.readonly == 1 || currMenuObj.rsvp != 1} value={lessRiceMap[daySelected]} onValueChange={checkboxClicked}/>
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
                        <Text style={styles.links} onPress={() => setOpenSpIns(true)} 
                          disabled={currMenuObj.readonly == 1 || currMenuObj.rsvp != 1}>View Instructions</Text>
                        <Text style={styles.links}>Provide Feedback</Text>
                      </View>
                      <SpInsModal openSpIns={openSpIns} onClose={()=> setOpenSpIns(false)} daySelected={daySelected}/>
                      <Text>{"\n"}</Text>
                      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                        <Text style={styles.links} onPress={() =>{changeMenuWeek(-7)}}>{'<<'} Prev week</Text>
                        <Text style={styles.links} onPress={() =>{changeMenuWeek(7)}}>Next week {'>>'}</Text>
                      </View>
                    </View>
                 </View>
             </View>
             <View style={{flex:0.4, width:'90%', alignSelf:'center', marginTop:10, marginLeft:15, flexDirection:'row', alignContent:'center'}}>
             <TouchableOpacity style={styles.navBarLeftButton} onPress={onRsvpAll}>
                <Icon name="view-week" />
                  <Text style={styles.buttonText}>  Rsvp Full Week</Text>
              </TouchableOpacity>
             </View>
             <View style={{flex:1}}></View>
        </View>
      
    );

}

var styles = StyleSheet.create({
  links: {
    flex:1,
    color:'#2b4257',
    fontWeight: 'bold',
    textAlign:'center'
  },
    daymenu: {
      height:250,
      backgroundColor: 'white',
      margin:5,
      borderRadius: 5,
      fontSize:40
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'stretch',
      height:25,
      marginTop:25,
      marginRight:5
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
        backgroundColor: '#4c7031',
        padding: 10,
        width:'30%',
        borderRadius:5
    },
    buttonDisabled: {
      alignItems: 'center',
      backgroundColor: '#4c7031',
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
    navBarLeftButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    buttonText: {
      fontSize: 18
    },
    html: {
      fontFamily:'Futura'
    }
  });

export default HomeGo;