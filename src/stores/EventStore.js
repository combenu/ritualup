import { observable, action, computed } from 'mobx';
import {
  Alert
} from 'react-native'

import LocalStorage from '../utils/LocalStorage';
import Theme from '../styles/theme.js'
import EVENTSERVICE from '../service/events.service'
import autobind from 'autobind-decorator'

@autobind
class EventStore {

  constructor() {
  }

  @action
  loadGlobalEvents(data, onGlobalEvents) {
    console.log('[EventStore] Global Events requested.')
    try {
      EVENTSERVICE.getGlobalEvents(data, onGlobalEvents)
    } catch(e) {
      console.error(e.message)
      Alert.alert(e.message)
    }
  }

  @action
  loadPersonalEvents() {
    return EVENTSERVICE.getPersonalEvents().then((resp)=>{
      console.log('Personal Events:', resp)
      return resp;
    }).catch((e) => {
      console.error(e.message)
      Alert.alert(e.message)
    })
  }
}

export default new EventStore()