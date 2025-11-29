import { IGeo } from "@/types/index";

const APIKEY = import.meta.env.VITE_API_KEY;
const API_BASE = import.meta.env.VITE_API_BASE;
const fetchOptions = {
  method: "GET",
  headers: {
    "Accept-Language": "en-En",
    "Content-Language": "en-En",
  },
};

export const getWeatherByCity = async (city: string) => {
  const apiUrl = `${API_BASE}/data/2.5/weather?q=${city}&units=metric&lang=en&appid=${APIKEY}&units=metric`;
  try {
    const res = await fetch(apiUrl, fetchOptions);
    const data = await res.json();
    return data;
  } catch (e) {
    console.log("error", e);
  }
};

export const getWeatherByGeoposition = async ({ lat, lon }: IGeo) => {
  const apiUrl = `${API_BASE}/data/2.5/forecast?cnt=1&units=metric&lat=${lat}&lon=${lon}&appid=${APIKEY}`;
  try {
    const res = await fetch(apiUrl, fetchOptions);
    const data = await res.json();
    return data;
  } catch (e) {
    console.log("error", e);
  }
};

export const reverseGeocoding = async ({ lat, lon }: IGeo) => {
  const apiUrl = `${API_BASE}/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${APIKEY}`;
  try {
    const res = await fetch(apiUrl, fetchOptions);
    const data = await res.json();
    return data;
  } catch (e) {
    console.log("error", e);
  }
};
