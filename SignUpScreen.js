import { View, Text, StyleSheet, TextInput, TouchableOpacity, CheckBox } from 'react-native'
import { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import integrate from './integration';

const SignUpScreen = ({ route, navigation }) => {
    const its = route.params.its
    const [fnmae, setFname] = useState('');
    const [lnmae, setLname] = useState('');
    const [addr1, setAddr1] = useState('');
    const [addr2, setAddr2] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [userid, setUserid] = useState('');
    const [password, setPassword] = useState('');
    const [result, setResult] = useState('');
    const [open, setOpen] = useState(false);
    const [foodSizeValues, setFoodSizeValues] = useState([
        { label: 'XS', value: 'XS' },
        { label: 'S', value: 'S' },
        { label: 'M', value: 'M' },
        { label: 'L', value: 'L' },
        { label: 'XL', value: 'XL' }
    ]);
    const [foodSizeValue, setFoodSizeValue] = useState('');
    const [lessCarbsValue, setLessCarbsValue] = useState(false);

    const handleSubmit = async () => {
        let jsonObj = {}
        jsonObj['fname'] = fnmae
        jsonObj['lname'] = lnmae
        jsonObj['its'] = its
        jsonObj['addr1'] = addr1
        jsonObj['addr2'] = addr2
        jsonObj['city'] = city
        jsonObj['state'] = state
        jsonObj['country'] = country
        jsonObj['zip'] = zip
        jsonObj['email'] = email
        jsonObj['phone'] = phone
        jsonObj['userid'] = userid
        jsonObj['password'] = password
        jsonObj['size'] = foodSizeValue
        jsonObj['lessCarbs'] = lessCarbsValue

        if (fnmae == '' || lnmae == '' || its == '' || addr1 == '' ||
            addr2 == '' || city == '' || state == '' || country == '' ||
            zip == '' || email == '' || phone == '' || userid == '' || 
            password == '' || foodSizeValue == '') {
            setResult('All fields are necessary')
        } else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonObj)
            };
            requestOptions.headers['Accept'] = '*/*'
            requestOptions.headers['Content-Type'] = 'application/json;charset=UTF-8'

            const url = "http://10.0.0.121:8080/fmbApi/register"
            let data
            try {
                data = await integrate('POST', url, null, JSON.stringify(jsonObj), false, null)
            } catch (error) {
                // TypeError: Failed to fetch
                console.log('There was an error', error);
            }
            console.log('data ', data)
            setResult(data.status == 200 ? data.successMessage : data.errorMessage)
        }

    }

    return (
        <View style={{ flexDirection: 'column', marginTop: 30, borderWidth: 0, padding: 20, borderRadius: 15, backgroundColor: 'white', width: '90%', alignSelf: 'center' }}>
            <View style={{ alignSelf: 'center', marginBottom: 20, borderWidth: 0 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Thali Registration</Text>
                <Text style={{ fontSize: 17, textAlign: 'center', marginTop: 5, marginBottom: 5 }}>ITS: {its}</Text>
            </View>
            <View style={styles.columnItem}>
                <View style={{ flex: 1, borderWidth: 0 }}><Text style={styles.textContainer}>Name</Text></View>
                <View style={{ flex: 2, alignItems: 'left', flexDirection: 'row', borderWidth: 0 }}>
                    <TextInput style={styles.inputHalf} placeholder={'First'} onChangeText={(text) => { setFname(text) }} />
                    <TextInput style={styles.inputHalf} placeholder={'Last'} onChangeText={(text) => { setLname(text) }} />
                </View>
            </View>
            <View style={styles.columnItem}>
                <View style={{ flex: 1, borderWidth: 0 }}><Text style={styles.textContainer}>Addr Line 1</Text></View>
                <View style={{ flex: 2, alignItems: 'left', borderWidth: 0 }}><TextInput style={styles.input} placeholder={'Addr Line 1'} onChangeText={(text) => { setAddr1(text) }} /></View>
            </View>
            <View style={styles.columnItem}>
                <View style={{ flex: 1, borderWidth: 0 }}><Text style={styles.textContainer}>Addr Line 2</Text></View>
                <View style={{ flex: 2, alignItems: 'left', borderWidth: 0 }}><TextInput style={styles.input} placeholder={'Addr Line 2'} onChangeText={(text) => { setAddr2(text) }} /></View>
            </View>
            <View style={styles.columnItem}>
                <View style={{ flex: 1, borderWidth: 0 }}><Text style={styles.textContainer}>City</Text></View>
                <View style={{ flex: 2, alignItems: 'left', flexDirection: 'row', borderWidth: 0 }}>
                    <TextInput style={styles.inputHalf} placeholder={'City'} onChangeText={(text) => { setCity(text) }} />
                    <TextInput style={styles.inputHalf} placeholder={'State'} onChangeText={(text) => { setState(text) }} />
                </View>
            </View>
            <View style={styles.columnItem}>
                <View style={{ flex: 1, borderWidth: 0 }}><Text style={styles.textContainer}>Country</Text></View>
                <View style={{ flex: 2, alignItems: 'left', flexDirection: 'row', borderWidth: 0 }}>
                    <TextInput style={styles.inputHalf} placeholder={'Zip'} keyboardType="numeric" onChangeText={(text) => { setZip(text) }} />
                    <TextInput style={styles.inputHalf} placeholder={'Country'} onChangeText={(text) => { setCountry(text) }} />
                </View>
            </View>
            <View style={styles.columnItem}>
                <View style={{ flex: 1, borderWidth: 0 }}><Text style={styles.textContainer}>Phone</Text></View>
                <View style={{ flex: 2, alignItems: 'left', borderWidth: 0 }}><TextInput style={styles.input} placeholder={'Phone'} onChangeText={(text) => { setPhone(text) }} /></View>
            </View>
            <View style={styles.columnItem}>
                <View style={{ flex: 1, borderWidth: 0 }}><Text style={styles.textContainer}>Email</Text></View>
                <View style={{ flex: 2, alignItems: 'left', borderWidth: 0 }}><TextInput style={styles.input} placeholder={'Email'} onChangeText={(text) => { setEmail(text) }} /></View>
            </View>
            <View style={styles.columnItem}>
                <View style={{ flex: 1, borderWidth: 0 }}><Text style={styles.textContainer}>Preference</Text></View>
                <View style={{ flex: 2, alignItems: 'left', flexDirection: 'row', borderWidth: 0, paddingBottom:10 }}>
                    <DropDownPicker placeholder='Size' containerStyle={{ width: 120 }} style={{ zIndex: 999,paddingHorizontal: 5, minHeight: 35, width:100 }}
                        open={open} value={foodSizeValue}
                        items={foodSizeValues} setOpen={setOpen} setValue={setFoodSizeValue}
                        setItems={setFoodSizeValues}
                    />
                    <CheckBox style={{alignSelf:'center', marginLeft:-10 }} disabled={false} onValueChange={setLessCarbsValue} value={lessCarbsValue} />
                    <Text style={{ textAlign: 'center', fontSize: 11, alignSelf:'center'}}> No rice/bread</Text>
                </View>
            </View>
            <View style={styles.columnItem}>
                <View style={{ flex: 1, borderWidth: 0 }}><Text style={styles.textContainer}>Credentials</Text></View>
                <View style={{ flex: 2, alignItems: 'left', flexDirection: 'row', borderWidth: 0 }}>
                    <TextInput style={styles.inputHalf} placeholder={'Userid'} onChangeText={(text) => { setUserid(text) }} />
                    <TextInput style={styles.inputHalf} placeholder={'Password'} onChangeText={(text) => { setPassword(text) }} />
                </View>
            </View>
            <View style={{ alignSelf: 'center', marginBottom: 20, borderWidth: 0 }}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={{ color: 'white', width: 70, textAlign: 'center' }}>Submit</Text>
                </TouchableOpacity>
            </View>
            <View style={{ alignSelf: 'center', marginBottom: 0, borderWidth: 0 }}>
                <Text style={{ color: 'red' }}>{result}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 200
    },
    textContainer: {
        textAlign: 'right',
        marginRight: 25
    },
    columnItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0
    },
    logincontainer: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        padding: 20,
        backgroundColor: '#ecf0f1',
        width: '65%',
        borderRadius: 15,
        backgroundColor: 'white',
        marginTop: 15

    },
    logincontainerWithTopMargin: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        padding: 20,
        paddingTop: 40,
        backgroundColor: '#ecf0f1',
        width: '65%',
        borderRadius: 15,
        backgroundColor: 'white',
        marginTop: 15
    },
    input: {
        width: 200,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
    },
    inputHalf: {
        width: 97,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
        marginRight: 6
    },
    inputThird: {
        width: 63,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
        marginRight: 6
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#4c7031',
        padding: 10,
        borderRadius: 5,
        marginTop: 10
    },
    link: {
        alignItems: 'center',
        marginTop: 15
    },
});


export default SignUpScreen;