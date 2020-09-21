<template>
    <div>
     <apexchart width="100%" type="bar" :options="chartOptions" :series="series"></apexchart>
   </div>
</template>
<script>
import apexchart from 'vue-apexcharts'
export default {
    components: {
        apexchart
    }, 
     data: function() {
      return {
        initChart: {
            chart: {
              type: 'bar',
              height: 350,
              stacked: true,
            },
            plotOptions: {
              bar: {
                horizontal: true,
              },
            },
            stroke: {
              width: 1,
              colors: ['#fff']
            },
            title: {
              text: 'Capacité des entrepots'
            },
            xaxis: {
              categories: [],
              labels: {
                formatter: function (val) {
                  return val ;
                }
              }
            },
            yaxis: {
              title: {
                text: undefined
              },
            },
            tooltip: {
              y: {
                formatter: function (val) {
                  return val;
                }
              }
            },
            fill: {
              opacity: 1
            },
            legend: {
              position: 'top',
              horizontalAlign: 'left',
              offsetX: 40
            }
        },
        series: [{
            name: 'Utilisé',
            data: []
          }, {
            name: 'Restant',
            data: []
        }],
        chartOptions: {
            chart: {
              type: 'bar',
              height: 350,
              stacked: true
            },
            plotOptions: {
              bar: {
                horizontal: true,
              },
            },
            stroke: {
              width: 1,
              colors: ['#fff']
            },
            title: {
              text: 'Capacité des entrepots'
            },
            xaxis: {
              categories: [],
              labels: {
                formatter: function (val) {
                  return val ;
                }
              }
            },
            yaxis: {
              title: {
                text: undefined
              },
            },
            tooltip: {
              y: {
                formatter: function (val) {
                  return val;
                }
              }
            },
            fill: {
              opacity: 1
            },
            legend: {
              position: 'top',
              horizontalAlign: 'left',
              offsetX: 40
            }
            }
        }
       
        
    },
    mounted() {
        var index = 0;
        for (var key in this.$store.getters.getAgence.entrepots) {
             var entrepot = this.$store.getters.getAgence.entrepots[key];
             
             this.series[0].data.push(entrepot.capacite - entrepot.reste);
             this.series[1].data.push(entrepot.reste);             
             this.initChart.xaxis.categories.push(entrepot.nom);
            
             index++;
             if (index == Object.keys(this.$store.getters.getAgence.entrepots).length)
                this.chartOptions = this.initChart;
        }
        
    }
}
</script>