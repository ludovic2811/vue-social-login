<template>
  <section class="hero has-background-white">
    <div class="hero-body">
      <div class="container">
        <div class="notification has-background-white has-text-centered">
            <div v-on:click="rout('/index')" class="logo">
              <img src="@/assets/logo.png"   />
              <div class="title" >
                <div class="logoTitle">Guarding Manager</div>
                </div>
            </div>
          <br>

          <p>
            Loguez vous pour accèder à votre espace
          </p>
          <br>
        <a class="button is-google is-outlined is-info is-rounded is-medium is-fullwidth"
            @click="loginWithGoogle">
            <span class="icon">
              <i class="fab fa-google"></i>
            </span>
            <span>&nbsp;Loguez vous par Google</span>
          </a>
          <div style="margin: 20px">ou connectez vous directement :</div>
          <div class='form'>
              <div>
                <p class="control has-icons-left has-icons-right">
                <span class="icon is-small is-left">
                  <i class="fas fa-envelope"></i>
                </span>
                <input type="email" class="input is-rounded" v-model="email" placeholder="Votre email"/>
                <span v-show="errorEmail" class="errorMail">
                    Votre mail n'est pas au bon format
                </span>
                </p>
              </div>
              <div>
                <p class="control has-icons-left has-icons-right">
                   <input type="password" class="input is-rounded" v-model="password" placeholder="Votre mot de passe"/>
                   <span class="icon is-small is-left">
                    <i class="fas fa-lock"></i>
                  </span>
                  <span v-show="errorPwd" class="errorMail">
                   Mot de passe incorrect
                </span>
                </p>
              </div>
              <div class="buttons">
                <div>
                  <a href="#" v-on:click="resetPwd()"> mot de passe oublié</a>   &nbsp;   &nbsp;
                    <s-button theme="is-success" icon="sign-in-alt" label="Se loguer" @onclick="login"/>
                  <div class="sendMail" v-show="sendEmail">
                      Un mail vous a été envoyé pour réinitialiser votre mot de passe
                  </div>
                </div>
               
              </div>
          </div>
                <div>
                    <s-button theme="is-primary" icon="user-plus" label="S'inscire" @onclick="register"/> 
                </div>
        </div>
        <!-- /Notification -->
      </div>
      <!-- /Container -->
    </div>
    <!-- /Hero Body -->
  </section>
</template>
<style scoped>
  .errorMail {
    font-style: italic;
    font-size: smaller;
    color: red;
  }
  .sendMail {
    font-style: italic;
    font-size: smaller;
    color: black;
  }
  .logo {
		color: #325D88;
	}
  .logo:hover{
    cursor: pointer;
  }
  .form div {
    margin-bottom: 10px;
    width: 100%
  }
  .buttons {
    width: 100%;
  }
  .buttons div {
    margin: 10px;
    float: right;
  }
</style>
<script>
import firebase from "firebase";
import user_api from "@/firebase/user_api.js"; 

export default {
  name: "login",
  data:function() {
    return {
      email: "",
      password: "",
      errorEmail: false,
      sendEmail: false,
      errorPwd: false
    }
  },
  methods: {
    resetPwd() { 
      this.sendEmail = false;
      this.errorEmail = false;
      firebase.auth().sendPasswordResetEmail (this.email).then(()=>{
          this.sendEmail = true;
         
      }).catch(err=>{
        this.sendEmail = false;
        this.errorEmail = (err.code == "auth/invalid-email");
          
      })
    },
    register() {
      this.rout("/register");
    },
    rout(nav) {
      this.$router.push(nav).catch(
        (error)=>{

      })
    },
    login () {
      this.errorEmail = false;
      this.errorPwd = false;
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
      .then(()=>{
        this.createUser();
        this.rout("/client");
      })
      .catch((error)=> {
          // Handle Errors here.
          console.log(error.code);
          if (error.code == "auth/invalid-email")
            this.errorEmail = true;
          if (error.code == "auth/wrong-password")
            this.errorPwd = true;
          
        });
    },
    loginWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(() => {
          this.createUser();
          this.$router.replace("client").catch((err) => {
              throw new Error();
          });
        })
        .catch(err => {
          // TODO:
          alert(err.message);
        });
    },
    createUser () {
      user_api.api.createWidthAuth(()=>{
        this.$store.dispatch('init',()=>{
          
        });
      });
    }
  }
};
</script>
