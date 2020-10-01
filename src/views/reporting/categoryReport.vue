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
              text: "Articles par categorie"
            },
            chart: {
              width: '100%',
              height: '250px',
              type: 'pie',
            },
            labels: [],
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                return Math.round(val) +"%";
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
        
        for (var key in this.$store.getters.getAgence.categories) {
             var categorie = this.$store.getters.getAgence.categories[key];
             if (typeof(categorie.nbArticles) != "undefined")
                this.series.push(parseInt(categorie.nbArticles));
             else
                this.series.push(0);
             this.initChart.labels.push(categorie.nom);
             index++;
             if (index == Object.keys(this.$store.getters.getAgence.categories).length)
                this.chartOptions = this.initChart;
        }
        console.log(this.series);
    }
}
</script>