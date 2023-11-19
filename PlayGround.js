import * as React from 'react'
import { Button } from 'react-native-paper'
import { DatePickerModal } from 'react-native-paper-dates'
import Moment from 'moment';
import integrate from './integration';

const PlayGround = ({ navigation }) => {
  const [visible, setVisible] = React.useState(false)
  const onDismiss = React.useCallback(() => {
    setVisible(false)
  }, [setVisible])

  const onChange = async ({ date }) => {
    setVisible(false)
    const dateFormat = 'YYYY-MM-DD'
    var selected_date = Moment(date).format(dateFormat);
    navigation.navigate('SetMenu', {
      menuDate: selected_date
    })
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
      <Button onPress={() => setVisible(true)}>
        Pick date
      </Button>
    </>
  )
}

export default PlayGround;