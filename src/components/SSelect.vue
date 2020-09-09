<template>
	<div :class="classMenu">
	  <div class="dropdown-trigger">
	    <button class="button" aria-haspopup="true" aria-controls="dropdown-menu-sselect" v-on:click="openOrClose">
	      	<span class="icon" v-if="itemSelected.icon">
	      			<i :class="itemSelected.icon"></i>
	      	</span>
	      	<span>{{itemSelected.label}}</span>
	      <span class="icon is-small">
	        <i class="fas fa-angle-down" aria-hidden="true"></i>
	      </span>
	    </button>
	  </div>
	  <div class="dropdown-menu" id="dropdown-menu-sselect" role="menu">
	    <div class="dropdown-content">
	      <a href="#" class="dropdown-item" v-for="itemList in listOrder" v-on:click="selectItem(itemList)">
	      		<span class="icon" v-if="itemList.object[fields[2]]">
	      			<i :class="itemList.object[fields[2]]"></i>
	      		</span>
	      		<span>
	      			{{itemList.object[fields[0]]}}
	      		</span>
	        	
	      </a>
	    </div>
	  </div>
	</div>
</template>
<script>
	export default {
		nom: "SSELECT",
		props : ["list", "valueSelected", "fields","change","attributChange","labelNotSelected"],
		data() {
			return {
				itemSelected: {
					label: "",
					value: "",
					icon: ""
				},
				classMenu: "dropdown",
				listOrder: []
			}
		},
		methods: {
			selectItem(item) {
				
				this.itemSelected.label = item.object.[this.fields[0]];
				this.itemSelected.value = item.object.[this.fields[1]];
				if (this.fields.length == 3)
					this.itemSelected.icon = item.object.[this.fields[2]];
				this.classMenu = "dropdown";
				
				if (typeof(this.change)!="undefined") {
					this.change[this.attributChange] = item.object.[this.fields[1]]					
				}
				
				this.$emit("selected",item); 
			},
			openOrClose() {
				
				if (this.classMenu=='dropdown is-active')
					this.classMenu='dropdown';
				else
					this.classMenu='dropdown is-active';
				
			},
			setSelected() {
				this.listOrder = this.$orderJson(this.list);
				var index = this.listOrder.findIndex(elt => elt.object[this.fields[1]] === this.valueSelected);
				if (index != -1) {
					this.itemSelected.label = this.listOrder[index].object[this.fields[0]];
					this.itemSelected.value = this.listOrder[index].object[this.fields[1]];
					if (this.fields.length == 3)
						this.itemSelected.icon = this.listOrder[index].object[this.fields[2]];
				}
				else
				{
					this.itemSelected.label = this.labelNotSelected;
					
				}
			}
			
		},
		watch: {
			valueSelected: function(val) {
				this.setSelected();
			}
			
		},
		mounted() {
			this.setSelected();
		}
		
	}
</script>