import { ref, type Ref, watch } from "vue";
import {
  IGeo,
  ICity,
  IWeatherCityResponse,
  IWeatherGeoResponse,
} from "@/types";
import { getWeatherByCity, getWeatherByGeoposition } from "@/api/api";

type WeatherData = IWeatherCityResponse | IWeatherGeoResponse;
type CachedData = {
  [k: string]: WeatherData;
};
export function useWeather(geoCoordinates: IGeo, cities: Ref<ICity[]>) {
  const weatherData = ref<WeatherData[]>([]);
  const isLoading = ref(false);
  const error = ref<Error | string | null>(null);
  const cacheData = ref<CachedData>({});
  const geopositionInitition = async () => {
    error.value = null;
    isLoading.value = true;
    const data = localStorage.getItem("data");

    if (data) {
      cities.value = JSON.parse(data);
    }
    if (cities.value && cities.value.length < 1) {
      navigator.geolocation.getCurrentPosition(async (positions) => {
        if (positions) {
          (geoCoordinates.lat = positions.coords.latitude),
            (geoCoordinates.lon = positions.coords.longitude);
        } else {
          isLoading.value = false;
          error.value = "Provide coordinates to initiate your city weather";
          return;
        }
        const city = (await getWeatherByGeoposition(geoCoordinates)
          .catch((e) => (error.value = e))
          .finally(() => (isLoading.value = false))) as IWeatherGeoResponse;
        cities.value.push({
          cityName: city.city.name,
          country: city.city.country,
          weatherData: null,
        });
        weatherData.value.push(city);
        if (!city) {
          cities.value.push({
            cityName: "London",
            country: "GB",
            weatherData: city,
          });
        }
      });
    }
  };

  const getCitiesWeather = async () => {
    error.value = null;
    isLoading.value = true;
    const notCachedCities = cities.value.filter(
      (c) => !cacheData.value?.[c.cityName]
    );
    cities.value.map((c) => {
      if (cacheData.value?.[c.cityName]) {
        return { ...c, ...cacheData.value[c.cityName] };
      }
    });
    weatherData.value = await Promise.all(
      notCachedCities.map(async (city) => {
        const weather = await getWeatherByCity(city.cityName);
        city.weatherData = weather;
        cacheData.value[city.cityName] = weather;
        return weather;
      })
    )
      .catch((e) => (error.value = e))
      .finally(() => (isLoading.value = false));
    localStorage.setItem("data", JSON.stringify(cities.value));
    console.log("weatherData.value", weatherData.value);
  };

  watch(
    () => cities.value?.length,
    () => {
      getCitiesWeather();
    }
  );

  return {
    weatherData,
    isLoading,
    error,
    geopositionInitition,
    getWeatherByCity,
    getWeatherByGeoposition,
  };
}
