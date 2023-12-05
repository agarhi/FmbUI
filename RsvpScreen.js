import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, ScrollView } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { useState, useEffect } from 'react';
import Moment from 'moment';
import DateObject from "react-date-object";
import { Icon } from 'react-native-elements'
import Checkbox from 'expo-checkbox';
import SpInsModalScreen from './SpInstructionScreen'
import FeedbackModalScreen from './FeedbackModalScreen'
import moment from "moment";
import integrate from './integration';


const RsvpScreen = ({ route, navigation }) => {
    const welcomeMessage = route.params.welcomeMessage
    const userId = route.params.userId
    console.log('welcomeMessage ', welcomeMessage)
    const [open, setOpen] = useState(false);
    const [foodSizeValues, setFoodSizeValues] = useState([
        { label: 'X Small', value: 'XS' },
        { label: 'Small', value: 'S' },
        { label: 'Medium', value: 'M' },
        { label: 'Large', value: 'L' },
        { label: 'X Large', value: 'XL' }
    ]);

    const [menuItemMap, setmenuItemMap] = useState({});
    const [currentMonth, setCurrentMonth] = useState('');
    const [currMenuObj, setCurrMenuObj] = useState('')
    const [currMenuPgOffset, setCurrMenuPgOffset] = useState(0)
    const [reverseMenuPgOffset, setReverseCurrMenuPgOffset] = useState(0)
    const [isPostMode, setPostMode] = useState(false)
    const [postModeUrl, setPostModeUrl] = useState('')
    const [postBody, setPostBody] = useState(null)
    const [userIdxChoice, setUserIdxChoice] = useState(0)
    const [daySelected, setDaySelected] = useState();
    const [lessRiceMap, setLessRiceMap] = useState({});
    const [weekInfo, setWeekInfo] = useState('');
    const [foodSizeValue, setFoodSizeValue] = useState('');
    const [rsvpAllPayloadMap, setRsvpAllPayloadMap] = useState([])
    const [rsvpCancelAllPayloadMap, setRsvpCancelAllPayloadMap] = useState([])
    const [noDataForTheWeek, setNoDataForTheWeek] = useState(false)
    const [openSpInsModal, setOpenSpInsModal] = useState(false)
    const [openFeedbackModal, setOpenFeedbackModal] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [dataCache, setDataCache] = useState({});

    const fetchData = async () => { // Called on first render, when you click next or prev (fetchMode = false);;; and on rsvp change (fetchMode = true)
        let method = isPostMode ? 'PUT' : 'GET'
        let url = isPostMode ? postModeUrl : "http://10.0.0.121:8080/fmbApi/rsvp/" + currMenuPgOffset
        let body = isPostMode ? postBody : null
        let headers = {}
        if (isPostMode) {
            headers['Content-Type'] = 'application/json'
        }
        console.log('Fetch url ', url)
        console.log('Post mode', isPostMode)
        let detailsData
        if (!isPostMode && dataCache[currMenuPgOffset] != null) {
            detailsData = dataCache[currMenuPgOffset]
            console.log('Fetched from cache')
        } else {
            try {
                detailsData = await integrate(method, url, headers, body, true, navigation)
                console.log('detailsDatadetailsData ', JSON.stringify(detailsData))
            } catch (error) {
                // TypeError: Failed to fetch
                console.log('There was an error', error);
            }
        }

        if (detailsData && detailsData.length > 0) {

            console.log('detailsData ', detailsData, ' ', new Date())
            dataCache[currMenuPgOffset] = detailsData
            var dateToday = new DateObject();

            var dateTodayInFormat = Moment(dateToday).format('ddd, DD');
            let currentDayIdx = 0;

            setCurrentMonth(Moment(detailsData[0].date).format('MMM')) // Month to be displayed in the top left of main view
            let rsvpTruStr = { "rsvp": true };
            let rsvpFalsStr = { "rsvp": false };
            let verticalTabArr = []
            for (let i = 0; i < detailsData.length; i++) {
                let menuDate = detailsData[i].date;
                if (isAfterToday(menuDate)) {
                    if (!detailsData[i].rsvp) {
                        rsvpAllPayloadMap.push(detailsData[i].menuRsvp.menu.id);
                    } else {
                        rsvpCancelAllPayloadMap.push(detailsData[i].menuRsvp.menu.id);
                    }

                }
                // Get the index of current date in the data so we can show that date white
                const dayDtDt = Moment(menuDate).format('ddd, DD');
                if (currMenuPgOffset == 0 && dayDtDt == dateTodayInFormat) {
                    currentDayIdx = i;
                }

                // menuItemMap is a dictionary that uses dates as keys and full menu object as values
                menuItemMap[dayDtDt] = detailsData[i];
                lessRiceMap[dayDtDt] = detailsData[i].menuRsvp.lessCarbs;
                // start forming the vertical tab array 
                let topRadius = 0, bottomRadius = 0;
                if (i == detailsData.length - 1) {
                    bottomRadius = 10
                }

                let initialArrCurr = '{"id":'.concat(i).concat(',"color":"#e3e3e3","text":"'.concat(dayDtDt).concat('","topRadius":'.concat(topRadius).concat(',"bottomRadius":'.concat(bottomRadius).concat('}'))))
                verticalTabArr.push(JSON.parse(initialArrCurr))
            }
            console.log('menuItemMap ', menuItemMap);
            console.log('verticalTabArr ', verticalTabArr);
            // Just setting a bunch of state variables based on data received
            let idx = isPostMode ? userIdxChoice : currentDayIdx
            setUserIdxChoice(idx)
            verticalTabArr[idx].color = 'white'; // default day 
            setCurrMenuObj(menuItemMap[verticalTabArr[idx].text])
            console.log('currMenuObj ', menuItemMap[verticalTabArr[idx].text])
            console.log('foodSizeValue ', menuItemMap[verticalTabArr[idx].text].menuRsvp.size)
            setFoodSizeValue(menuItemMap[verticalTabArr[idx].text].menuRsvp.size)
            setmenuItemMap(menuItemMap);
            setButtonData(verticalTabArr)
            setDaySelected(verticalTabArr[idx].text)
            let weekInfo = Moment(detailsData[0].date).format('MMM').concat(verticalTabArr[0].text.split(',')[1].concat(' - ')).concat(Moment(detailsData[0].date).format('MMM')).concat(verticalTabArr[verticalTabArr.length - 1].text.split(',')[1])
            setWeekInfo(weekInfo)
            setRsvpAllPayloadMap(rsvpAllPayloadMap)
            setNoDataForTheWeek(false)
            setIsLoading(false);
        } else {
            if(!isPostMode) alert('Menu not set for next week')
            setNoDataForTheWeek(true)
            setCurrMenuPgOffset(reverseMenuPgOffset)
        }
    };

    useEffect(() => {
        fetchData();
    }, [currMenuPgOffset, postBody]);


    const [buttonData, setButtonData] = useState([])

    // Change the color of menu tab user taps on
    const changeMenuDay = (buttonInfo, index, isNextNav) => (e) => {
        if (isNextNav && index >= buttonData.length) {
            changeMenuWeek(1)
        } else if (isNextNav && index == -1) {
            changeMenuWeek(-1)
        }
        else {
            let newArrray = [] // You have to create a new object and set it for react to re-render
            for (let i = 0; i < buttonData.length; i++) {
                newArrray.push(buttonData[i])
                newArrray[i].color = '#e3e3e3'
            }
            newArrray[index].color = 'white'
            setCurrMenuObj(menuItemMap[newArrray[index].text])
            setFoodSizeValue(menuItemMap[newArrray[index].text].menuRsvp.size)
            setButtonData(newArrray);
            setUserIdxChoice(index);
            setDaySelected(newArrray[index].text)
        }
    }

    // Change menu view week
    const changeMenuWeek = (offset) => {
        let oldMenuPgOffset = currMenuPgOffset + 0
        setReverseCurrMenuPgOffset(oldMenuPgOffset)
        let newMenuPgOffset = currMenuPgOffset + offset;
        setCurrMenuPgOffset(newMenuPgOffset)
        setPostMode(false)
        setIsLoading(true)
        setNoDataForTheWeek(false)
    }

    const buttonsListArr = buttonData.map((buttonInfo, index) =>
    (
        <TouchableOpacity style={{
            backgroundColor: buttonInfo.color, padding: 15,
            borderTopLeftRadius: buttonInfo.topRadius, borderBottomLeftRadius: buttonInfo.bottomRadius,
            justifyContent: 'center', width: 70, height: 60
        }}
            onPress={changeMenuDay(buttonInfo, index, false)} key={buttonInfo.id}>
            <Text style={{ fontSize: 10 }}>{buttonInfo.text}</Text>
        </TouchableOpacity>
    ));

    const onRsvpPress = () => {
        let postBody = '{"userId":' + userId + ',"menuIds":[' + currMenuObj.menuRsvp.menu.id + '], "offset":' + currMenuPgOffset + ',"choice":' + !currMenuObj.rsvp + '}';
        console.log("postBody rsvp ", postBody)
        setRsvpAllPayloadMap([])
        setRsvpCancelAllPayloadMap([])
        setPostBody(postBody)
        setPostMode(true)
        setPostModeUrl("http://10.0.0.121:8080/fmbApi/rsvp")
        setIsLoading(true)
    }

    const onRsvpAll = () => {
        let menuIds = '[' + rsvpAllPayloadMap.toString() + ']'
        let postBodyRsvpAll = '{"userId":' + userId + ',"menuIds":' + menuIds + ', "offset":' + currMenuPgOffset + ',"choice":true}';
        console.log('rsvp all body ', postBodyRsvpAll)
        setPostBody(postBodyRsvpAll)
        setPostMode(true)
        setPostModeUrl("http://10.0.0.121:8080/fmbApi/rsvp")
        setIsLoading(true)
        setRsvpAllPayloadMap([])
    }

    const onRsvpCancelAll = () => {
        let menuIds = '[' + rsvpCancelAllPayloadMap.toString() + ']'
        let postBodyRsvpAll = '{"userId":' + userId + ',"menuIds":' + menuIds + ', "offset":' + currMenuPgOffset + ',"choice":false}';
        console.log('rsvp all body ', postBodyRsvpAll)
        setPostBody(postBodyRsvpAll)
        setPostMode(true)
        setPostModeUrl("http://10.0.0.121:8080/fmbApi/rsvp")
        setIsLoading(true)
        setRsvpCancelAllPayloadMap([])
    }

    const onSizeChangeRsvp = (item) => {
        let postBodySizeChange = '{"userId":' + userId + ',"menuId":' + currMenuObj.menuRsvp.menu.id + ', "offset":' + currMenuPgOffset + ',"size":"' + item.value + '"}';
        console.log("pppppppppostBody size ", postBodySizeChange)
        setPostBody(postBodySizeChange)
        setPostMode(true)
        setPostModeUrl("http://10.0.0.121:8080/fmbApi/rsvp/size")
        setIsLoading(true)
    }

    const onCarbsChangeRsvp = () => {
        let postBodyCarbsChange = '{"userId":' + userId + ',"menuId":' + currMenuObj.menuRsvp.menu.id + ', "offset":' + currMenuPgOffset + ',"lessCarbsChoice":' + !lessRiceMap[daySelected] + '}';
        console.log("postBody lessRice ", postBodyCarbsChange)
        setPostBody(postBodyCarbsChange)
        setPostMode(true)
        setPostModeUrl("http://10.0.0.121:8080/fmbApi/rsvp/carbs")
        setIsLoading(true)
    }

    const isRsvpDisabled = (currMenuObj) => {
        return currMenuObj.menuRsvp.menu.readonly || !currMenuObj.rsvp
    }

    const isFormInteractionEnabled = (currMenuObj) => {
        return isRsvpAllowedForDate(currMenuObj) && currMenuObj.rsvp
    }

    const isRsvpAllowedForDate = (currMenuObj) => {
        return isAfterToday(currMenuObj.date)
    }

    const isFeedbackDisabled = (currMenuObj) => {
        return isAfterToday((menuItemMap[daySelected]).date)
    }

    const isInstructionsDisabled = (currMenuObj) => {
        return isBeforeToday((menuItemMap[daySelected]).date)
    }

    const isAfterToday = (selectedDate) => {
        const dateFormat = 'YYYY-MM-DD'
        var selected_date = Moment(selectedDate).format(dateFormat);
        var today_date = Moment(new DateObject()).format(dateFormat);
        return moment(selected_date).isAfter(moment(today_date))
    }

    const isBeforeToday = (selectedDate) => {
        const dateFormat = 'YYYY-MM-DD'
        var selected_date = Moment(selectedDate).format(dateFormat);
        var today_date = Moment(new DateObject()).format(dateFormat);
        return moment(selected_date).isBefore(moment(today_date))
    }

    const openMenu = () => { }
    const openProfile = () => {
        navigation.navigate("Profile")
    }

    return (
        <View style={{ flexDirection: 'column', flex: 1 }}>

            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <ScrollView>
                    <View style={{
                        flexDirection: 'column',
                        width: Platform.OS === 'web' ? '40%' : '90%',
                        alignSelf: 'center'
                    }}>
                        <View style={{ flexDirection: 'row', alignSelf: 'center', borderWidth: 0, marginTop: 10, width: '100%' }}>
                            <View style={{ flex: 1, borderWidth: 0 }}>
                                <TouchableOpacity style={styles.burger} onPress={openMenu}>
                                    <Icon name="menu" size={25} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1, borderWidth: 0 }}><Image style={{ width: 170, height: 170 }} source={require('./images/FMB.png')} /></View>
                            <View style={{ flex: 1, borderWidth: 0 }}>
                                <TouchableOpacity style={styles.person} onPress={openProfile}>
                                    <Icon name="person" size={25} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ width: '100%', alignSelf: 'center', justifyContent: 'center', flexDirection: 'row', borderWidth: 0 }}>
                            <Text style={{ flex: 2, fontSize: 16, fontFamily: 'Futura', marginLeft: 15 }}>{welcomeMessage}</Text>
                            <Text style={{ flex: 1, fontSize: 14, fontFamily: 'Futura', textAlign: 'right', marginRight: 15 }}>{weekInfo}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row', marginTop: 15,
                            borderRadius: 10,
                            shadowColor: '#171717',
                            shadowOffset: { width: -2, height: 4 },
                            shadowOpacity: 0.2,
                            shadowRadius: 3
                        }}>
                            <View style={{ marginRight: -1 }}>
                                <View style={{ width: 70, height: 60, backgroundColor: '#4c7031', padding: 15, borderTopLeftRadius: 10, justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white', }}>{currentMonth}</Text>
                                </View>
                                {buttonsListArr}
                            </View>
                            <View style={{ backgroundColor: 'white', flex: 5, flexDirection: 'column', borderTopRightRadius: 15, borderBottomRightRadius: 15, paddingTop: 20, borderWidth: 0 }}>
                                <View style={{ flex: 1, borderWidth: 0 }}>
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>{currMenuObj.menuRsvp.menu.item}</Text>
                                </View>
                                <View style={!isFormInteractionEnabled(currMenuObj) ? styles.dropDisabled : styles.drop}>
                                    <Text style={{ fontSize: 18 }}>Size / Count   </Text>
                                    <DropDownPicker placeholder='Size' containerStyle={{ width: 120 }} style={{ zIndex: 999 }}
                                        open={open} value={foodSizeValue}
                                        items={foodSizeValues} setOpen={setOpen} setValue={setFoodSizeValue}
                                        setItems={setFoodSizeValues}
                                        onSelectItem={(value) => {
                                            onSizeChangeRsvp(value)
                                        }} disabled={!isFormInteractionEnabled(currMenuObj)}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ flex: 1, borderWidth: 0 }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', marginLeft: 5 }} onPress={changeMenuDay(null, userIdxChoice - 1, true)}>
                                            <Icon style={{ borderWidth: 0 }} name="arrow-left" color="#2b4257" size={28} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={!isFormInteractionEnabled(currMenuObj) ? styles.checkDisabled : styles.check}>
                                        <Checkbox disabled={!isFormInteractionEnabled(currMenuObj)} value={lessRiceMap[daySelected]} onValueChange={onCarbsChangeRsvp} />
                                        <Text style={{ textAlign: 'center', fontSize: 18 }}>   No rice / bread</Text>
                                    </View>
                                    <View style={{ flex: 1, borderWidth: 0 }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', marginRight: 5 }} onPress={changeMenuDay(null, userIdxChoice + 1, true)}>
                                            <Icon style={{ borderWidth: 0 }} name="arrow-right" color="#2b4257" size={28} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity style={!isRsvpAllowedForDate(currMenuObj) ? styles.buttonDisabled : styles.button} onPress={onRsvpPress} disabled={!isRsvpAllowedForDate(currMenuObj)}>
                                        <Text style={{ color: 'white' }}>{currMenuObj.rsvp ? 'Yes' : 'No'}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={isInstructionsDisabled(currMenuObj) ? styles.linksDisabled : styles.links} onPress={() => setOpenSpInsModal(true)}
                                        disabled={isInstructionsDisabled(currMenuObj)}>View Instructions</Text>
                                    <Text style={isFeedbackDisabled(currMenuObj) ? styles.linksDisabled : styles.links} onPress={() => setOpenFeedbackModal(true)}
                                        disabled={isFeedbackDisabled(currMenuObj)}>Provide Feedback</Text>
                                </View>
                                <SpInsModalScreen openSpInsModal={openSpInsModal} onClose={() => setOpenSpInsModal(false)} daySelected={daySelected} fullMenuDate={currMenuObj.date} />
                                <FeedbackModalScreen openFeedbackModal={openFeedbackModal} onClose={() => setOpenFeedbackModal(false)}
                                    daySelected={daySelected} menuItem={currMenuObj.item}
                                    beneficiary={welcomeMessage} />
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <View style={{ flex: 2, flexDirection: 'row', borderWidth: 0 }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', position: 'absolute', right: 5 }} onPress={() => { changeMenuWeek(-1) }}>
                                            <Icon style={{ borderWidth: 0 }} name="arrow-left" size={20} />
                                            <Text style={styles.nextPrev}>Prev week</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1 }}></View>
                                    <View style={{ flex: 2 }}>
                                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { changeMenuWeek(1) }}>
                                            <Text style={styles.nextPrev}>Next week</Text>
                                            <Icon name="arrow-right" size={20} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ width: '100%', borderWidth: 0, alignSelf: 'center', marginTop: 30, marginLeft: 10, flexDirection: 'row', alignContent: 'center' }}>
                            <TouchableOpacity style={styles.navBarLeftButton} onPress={onRsvpAll}>
                                <Icon name="star-half" size={20} />
                                <Text style={styles.buttonText}>  Rsvp for rest of the week</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '100%', borderWidth: 0, alignSelf: 'center', marginTop: 20, marginLeft: 10, flexDirection: 'row', alignContent: 'center' }}>
                            <TouchableOpacity style={styles.navBarLeftButton} onPress={onRsvpCancelAll}>
                                <Icon name="cancel" size={20} />
                                <Text style={styles.buttonText}>  Cancel rsvp for rest of the week</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

            )}
        </View>
    );

}

var styles = StyleSheet.create({
    links: {
        flex: 1,
        color: '#2b4257',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    linksDisabled: {
        flex: 1,
        color: '#2b4257',
        fontWeight: 'bold',
        textAlign: 'center',
        opacity: 0.5
    },
    daymenu: {
        height: 250,
        backgroundColor: 'white',
        margin: 5,
        borderRadius: 5,
        fontSize: 40
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'stretch',
        height: 25,
        marginTop: 25,
        marginRight: 5
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
        width: '30%',
        borderRadius: 5
    },
    buttonDisabled: {
        alignItems: 'center',
        backgroundColor: '#4c7031',
        opacity: 0.5,
        padding: 10,
        width: '30%',
        borderRadius: 5
    },
    text: {
        color: 'white'
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
        fontFamily: 'Futura'
    },
    burger: {
        position: 'absolute',
        top: 10,
        left: 20
    },
    person: {
        position: 'absolute',
        top: 10,
        right: 20
    },
    nextPrev: { borderWidth: 0, marginTop: 2, fontWeight: 'bold', color: '#2b4257' },
    check: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 0 },
    checkDisabled: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 0, opacity: 0.5 },
    drop: { flexDirection: 'row', flex: 1, alignItems: 'center', zIndex: 1, alignSelf: 'center' },
    dropDisabled: { flexDirection: 'row', flex: 1, alignItems: 'center', zIndex: 1, alignSelf: 'center', opacity: 0.5 },
});

export default RsvpScreen;