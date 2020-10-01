<template>
	<div>
		<br/>
		<div class="contain">
			
		   	<button class="button is-primary" v-on:click="addNewUser='modal is-active'">
		   		<span class="icon">
		   			<i class="fas fa-plus"/>
		   		</span>
		   		<span>
		   			Ajouter un utilisateur
		   		</span>
		   	</button>
		   	<div :class="addNewUser">
			<div class="modal-background"></div>
  			<div class="modal-card">
	    		<header class="modal-card-head">
				      <p class="modal-card-title">Ajouter un utilisateur</p>				      
				</header>
				<section class="modal-card-body">
					
					<label class="label">
						Nom : 
					</label>
					
					<p class="control has-icons-left has-icons-right">
						<input type="email" class="input is-rounded" v-model="user.displayName"  placeholder="Nom de l'utilisateur"/>
						<span class="icon is-small is-left">
						<i class="fas fa-user"></i>
					    </span>
					    <span class="icon is-small is-right">
					      <i class="fas fa-exclamation-triangle"></i>
					    </span>
					</p>
					<br/>
					<div class="notification is-danger" v-show="erreur.nom">
						  <button class="delete" v-on:click="erreur.nom=false"></button>
						  Le nom est obligatoire !
					</div>
      				
					

					<label class="label">
						Mail : 
					</label>
					<p class="control has-icons-left has-icons-right">
						<input type="email" class="input is-rounded" v-model="user.email"  placeholder="Email de l'utilisateur"/>
						<span class="icon is-small is-left">
						<i class="fas fa-envelope"></i>
					    </span>
					    <span class="icon is-small is-right">
					      <i class="fas fa-exclamation-triangle"></i>
					    </span>
					</p>
					<br/>
					<div class="notification is-danger" v-show="erreur.format">
						  <button class="delete" v-on:click="erreur.format=false"></button>
						  Le mail n'est pas au bon format : aaaa@bbbb.ccc
					</div>
					<div class="notification is-danger" v-show="erreur.email">
						  <button class="delete" v-on:click="erreur.email=false"></button>
						  Le mail est obligatoire !
					</div>
					<br/><br/>
					<div class="notification is-warning" v-show="erreur.exists">
						  <button class="delete" v-on:click="erreur.exists=false"></button>
						  Cet utilisateur est déjà dans inscrit sur ce compte
					</div>
				</section>
				<footer class="modal-card-foot">
      				
      				<s-button theme="button is-success" label="Enregistrer" icon="save" @onclick="saveUser"></s-button>
      				<s-button theme="button is-warning" label="Annuler" icon="ban" @onclick="addNewUser='modal'"></s-button>
      				
    			</footer>
  			</div>
  			
			</div>
		</div>
		   	<br/><br/>
		   	<div class="contain">
		   	<article class="media" v-for='user in users'>
			    <div class="media-left">
			      <figure class="image is-64x64">
					<img :src="user.photoURL" alt="Image" v-show="user.photoURL!='' && user.photoURL!=null"/>
			        <img src="@/assets/profil_blank.png" alt="Image" v-show="user.photoURL=='' || user.photoURL==null"/>
			        </figure>
			    </div>
			    <div class="media-content" >
			      <div class="content" >
			        <p>
			          <strong>{{user.displayName}}</strong> &nbsp;<small>{{user.email}}</small> 
			        </p>
			      </div>
			      <nav class="level is-mobile" style="width:250px">
			        <div class="level-left">
			          <button class="button is-success" disabled v-show="user.login">
			          	<span class="icon">
			          		<i class="fas fa-link"/>
			          	</span>
			          	<span>CONNECTE !</span></button>

			          <button class="button is-danger" disabled v-show="user.userNew == null && !user.login">
			          <span class="icon">
			          		<i class="fas fa-unlink"/>
			          	</span>
			          	<span>PAS LOGUE</span></button>

			          	<button class="button is-warning" v-show="user.userNew != null && !user.login" v-on:click="confirm(user)">
			          	<span class="icon">
			          		<i class="fas fa-link"/>
			          	</span>
			          	<span>CONFIRME ?</span></button>
			        </div>

			        <div class="level-right" v-if='$store.getters.getUser.id != user.id' v-on:click="deleteUser(user.id)">
			        	 <button class="button is-danger" aria-label="retweet">
			            <span class="icon is-large">
			              <i class="fas fa-trash" aria-hidden="true"></i>
			            </span>
			            <span>
			            	Supprimer
			            </span>
			        	</button>
			          
			        </div>
			      </nav>
			    </div>
			  </article>

			</div>

		</div>
	</div>
</template>
<script>

import user_api from "@/firebase/user_api"; 
import Vue from "vue"
	export default {
		props:["agence"],
		name: "user",
		data: function() {
			return {
				account: {},
				users:[],
				addNewUser: "modal",
				user: user_api.api.json,
				erreur: {nom:false,email:false,format:false, exists: false}
			}
		},
		methods :{
			getLength() {
				if (typeof(this.users)=="undefined")
					return 0;
				else
					return this.users.length;
			},
			refresh() {
				this.users=[];
				user_api.api.getUsersByAgence(this.agence, this.users );
			},
			deleteUser(userId) {
				user_api.api.deleteAgence(this.$store.getters.getUser.id, this.agence, userId, () => {
					this.refresh();		
				});
			},
			confirm(user) {
				//currentAgence, docAgence, userASupprimer, fct)
				user_api.api.confirm(this.agence, user, ()=> {
					this.refresh();
				});
			},
			save(fct) {
				fct(true);
			},
			saveUser() {
				var erreur = false;
				
				this.erreur.nom = this.user.displayName == '';				
				
				if (this.user.email == '') {
					this.erreur.email = true;
					this.erreur.format =false;					
				}
				else {
					 var reEmail = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;

    				 this.erreur.format = !this.user.email.match(reEmail);
    				 this.erreur.email = false;				 	
				}
				
				var erreur = this.erreur.nom || this.erreur.email || this.erreur.format
			
				if (!erreur) {					
					user_api.api.createWithoutAuth(this.$store, this.$store.getters.getUser.id, this.agence, this.user.displayName, this.user.email, 
						(error) =>{
							if (typeof(error) == "undefined") {
								this.addNewUser = "modal";
								this.erreur.exist = false;
								this.refresh();
							}
							else {
								this.erreur.exists = true;
							}
					})
				}
				
			}
		},

		mounted: function() {
     		this.refresh();
    	}
	}
</script>