<template>
    <div>
        <button class="px-4 py-2 bg-white rounded border" @click.stop.prevent="() => { addEvent('nani', '2020-08-04') } ">Add Fake Event</button>
        <v-calendar  @update:from-page="pageChange"  ref="calendar" :rows="1" :first-day-of-week="2" :masks="{ weekdays: 'WWWW' }" :attributes="attributes" :key="ghettoUpdate">
            <template slot="day-content" slot-scope="props">
                <div v-if="props.day.inMonth" class="caseDate"
                v-on:click="addEvent('nani', props.day.date)" >
                    <div>
                        <span>{{ props.day.day }}</span>
                    </div>
                    <div v-if="props.attributesMap">
                        <!-- Should probably check if the event actually occurs on this date -->
                        <div  v-for="dayEvent in props.attributesMap.events.customData.events">
                            <p class="label">{{ dayEvent.name }}</p>
                        </div>
                    </div>
                </div>
            </template>
        </v-calendar>
    </div>
</template>

<script>
    export default {
        name: 'EventCalendar',
        data() {
            return {
                ghettoUpdate: 0,
                attributes: [{
                    key: 'events',
                    dates: [],
                    customData: {
                        events: []
                    }
                }],
            }
        },
        mounted() {
            this.$nextTick(() => {
                
            })
        },
        methods: {
            pageChange(change) {
                console.log(change);                
            },
            addEvent(name, date) {
                var attribute = {
                    key: 'events',
                    dates: [],
                    customData: {
                        events: []
                    }}
                
                attribute.dates.push(new Date(date));
                
                attribute.customData.events.push({
                    name: name,
                    date: date
                });      
                
                this.attributes.push(attribute);
                // Calendar does not seem to update here if we update the props, so use a key for now
                this.ghettoUpdate += 1;
            }
        }
    }
</script>
<style scoped>
    .label {
        background-color: green;
        color: white;
        width: 50px;
        height: 25px;
        min-height: 25px;
        text-overflow: 'ellipsis';
        white-space: nowrap;
        overflow: hidden;
        font-size: 12px;
        padding: 2px;
    }
    .caseDate {
        width: 60px;
        min-height: 50px;
        border: thin silver solid;
        text-overflow: 'ellipsis';
    }
</style>