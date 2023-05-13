import React, { useMemo } from "react";
import styled from "@emotion/styled";

//svg & image
import { ReactComponent as DayCloudyIcon } from "../images/day-cloudy.svg";
import { ReactComponent as DayClear } from "./../images/day-clear.svg";
import { ReactComponent as DayCloudy } from "./../images/day-cloudy.svg";
import { ReactComponent as DayCloudyFog } from "./../images/day-cloudy-fog.svg";
import { ReactComponent as DayFog } from "./../images/day-fog.svg";
import { ReactComponent as DayPartiallyClearWithRain } from "./../images/day-partially-clear-with-rain.svg";
import { ReactComponent as DaySnowing } from "./../images/day-snowing.svg";
import { ReactComponent as DayThunderstorm } from "./../images/day-thunderstorm.svg";
import { ReactComponent as NightClear } from "./../images/night-clear.svg";
import { ReactComponent as NightCloudy } from "./../images/night-cloudy.svg";
import { ReactComponent as NightCloudyFog } from "./../images/night-cloudy-fog.svg";
import { ReactComponent as NightFog } from "./../images/night-fog.svg";
import { ReactComponent as NightPartiallyClearWithRain } from "./../images/night-partially-clear-with-rain.svg";
import { ReactComponent as NightSnowing } from "./../images/night-snowing.svg";
import { ReactComponent as NightThunderstorm } from "./../images/night-thunderstorm.svg";

const IconContainer = styled.div`
  flex-basis: 30%;
  svg {
    max-height: 110px;
  }
`;

const weatherTypes = {
  isThunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
  isClear: [1],
  isCloudyFog: [25, 26, 27, 28],
  isCloudy: [2, 3, 4, 5, 6, 7],
  isFog: [24],
  isPartiallyClearWithRain: [
    8, 9, 10, 11, 12, 13, 14, 19, 20, 30, 31, 32, 38, 39,
  ],
  isSnowing: [23, 37, 42],
};

const weatherIcons = {
  //白天模式跟晚上模式的圖片
  day: {
    isThunderstorm: <DayThunderstorm />,
    isClear: <DayClear />,
    isCloudyFog: <DayCloudyFog />,
    isCloudy: <DayCloudy />,
    isFog: <DayFog />,
    isPartiallyClearWithRain: <DayPartiallyClearWithRain />,
    isSnowing: <DaySnowing />,
  },

  night: {
    DayThunderstorm: <NightThunderstorm />,
    isClear: <NightClear />,
    isCloudyFog: <NightCloudyFog />,
    isCloudy: <NightCloudy />,
    isFog: <NightFog />,
    isPartiallyClearWithRain: <NightPartiallyClearWithRain />,
    isSnowing: <NightSnowing />,
  },
};

/**
 *  Object.entries(weatherTypes) => 會拿到 [Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2)]
 *  Array(2) ['isThunderstorm',Array(11)]   這時的每一個Array(2)長這樣
 *
 * 直接使用 Object.entries(weatherTypes).find(v) 這時的v就是每一個 Array(2) 必須在這裡做解構
 * 直接使用 Object.entries(weatherTypes).find([weatherType,weatherCodes] => weatherCodes.includes(Number))
 * 相當於[weatherType,weatherCodes] = v
 *
 */
// -------function-------
const weatherCodeToType = (weatherCode) => {
  const [weatherType] =
    Object.entries(weatherTypes).find(([weatherType, weatherCode]) =>
      weatherCode.includes(Number(weatherCode))
    ) || [];

  return weatherType;
};

// -------function-------

const WeatherIcon = ({ weatherCode, moment }) => {
  //useMemo 跟 useCallBack得差別 useMemo主要是回傳計算好的值 useCallback是回傳一個函式
  const weatherType = useMemo(
    () => weatherCodeToType(weatherCode),
    [weatherCode]
  );
  const weatherIcon = weatherIcons[moment][weatherType];

  return <IconContainer>{weatherIcon}</IconContainer>;
};

export default WeatherIcon;