

<template>

  <div class="weather__view" v-if="weatherData">
    <div class="weather__head">
      <h2 class="weather__title"><span class="weather__city">{{ weatherData.cityName }} </span> <span class="weather__country">{{ weatherData.country }}</span></h2>
      <div class="weather__settings-icon" @click="$emit('clickSettings')"></div>
    </div>
    <div class="weather__visuals">
      <div class="weather__icon">{{ weatherData.icon }}</div>
      <div class="weather__temperature">{{ weatherData.temperature }}&#8451;</div>
    </div>
    <div class="weather__description-text">{{ weatherDescription }}</div>
    <ul class="weather__description-list description">
      <li class="description__item"><div class="description__item-icon" v-if="true"></div><div class="description__item-text">{{ weatherData.windSpeed }} m/s SSE</div></li>
      <li class="description__item"><div class="description__item-icon" v-if="true"></div><div class="description__item-text">{{ weatherData.pressure}}hPA</div></li>
      <li class="description__item"><div class="description__item-text">Humidity: {{ weatherData.humidity }}%</div></li>
      <li class="description__item"><div class="description__item-text">Dew point: {{ weatherData.dewPoint}}&#8451;</div></li>
      <li class="description__item"><div class="description__item-text">Visibility: {{ weatherData.visibility }}km</div></li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { onMounted,reactive,ref,computed } from 'vue'
import { getWeatherByGeoposition } from "../api/api"
import { IWeatherResponse,ICity } from "../types"

defineProps<{ cities: ICity[] }>()
const geoCoordinates = reactive({
  lat: 51.5085,
  lon: -0.1257
})

const weatherDataResponse = ref<IWeatherResponse>()
const weatherDescription = computed(() => {
  if(
    weatherDataResponse.value
  ){
    return `Feels like ${weatherDataResponse.value.list[0].main.feels_like.toFixed()}C.
    ${weatherDataResponse.value.list[0].weather[0].description[0].toUpperCase() + weatherDataResponse.value.list[0].weather[0].description.slice(1,)}`
  }
  return ``
})

// interface IWheatherData {
//   cityName: string
//   description: string
// }

// const weatherData = reactive({
//   cityName: weatherDataResponse.value.city.name,
//   country: weatherDataResponse.value.city.country,
//   icon: weatherDataResponse.value.list[0].weather[0].icon,
//   temperature: weatherDataResponse.list[0].main.temp,
//   description: weatherDescription.value,
//   windSpeed: weatherDataResponse.value.list[0].wind.speed,
//   pressure: weatherDataResponse.value.list[0].main.pressure,
//   humidity: weatherDataResponse.value.list[0].main.humidity,
//   dewPoint: (weatherDataResponse.value.list[0].main.temp *  (weatherDataResponse.value.list[0].main.humidity / 100)).toFixed(),
//   visibility: (weatherDataResponse.value.list[0].visibility / 1000).toFixed(1)
// })

const weatherData = computed(() => {
  if(weatherDataResponse.value){
    return {
  cityName: weatherDataResponse.value.city.name,
  country: weatherDataResponse.value.city.country,
  icon: weatherDataResponse.value.list[0].weather[0].icon,
  temperature: weatherDataResponse.value.list[0].main.temp,
  description: weatherDescription.value,
  windSpeed: weatherDataResponse.value.list[0].wind.speed,
  pressure: weatherDataResponse.value.list[0].main.pressure,
  humidity: weatherDataResponse.value.list[0].main.humidity,
  dewPoint: (weatherDataResponse.value.list[0].main.temp *  (weatherDataResponse.value.list[0].main.humidity / 100)).toFixed(),
  visibility: (weatherDataResponse.value.list[0].visibility / 1000).toFixed(1)
}
  }
})
onMounted(() => {
  console.log("Mounted")
  navigator.geolocation.getCurrentPosition((positions) => {
    if(positions){
      geoCoordinates.lat = positions.coords.latitude,
    geoCoordinates.lon = positions.coords.longitude
    }
  });
  (async () => {
    weatherDataResponse.value = await getWeatherByGeoposition(geoCoordinates) as IWeatherResponse
    console.log("weatherData.value",weatherDataResponse.value)
  })()
  // weatherData.value = getWeatherByGeoposition(geoCoordinates)
  // getWeatherByGeoposition(geoCoordinates).then(data => {
  //   weatherData.value = data
  // })
  
})
</script>
<style scoped lang="scss">
.weather {
&__head {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
&__title {
  flex: 1 1 auto;
}
&__settings-icon {
  background-image: url("../assets/settings-icon.svg");
  width: 24px;
  height: 24px;
  background-repeat: no-repeat;
  cursor: pointer;
  transition: transform linear 0.2s;
  &:hover {
    transform: rotate(90deg);
  }
  }
&__visuals {
  display: flex;
  column-gap: 10px;
  margin-bottom: 20px;
}
&__icon {
  font-size: 28px;
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
    &__item{
      flex: 0 1 48%;
    }
}
</style>