import firebase from 'firebase/app';
import 'firebase/auth'; // This line is important
import 'firebase/firestore'; // This line is important
import 'firebase/storage'; 
import 'firebase/functions'; // This line is important
import 'firebase/database'; // This line is important


const config = {
	apiKey: "AIzaSyBayA4a2hh03CyrJdc7Mel8JsJRaWYLhBM",
  	authDomain: "gesthib-acda5.firebaseapp.com",
  	databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  	projectId: "gesthib-acda5",
  	storageBucket: "gesthib-acda5.appspot.com",
  	messagingSenderId: "YOUR_MESSAGING_SEND_ID"
}

const const_api = {
	db: null,	
	init(context) {
		this.context = context;
		firebase.initializeApp(config);
		this.db = firebase.firestore();		
	},
	getDb () {
		return this.db;
	},
	getUser() {
		return firebase.auth().currentUser;
	},
	getDate() {
		return firebase.firestore.FieldValue.serverTimestamp();
	}

}


export default {
  api: const_api
};