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
                    <div class="date">
                        Départ le 
                    </div>
                    <div class="date">
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
                                @onclick="selectInOut(inoutItem)" v-show="editable(inoutItem)"/>
                            <span v-show="!editable(inoutItem)">
                            {{inouts.length-index}}
                            </span>
                        </div>
                        <div class="dateItem">
                            {{formatDate(inoutItem.departLe)}}
                        </div>
                        <div class="dateItem">
                            {{formatDate(inoutItem.rentreLe)}}
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
                    <s-button label="Ajouter" icon="calendar-plus"
                        theme="is-primary"
                        @onclick="addInOut"/>
                    <date-picker 
                        :dates="dates"
                        :open="openDatePicker"
                        @close="openDatePicker=false"
                        @save="set"
                    ></date-picker>
                   
                      </div>
      				
      				
    			</footer>
  			</div>
  			
			</div>
		</div>
</template>
<script>
import  firebase_api from "@/firebase/firebase_api"; 
import  inout_api    from "@/firebase/inout_api"
import  DatePicker   from "@/components/datePicker.vue"
export default {
   
    props: ["client", "article","open"],
    components: {
        DatePicker
    },
    data() {
        return {
            inout: JSON.parse(JSON.stringify(inout_api.api.json_inout)),
            classModal: "modal",
            inouts: [],
            openDatePicker: false,
            dates: {
                start: '',
                end: ''
            }
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
        editable(inoutItem) {
            var date = new Date();
            if (date > inoutItem.rentreLe)
                return false;
            else   
                return true;
        },
        addInOut () {
            this.inout = JSON.parse(JSON.stringify(inout_api.api.json_inout));
            this.openDatePicker = true;
             this.dates.start = '';
             this.dates.end = '';
        },
        formatDate(date) {
            
            var myDate = new Date(date)
            return this.$convertDateToString(myDate);
        },
        selectInOut(inout) {
            this.dates.start    = inout.departLe;
            this.dates.end      = inout.rentreLe;
            this.inout          = inout;
            this.openDatePicker = true;
        },
        updateArticle() {
            inout_api.api.updateArticle(this.$store, this.client, this.article, this.inouts,
                inouttemp=>{
                    this.article.departLe = inouttemp.departLe;
                    this.article.rentreLe = inouttemp.rentreLe;
                });
        },
        add(dates) {
            
             this.inout.idClient = this.client['.key'];
             this.inout.idArticle = this.article.id;
             this.inout.departLe = Date.parse(dates.start);
             this.inout.rentreLe = Date.parse(dates.end);
            
             inout_api.api.add(this.$store, this.inout, inoutItem=>{
                 this.inout = JSON.parse(JSON.stringify(inout_api.api.json_inout))
                 this.init(()=>{
                     this.updateArticle();
                     this.openDatePicker = false;
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
        set (dates) {
             if( this.inout.id == -1) {
                 this.add(dates);
             }
             else {
                this.inout.departLe = Date.parse(dates.start);
                this.inout.rentreLe = Date.parse(dates.end);
                inout_api.api.set(this.$store, this.inout, inout=>{
                    this.inout = JSON.parse(JSON.stringify(inout_api.api.json_inout))
                    this.init(()=>{
                        this.updateArticle();
                         this.openDatePicker = false;
                    });
                })
            }
        },
        init(fct) {
            if (this.article.id != "") {
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
        width: 15%;
        font-weight: bolder;
    }
    .date {
        display: inline-block;
        width: 30%;
        margin-left: 13px;
        font-weight: bolder;
    }
    .trash {
        display: inline-block;
        width: 15%;
        padding-top: 0px;
    }
    .itemInOut {
        border: solid thin black;
        margin-bottom: 2px;
        height: 50px;
        vertical-align: middle;
         width: 100%;
    }
    .itemInOutSelected {
        border: solid thin black;
        margin-bottom: 2px;
        height: 50px;
        vertical-align: middle;
    }
    .itemInOutItem {
        display: inline-block;
        width: 15%;
        padding-top: 10px; 
        height: 100%;
        font-weight:normal;
    }
     .dateItem {
        display: inline-block;
        width: 30%;
        margin-left: 13px;
        padding-top: 10px; 
        height: 100%;
        
        font-weight:normal;
    }
    .trashItem {
        display: inline-block;
        width: 10%;
        vertical-align: top;
        padding-top: 5px; 
        margin-left: 3px; 
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