<template>
    <div >
     <apexchart :yaxis="yaxis" width="100%" type="line" :options="chartOptions" :series="series"></apexchart>
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
              data: []
          }],
          yaxis: [
                {
                  axisTicks: {
                    show: true
                  },
                  axisBorder: {
                    show: true,
                    color: "#FF1654"
                  },
                  labels: {
                    style: {
                      colors: "#FF1654"
                    }
                  },
                  title: {
                    text: "Series A",
                    style: {
                      color: "#FF1654"
                    }
                  }
                },
                {
                  opposite: true,
                  axisTicks: {
                    show: true
                  },
                  axisBorder: {
                    show: true,
                    color: "#247BA0"
                  },
                  labels: {
                    style: {
                      colors: "#247BA0"
                    }
                  },
                  title: {
                    text: "Series B",
                    style: {
                      color: "#247BA0"
                    }
                  }
                }
              ],
          initChart: {
            
          },
          chartOptions: {
            chart: {
              height: 250,
              type: 'line',
              zoom: {
                enabled: false
              },
              
            },
            dataLabels: {
              enabled: false,
              formatter: function (val) {
                return val +"€";
                }
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
            },
            
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