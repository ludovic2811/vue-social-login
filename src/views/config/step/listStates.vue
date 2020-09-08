<template>
	<div   class="contain"><br/>
		<input type="text" :value="refresh"/>
		<s-button theme="is-primary" icon="plus" label="Ajouter un état"  @onclick="addEtat"></s-button>&nbsp;&nbsp;
		<s-button theme="is-primary is-small" icon="info" label=""  @onclick="infoEtat=!infoEtat"></s-button>
		
		<div class="notification is-warning" v-show="infoEtat">
			<button class="delete" v-on:click="infoEtat=false"></button>
			Vous pouvez configurer les états de vos articles.<br/>
			A savoir si ils sont partis ou pas.<br/>
			Attribuez un icone avec un nom.<br/>
			Le champ sorti signfie si l'article n'est plus dans votre lieu de stockage<br/>
			Cela permet de calculer le nombre de places restants dans votre lieu de stockage
		</div>
		<br/><br/>
		<ul>
			<li v-for="etat in agence.etats">
				<s-select :list="iconsEtats" :valueSelected="etat.icon" :change="etat" attributChange="icon" :fields="fields" @selected="" labelNotSelected="Icon"/>
				&nbsp;&nbsp;
				<input type="text"class="input" v-model="etat.nom" style="width:100px" placeholder="Libelle" />
				&nbsp;&nbsp;<input type="hidden" v-model="etat.icon"/>
				
				<s-button theme="is-danger" icon="trash" label="" @onclick="deleteEtat(etat.id)"></s-button><br/><br/>
			</li>
		</ul>
		<div class="notification is-danger" v-show="error">
	      <button class="delete" v-on:click="error=false"></button>
	      Il faut au moins un état !
	      Leur nom est oblitaoire !
	    </div>
		
	
		
	</div>
</template>
<script>
	import etat_api from '@/firebase/etat_api'
	
	import library_icons from "@/firebase/library_icon"
	export default {
		props : ["agence","refresh"],
		data: function() {
			return {
				fields: ['label', 'value', 'icon'],				
				iconsEtats: library_icons.iconsEtats,				
				infoEtat: false,
				error: false	
			}
		},
		methods: {  
			addEtat() {
				var etat =  JSON.parse(JSON.stringify(etat_api.api.json_etat));
				etat.id = this.$uuid();
				this.agence.etats[etat.id] = etat;
				this.$emit("refresh");
							
			},
			deleteEtat(idEtat) {
				etat_api.api.delete(this.agence, idEtat,()=>{
					
				});
			},
			save(fct) {
				this.error = false;
				
				var nb=0;
				
				for (var key in this.agence.etats) {					
					this.error =  this.agence.etats[key].nom =="" || this.error					
					nb++;
				}
				if (nb==0)
					this.error = true;
				if (!this.error)
					etat_api.api.save(this.agence, ()=>{
						fct(true);
					});	
				else
					fct(false);
				
				
			}
		}
	}
</script>