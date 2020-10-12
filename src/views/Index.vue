<template>
	<div class="container">
		<nav class="level">
		<div class="level-left">
			<div class="level-item">
				<img src="@/assets/logo.png"   />
				<div class="title" > <span class="logoTitle">Guarding Manager</span></div>
			</div>
		</div>
		<div class="level-right">
			<div class="level-item">
				<s-button v-if="!existUser()" theme="is-primary" label="Se loguer" icon="" @onclick="rout('/login')" />
				<s-button v-if="existUser()" theme="is-primary" :label="getDisplayName ()" icon="" @onclick="rout('/client')" />
			</div>
		</div>
		</nav>
		<div class="footerHome" v-show="!infoVersion && !infoAProposDe && !infoInstall">
			<div v-on:click="rout('/contact')">
				Contactez moi
			</div>
			<div v-on:click="infoAProposDe=true">
				à propos de
			</div>
			<div v-on:click="infoVersion=true">
				{{version}}
			</div>
		</div>
		<div class="tile is-ancestor">
			<div class="tile is-vertical is-8">
				<div class="tile">
					<div class="tile is-parent is-vertical">
						<article class="tile is-child notification is-primary">
						<p class="title">Vous êtes </p>
						<p class="subtitle">
							une entreprise qui garde des véhicules pour du gardiennage (ou d'hivernage) ?
							<br/>
						</p>
						<p class="subtitle"><b>Guarding Manager</b> est fait pour vous !</p>
						<p class="contain">Guarding Manager est un outil de gestion vous permettant de gérer l'ensemble de vos activités </p>
						</article>
						<article class="tile is-child notification is-primary">
						<p class="title">Prêt ?</p>
						<p class="subtitle">Il vous suffit de vous <a href="" v-on:click="rout('/login')">loguer</a> et vous laisser guider
						<br/>
						</p>
						<div class="contain">
							Vous pouvez utiliser le produit tout de suite avec un mode gratuit (limité à 5 clients)
						</div>
						</article>
					</div>
					<div class="tile is-parent">
						<article class="tile is-child notification is-info">
						<p class="title">Quelques exemples</p>
						<p class="subtitle">Liste des clients</p>
						<figure class="image is-4by3">
							<img src="@/assets/captureHome.png" v-on:click="openModal='modal is-active'">
						</figure>
						
						</article>
					</div>
				</div>
				<div class="tile">
					<div class="tile is-parent">
						<article class="tile is-child notification is-primary">
							<div class="content">
								<p class="title">Le produit en ligne</p>
								<p class="subtitle">Simple, fiable, configurable et 
									<a v-on:click="infoInstall=true">installable</a></p>
								<div class="content">
									Vous pouvez l'utiliser via le site ou sur votre portable.
									<br/>Vous pouvez également l'INSTALLER sur votre PC ou sur votre portable comme un véritable produit :
									<a v-on:click="infoInstall=true"> Cliquez ici pour savoir comment</a>
									<br/><br/>
									
								</div>
							</div>
						</article>
						</div>
						<div class="tile is-parent ">
							<article class="tile is-child notification is-info">
								<div class="content">
									<p class="title">Tarif</p>
									<p class="contain">
										Vous avez un essai gratuit limité à 5 clients ...
									</p>
									<p class="subtitle">3 formules d'abonnement :</p>
									<div class="items">
										<div>
										Dove : 10€ par mois (max 200 clients)
										</div>
										<div>
										Spider : 50€ par mois (max 500 clients)
										</div>
										<div>
										Dragon : 100€ par mois (max 1000 clients)
										</div>
									</div>
									
								</div>
							</article>
						</div>
				</div>
			</div>
			<div class="tile is-parent">
				<article class="tile is-child notification is-success">
				<div class="content">
					<p class="title">Ce que vous pouvez faire </p>
					<p class="subtitle"><br/></p>
					<div class="items">
						<div>
							<span class="icon">
  								<i class="fas fa-home"></i>
							</span>&nbsp;
							Configurer votre agence
						</div>
						<div>
							<span class="icon">
  								<i class="fas fa-user-plus"></i>
							</span>&nbsp;
							Créer des clients
						</div>
						<div>
							<span class="icon">
								<i class="fas fa-search"></i>
							</span>&nbsp;
							Rechercher facilement un client
						</div>
						<div>
							<span class="icon">
								<i class="fas fa-camera"></i>
							</span>&nbsp;
							Photographier la plaque d'immatriculation et trouver à qui appartient le véhicule
						</div>
						<div>
							<span class="icon">
								<i class="fas fa-money-check-alt"></i>
							</span>&nbsp;
							
							Gérer les paiements de vos clients
						</div>
						<div>
							<span class="icon">
								<i class="fas fa-file-invoice-dollar"></i>
							</span>&nbsp;
							Lister les impayés
						</div>
						<div>
							<span class="icon">
								<i class="fas fa-calendar-alt"></i>
							</span>&nbsp;
							Voir en un coup d'oeil les entrées et sorties de vos clients gràce à un planning simple
						</div>
						<div>
							<span class="icon">
								<i class="fas fa-chart-bar"></i>
							</span>&nbsp;
							Visualiser en un coup d'oeil l'état de votre agence
						</div>
					</div>
				</div>
				</article>
			</div>
			</div>
			<div class="screen" v-show="openModal">
				<div class="modal-background"></div>
					<div style="width:100%;height: 50px;padding: 3px;">
						<div style="float:right" >
							<s-button theme="is-danger" label="" icon="times-circle" @onclick="openModal=false"/>
						</div>
					</div>
					<carroussel></carroussel>
							
			</div>
			<div class="modal is-active" v-show="infoAProposDe">
				<div class="modal-background"></div>
				<div class="modal-card">
					<header class="modal-card-head">
						<p class="modal-card-subtitle" style="width:90%" >A propos de</p>	
						<div style="float:rigth" >
							<s-button theme="" label="" icon="times-circle" @onclick="infoAProposDe=false"/>
						</div>				      
					</header>
				<section class="modal-card-body">
					<b>Guarding Manager</b> a été crée par la société <b>MakApp</b>
					<br/><br/>dont le gérant est <b>Ludovic Baillet</b>
					<br/><br/>
					<br/> Le siège est situé à <br/>
					<b>840 rue jean carpentier <br/>
					59112 Annoeullin</b>

				</section>
				</div>
			</div>
			<div class="modal is-active" v-show="infoVersion">
				<div class="modal-background"></div>
				<div class="modal-card">
					<header class="modal-card-head">
						<p class="modal-card-subtitle" style="width:90%" >Versions</p>	
						<div style="float:rigth" >
							<s-button theme="" label="" icon="times-circle" @onclick="infoVersion=false"/>
						</div>				      
					</header>
				<section class="modal-card-body">
					<b>Liste des versions</b> <br/>
					<div>
						V1.0 : Mise en ligne
					</div>
					

				</section>
				</div>
			</div>
			<div class="modal is-active" v-show="infoInstall">
				<div class="modal-background"></div>
				<div class="modal-card">
					<header class="modal-card-head">
						<p class="modal-card-title" style="width:90%" >Installer le produit</p>	
						<div style="float:rigth" >
							<s-button theme="" label="" icon="times-circle" @onclick="infoInstall=false"/>
						</div>				      
					</header>
				<section class="modal-card-body">
					
					<div>
						Le site a été développé en PWA<br/><br/>
						Vous pouvez donc l'installer sur votre terminal (Ordinateur, Tablette ou Mobile)<br/><br/>
						Selon le navigateur ou le système d'exploitation que vous utilisez, la manipulation peut être différente<br/>
						<br/><br/>
						Le principe est cependant le même : il suffit d'aller sur le menu de votre navigateur et de cliquer sur :<br/>
						- Installer l'application<br/>
						- ou Ajouter à l'écran d'accueil
						<br/><br/>
						<b>Un raccourci est alors crée sur votre bureau<br/></b>
						L'application une fois installée se comporte comme une application standard ! <br/><br/>
						<b>Notez</b> qu'à la première connexion au site, le navigateur vous demande automatiquement d'installer le produit <br/>
						<br/><br/>
						<i>Pour le supprimer, il vous suffit de le désinstaller comme tout autre application <br/></i>
					</div>
					

				</section>
				</div>
			</div>
	</div>
</template>
<script>
import firebase from "firebase"
import carroussel from "@/views/carroussel.vue"
export default {
	data() {
		return {
			openModal: false,
			version: "V1.01",
			infoAProposDe: false,
			infoVersion: false,
			infoInstall: false
		}
	},
	components: {
		carroussel
	},
	methods: {
		rout(nav) {
			this.$router.push(nav).catch(error=>{})
		},
		 existUser() {
		return firebase.auth().currentUser != null;
		},
		getDisplayName () {
			if (firebase.auth().currentUser != null)
				return firebase.auth().currentUser.displayName;
			else
				return "";
			}
	},
	mounted() {
	 const recaptcha = this.$recaptchaInstance
      if (recaptcha)
        recaptcha.hideBadge();
	}
}
</script>
<style scoped>
	.footerHome {
		position: fixed;
		bottom: 0;
		width: 100%;
		max-width: 1400px;
		z-index: 1000;		
		opacity: 0.9;
		background-color: white;	
		color: rgb(51, 101, 148);
		font-weight: bold;
		font-size: 15px;
	}
	.footerHome div {
		width: 33%;
		text-align: center;
		padding-top: 10px;
		padding-bottom: 10px;
		display: inline-block;
	}
	.footerHome div:hover {
		
		text-decoration: underline;
		cursor: pointer;
	}
	.logoTitle {
		color: #325D88;
	}
	.items {
		font-size: 15px;

	}
	.items div {
		margin-top: 25px;
	}
	.screen {
		height: 100%;
		width: 100%;
		top: 0px;
		left: 0px;
		position: absolute;
		background-color: white;
	}
	
</style>