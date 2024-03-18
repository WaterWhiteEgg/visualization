import { ref, computed, type Ref } from "vue";
import { defineStore } from "pinia";
import { type City } from "../assets/ts/forDistricts";

export const useCityArray = defineStore(
  "item",
  (): { localCityArray: typeof localCityArray, addLocalCityArray: typeof addLocalCityArray } => {
    // 全局保存CityArray
    const localCityArray: Ref<City[]> = ref([]);
    function addLocalCityArray(data: City[]) {
      localCityArray.value = data
    }

    return { localCityArray, addLocalCityArray };
  },
  { persist: true }
);
