const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
exports.createClient = 
    functions.region('europe-west1')
        .firestore.document("agence/{agenceId}/clients/{clientId}").onCreate((change, context) => {
            return db.collection("agence").doc(context.params.agenceId).get().then(agence=>{
               return db.collection("subscription").doc(agence.data().userIdCreated).get().then(subscription=>{
                   if (subscription.exists) {
                        var nbClients = parseInt(subscription.data().nbClients) + 1;
                        db.collection("subscription").doc(agence.data().userIdCreated).update({
                            nbClients: nbClients
                        }).then(()=>{
                            return "ok"
                        })
                    }
                })
            })
        })
exports.deleteClient = 
        functions.region('europe-west1')
            .firestore.document("agence/{agenceId}/clients/{clientId}").onDelete((change, context) => {
                return db.collection("agence").doc(context.params.agenceId).get().then(agence=>{
                    return db.collection("subscription").doc(agence.data().userIdCreated).get().then(subscription=>{
                        if (subscription.exists) {
                            var nbClients =  parseInt(subscription.data().nbClients) - 1;
                            db.collection("subscription").doc(agence.data().userIdCreated).update({
                                nbClients: nbClients
                            }).then(()=>{
                                return "ok"
                            })
                        }
                    })
                })
            })
exports.updateSubscription = 
    functions.region('europe-west1')
        .firestore.document('customers/{customerId}/subscriptions/{subscriptionId}').onWrite((change, context)=>{
            var dataSubscription = change.after.data();
            var idCustomer = context.params.customerId;

            //Search Product 
            if (typeof(dataSubscription) != "undefined") {
                return dataSubscription.price.get().then(docPrice=>{
                    return docPrice.ref.parent.parent.get().then(docParent=>{
                        var productRef = docParent.ref;
                        return db.collection("subscription").doc(idCustomer).get().then(subDoc=>{
                            if (subDoc.exists) {
                                return subDoc.ref.update({
                                    productRef: productRef,
                                    subscription: dataSubscription
                                }).then(()=>{
                                    return "ok";
                                })
                            }
                            else {
                                return db.collection("subscription").doc(idCustomer).set({
                                    nbClients: 0,
                                    productRef: productRef,
                                    subscription: dataSubscription
                                }).then(()=>{
                                    return "ok";
                                })
                            }
                        })

                    })
                });
              }
              else
                return null;
            
            

})
/*
exports.updateAgence = 
    functions.region('europe-west1')
        .firestore.documents('agence/{agenceId}').onWrite((change, context)=>{
            var dataAgenceAfter = change.after.data();
            var dataAgenceBefore = change.before.data();
            if (typeof(dataAgenceAfter.metadata) != "undefined")
             if (typeof(dataAgenceAfter.metadata.subscription) != "undefined") {
                if (dataAgenceAfter.metadata.subscription != dataBeforeAfter.metata.subscription.)
            
        })
*/