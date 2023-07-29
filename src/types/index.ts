export interface IGeo {
  lat: number
  lon: number 
}

interface IWeather {
  id: number
  main: string
  description: string
  icon: string
}
interface IWeatherCity {
  coord: {}
  country: string
  id: number
  name: string
  population: number
  sunrise: number
  sunset: number
  timezone: number
}


interface IMain {
  temp: number
  feels_like: number
  temp_min: number 
  temp_max: number 
  pressure: number 
  humidity: number
}
interface IWind {
  deg: number
  gust: number
  speed: number
}

interface IWeatherListItem {
  clouds: {}
  dt: number
  dt_txt: string
  main: IMain
  pop: number
  rain: {}
  sys: {}
  visibility: number
  weather: IWeather[]
  wind: IWind
}

export interface IWeatherResponse {
  city: IWeatherCity
  cnt: number
  cod: string
  list : IWeatherListItem[]
  message?: null | string
}
interface ISys {
  type: number
  id: number
  country: string
  sunrise: number
  sunset: number
}
export interface IWheatherData {
  coord: {}
  weather: IWeather[]
  base: string
  main: IMain
  visibility: number
  wind: {}
  clouds: {}
  dt: number
  sys: ISys
  timezone: number
  id: number
  name: string
  cod: number
}

export interface ICity {
  cityName: string
  country: string
  }