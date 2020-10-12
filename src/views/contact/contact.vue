<template>
    <div class="container">
        <div class="notification has-background-white has-text-centered">
            <div v-on:click="rout('/index')" class="logo">
              <img src="@/assets/logo.png"   />
              <div class="title" >
                <div class="logoTitle">Guarding Manager</div>
                </div>
            </div>
          <br/>
          <br/>

        <div class="subtitle">
            Formulaire de contact
        </div>
        <div class="formulaire">
            <label class="label">
                Nature de votre demande :
            </label>
            <div>
            <select v-model="nature" >
                <option :value="natureItem" v-for="natureItem in natures">
                    {{descNature[natureItem]}}
                </option>
            </select>
            </div>  <br/>
            <label class="label">
               Description de la demande :
            </label>
            
           <textarea maxlength="400" v-model="description" :placeholder="placeHolder[nature]"  
           rows="8" cols="40"/><div class="error" v-show="err">
                Merci de remplir la description de votre demande !
            </div>
        </div>  <br/>  
        <s-button label="Annuler" theme="is-warning" icon="ban" @onclick="cancel"/>
        &nbsp;&nbsp;&nbsp;
        <s-button label="Envoyer" theme="is-success" icon="paper-plane" @onclick="send"/>
            <div :class="infoEmail ? 'modal is-active':'modal'">
                  <div class="modal-background"></div>
                  <div class="modal-card">
                  <section class="modal-card-body">
                   Un mail a été envoyé à nos équipes<br/>
                   Ils s'efforceront de vous répondre au plus vite <br/>
                   Merci<br/>

                  </section>
                  <footer class="modal-card-foot">
                    <s-button label="J'ai compris" icon="thumbs-up" @onclick="back()" theme="is-success"/>
                  </footer>
                  </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .error {
        font-size: 12px;
        color: rgb(168, 2, 2);
        
    }
</style>
<script>
import firebase_api from "@/firebase/firebase_api"
export default {
    name: "contact",
    data() {
        return {
            natures: ['BUG', 'HELP', 'ADD', 'OTHER'],
            descNature: {
                BUG: "Vous avez rencontré une anomalie",
                HELP: "Besoin d'aide sur une fonctionnalité",
                ADD: "Vous avez une suggestion d'évolutions",
                OTHER: "Autre"
            },
            placeHolder: {
                BUG: "Décrivez le problème rencontré (400 caractères max)",
                HELP: "Décrivez la fonctionnalité que nous ne comprenez pas (400 caractères max)",
                ADD: "Décrivez l'évolution que vous souhaiteriez avoir (400 caractères max)",
                OTHER: "..."
            },
            description: "",
            nature: "BUG",
            infoEmail: false,
            err: false
        }
    },
    methods: {
        back() {
            this.rout("/index");
        },
        rout(nav) {
            const recaptcha = this.$recaptchaInstance
            if (recaptcha)
		        recaptcha.hideBadge();
			this.$router.push(nav).catch(error=>{})
		},
        send() {
            if (this.description != "") {
                    var user = this.$store.getters.getUser;
                     this.$sendRecaptcha( this.$recaptchaLoaded(), this.$recaptcha('register'), result=>{
                      if (result.data.data.success) {
                            firebase_api.api.getDb().collection('mail').add({
                                to: "contact@guarding-manager.com",
                                message: {
                                    subject: '['+this.nature+']: ' + user.displayName + " : " + user.email,
                                    html: this.description
                                },
                                        
                            }).then(()=>{
                                this.infoEmail = true;
                            })
                      } 
                     })
                     
            }
            else {
                this.err = true;
            }
        },
        cancel() {
            this.rout("/index");
        }
    },
    
   mounted() {
    const recaptcha = this.$recaptchaInstance
		recaptcha.showBadge();
  }
}
</script>