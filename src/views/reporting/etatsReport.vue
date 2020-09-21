<template>
    <div>
     <apexchart width="100%" type="pie" :options="chartOptions" :series="series"></apexchart>
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
          series: [],
          initChart: {
            title: {
              text: "Articles par état"
            },
            chart: {
              width: '100%',
              type: 'pie',
            },
            labels: [],
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                return val +"%";
                },
            },
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: 'top'
                }
              }
            }]
          },
          chartOptions: {
            
            chart: {
              height: 500,
              width: 400,
              type: "pie",
            },
            labels: [],
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 280,
                  height: 280
                },
                legend: {
                  position: 'bottom'
                }
              }
            }]
          },
         }
    },
    mounted() {
        var index = 0;
        for (var key in this.$store.getters.getAgence.etats) {
             var etat = this.$store.getters.getAgence.etats[key];
             this.series.push(etat.nbArticles);
             this.initChart.labels.push(etat.nom);
             index++;
             if (index == Object.keys(this.$store.getters.getAgence.etats).length)
                this.chartOptions = this.initChart;
        }
    }
}
</script>