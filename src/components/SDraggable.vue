<template>
	<div>
		
		<draggable  :draggable="draggable" @end="onEnd" >
		   <slot></slot>

		</draggable>
	</div>
</template>
<script >
	import draggable from "vuedraggable"
	export default {

		props: ["draggable", "datas","refresh"],
		components: {
			draggable
		},
		methods: {

			onEnd(event) {
				// L'objectif ici est de changer l'attibut RANG du tableau

				// On créer un nouveau tableau
				var myArray = this.datas.slice();

				// On le remet dans l'ordre
				// Normalement on est iso en terme d'odre par rapport à ce qui est affiché
				myArray = myArray.sort(function(a, b){
				    return a.object.rang-b.object.rang
				})
				// On déplace l'élément
				var objectADepacer = myArray[event.oldDraggableIndex];
				myArray.splice(event.oldDraggableIndex, 1);
    			myArray.splice(event.newDraggableIndex, 0, objectADepacer);
			
				// on remet dans l'objet le bon index !!
				myArray = myArray.map((obj, index) => {
					obj.object.rang = index;
					return obj;
				})
				
				
				// On renvoit le tableau ... sufirra de mettre le bon rang dans le tableau initial
				this.$emit("sortData", myArray);
				
			}
		}
	}
</script>