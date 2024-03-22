import { ref, computed, type Ref } from "vue";
import { defineStore } from "pinia";
import { type City,type Weather } from "../assets/ts/forDistricts";

export const useCityArray = defineStore(
  "item",
  (): {
    localCityArray: typeof localCityArray;
    addLocalCityArray: typeof addLocalCityArray;
    localWeather: typeof localWeather;
    addLocalWeather: typeof addLocalWeather;
  } => {
    // 全局保存CityArray
    const localCityArray: Ref<City[]> = ref([]);
    function addLocalCityArray(data: City[]) {
      localCityArray.value = data;
    }
    // 全局保存天气信息
    const localWeather: Ref<Weather[]> = ref([]);
    function addLocalWeather(data: Weather[]) {
      localWeather.value = data;
    }
    return { localCityArray, addLocalCityArray, localWeather, addLocalWeather };
  },
  { persist: true }
);
