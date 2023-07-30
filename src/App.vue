<template>
  <div class="main">
    <div class="weather">
      <WheatherView
        @clickSettings="handleSettings"
        v-for="(weatherData, index) in weatherDatas"
        :key="index"
        :isMain="index === 0"
        :weatherDataResponse="weatherData"
        v-if="!isSettingsOpened && weatherDatas"
      />
      <WheatherSettings
        :cities="cities"
        v-else
        @clickCloseSettings="isSettingsOpened = false"
        @clickDelete="deleteCity"
        @clickAdd="addCity"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, watchEffect } from "vue";
import WheatherView from "./components/WheatherView.vue";
import WheatherSettings from "./components/WheatherSettings.vue";
import { ICity } from "./types";
import { getWeatherByCity, getWeatherByGeoposition } from "./api/api";
const isSettingsOpened = ref(false);
const geoCoordinates = reactive({
  lat: 51.5085,
  lon: -0.1257,
});
const cities = ref<ICity[]>([]);
const weatherDatas = ref();
const handleSettings = () => {
  if (isSettingsOpened.value) {
    isSettingsOpened.value = false;
  } else {
    isSettingsOpened.value = true;
  }
};

const addCity = (name: string) => {
  cities.value.push({ cityName: name, country: "" });
};

const deleteCity = (name: string) => {
  cities.value = cities.value.filter((city) => city.cityName !== name);
};
onMounted(async () => {
  console.log("onMount cities.value", cities.value);
  const data = localStorage.getItem("data");
  console.log("data", data);
  if (data) {
    cities.value = JSON.parse(data);
    console.log("cities.value", cities.value);

    console.log("weatherDatas.value", weatherDatas.value);
  } else {
    const city = await getWeatherByGeoposition(geoCoordinates);
    console.log(city);
  }
});

onBeforeUnmount(() => {
  console.log("Before unmount");
});

watchEffect(async () => {
  weatherDatas.value = await Promise.all(
    cities.value.map(async (city) => {
      const weather = await getWeatherByCity(city.cityName);
      return weather;
    })
  );
});
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
