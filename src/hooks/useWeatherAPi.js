import { useState, useCallback, useEffect } from "react";
import axios from "axios";
// API
import { WEATHER, AUTH, TWO_DAY, OBSERVE } from "./../Api/weather.js";

//-----------------------------------function------------------------------------------
const fetchCurrentWeather = (myLocationName) => {
  //氣象觀測資料
  return axios
    .get(WEATHER + OBSERVE, {
      params: {
        Authorization: AUTH,
        locationName: myLocationName,
      },
    })
    .then((res) => {
      const locationData = res.data.records.location.find(
        (location) => location.locationName === myLocationName
      );

      const weatherElements = locationData.weatherElement.reduce(
        (myWeatherElement, item) => {
          if (["WDSD", "TEMP"].includes(item.elementName)) {
            myWeatherElement[item.elementName] = item.elementValue;
          }

          return myWeatherElement;
        },
        {}
      );

      return {
        locationName: locationData.locationName,
        windSpeed: weatherElements.WDSD,
        temperature: weatherElements.TEMP,
        observationTime: locationData.time.obsTime,
      };
    })
    .catch((e) => {
      throw new Error(`參數為：${myLocationName}找不到${e}的資料`);
    });
};

function fetchWeatherForecast(myCity) {
  //三十六小時天氣預報
  return axios
    .get(WEATHER + TWO_DAY, {
      params: {
        Authorization: AUTH,
        locationName: myCity,
      },
    })
    .then((res2) => {
      const locationInfo = res2.data.records.location[0].weatherElement;

      const myData = locationInfo.filter((v) => {
        return ["Wx", "PoP", "CI"].includes(v.elementName);
      });

      return {
        description: myData[0].time[0].parameter.parameterName,
        weatherCode: myData[0].time[0].parameter.parameterValue,
        rainPossibility: myData[1].time[0].parameter.parameterName,
        comfortable: myData[2].time[0].parameter.parameterName,
      };
    })
    .catch((e) => {
      throw new Error(`找不到${e}的資料`);
    });
}

//-----------------------------------function------------------------------------------

const useWeatherAPi = ({ locationName, cityName }) => {
  const [weatherElement, setWeatherElement] = useState({
    locationName: "",
    description: "",
    windSpeed: 0,
    temperature: 0,
    rainPossibility: 0,
    observationTime: new Date(),
    comfortable: "",
    isLoading: true,
  });

  const fetchData = useCallback(async () => {
    setWeatherElement((prev) => ({
      ...prev,
      isLoading: true,
    }));

    const data = await axios.all([
      fetchCurrentWeather(locationName),
      fetchWeatherForecast(cityName),
    ]);

    const [currentWeather, weatherForecast] = data;

    setWeatherElement({
      ...currentWeather,
      ...weatherForecast,
      isLoading: false,
    });
  }, [cityName, locationName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [weatherElement, fetchData];
};

export default useWeatherAPi;
