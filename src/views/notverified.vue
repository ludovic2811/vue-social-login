<template>
   
    <div class="container">
        <div style="width:100%;text-align:center">
        <div style="width:100%;text-align:center" v-on:click="rout('/index')">
            <img src="@/assets/logo.png"   />
            <div class="title" >
              <div class="logoTitle">Guarding Manager</div>
            </div>
        </div>
        <div >
        <br/><br/>
        <div class="subtitle">Votre compte n'a pas encore été activé</div> 
            Veuillez vérifier votre messagerie, et cliquez sur le lien pour activer votre compte
            <br/><br/><div>    <a href="#" v-on:click="sendVerif()">Renvoyer le mail d'activation</a></div>
        
         <br/><br/>
        </div>
        <s-button label="Se loguer" theme="is-primary" icon="" @onclick="login()"/>
        </div>
         <div :class="infoSendMail ? 'modal is-active':'modal'">
                  <div class="modal-background"></div>
                  <div class="modal-card">
                  <section class="modal-card-body">
                    Un mail a été envoyé à votre adresse.<br/>
                    Veuillez confirmer votre adresse mail pour valider votre compte.                    
                  </section>
                  <footer class="modal-card-foot">
                    <s-button label="J'ai compris" icon="thumbs-up" @onclick="login()" theme="is-success"/>
                  </footer>
                  </div>
                </div>
    </div>
</template>
<script>
import firebase from "firebase"
export default {
    data() {
        return {
            infoSendMail: false
        }
    },
    methods: {
        login() {
            firebase.auth().signOut();
            this.rout("/login");
        },
        rout(nav) {
            this.$router.push(nav).catch(error=>{})
        },
        sendVerif() {
            var user = firebase.auth().currentUser;
            user.sendEmailVerification().then(()=> {
                    console.log("SEND EMAIL");
                    this.infoSendMail = true;
                    
            }).catch(function(error) {})
        }
    },
    mounted() {
        console.log(this.$store.getters.getUser)
    }
}
</script>