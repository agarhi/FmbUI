import * as React from 'react'
import { Button } from 'react-native-paper'
import { DatePickerModal } from 'react-native-paper-dates'
import Moment from 'moment';
import integrate from './integration';

const PlayGround = ({navigation}) => {
  const [visible, setVisible] = React.useState(false)
  const [menuDate, setMenuDate] = React.useState('')
  const onDismiss = React.useCallback(() => {
    setVisible(false)
  }, [setVisible])

  const onChange = async ({ date }) => {
    setVisible(false)
    const dateFormat = 'YYYY-MM-DD'
    var selected_date = Moment(date).format(dateFormat);
    setMenuDate(selected_date)
    let menuData
    try {
      menuData = await integrate('GET', 'http://localhost:8080/fmbApi/menu/'+selected_date, null, null, true)  
      navigation.navigate('SetMenu', {
        menuData: menuData
      })
    } catch (error) {
        // TypeError: Failed to fetch
        console.log('There was an error', error);
    }
    console.log(menuData)
  }

  const date = new Date()

  return (
    <>
      <DatePickerModal
        mode="single"
        visible={visible}
        onDismiss={onDismiss}
        date={date}
        onConfirm={onChange}
        saveLabel="Save" // optional
        label="Select date" // optional
        animationType="slide" // optional, default is 'slide' on ios/android and 'none' on web
        locale='en-US'
      />
      <Button onPress={()=> setVisible(true)}>
        Pick date
      </Button>
    </>
  )
}

export default PlayGround;