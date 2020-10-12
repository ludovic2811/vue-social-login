<template>
    <div class="container">
        <div>
        <div style="width:100%;text-align:center" v-on:click="rout('/index')">
            <img src="@/assets/logo.png"   />
            <div class="title" >
              <div class="logoTitle">Guarding Manager</div>
            </div>
        </div>
        <br/>
        <label class="label">
          Votre nom :
        </label>
        <input type="text" 
            :class="error.nom ? 'input is-rounded is-danger' : 'input is-rounded'" 
            v-model="nom" 
            placeholder="Votre nom"/>
        <div v-show="error.nom" class="danger">
            Le nom est obligatoire
        </div>
        <br/><br/>
         <label class="label">
          Email  :
        </label>
        <p class="control has-icons-left has-icons-right">
                <span class="icon is-small is-left">
                  <i class="fas fa-envelope"></i>
                </span>
                <input type="email" 
                :class="error.email ? 'input is-rounded is-danger' : 'input is-rounded'" 
                v-model="email" placeholder="Votre email"/>
                <div v-show="error.email" class="danger">
                    Le mail est obligatoire et doit respecter le format xxxx@xxxx.xx
                </div>
                </p>
                <br/>
         <label class="label">
          Password : 
        </label>
         <p class="control has-icons-left has-icons-right">
                   <input type="password" 
                   :class="error.pwd ? 'input is-rounded is-danger' : 'input is-rounded'"  
                   v-model="password" placeholder="Votre mot de passe"/>
                   <span class="icon is-small is-left">
                    <i class="fas fa-lock"></i>
                  </span>
                   <div v-show="error.pwd" class="danger">
                      Les mots de passe sécurisés comportent au moins six caractères 
                      et une combinaison de chiffres et de lettres
                   </div>
                </p>
                <br/>
                <div v-show="error.exist" class="danger">
                  Cet mail existe déjà ...</br>
                  Vous avez peut être oublier votre mot de passe </br>
                </div>
                <div :class="infoSendMail ? 'modal is-active':'modal'">
                  <div class="modal-background"></div>
                  <div class="modal-card">
                  <section class="modal-card-body">
                    Un mail a été envoyé à votre adresse.<br/>
                    Veuillez confirmer votre adresse mail pour valider votre compte.                    
                  </section>
                  <footer class="modal-card-foot">
                    <s-button label="J'ai compris" icon="thumbs-up" @onclick="rout('/login')" theme="is-success"/>
                  </footer>
                  </div>
                </div>
       
        <div class="buttons">
          
          <s-button label="Annuler" icon="save" theme="is-warning" @onclick="rout('/index')"/>
          &nbsp;&nbsp;&nbsp;
          <s-button label="Enregistrer" icon="save" theme="is-success" @onclick="save()"/>
        </div>
        </div>
    </div>
</template>
<style scoped>
  .container div {
    margin-left: 10px;
    margin-right: 10px;
  }
  .buttons {
    margin-top: 10px;
    margin-bottom: 10px;
    width: 100%;
    text-align: "center";
  }
  .danger {
    font-style: italic;
    font-size: smaller;
    color: red;
  }
  
</style>
<script>
import firebase from "firebase";

export default {
    
    data:function() {
    return {
      email: "",
      password: "",
      nom: "",
      error: {
        nom: false,
        pwd: false,
        email: false,
        exist: false
      },
      infoSendMail: false
    }
  },
  methods: {
      rout(nav) {
        const recaptcha = this.$recaptchaInstance
        if (recaptcha)
          recaptcha.hideBadge();
        this.$router.push(nav).catch(error=>{})
      },
      save() {
          this.error.nom = this.nom == "";
          this.error.pwd = this.password == "";
          this.error.email = this.email == "";

          if (!this.error.email) {
            var reEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            this.error.email = !this.email.match(reEmail);
          }
          
          if (!this.error.pwd) {
             this.error.pwd = !(this.password.match( /[0-9]/g) && 
                    (this.password.match( /[A-Z]/g) ||
                    this.password.match(/[a-z]/g)) && 
                    this.password.length >= 6)
          }
 
          if (!this.error.nom || !this.error.pwd || !this.error.email) {
            // Execute reCAPTCHA with action "login".
            console.log("REGISTER")
            this.$sendRecaptcha( this.$recaptchaLoaded(), this.$recaptcha('register'), result=>{
              console.log("REGISTER 2")
              if (result.data.data.success) {
                console.log("SUCESS")
                firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                .then(data=> {
                    data.user.updateProfile({
                        displayName: this.nom
                    }).then(error=>{
                        var user = firebase.auth().currentUser;

                        user.sendEmailVerification().then(()=> {
                          
                          this.error.exist = false;
                          this.infoSendMail = true;
                          firebase.auth().signOut();
                        }).catch(function(error) {
                          // An error happened.
                        });
                    })
                    .catch(error=> {
                      if (error.code =="auth/email-already-in-use")
                          this.error.exist = true;
                      });
                });
              }
              else {
                console.log("Probleme : captcha non valide !")
                console.log(result);
              }
          })
                  
        } // en if
      } // save

  }// methods
  ,
  mounted() {
    const recaptcha = this.$recaptchaInstance
     if (recaptcha)
      recaptcha.showBadge();
  }
}
</script>