<template>
    <s-modal
        title="Selectionner une plage"
        :close="true"
        :save="true"
        :cancel="false"
        :open="open"
        @save="save"
        @close="$emit('close')" 
        
    >
       <v-date-picker
            mode="range"
            v-model="datesData"
            color="green"
            is-inline
        />
 
    </s-modal>
</template>
<script>
export default {
    props: ["open","dates"],
    data() {
        return {
            datesData: [new Date(2018, 0, 9), new Date(2018, 0, 25)],
        }
    },
    watch: {
        open: function(val) {
            this.datesData = {
                start: new Date(this.dates.start), 
                end: new Date(this.dates.end)
            }
            
        }
    },
    methods: {
        save() {
           var date = new Date (this.datesData.start);
           this.$emit("save", this.datesData)
        }
    }
}

</script>