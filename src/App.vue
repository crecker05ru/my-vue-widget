<template>
  <div class="main">
    <div class="main__weather weather">
      <AppError v-if="error" class="main__error" :error="error" />
      <AppLoader v-if="isLoading" class="main__loading" />
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
        <template v-if="cities?.length > 0">
          <CityWeather
            v-for="(city, index) in cities"
            :key="city?.cityName"
            :isMain="index === 0"
            :weatherDataResponse="city.weatherData"
            @clickSettings="handleSettings"
          />
        </template>
        <AppEmpty
          v-else
          class="weather__empty"
          @clickSettings="handleSettings"
        />
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import AppEmpty from "@/components/AppEmpty.vue";
import CityWeather from "@/components/CityWeather.vue";
import WeatherSettings from "@/components/WeatherSettings.vue";
import { ICity } from "@/types";
import AppLoader from "@/components/AppLoader.vue";
import AppError from "@/components/AppError.vue";
import { useWeather } from "./composables/useWeather";

const isSettingsOpened = ref(false);
const geoCoordinates = reactive({
  lat: 51.5085,
  lon: -0.1257,
});
const cities = ref<ICity[]>([]);
const { isLoading, error, geopositionInitition } = useWeather(
  geoCoordinates,
  cities
);
const handleSettings = () => {
  if (isSettingsOpened.value) {
    isSettingsOpened.value = false;
  } else {
    isSettingsOpened.value = true;
  }
};

const onAddCity = (name: string) => {
  cities.value.push({ cityName: name, country: "", weatherData: null });
};

const deleteCity = (name: string) => {
  cities.value = cities.value.filter((city) => city.cityName !== name);
};

const dargEnd = (citiesArr: ICity[]) => {
  cities.value = citiesArr;
};
onMounted(async () => {
  geopositionInitition();
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
