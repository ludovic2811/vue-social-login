import firebase from 'firebase/app';
import 'firebase/auth'; // This line is important
import 'firebase/firestore'; // This line is important
import 'firebase/storage'; 
import 'firebase/functions'; // This line is important
import 'firebase/database'; // This line is important
import  keys from '@/firebase/keys_firebase'

const config = keys.keys.config_prod;
const config_stripe = keys.keys.stripe_prod;

const const_api = {
	db: null,	
	init(context) {
		this.context = context;
		firebase.initializeApp(config);
		this.db = firebase.firestore();		
	},
	getConfigStripe() {
		return config_stripe;
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