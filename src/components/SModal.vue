<template>
<div :class="classModal">
			<div class="modal-background"></div>
  			<div class="modal-card">
	    		<header class="modal-card-head" >
				      <p class="modal-card-subtitle" style="width:90%" >{{title}}</p>	
				      <div style="float:rigth" v-if="close">
				      	<s-button theme="" label="" icon="times-circle" @onclick="$emit('close')"/>
				      </div>

				</header>
				<section class="modal-card-body">
					<slot></slot>
				</section>
				<footer class="modal-card-foot">
      				
      				<s-button v-if="save"  theme="button is-success" label="Enregistrer" icon="save" @onclick="saveButton"></s-button>
      				<s-button v-if="cancel" theme="button is-warning" label="Annuler" icon="ban" @onclick="cancelButton"></s-button>
      				
    			</footer>
  			</div>
  			
			</div>
		</div>
</template>
<script>
	export default  {
		props: ["title","save","cancel","delete","open","close"],
		data() {
			return {
				classModal: "modal"
			}
		},
		watch: {
			open: function(val) {
				if (val)
					this.classModal = "modal is-active";
				else
					this.classModal = "modal";
			}
		},
		methods: {
			saveButton () {
				this.$emit("save")
			},
			cancelButton () {
				this.classModal = "cancel";
				this.$emit("cancel");
			}
			
		}
	}
</script>