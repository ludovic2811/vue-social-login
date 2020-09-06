<template>
    <div class="container">
        <v-calendar  
        	@update:from-page="pageChange"  
        	ref="calendar" :rows="1" 
        	:first-day-of-week="2" 
        	:attributes="attributes" 
        	
        	>
            	
            	<template slot="day-content" slot-scope="props">
                	<div 
                		v-if="props.day.inMonth" 
                		class="caseDate"
                		v-on:click="openModalItemDate(props.day.date)" >
                    <div>
                        <span>{{ props.day.day }}</span>
                    </div>
                    <div v-if="props.attributesMap">
                        <!-- Should probably check if the event actually occurs on this date -->
                        <div  v-for="dayEvent in props.attributesMap.events.customData.events">
                            <p class="label">
                            	<s-button 
                            		v-if="dayEvent.rentrele.length!=0" 
                            		theme="is-primary is-small is-rounded" 
                            		icon="" 
                            		:label="dayEvent.rentrele.length"
                            	></s-button><br/>
                            	<s-button 
                            		v-if="dayEvent.partirle.length!=0" 
                            		theme="is-danger is-small is-rounded" 
                            		icon="" 
                            		:label="dayEvent.partirle.length"
                            	></s-button>
                            	
                            </p>
                        </div>
                    </div>
                </div>
            </template>
        </v-calendar>

        <item-date :date="itemDate" :clients="tabItem" :open="openIdemDate"    @close="openIdemDate=false"/>
    </div>
</template>

<script>
	import planning_api from "@/firebase/planning_api"
	import ItemDate from "@/views/planning/itemDate.vue"
    export default {
        name: 'EventCalendar',
        components:{
        	ItemDate
        },
        data() {
            return {
                ghettoUpdate: 0,
                screens: {
			    tablet: '576px',
			    laptop: '992px',
			    desktop: '1200px',
			  },
                attributes: [{
                    key: 'events',
                    dates: [],
                    customData: {
                        events: []
                    }
                }],
                tabDates: {},
                openIdemDate: false,
                itemDate: null,
                tabItem: {},
                YYYYMM :null
            }
        },
        mounted() {
                
                var date = new Date();
               

                this.init(this.convertYYYYMM(date));
            
        },

        methods: {
            convertYYYYMM(date) {
                var month = date.getMonth() + 1;
                if (month < 10)
                    month = "0" + month;
                return date.getFullYear()+"-"+month;
            },
            init(YYYYMM) {
               
                this.tabDates = {};
                
                if (this.YYYYMM != YYYYMM) {
                   this.YYYYMM = YYYYMM;
                 
                    planning_api.api.getClientsByMonth(this.$store, YYYYMM, clients=>{

                        clients.forEach(client=> {
                            client.articles.forEach(article=>{
                                if (typeof(this.tabDates[article.rentrele]) == "undefined") {
                                    this.tabDates[article.rentrele] = {};
                                    this.tabDates[article.rentrele].rentrele = [];
                                    this.tabDates[article.rentrele].partirle = [];
                                }
                                if (typeof(this.tabDates[article.partirle]) == "undefined") {
                                    this.tabDates[article.partirle] = {};
                                    this.tabDates[article.partirle].partirle = [];
                                    this.tabDates[article.partirle].rentrele = [];
                                }
                                this.tabDates[article.rentrele].rentrele.push(client);
                                this.tabDates[article.partirle].partirle.push(client);
                            })

                        })
                        
                        for (var dateKey in this.tabDates) {
                            this.addEvent(dateKey, this.tabDates[dateKey].rentrele, this.tabDates[dateKey].partirle )
                        }
                        
                        
                         /*= [];
                        tabDepart[res.departle] = [];*/
                      })
                }
            }
            ,
        	formatDate(date) {
        		var date = new Date(date);
            	var month = date.getMonth() + 1;
            	var day = date.getDate();
            	if (month < 10)
            		month = "0" + month;
            	if (day < 10)
            		day = "0" + day;
            	return date.getFullYear()+"-"+month+"-"+day;
        	},
        	openModalItemDate(date) {

        		var dateFormat = this.formatDate(date);
        		
                if (typeof(this.tabDates[dateFormat]) != "undefined") {

                    this.itemDate = dateFormat;
            		
            		this.tabItem = this.tabDates[this.itemDate];

                    this.openIdemDate = true;
                }
        	},
            pageChange(change) {
               
                var date = new Date (change.year + "-" + change.month + "-01");
                this.init(date);
            },
            addEvent(date, rentrele, partirle) {
                var attribute = {
                    key: 'events',
                    dates: [],
                    customData: {
                        events: []
                    }}
                
                attribute.dates.push(new Date(date));
                
                attribute.customData.events.push({
                    rentrele: rentrele,
                    partirle: partirle,
                    date: date
                });      
                
                this.attributes.push(attribute);
                // Calendar does not seem to update here if we update the props, so use a key for now
                //this.ghettoUpdate += 1;
            }
        }
    }
</script>
<style scoped>
    
    .caseDate {
        width: 55px;
        min-height: 70px;
        border: thin silver solid;
        text-overflow: 'ellipsis';
        margin: 1px;
    }
    .label {
    	margin-top: -15px;
    	margin-right: 2px;
    	text-align: right;
    	padding-bottom: 2px;
    }
</style>