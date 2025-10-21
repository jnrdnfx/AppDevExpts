import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyAgXaKatWVtPAk2oHVo9jd4hv8ZUFZZCtQ",
  authDomain: "todolistrn-e878f.firebaseapp.com",
  projectId: "todolistrn-e878f",
  storageBucket: "todolistrn-e878f.firebasestorage.app",
  messagingSenderId: "599063415703",
  appId: "1:599063415703:web:fe3864c19e63239ab0d2d2"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export const firestore = firebase.firestore();