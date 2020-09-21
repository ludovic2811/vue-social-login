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
        <br/>
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
        <div class="buttons">
          <s-button label="Enregistrer" icon="save" theme="is-success" @onclick="save()"/>
          <s-button label="Annuler" icon="save" theme="is-warning" @onclick="rout('/index')"/>
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
        email: false
      }
    }
  },
  methods: {
      rout(nav) {
        this.$router.push(nav).catch(error=>{})
      },
      save() {
          this.error.nom = this.nom == "";
          this.error.pwd = this.password == "";
          this.error.email = this.email == "";

          if (!this.error.email) {
            var reEmail = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
            this.erreur.email = this.email.match(reEmail);
          }
          
          if (!this.error.pwd) {
             this.error.pwd = !(this.password.match( /[0-9]/g) && 
                    (this.password.match( /[A-Z]/g) ||
                    this.password.match(/[a-z]/g)) && 
                    this.password.length >= 6)
          }

          if (!this.error.nom || !this.error.pwd || !this.error.email) {

          firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          .then(data=> {
              data.user.updateProfile({
                  displayName: this.nom
              }).then(()=>{
              }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
                });
          
            firebase.auth().onAuthStateChanged(firebaseUser => {
                      if (firebaseUser) {
                          firebaseUser.sendEmailVerification().then(function() {
                              
                              
                          }, function(error) {
                              console.log('not send Verification');
                          });
                      } else {
                          console.log('not logged in');
                          
                      }
                  })
              })
          }
          
      }
  }

}
</script>