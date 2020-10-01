import firebase_api from "@/firebase/firebase_api"; 
const subscription_api = {

    publishableKey: "pk_test_kQiRzTlrywDt8BOeiBzUmAlQ00yblSzSdQ", 
    getSubscription (idUser, fct) {
        var db = firebase_api.api.getDb();
        db.collection("subscription").doc(idUser).get().then(doc=>{
            if (doc.exists) {
                var sub = doc.data();
                var subscription = {
                    status: sub.subscription.status,
                    product: {}
                }
                sub.productRef.get().then(product=>{
                    subscription.product = product.data();
                    fct(subscription);
                })
            }
            else   
                fct("");
        })
    },
    getSubscriptionByAgence(agence, fct) {
        this.getSubscription(agence.userIdCreated, data=>{
            fct(data);
        });
    },
    subscribe(idUser, priceId, success_url, cancel_url) {
        firebase_api.api.getDb()
          .collection('customers')
          .doc(idUser)
          .collection('checkout_sessions')
          .add({
            price: priceId,
            allow_promotion_codes: false,
            tax_rates: ["txr_1HS421JfciPMt21YRL05Z30z"],
            success_url: success_url,
            cancel_url: cancel_url
          }).then(docRef=>{
            docRef.onSnapshot(snap=>{
               
               const { error, sessionId } = snap.data();
               if (error) {
                  // Show an error to your customer and then inspect your function logs.
                  console.log("An error occured: "+error.message);
               }
               if (sessionId) {
                // We have a session, let's redirect to Checkout
                // Init Stripe
                const stripe = Stripe(this.publishableKey);
                
                //stripe.redirectToCheckout({ sessionId });
                stripe.redirectToCheckout({
                    sessionId
                  })
                  .then((result)=> {
                      // If `redirectToCheckout` fails due to a browser or network
                      // error, display the localized error message to your customer
                      // using `result.error.message`.
                      
                  });
              }
            });
          })
      },
      getProducts (fct) {
        firebase_api.api.getDb().collection('products')
          .where('active', '==', true)
          .get()
          .then((querySnapshot) =>{
               querySnapshot.forEach((doc)=> {
                  var element = {};
                  element.description = doc.data().description;
                  element.nom = doc.data().name;
                  element.image = doc.data().images[0];
                  doc.ref.collection("prices").get().then(priceSnap=>{
                      priceSnap.docs.forEach(docPrice=>{
                          element.priceId = docPrice.id;
                          element.price = docPrice.data();
                          fct(element);
                      })
                  })
               })
          })
      },
      callPortailStrip() {
        var subscription = firebase
          .app()
          .functions("europe-west1")
          .httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink');
        subscription(
              { returnUrl: window.location.origin }
          )
          .then(function(result) {
             window.location.assign(result.data.url);
          })
          .catch(function(err) {
              console.log("Inside sendPushNotification error: " + err);
              console.log("Inside sendPushNotification error: " + JSON.stringify(err));
          })
          
      }
    } // END METHODS

export default {
    api: subscription_api
};