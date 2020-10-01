import util from "@/firebase/util.js";  

const const_inout = {
	json_inout : {
        id: -1,
		departLe: "",
        rentreLe: "",
        idClient: null,
        numero: null,
        idArticle: null
        
    },
    deleteByArticle (store, article) {
        store.getters.getDocAgence.collection("inout")
            .get().then(querySnapshot=>{
                querySnapshot.docs.forEach(element => {
                    if (element.data().idArticle == article.id)
                        element.ref.delete();
                });
            })
    },
	getAll (store, client, article , fct) {
        store.getters.getDocAgence.collection('inout')
            .where("idClient","==",client['.key'])
            .where("idArticle","==",article.id)
            .orderBy("departLe","desc")
            .get().then(querySnapshot=> {
                var docs = querySnapshot.docs.map(function (doc) {
                    const eventData = doc.data()
                    eventData.id = doc.id;
                    return eventData
                })
                fct(docs);
            })
    },
    delete (store, inout, fct) {
        store.getters.getDocAgence
        .collection('inout')
        .doc(inout.id).delete().then(()=>{
            fct();
        })
    },
    set (store, inout, fct) {
        var yyyymmR = util.util.convertYYYYMM(inout.rentreLe);
        var yyyymmD = util.util.convertYYYYMM(inout.departLe);
        var yyyymm = [];
        yyyymm.push(yyyymmD);
        if (yyyymmD != yyyymmR)
            yyyymm.push(yyyymmR);
        
        inout.yyyymm = yyyymm;

        store.getters.getDocAgence
        .collection('inout')
        .doc(inout.id).set(inout).then(()=>{
            fct();
        })
    },
    add (store, inout, fct) {
        var yyyymmR = util.util.convertYYYYMM(inout.rentreLe);
        var yyyymmD = util.util.convertYYYYMM(inout.departLe);
        var yyyymm = [];
        yyyymm.push(yyyymmD);
        if (yyyymmD != yyyymmR)
            yyyymm.push(yyyymmR);
        
        inout.yyyymm = yyyymm;

        store.getters.getDocAgence
        .collection('inout')
        .add(inout).then((inoutAdd)=>{
            inout.id = inoutAdd.id
            fct(inout);
        })
    },
    updateArticle (store, client, article, inouts, fct) {
        var jsonInOut={
            departLe : "",
            rentreLe : ""
        }
        var date = new Date();
        var indexFind = 0;
        if (inouts.length != 0) {
            inouts.forEach((inout, index)=>{
                if (inout.rentreLe > date)
                    indexFind = index;
            })
            if (indexFind >= 0) {
                jsonInOut.departLe = inouts[indexFind].departLe;
                jsonInOut.rentreLe = inouts[indexFind].rentreLe;
            }
        }
        
        
        
        var idClient = client['.key'];
        client.articles[article.id].departLe = jsonInOut.departLe;
        client.articles[article.id].rentreLe = jsonInOut.rentreLe;
        
        store.getters.getDocAgence
            .collection("clients").doc(idClient).update({
                articles: client.articles
            }).then(()=>{
                
                fct(jsonInOut)
            })
    }
}

export default {
	api: const_inout
}

