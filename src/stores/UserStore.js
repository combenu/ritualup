import { observable, action, computed } from 'mobx';
import {
  Alert
} from 'react-native'
import { statusCodes } from 'react-native-google-signin'

import LocalStorage from '../utils/LocalStorage';
import Theme from '../styles/theme.js'
import USERSERVICE from '../service/user.service'
import autobind from 'autobind-decorator'

@autobind
class UserStore {
  @observable _userId = '';
  @observable _user = {};
  @observable loggedIn = false;

  constructor() {
  }

  @action
  register(email, password) {
    return USERSERVICE.createUserWithEmailAndPassword(email, password).then((resp)=>{
      if (resp.user) {
        this.user = resp.user
      }
    }).catch((e) => {
      Alert.alert(e.message)
    })
  }

  @action
  login(email, password) {
    return USERSERVICE.signInWithEmailAndPassword(email, password).then((resp) => {
      if (resp.user) {
        this.user = resp.user
        this.loggedIn = true
        return true
      }
      return false
    }).catch((e) => {
      console.error(e)
      Alert.alert(e.message)
    })
  }

  @action
  logout() {
    return USERSERVICE.signOut().then((resp) => {
      this.user = {}
      this.loggedIn = false
    }).catch((e) => {
      Alert.alert(e.message)
    })
  }

  @action
  async loginWithGoogle() {
    try {
      const resp = await USERSERVICE.signInWithGoogle()
      if (resp.user) {
        this.user = resp.user
        return true
      }
    } catch(e) {
      console.log('error:', e);
      if (e.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        Alert.alert('User cancelled the login flow')
      } else if (e.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
        Alert.alert('Operation (f.e. sign in) is in progress already')
      } else if (e.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        Alert.alert('Play services not available or outdated')
      } else {
        Alert.alert('User cancelled the login flow')
      }
    }
    return false
  }

  @action
  async loginWithFacebook() {
    try {
      const resp = await USERSERVICE.signInWithFacebook()
      if (resp.user) {
        this.user = resp.user
        return true
      }
    } catch(e) {
      Alert.alert(e.message)
    }
    return false
  }

  @computed
  get userId() {
    return this._userId === '' ? false : this._userId
  }

  @computed
  get user() {
    return this._user || {}
  }
  set user(user) {
    this._user = user
  }
}

export default new UserStore()