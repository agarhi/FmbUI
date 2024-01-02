import { View, Text, StyleSheet } from 'react-native';
import Accordion from './Accordian';
import { useState, useEffect } from 'react';
import integrate from '../integration';

const ViewFeedbackScreen = ({navigation, route}) => {
    const qryString = route.params.qryString
    const [feedbackJson, setFeedbackJson] = useState({})
    const fetchData = async () => {
        const response = await integrate('GET', 'http://10.0.0.121:8080/fmbApi/feedback?'+qryString, null, null, true, navigation)
        setFeedbackJson(response)
        console.log(response)
    }

    /*const json = {
        "Masoor Daal, Chawal, Bhindi - 2023-12-10": [
            {
                "quality": "Extraordinary",
                "comment": "Ek straa o rdi naari",
                "username": "Murtaza Partapurwala",
                "its": "87654321"
            }
        ],
        "Homestyle Chicken Tarkari - 2023-12-06": [
            {
                "quality": "Satisfactory",
                "comment": "Shatish ki factory",
                "username": "Anonymous",
                "its": "Anonymous"
            }
        ],
        "Milad Imam Uz Zaman - 2023-12-11": [
            {
                "quality": "Satisfactory",
                "comment": "Hui hui mein mastt",
                "username": "Anonymous",
                "its": "Anonymous"
            },
            {
                "quality": "Satisfactory",
                "comment": "Hui hui mein mastt",
                "username": "Anonymous",
                "its": "Anonymous"
            },
            {
                "quality": "Satisfactory",
                "comment": "Hui hui mein mastt",
                "username": "Anonymous",
                "its": "Anonymous"
            },
            {
                "quality": "Disappointing",
                "comment": "This appointing",
                "username": "Ma'ad Garhi",
                "its": "5353535353"
            },
            {
                "quality": "Satisfactory",
                "comment": "Shatish one more facotry",
                "username": "Anonymous",
                "its": "Anonymous"
            }
        ],
        "Achari Gosht Pulao, Cucumber Raita - 2023-12-07": [
            {
                "quality": "Satisfactory",
                "comment": "Khaali Peeli",
                "username": "Anonymous",
                "its": "Anonymous"
            }
        ]
    }*/


    useEffect(() => {
        console.log(Object.keys(feedbackJson))
        fetchData()
    }, []);

    const testList = () => {
        let arr = []
        let keysArr = Object.keys(feedbackJson)
        for (let i = 0; i < keysArr.length; i++) {
            let key = keysArr[i]
            let valueArr = feedbackJson[key]
            console.log('key is ', key)
            console.log('feedbackJson[key]', feedbackJson[key])
            let contentArr = []
            let idx = 0
            contentArr.push(
                <View key={idx} style={styles.viewMain}>
                    <Text style={styles.header}>ITS</Text>
                    <Text style={styles.header}>Username</Text>
                    <Text style={styles.header}>Quality</Text>
                    <Text style={styles.header}>Comment</Text>
                </View>
            )
            for (let j = 0; j < valueArr.length; j++) {
                let innerJson = valueArr[j]
                contentArr.push(
                    <View key={j + 1} style={styles.viewMain}>
                        <Text style={styles.text}>{innerJson.its}</Text>
                        <Text style={styles.text}>{innerJson.username}</Text>
                        <Text style={styles.text}>{innerJson.quality}</Text>
                        <Text style={styles.text}>{innerJson.comment}</Text>
                    </View>
                )
            }
            arr.push(
                <Accordion key={i} title={key}
                    content={contentArr} />
            )
        }
        return arr
    }

    return (
        <View>
            {testList()}
        </View>
    );
}

const styles = StyleSheet.create({

header: { flex: 1, borderWidth: 1, borderColor: 'silver', padding: 5, fontWeight: 'bold' },
text: { flex: 1, borderWidth: 0.5, borderColor: 'silver', padding: 5 },
viewMain: { flexDirection: 'row', width: '80%' }
});

export default ViewFeedbackScreen;