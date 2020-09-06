<template>
  <section class="hero has-background-white is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="notification has-background-white has-text-centered">
          <h1 class="title">Login</h1>
          <br>

          <p>
            A basic social login PWA project using
            <strong>Vue</strong>,
            <strong>Firebase</strong> and
            <strong>Bulma</strong>.
          </p>
          <br>

          <a class="button is-outlined is-link is-rounded is-medium is-fullwidth"
            @click="loginWithFacebook">
            <span class="icon">
              <i class="fab fa-facebook"></i>
            </span>
            <span>Sign in with Facebook</span>
          </a>
          <br />
          <a class="button is-outlined is-danger is-rounded is-medium is-fullwidth"
            @click="loginWithInstagram">
            <span class="icon">
              <i class="fab fa-instagram"></i>
            </span>
            <span>Sign in with Instagram</span>
          </a>
          <br />
          <a class="button is-google is-outlined is-info is-rounded is-medium is-fullwidth"
            @click="loginWithGoogle">
            <span class="icon">
              <i class="fab fa-google"></i>
            </span>
            <span>Sign in with Google</span>
          </a>
        </div>
        <!-- /Notification -->
      </div>
      <!-- /Container -->
    </div>
    <!-- /Hero Body -->
  </section>
</template>

<script>
import firebase from "firebase";
import user_api from "@/firebase/user_api.js"; 
import Vue from "vue";
export default {
  name: "login",
  methods: {
    loginWithFacebook() {
      const provider = new firebase.auth.FacebookAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(() => {
          this.createUser();
          this.$router.replace("home");
        })
        .catch(err => {
          // TODO:
          alert(err.message);
        });
    },
    loginWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(() => {
          this.createUser();
          this.$router.replace("home");
        })
        .catch(err => {
          // TODO:
          alert(err.message);
        });
    },
    loginWithInstagram() {
      this.createUser();
      this.$router.replace("InstagramAuth");
    },
    createUser () {
      user_api.api.createWidthAuth(()=>{
        this.$store.dispatch('init',()=>{
          console.log(this.$store.getters);
        });
      });
    }
  }
};
</script>