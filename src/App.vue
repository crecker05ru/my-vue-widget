<template>
  <div class="main">
    <div class="weather">
      <WheatherView @clickSettings="handleSettings" v-for="(city, index) in cities" :key="city.cityName" :isMain="index === 0"  :city="city" v-if="!isSettingsOpened"/>
      <WheatherSettings :cities="cities" v-else @clickCloseSettings="isSettingsOpened = false"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref,onMounted,onBeforeUnmount, watch } from "vue";
import WheatherView from "./components/WheatherView.vue";
import WheatherSettings from "./components/WheatherSettings.vue";
import { ICity } from "./types"
import { getWeatherByCity } from "./api/api";
const isSettingsOpened = ref(false);

const cities = ref<ICity[]>([])
const weatherDatas = ref()
const handleSettings = () => {
  if (isSettingsOpened.value) {
    isSettingsOpened.value = false;
  } else {
    isSettingsOpened.value = true;
  }
};

onMounted(() => {
  console.log("onMount cities.value",cities.value)
  const data = localStorage.getItem("data")
  console.log("data",data)
  if(data){
  cities.value = JSON.parse(data)
  console.log("cities.value",cities.value)
  weatherDatas.value = cities.value.map( city => {
    return (async () => getWeatherByCity(city.cityName))()
  })
  console.log("weatherDatas.value",weatherDatas.value)
  }
})
onBeforeUnmount(() => {
  console.log("Before unmount")
  // localStorage.setItem("data",JSON.stringify(cities.value))

  // if(cities.value.length){

  // }

})

watch(weatherDatas, async () => {
  weatherDatas.value = cities.value.map( city => {
    return async () => getWeatherByCity(city.cityName)
  })
})
// onUpdated(() => {
//   console.log("Updated")
//   localStorage.setItem("data",JSON.stringify(cities.value))

//   if(cities.value.length){

//   }
// })
</script>
<style scoped lang="scss">
.main {
  flex: 1 1 auto;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 1) 1%,
    rgba(0, 185, 255, 1) 53%
  );
}
.weather {
  background-color: rgba(255, 255, 255, 0.3);
  max-width: 320px;
  padding: 8px;
  border-radius: 16px;
}
</style>
