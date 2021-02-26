import { createStore } from 'vuex';

export default createStore({
  state: {
    map: null,
    restaurants: []
  },

  getters: {
    getMap: state => state.map,
    getResList: state => state.restaurants
  },

  mutations: {
    storeMap(state, map) {
      state.map = map;
    },

    searchRestaurants(state, request) {
      if (!state.map) return;

      state.restaurants = [];
      const service = new google.maps.places.PlacesService(state.map);

      service.nearbySearch(request, 
        (results, status) => {
          if (status !== "OK" || !results) return;
          for (let spot of results) {
            if (spot.geometry && spot.geometry.location) {
              service.getDetails(
                { placeId: spot.place_id }, 
                (result, status) => {
                  if (status === google.maps.places.PlacesServiceStatus.OK) {
                    const photos = result.photos || null;
                    const dist = google.maps.geometry.spherical.computeDistanceBetween(
                      request.location, result.geometry.location);
                    const restaurantInfo = {
                      placeId: result.place_id,
                      coords: result.geometry.location,
                      name: result.name,
                      imgUrl: photos ? photos[0].getUrl({ maxwidth: 200 }) : '',
                      addr: result.formatted_address,
                      tel: result.formatted_phone_number,
                      openingOrNot: result.opening_hours ? result.opening_hours.isOpen() : false,
                      rating: result.rating === undefined ? -1 : result.rating,
                      priceLevel: result.price_level === undefined ? Infinity : result.price_level,
                      minDist: dist,
                      url: result.url,
                    };
                    state.restaurants.push(restaurantInfo);
                  }
                }
              );
            }
          }
        }
      );
    },

    rearrangeList(state, result) {
      state.restaurants = result;
    }
  },

  actions: {
    buildMap({ commit }, newMap) {
      commit('storeMap', newMap);
    },

    findOutRestaurants({ commit }, request) {
      commit('searchRestaurants', request);
    },

    sortRestaurants({ commit }, result) {
      commit('rearrangeList', result);
    }
  }
});