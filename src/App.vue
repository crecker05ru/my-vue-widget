<template>
  <div class="main">
    <div class="weather">
      <WeatherSettings
        class="weather__settings"
        v-if="isSettingsOpened"
        :cities="cities"
        @clickCloseSettings="isSettingsOpened = false"
        @clickDelete="deleteCity"
        @addCity="onAddCity"
        @dragEnd="dargEnd"
      />
      <template v-else>
        <template v-if="weatherData?.length">
          <ViewWeather
          v-for="(weatherData, index) in weatherData"
          :key="index"
          :isMain="index === 0"
          :weatherDataResponse="weatherData"
          @clickSettings="handleSettings"
        />
        </template>
        <ViewEmpty 
        v-else
        class="weather__empty"
        @clickSettings="handleSettings"
        />
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watchEffect } from "vue";
import ViewEmpty from "@/components/ViewEmpty.vue";
import ViewWeather from "@/components/ViewWeather.vue";
import WeatherSettings from "@/components/WeatherSettings.vue";
import { ICity, IWeatherGeoResponse } from "@/types";
import { getWeatherByCity, getWeatherByGeoposition } from "@/api/api";
const isSettingsOpened = ref(false);
const geoCoordinates = reactive({
  lat: 51.5085,
  lon: -0.1257,
});
const cities = ref<ICity[]>([]);
const weatherData = ref();
const handleSettings = () => {
  if (isSettingsOpened.value) {
    isSettingsOpened.value = false;
  } else {
    isSettingsOpened.value = true;
  }
};

const onAddCity = (name: string) => {
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
      const city = (await getWeatherByGeoposition(geoCoordinates)) as IWeatherGeoResponse;
      cities.value.push({
        cityName: city.city.name,
        country: city.city.country,
      });
      weatherData.value.push(city);
      if (!city) {
        cities.value.push({ cityName: "London", country: "GB" });
      }
    });
  }
});

watchEffect(async () => {
  weatherData.value = await Promise.all(
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
  position: absolute;
  z-index: 999;
}
.weather {
  background-color: rgba(255, 255, 255, 0.3);
  width: 320px;
  padding: 8px;
  border-radius: 16px;
}
</style>
