<template>
    <div :class="classModal">
			<div class="modal-background"></div>
  			<div class="modal-card" style="width:90%">
	    		<header class="modal-card-head">
				      <p class="modal-card-title">Départ - Sortie</p>	
				      <div style="float:rigth" >
				      	<s-button theme="" label="" icon="times-circle" @onclick="$emit('close')"/>
				      </div>

				</header>
				<section class="modal-card-body">
                    <div class="inout">
                        n°
                    </div>
                    <div class="inout">
                        Départ le 
                    </div>
                    <div class="inout">
                            Rentre le 
                    </div>
                    <div class="trash">
                            
                    </div>
                    <div class="list">
					<div v-for="(inoutItem, index) in inouts" 
                        :class="(inout.id == inoutItem.id) ? 'itemInOutSelected' : 'itemInOut' ">
                         <div class="itemInOutItem">
                           
                           <s-button 
                                icon="edit"
                                :label="inouts.length-index"
                                theme="is-primary is-small"
                                @onclick="selectInOut(inoutItem)" v-show="index==0"/>
                            <span v-show="index!=0">
                            {{inouts.length-index}}
                            </span>
                        </div>
                        <div class="itemInOutItem">
                            {{inoutItem.departLe}}
                        </div>
                        <div class="itemInOutItem">
                            {{inoutItem.rentreLe}}
                        </div>
                        <div class="trashItem">
                            <s-button 
                                icon="trash"
                                label=""
                                theme="is-danger is-small"
                                @onclick="deleteInOut(inoutItem)"/>
                        </div>
					</div>
                      </div>
				</section>
				<footer class="modal-card-foot">
                    <div style="width:100%">
                    <div class="itemFooter">
      				    Part le
                    </div>
                    <div class="itemFooter">
                        Rentre le
                     </div>  
                    
                    <div>
                     <div class="itemFooter">
      				     <input type="date" v-model="inout.departLe" style="width:130px"/>
                    </div>
                    <div class="itemFooter">
      				    <input type="date" v-model="inout.rentreLe" style="width:130px"/>
                    </div> 
                    
                    <div class="add">
                        <s-button 
                        theme="button is-success" 
                        label="Ajouter" icon="plus" 
                        @onclick="add"
                        v-show="inout.id == -1"></s-button>
                      
                        <s-button 
                        theme="button is-success" 
                        label="Enregistrer" icon="save" 
                        @onclick="set"
                        v-show="inout.id != -1"></s-button>
                        
                         <s-button 
                        theme="button is-warning" 
                        label="Annuler" icon="cancel" 
                        @onclick="cancel"
                        v-show="inout.id != -1"></s-button>
                        </div>
      				</div>
                      </div>
      				
      				
    			</footer>
  			</div>
  			
			</div>
		</div>
</template>
<script>
import firebase_api from "@/firebase/firebase_api"; 
import inout_api    from "@/firebase/inout_api"

export default {
   
    props: ["client", "article","open"],
    data() {
        return {
            inout: JSON.parse(JSON.stringify(inout_api.api.json_inout)),
            classModal: "modal",
            inouts: []
        }
    },
    watch: {
            open: {
                 handler(val) {      
                      
                    if (val) {
                        
                        this.classModal = "modal is-active";
                       
                        this.init(()=>{
                            
                        });
                    }
                    else
                        this.classModal = "modal";
                 },
                 deep: true
            }
	},
    methods: {
        selectInOut(inout) {
            this.inout = inout;
        },
        updateArticle() {
            inout_api.api.updateArticle(this.$store, this.client, this.article, this.inouts,
                inouttemp=>{
                    this.article.departLe = inouttemp.departLe;
                    this.article.rentreLe = inouttemp.rentreLe;
                });
        },
        add() {
             this.inout.idClient = this.client['.key'];
             this.inout.numero = this.article.numero;
             inout_api.api.add(this.$store, this.inout, inoutItem=>{
                 this.inout = JSON.parse(JSON.stringify(inout_api.api.json_inout))
                 this.init(()=>{
                     this.updateArticle();
                 });
             })
        },
        deleteInOut (inoutItem) {
             inout_api.api.delete(this.$store, inoutItem, inout=>{
                this.inout = JSON.parse(JSON.stringify(inout_api.api.json_inout))
                this.init(()=>{
                     this.updateArticle();
                 });
             })
        },
        cancel () {
            this.inout = JSON.parse(JSON.stringify(inout_api.api.json_inout))
            
        },
        set () {
             inout_api.api.set(this.$store, this.inout, inout=>{
                this.inout = JSON.parse(JSON.stringify(inout_api.api.json_inout))
                 this.init(()=>{
                     this.updateArticle();
                 });
             })
        },
        init(fct) {
            if (this.article.numero != "") {
                inout_api.api.getAll(this.$store, this.client, this.article, inouts=>{
                    this.inouts = inouts;
                    fct();
                })
            }
        }
    },
    mounted() {
        if (this.article!=null)
            this.init(()=>{

            });
       
    }
    
  }

</script>
<style scoped>
    .inout {
        display: inline-block;
        width: 25%;
        font-weight: bolder;
    }
    .trash {
        display: inline-block;
        width: 25%;
        padding-top: 0px;
    }
    .itemInOut {
        border: solid thin black;
        margin-bottom: 2px;
        height: 50px;
        vertical-align: middle;

    }
    .itemInOutSelected {
        background-color:chartreuse;
        border: solid thin black;
        margin-bottom: 2px;
        height: 50px;
        vertical-align: middle;
    }
    .itemInOutItem {
        display: inline-block;
        width: 25%;
        padding-top: 10px; 
        height: 100%;
        font-weight:normal;
    }
    .trashItem {
        display: inline-block;
        width: 25%;
        vertical-align: top;
        padding-top: 5px; 
    }
    .list {
        overflow-y: auto;
        height: 300px;
    }
    .itemFooter {
        width: 150px;
        display: inline-block;
        text-align: center;
        margin-right: -10px;
    }
    .add {
        margin-top: 10px;
        display: inline-block;
         margin-left: 10px;
    }
</style>