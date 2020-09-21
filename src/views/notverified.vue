<template>
    <div>
        Votre compte n'a pas été vérifier
        <s-button label="Se loguer" theme=" " icon="" @onclick="rout('/login')"/>
    </div>
</template>
<script>
export default {
    methods: {
        rout(nav) {
            this.$router.push(nav).catch(error=>{})
        }
    }
}
</script>