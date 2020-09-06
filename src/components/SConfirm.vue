<template>
<div :class="classModal">
			<div class="modal-background"></div>
  			<div class="modal-card">
	    		<header class="modal-card-head">
				      <p class="modal-card-title">{{title}}</p>				      
				</header>
				<section class="modal-card-body">
					<slot></slot>
				</section>
				<footer class="modal-card-foot" >
      				<div style="width:80%;margin-left:10%">
      					<div style="float:left">
      						<s-button  theme="button is-warning" label="NON" icon="thumbs-down" @onclick="no"></s-button>
      					</div>
      					<div style="float:right">
      						<s-button  theme="button is-success" label="OUI" icon="thumbs-up" @onclick="yes"></s-button>      						
      					</div>
      				</div>
    			</footer>
  			</div>
  			
			</div>
		</div>
</template>
<script>
	export default  {
		props: ["title","open"],
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
			yes () {
				this.$emit("yes")				
			},
			no () {
				this.$emit("no");
			}
			
		}
	}
</script>