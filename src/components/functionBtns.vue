<template>
  <div class="btnField">
    <div class="dropdown">
      <button class="btn btn-info dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown"
        aria-expanded="false">
        列表排序
      </button>
      <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton1">
        <li><a class="dropdown-item" href="#" @click="sortList('minDist')">依距離近->遠</a></li>
        <li><a class="dropdown-item" href="#" @click="sortList('rating')">依評分高->低</a></li>
        <li><a class="dropdown-item" href="#" @click="sortList('priceLevel')">依價位低->高</a></li>
      </ul>
    </div>
    <button type="button" class="btn btn-danger titleText" data-bs-toggle="modal" data-bs-target="#listFilter"
      style="min-width: 7vw" @click="init()">搜尋過濾</button>
    <button type="button" class="btn btn-warning" id="viewList">👀</button>
    <button type="button" class="btn btn-success" id="viewList">📍</button>
  </div>

  <div class="modal fade" id="listFilter" tabindex="-1">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">搜尋過濾設定</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="input-group mb-3">
            <div class="input-group-text">營業狀態</div>
            <div class="d-flex justify-content-center align-items-center" style="padding-left: 1vw;">
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1"
                  value='' v-model="openNow">
                <label class="form-check-label" for="inlineRadio1">不限</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2"
                  value='true' v-model="openNow">
                <label class="form-check-label" for="inlineRadio2">營業中</label>
              </div>
            </div>
          </div>
          <div class="input-group mb-3">
            <label for="radius" class="input-group-text">搜尋半徑 : {{ distance }} 公尺</label>
            <input type="range" v-model="distance" class="form-range" min="100" max="3000" step="100" id="radius">
          </div>
          <div class="input-group mb-3">
            <label class="input-group-text" for="ratingLimit">最高價位</label>
            <select class="form-select" id="ratingLimit" v-model="MaxPriceLevel">
              <option value="0">Free</option>
              <option value="1">💰</option>
              <option value="2">💰💰</option>
              <option value="3" selected>💰💰💰</option>
              <option value="4">💰💰💰💰</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click="customizeSearch()">確定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//🚶 📍 🚗
export default {
  name: "functionBtns",
  data() {
    return {
      openNow: '',
      distance: 100,
      MaxPriceLevel: '3',
    }
  },
  methods: {
    sortList(prop) {
      const sorted = this.$store.getters.getResList.sort(
        (a, b) => a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0
      );
      if (prop === 'rating') sorted.reverse();
      this.$store.dispatch('sortRestaurants', sorted);
    },

    init() {
      this.openNow = '';
      this.distance = 100;
      this.MaxPriceLevel = '3';
    },

    customizeSearch() {
      const listFilterModal = bootstrap.Modal.getInstance(document.getElementById('listFilter'));

      const request = {
        location: this.$store.getters.getMap.getCenter(), radius: this.distance, 
        type: "restaurant", openNow: this.openNow ? true : false, 
        MaxPriceLevel: this.MaxPriceLevel
      };
      
      this.$store.dispatch('findOutRestaurants', request);
      listFilterModal.hide();
    }
  },
  mounted() {
    const viewList = document.getElementById('viewList');

    viewList.addEventListener('click', () => {
      const list = document.getElementById('restaurantList');
      list.style.visibility = list.style.visibility === 'hidden' 
        ? 'visible' : 'hidden';
    });
  }
}
</script>

<style scoped>
.btnField {
  width: 20vw;
  height: 15vh;
  position: absolute;
  top: 5vh;
  left: 70vw;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
}

.titleText {
  overflow: hidden; 
  white-space: nowrap; 
  text-overflow: ellipsis;
}

@media only screen and (max-width: 600px) {
  .btnField {
    width: 100vw;
    height: 10vh;
    position: absolute;
    top: 9vh;
    left: 0;
    justify-content: flex-end;
  }
}
</style>