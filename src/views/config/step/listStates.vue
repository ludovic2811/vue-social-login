<template>
	<div   class="contain"><br/>
		
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
			<li v-for="(etat,index) in $store.getters.getEtats">
				<s-select :list="iconsEtats" :valueSelected="etat.icon" :change="etat" attributChange="icon" :fields="fields" @selected="" labelNotSelected="Icon"/>
				&nbsp;&nbsp;
				<input type="text"class="input" v-model="etat.nom" style="width:100px" placeholder="Libelle" />
				&nbsp;&nbsp;<input type="hidden" v-model="etat.icon"/>
				&nbsp;&nbsp;Sortie ?&nbsp;<input type="checkbox" v-model="etat.sorti"/>
				&nbsp;&nbsp;
				<s-button theme="is-danger" icon="trash" label="" @onclick="deleteEtat(etat.id)"></s-button><br/><br/>
			</li>
		</ul>
		<div class="notification is-danger" v-show="error">
	      <button class="delete" v-on:click="error=false"></button>
	      Il faut au moins un état !
	    </div>
		
	
		
	</div>
</template>
<script>
	import etat_api from '@/firebase/etat_api'
	
	import library_icons from "@/firebase/library_icon"
	export default {
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
				this.etat =  JSON.parse(JSON.stringify(etat_api.api.json_etat));
				etat_api.api.save(this.$store.getters.getDocAgence, this.etat, ()=>{
				
				});				
			},
			deleteEtat(idEtat) {
				etat_api.api.delete(this.$store.getters.getDocAgence, idEtat,()=>{
				
				});
			},
			save(fct) {
				this.error = false;
				if (this.$store.getters.getEtats.length > 0) {
					this.$store.getters.getEtats.forEach(etat=>{
						etat_api.api.save(this.$store.getters.getDocAgence, etat, ()=>{
							
						});
					})
					fct(true);
				}
				else {
					this.error = true;
					fct(false);
				}
			}
		}
	}
</script>