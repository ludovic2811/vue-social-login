<template>
    <div>
     <apexchart width="100%" type="line" :options="chartOptions" :series="series"></apexchart>
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
         series: [{
              name: "Desktops",
              data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
          }],
          initChart: {
            
          },
          chartOptions: {
            chart: {
              height: 350,
              type: 'line',
              zoom: {
                enabled: false
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'straight'
            },
            title: {
              text: 'CA par Année',
              align: 'left'
            },
            grid: {
              row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
              },
            },
            xaxis: {
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
            }
          }
         }
    },
    mounted() {
        this.initChart = JSON.parse(JSON.stringify(this.chartOptions));
        var index = 0;
        this.series[0].data = [];
        this.initChart.xaxis.categories = [];
        
        for (var key in this.$store.getters.getAgence.paiements) {
             var paiement = this.$store.getters.getAgence.paiements[key];
           
             this.series[0].data.push(paiement.total);
             this.series[0].name = "CA";
             this.initChart.xaxis.categories.push(key);
             index++;
             if (index == Object.keys(this.$store.getters.getAgence.paiements).length)
                this.chartOptions = this.initChart;
        }
    }
}
</script>