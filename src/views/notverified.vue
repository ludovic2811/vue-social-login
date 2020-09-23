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
        <div class="subtitle">Votre compte n'a pas encore été vérifié</div> 
            Veuillez vérifier votre messagerie, et cliquez sur le lien pour activer votre compte
            Votre nom : {{firebase.auth().currentUser.displayName}}<br/>
            Email enregistré : {{firebase.auth().currentUser.email}}<br/>
        <br/>
         <br/><br/>
        </div>
        <s-button label="Se loguer" theme="is-primary" icon="" @onclick="rout('/login')"/>
        </div>
    </div>
</template>
<script>
import firebase from "firebase"
export default {
    methods: {
        rout(nav) {
            this.$router.push(nav).catch(error=>{})
        }
    },
    mounted() {
        console.log(this.$store.getters.getUser)
    }
}
</script>