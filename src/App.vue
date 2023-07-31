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
        @dragEnd="dargEnd"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watchEffect } from "vue";
import WheatherView from "./components/WheatherView.vue";
import WheatherSettings from "./components/WheatherSettings.vue";
import { ICity, IWeatherGeoResponse } from "./types";
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

const dargEnd = (citiesArr: ICity[]) => {
  cities.value = citiesArr;
};
onMounted(async () => {
  const data = localStorage.getItem("data");

  if (data) {
    cities.value = JSON.parse(data);
  }
  if (cities.value && cities.value.length < 1) {
    navigator.geolocation.getCurrentPosition(async (positions) => {
      if (positions) {
        (geoCoordinates.lat = positions.coords.latitude),
          (geoCoordinates.lon = positions.coords.longitude);
      }
      const city = (await getWeatherByGeoposition(
        geoCoordinates
      )) as IWeatherGeoResponse;
      cities.value.push({
        cityName: city.city.name,
        country: city.city.country,
      });
      weatherDatas.value.push(city);
      if (!city) {
        cities.value.push({ cityName: "London", country: "GB" });
      }
    });
  }
});

watchEffect(async () => {
  weatherDatas.value = await Promise.all(
    cities.value.map(async (city) => {
      const weather = await getWeatherByCity(city.cityName);
      return weather;
    })
  );
  localStorage.setItem("data", JSON.stringify(cities.value));
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
