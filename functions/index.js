/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

const functions = require('firebase-functions');
const axios = require('axios');
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
            
            var idClientDelete = context.params.clientId;
            var idAgence = context.params.agenceId;

            db.collection("agence").doc(idAgence).collection('clientsArchive').doc(idClientDelete)
			.set(change.data()).then(success => {
				// copy paiements
				db.collection("agence").doc(idAgence).collection('clients').doc(idClientDelete).collection("paiements")
					.get().then(paiementsDoc=>{
							
						paiementsDoc.docs.forEach(paiement=>{							
							db.collection("agence").doc(idAgence).collection('clientsArchive').doc(idClientDelete)
								.collection("paiements").doc(paiement.id).set(paiement.data()).then(()=>{
                                    paiement.ref.delete();
                                });
                        }) 
                        
                        db.collection("agence").doc(idAgence).collection('inout')
                                    .where("idClient", "==", idClientDelete).get().then(inout=>{
                                        inout.docs.forEach(inoutItem=>{
                                            inoutItem.ref.delete();
                                        })
                                       
                                    })			
				}) // paiementsDoc
				
			}) 
			
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

exports.deleteAgence = 
    functions.region('europe-west1')
        .firestore.document('agence/{agenceId}').onDelete((change, context)=>{
            var agenceId = context.params.agenceId;
            db.collection("user").where("agences", "array-contains", agenceId).get().then(userDoc=>{
                userDoc.docs.forEach(user=>{
                    var tabAgences = user.data().agences;
                    var idAgenceSelected = user.data().idAgenceSelected;
                    if (idAgenceSelected == agenceId)
                        idAgenceSelected = "";
                    var indexAgence = tabAgences.indexOf(agenceId);
                    if (indexAgence != -1) {
                        tabAgences.splice(indexAgence, 1);
                        user.ref.update({
                            idAgenceSelected : idAgenceSelected,
                            agences : tabAgences
                        })
                    }
                })
            })
            db.collection("agence").doc(agenceId).collection("clientsArchive").get().then(clientArchives=>{
                clientArchives.docs.forEach(clientArchive=> {
                    clientArchive.ref.collection("paiements").get().then(paiements=>{
                        paiements.docs.forEach(paiement=>{
                            paiement.ref.delete();
                        })
                    })
                    clientArchive.ref.delete();
                })
            })
            // Maintenant je supprimer tous mes clients
            return db.collection("agence").doc(agenceId).collection("clients").get().then(clients=>{
                clients.docs.forEach(client=>{
                   return client.ref.delete().then(()=>{
                         // et en fait bah il faut supprimer les clients qu'ils viennent d'être archivés
                        var idClient = client.id;

                        db.collection("agence").doc(agenceId).collection("clientsArchive").doc(idClient).get().then(clientArchive=>{
                            clientArchive.ref.collection("paiements").get().then(paiements=>{
                                paiements.docs.forEach(paiement=>{
                                    paiement.ref.delete();
                                })
                            })
                            return clientArchive.ref.delete();
                        })
                   })
                })
            })
        })
    
/**
Firebase Function to verify user response with Google recaptcha v3
**/

exports.sendRecaptcha = functions.region('europe-west1').https.onCall((data, context) => {
    const token = data.token;
    const secret = "6Lfsy9MZAAAAAEE-ocMXeIYiIfo5DPIo8miqM1wV";
    return axios.get(`https://recaptcha.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`)
        .then(response=>{           
            return {
                data: response.data
            }
        })
        .catch(err=>{
            console.log(err);
            return err;
        })
  });