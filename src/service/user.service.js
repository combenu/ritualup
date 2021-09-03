import firebase from 'react-native-firebase'
import { GoogleSignin } from 'react-native-google-signin'
import { AccessToken, LoginManager } from 'react-native-fbsdk';

export default {
  createUserWithEmailAndPassword: (email, password) => firebase.auth().createUserWithEmailAndPassword(email, password),
  signInWithEmailAndPassword: (email, password) => firebase.auth().signInWithEmailAndPassword(email, password),
  signOut: () => firebase.auth().signOut(),
  signInWithGoogle: async () => {
    // add any configuration settings here:
    await GoogleSignin.configure();

    const data = await GoogleSignin.signIn();

    // create a new firebase credential with the token
    const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
    // login with credential
    const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);

    return firebaseUserCredential;
  },
  signInWithFacebook: async () => {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    if (result.isCancelled) {
      // handle this however suites the flow of your app
      throw new Error('User cancelled Facebook login'); 
    }

    console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);

    // get the access token
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      // handle this however suites the flow of your app
      throw new Error('Something went wrong obtaining the users access token');
    }

    // create a new firebase credential with the token
    const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);

    // login with credential
    const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);

    return firebaseUserCredential;
  }
}