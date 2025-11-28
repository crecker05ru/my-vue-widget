<template>
  <div class="weather__view" v-if="weatherData">
    <div class="weather__head">
      <h2 class="weather__title">
        <span class="weather__city">{{ weatherData.cityName }} </span>
        <span class="weather__country"> {{ weatherData.country }}</span>
      </h2>
      <button
        class="weather__settings-button"
        @click="$emit('clickSettings')"
        v-if="isMain"
      ></button>
    </div>
    <div class="weather__visuals">
      <div class="weather__icon" :style="{ backgroundImage: weatherData.icon }"></div>
      <div class="weather__temperature">{{ weatherData.temperature }}&#8451;</div>
    </div>
    <div class="weather__description-text">{{ weatherDescription }}</div>
    <ul class="weather__description-list description">
      <li class="description__item">
        <div class="description__item-icon" v-if="true"></div>
        <div class="description__item-text">{{ weatherData.windSpeed }} m/s SSE</div>
      </li>
      <li class="description__item">
        <div class="description__item-icon" v-if="true"></div>
        <div class="description__item-text">{{ weatherData.pressure }}hPA</div>
      </li>
      <li class="description__item">
        <div class="description__item-text">Humidity: {{ weatherData.humidity }}%</div>
      </li>
      <li class="description__item">
        <div class="description__item-text">
          Dew point: {{ weatherData.dewPoint }}&#8451;
        </div>
      </li>
      <li class="description__item">
        <div class="description__item-text">
          Visibility: {{ weatherData.visibility }}km
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { computed, defineProps } from "vue";
import { IWeatherGeoResponse, IWeatherCityResponse } from "@/types";

const props = defineProps<{
  weatherDataResponse: IWeatherCityResponse & IWeatherGeoResponse;
  isMain: boolean;
}>();

const weatherDescription = computed(() => {
  if (props.weatherDataResponse && props.weatherDataResponse.list) {
    return `Feels like ${props.weatherDataResponse.list[0].main.feels_like.toFixed()}C.
    ${
      props.weatherDataResponse.list[0].weather[0].description[0].toUpperCase() +
      props.weatherDataResponse.list[0].weather[0].description.slice(1)
    }`;
  }
  if (props.weatherDataResponse && props.weatherDataResponse.weather[0]) {
    return `Feels like ${props.weatherDataResponse.main.feels_like.toFixed()}C.
    ${
      props.weatherDataResponse.weather[0].description[0].toUpperCase() +
      props.weatherDataResponse.weather[0].description.slice(1)
    }`;
  }
  return ``;
});

const weatherData = computed(() => {
  if (props.weatherDataResponse) {
    return {
      cityName: props.weatherDataResponse.name || props.weatherDataResponse.city.name,
      country:
        props.weatherDataResponse.sys?.country || props.weatherDataResponse.city.country,
      icon:
        `url("/weather-icons/${props.weatherDataResponse.weather?.[0]?.icon}.png")` ||
        `url("/weather-icons/${props.weatherDataResponse.list?.[0]?.weather[0].icon}.png")`,
      temperature:
        props.weatherDataResponse.main?.temp.toFixed() ||
        props.weatherDataResponse.list?.[0]?.main.temp.toFixed(),
      description: weatherDescription,
      windSpeed:
        String(props.weatherDataResponse.wind?.speed) ||
        props.weatherDataResponse.list?.[0]?.wind.speed,
      pressure:
        props.weatherDataResponse.main?.pressure ||
        props.weatherDataResponse.list?.[0]?.main.pressure,
      humidity:
        props.weatherDataResponse.main?.humidity ||
        props.weatherDataResponse.list?.[0]?.main.humidity,
      dewPoint:
        (
          props.weatherDataResponse.main?.temp *
          (props.weatherDataResponse.main?.humidity / 100)
        ).toFixed() ||
        (
          props.weatherDataResponse.list?.[0]?.main.temp *
          (props.weatherDataResponse.list?.[0]?.main.humidity / 100)
        ).toFixed(),
      visibility:
        (props.weatherDataResponse.visibility / 1000).toFixed(1) ||
        (props.weatherDataResponse.list?.[0]?.visibility / 1000).toFixed(1),
    };
  }
  return null;
});
</script>
<style scoped lang="scss">
.weather {
  &__view {
    margin-bottom: 40px;
  }
  &__head {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  &__title {
    flex: 1 1 auto;
  }
  &__city {
    margin-right: 10px;
  }
  &__settings-button {
    background-image: url("/settings-icon.svg");
    width: 24px;
    height: 24px;
    background-repeat: no-repeat;
    transition: transform linear 0.2s;
    background-color: transparent;
    border: none;
    &:hover {
      transform: rotate(90deg);
    }
  }
  &__visuals {
    display: flex;
    align-items: center;
    column-gap: 10px;
    margin-bottom: 20px;
  }
  &__icon {
    background-repeat: no-repeat;
    background-size: contain;
    height: 50px;
    width: 50px;
  }
  &__temperature {
    font-size: 28px;
  }
  &__description-text {
    font-size: 20px;
  }
}
.description {
  display: flex;
  padding-top: 20px;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 320px;
  font-size: 20px;
  &__item {
    flex: 0 1 48%;
  }
}
</style>
