<template>
  <div class="myslider">
    <VueSlickCarousel v-bind="settings">
      <div class="slide">
          <img src="@/assets/carroussel/listClient.png"/>
      </div>
      <div> <img src="@/assets/carroussel/editerClient.png"/></div>
      <div > <img src="@/assets/carroussel/editerArticle.png"/></div>
      <div> <img src="@/assets/carroussel/listClient.png"/></div>
    </VueSlickCarousel>
  </div>
</template>
 <style scoped>
    div.myslider {
        margin-left: 30px;
        margin-right: 30px;
    }
    .slide {
        width: 90%;
        height: 90%;
    }
</style>
<script>
  import VueSlickCarousel from 'vue-slick-carousel'
  import 'vue-slick-carousel/dist/vue-slick-carousel.css'
  // optional style for arrows & dots
  import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
 
  export default {
    name: 'MyComponent',
    components: { VueSlickCarousel },
    data: function() {
        return {
            settings: {
                "dots": true,
                "fade": true,
                "infinite": true,
                "speed": 500,
                "slidesToShow": 1,
                "slidesToScroll": 1
                }
        }
        
    }
  }
</script> 
