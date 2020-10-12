
<template>
<div>
    <vue-recaptcha
          ref="recaptcha"
          @verify="onVerify"
          @expired="onExpired"
          :loadRecaptchaScript="true"
          :sitekey="key">
        </vue-recaptcha>
        <button @click="resetRecaptcha"> Reset ReCAPTCHA </button>
        <br/>
    {{key}}
   <vue-recaptcha
          @verify="onVerify"
          @expired="onExpired"
          :sitekey="key">
          <button>Click me</button>
        </vue-recaptcha>
</div>
</template>
 
<script>
  import  keys from '@/firebase/keys_firebase'
  import VueRecaptcha from 'vue-recaptcha';
  export default {
    data() {
        return {
            key: keys.keys.siteKeyCaptcha
        }
    },
    components: { VueRecaptcha },
    methods: {
        onSubmit: function () {
        this.$refs.invisibleRecaptcha.execute()
        },
        onVerify: function (response) {
        console.log('Verify: ' + response)
        },
        onExpired: function () {
        console.log('Expired')
        },
        resetRecaptcha () {
        this.$refs.recaptcha.reset() // Direct call reset method
        }
    }
  };
</script>