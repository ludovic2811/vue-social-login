<template>
   
    <div class="container">
        <div style="width:100%;text-align:center">
        <div  v-on:click="rout('/index')">
            <img src="@/assets/logo.png"   />
            <div class="title" >
              <div class="logoTitle">Guarding Manager</div>
            </div>
        </div>
       
        <div >
        <br/><br/>
        <div class="subtitle">Modifier votre mot de passe</div> 
        </div><br/><br/>

        <div>
            Nouveau mot de passe :
        </div>
        <div style="width:100%">
            <div style="text-align:center">
                    <div class="control has-icons-left has-icons-right" >
                    <input type="password"class="input is-rounded"  
                        v-model="pwd" style="width:  100%" 
                        placeholder="Votre mot de passe"/><br/>
                    
                    <span class="icon is-small is-left">
                    <i class="fas fa-lock"></i>
                    </span>
                    </div>
             </div>
        </div>
        <div>
                Confirmez votre mot de passe :
        </div>
        <div style="text-align:center;width:100%">
            <div style="width:100%;text-align:center">
        <div class="control has-icons-left has-icons-right"  >
                   <input type="password"class="input is-rounded"  v-model="pwdConfirm" style="width: 100%" placeholder="Confirmez le"/><br/>                   
                   <span class="icon is-small is-left">
                    <i class="fas fa-lock"></i>
                  </span>
                  
                </div>
            </div>
        </div>
        <br/><br/><s-button label="Modifier" theme="is-primary" icon="save" @onclick="save()"/>
        </div>
        <br/>
         <div v-show="error" class="notification is-danger">
                    <b>Mot de passe non conforme... </b><br/>
                    Véirifier qu'il a au moins 1 chiffre et qu'il est supérieur ou égale à 6 caractères   
                   
                    <span v-show="errorIdentifique" ><br/><br/>La confirmation du mot de passe n'est pas bonne</span>          
                </div>
         <div :class="infoBack ? 'modal is-active':'modal'">
                  <div class="modal-background"></div>
                  <div class="modal-card">
                  <section class="modal-card-body">
                    Votre mot de passe a bien été modifié<br/>
                    Cliquez sur Login et reconnectez vous avec votre nouveau mot de passe
                  </section>
                  <footer class="modal-card-foot">
                    <s-button label="login" icon="thumbs-up" @onclick="login()" theme="is-success"/>
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
            infoSendMail: false,
            pwd: "",
            pwdConfirm: "",
            actionCode: "",
            continueUrl: "",
            lang: "",
            infoBack: false,
            error: false,
            errorIdentifique: false
        }
    },
    methods: {
        
        login() {
            firebase.auth().signOut();
            this.rout("/login");
        },
        save() {
                var reEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                this.error = !(this.pwd.match( /[0-9]/g) && 
                    (this.password.match( /[A-Z]/g) ||
                    this.password.match(/[a-z]/g)) && 
                    this.password.length >= 6)

                if (this.pwd == this.pwdConfirm && !this.error) {
                            // Localize the UI to the selected language as determined by the lang
                // parameter.
                var accountEmail;
                // Verify the password reset code is valid.
                
                firebase.auth().verifyPasswordResetCode(this.actionCode).then((email)=> {
                    var accountEmail = email;
                 
                    // TODO: Show the reset screen with the user's email and ask the user for
                    // the new password.

                    // Save the new password.
                    firebase.auth().confirmPasswordReset(this.actionCode, this.pwd).then((resp)=> {
                    // Password reset has been confirmed and new password updated.
                   // TODO: Display a link back to the app, or sign-in the user directly
                    // if the page belongs to the same domain as the app:
                    // auth.signInWithEmailAndPassword(accountEmail, newPassword);
                    this.infoBack = true;
                    // TODO: If a continue URL is available, display a button which on
                    // click redirects the user back to the app via continueUrl with
                    // additional state determined from that URL's parameters.
                    }).catch(function(error) {
                    // Error occurred during confirmation. The code might have expired or the
                    // password is too weak.
                    console.log(error)
                    });
                }).catch(function(error) {
                    // Invalid or expired action code. Ask user to try to reset the password
                    // again.
                  
                     console.log(error)
                });
            }
            else {
               this.error = true;
               this.errorIdentifique = this.pwd != this.pwdConfirm;
            }
        },
        rout(nav) {
            this.$router.push(nav).catch(error=>{})
        }
    },
	mounted() {
		
        this.actionCode = this.$route.query.oobCode;
        this.continueUrl  = this.$route.query.continueUrl ;
        this.lang =  this.$route.query.lang ;
        
	}
}
</script>