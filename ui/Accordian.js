import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Accordion = ({ title, content }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={() => setExpanded(!expanded)} >
                <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>
            {expanded && <View style={styles.contentText}>{content}</View>}
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#4c7031',
        padding: 10,
        borderRadius: 15,
        margin: 10,
        width:'80%'
    },
    buttonText: { color: 'white', textAlign: 'left', paddingLeft: 10, fontWeight:'bold' },
    contentText: {paddingLeft:20}
});

export default Accordion;