import firebase from 'react-native-firebase'

export default {
  createUserWithEmailAndPassword: (username, password) =>
    firebase.auth().createUserWithEmailAndPassword(username, password),
  signInWithEmailAndPassword: (username, password) =>
    firebase.auth().signInWithEmailAndPassword(username, password),
  getGlobalEvents: (data, onGlobalEvents) => {
    console.log('[Event Service] Global Events requested.')
    let { ts, te } = data;
    firebase
      .database()
      .ref('/global/events')
      .orderByChild('eventTime')
      .startAt(ts)
      .endAt(te)
      .on('value', snap => {
        let list = []
        snap.forEach(item => {
          list.push(item.val())
        })
        onGlobalEvents(list)
      })
  },
  getPersonalEvents: () => {
    const uid = firebase.auth().currentUser.uid;
    const ref = firebase.database().ref(`/users/${uid}/events`)
    const data = ref.once('value')
    return data
  }
}
