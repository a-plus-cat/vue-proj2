<template>
  <div class="accordion" id="restaurantList">
    <div class="accordion-item" v-for="restaurant in restaurants" :key='restaurant.id'>
      <h2 class="accordion-header" :id="restaurant.id">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
          :data-bs-target="addSpecChar(restaurant.placeId)" aria-expanded="true" :aria-controls="restaurant.placeId"
          @click="markerHandle($event, restaurant)">
          <span class="titleText">{{ restaurant.name }}</span>
        </button>
      </h2>
      <div :id="restaurant.placeId" class="accordion-collapse collapse" :aria-labelledby="restaurant.id"
        data-bs-parent="#restaurantList">
        <div class="accordion-body">
          <img :src="restaurant.imgUrl" style="width: 100%">
          <h4>{{ restaurant.name }}</h4>
          <p>營業狀態 : {{ restaurant.openingOrNot ? '營業中' : '未營業' }}</p>
          <p>評價 : {{ restaurant.rating === -1 ? '???' : restaurant.rating }} 顆星</p>
          <p>價位 : {{ restaurant.priceLevel === Infinity ? '???' : restaurant.priceLevel }} 級</p>
          <p>地址 :<br> {{ restaurant.addr }}</p>
          <p>電話 : {{ restaurant.tel }}</p>
          <p>距離 : {{ Math.ceil(restaurant.minDist) }} 公尺</p>
          <p></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// ▶ ◀
import { computed } from 'vue';
import { useStore } from 'vuex';
let lastTimeClick = null;
let restaurantMarker = []; 

export default {
  name: "restaurantList",
  methods: {
    addSpecChar(input) {
      return `#${input}`;
    },

    markerHandle(event, current) {
      for (let i = 0; i < restaurantMarker.length; i++) {
        restaurantMarker[i].setMap(null);
      }
      restaurantMarker = [];
      const isCollapsed = event 
        ? event.target.classList.contains('collapsed') || event.target.parentNode.classList.contains('collapsed')
        : false;
      if (lastTimeClick !== current.placeId && !isCollapsed) {
        restaurantMarker.push(
          new google.maps.Marker({
            map: this.$store.getters.getMap,
            position: current.coords,
            icon: {
              url: 'https://maps.google.com/mapfiles/kml/shapes/dining.png',
              scaledSize: new google.maps.Size(30, 30)
            }
          })
        );
        lastTimeClick = current.placeId;
      } else lastTimeClick = null;
    }
  },
  setup() {
    const store = useStore();
    return {
      restaurants: computed(() => store.getters.getResList)
    };
  },
}
</script>

<style scoped>
#restaurantList {
  width: 20vw;
  height: 70vh;
  position: absolute;
  top: 20vh;
  left: 70vw;
  background-color: azure;
  overflow-y: scroll;
}
.titleText {
  overflow: hidden; 
  white-space: nowrap; 
  text-overflow: ellipsis;
}

@media only screen and (max-width: 600px) {
  #restaurantList {
    width: 60vw;
    height: 45vh;
    position: absolute;
    top: 19vh;
    left: 40vw;
    visibility: hidden;
  }
}
</style>