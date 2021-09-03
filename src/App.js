import { Navigation } from 'react-native-navigation'
import firebase from 'react-native-firebase'
import { goToAuth, goToHome } from './Screens'
import LocalStorage from './utils/LocalStorage'
console.ignoredYellowBox = ['Remote debugger', 'Warning: isMounted(...) is deprecated']

export default class App {
  constructor() {
    Navigation.events().registerAppLaunchedListener(async () => {
      Navigation.setDefaultOptions({
        topBar: {
          visible: false,
          animate: false
        }
      })
      firebase.auth().onAuthStateChanged(user => {
        user ? goToHome() : goToAuth()
      })
    })

    // Create notification channel required for Android devices
    this.createNotificationChannel()

    // Ask notification permission and add notification listener
    this.checkPermission()
    this.createNotificationListeners()
    // this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
    //   // Process your token as required
    // });
  }

  createNotificationChannel = () => {
    // Build a android notification channel
    const channel = new firebase.notifications.Android.Channel(
      'reminder', // channelId
      'Reminders Channel', // channel name
      firebase.notifications.Android.Importance.High // channel importance
    ).setDescription('Used for getting reminder notification') // channel description

    // Create the android notification channel
    firebase.notifications().android.createChannel(channel)
  }

  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission()
    if (enabled) {
      // We've the permission
      this.getToken()
    } else {
      // user doesn't have permission
      this.requestPermission()
    }
  }

  getToken = async () => {
    let fcmToken = await LocalStorage.getItem('fcmToken')
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken()
      if (fcmToken) {
        console.log('Token: ', fcmToken)
        await LocalStorage.setItem('fcmToken', fcmToken)
      }
    }
  }

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission()
      this.getToken()
    } catch (error) {
      console.log('permission rejected')
    }
  }

  createNotificationListeners = async () => {
    firebase.notifications().onNotification(notification => {
      notification.android.setChannelId('insider').setSound('default')
      firebase.notifications().displayNotification(notification)
    })
  }
}
