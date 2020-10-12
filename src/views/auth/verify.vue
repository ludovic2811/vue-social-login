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
        <div class="subtitle">Votre compte a bien été validé !</div> 
        </div><br/><br/>
        <s-button label="Se loguer" theme="is-primary" icon="" @onclick="login()"/>
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
        }
    },
	mounted() {
	
		if (this.$route.query.mode="verifyEmail") {
		
			 // Localize the UI to the selected language as determined by the lang
				// parameter.
				// Try to apply the email verification code.
				var actionCode = this.$route.query.oobCode;
				firebase.auth().applyActionCode(actionCode).then(function(resp) {
					// Email address has been verified.
					
					// TODO: Display a confirmation message to the user.
					// You could also provide the user with a link back to the app.

					// TODO: If a continue URL is available, display a button which on
					// click redirects the user back to the app via continueUrl with
					// additional state determined from that URL's parameters.
				}).catch(function(error) {
					// Code is invalid or expired. Ask the user to verify their email address
					// again.
				});
		}
	}
}
</script>