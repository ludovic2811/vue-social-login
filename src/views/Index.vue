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
								<p class="subtitle">Simple, fiable, configurable et <u>installable</u></p>
								<div class="content">
									Vous pouvez l'utiliser via le site ou sur votre portable.
									<br/>Vous pouvez également l'INSTALLER sur votre PC ou sur votre portable comme un véritable produit :
									<a href=""> Cliquez ici pour savoir comment</a>
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
	</div>
</template>
<script>
import firebase from "firebase"
import carroussel from "@/views/carroussel.vue"
export default {
	data() {
		return {
			openModal: false
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
	}
}
</script>
<style scoped>
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