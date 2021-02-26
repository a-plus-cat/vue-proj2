<template>
  <div id="map"></div>
  <functionBtns></functionBtns>
  <restaurantList></restaurantList>
</template>

<script>
import restaurantList from './components/restaurantList';
import functionBtns from './components/functionBtns';
export default {
  name: 'App',
  components: {
    restaurantList,
    functionBtns
  },
  methods: {
    initMap() {
      const newMap = new google.maps.Map(document.getElementById('map'), {
        center: {
          lat: 25.041715, 
          lng: 121.556882
        },
        zoom: 15,
        mapTypeId: 'roadmap',
        styles: [{
          featureType: "poi",
          elementType: "labels",
          stylers: [{
            visibility: "off"
          }]
        }]
      });

      const selfLocMarker = new google.maps.Marker({
        map: newMap,
        position: newMap.getCenter(),
        label: '我',
        animation: google.maps.Animation.DROP
      });
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          const currentLoc = {
            lat: position.coords.latitude, 
            lng: position.coords.longitude
          };
          newMap.setCenter(currentLoc);
          selfLocMarker.setPosition(currentLoc);
        });
      }

      this.$store.dispatch('buildMap', newMap);
      
      newMap.addListener("idle", () => {
        const map = this.$store.getters.getMap;
        if (!map) return;
        const request = {
          location: map.getCenter(),
          rankBy: google.maps.places.RankBy.DISTANCE,
          type: "restaurant"
        };
        this.$store.dispatch('findOutRestaurants', request);
      });
    },
  },
  created() {
    window.addEventListener('load', () => { this.initMap() });
  },
}
</script>

<style>
#map {
  width: 100vw;
  height: 100vh;
  position: relative;
}
</style>
