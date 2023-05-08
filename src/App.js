//套件模組
import React, { useState, useEffect } from "react";
//載入 emotion 的 styled套件
import styled from "@emotion/styled";
import dayjs from "dayjs";
import "dayjs/locale/zh-tw";
import axios from "axios";
//第二種 載入themeProvider 來使用主題色 就不用一個一個傳 props下去
import { ThemeProvider } from "@emotion/react";

import { ReactComponent as DayCloudyIcon } from "./images/day-cloudy.svg";
import { ReactComponent as RainIcon } from "./images/rain.svg";
import { ReactComponent as AirFlowIcon } from "./images/airFlow.svg";
import { ReactComponent as RefreshIcon } from "./images/refresh.svg";
import { ReactComponent as LoadingIcon } from "./images/loading.svg";

//css樣式
import "./App.css";
import "normalize.css"; //把不同瀏覽器預設樣式變成一樣

// API
import { WEATHER, AUTH, TWO_DAY, OBSERVE } from "./Api/weather.js";

//-----------------------------------主題配色------------------------------------------
const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282",
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc",
  },
};
//------------------------------------------------------------------------------------

//記得跟元件一樣要使用大寫駝峰
//style.div代表要新增一個 div的元件 如果要新增 button 就是styled.button

const Container = styled.div`
  ${"" /* callback ({theme})=>{} */}
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px 10px;
  border-radius: 10px;
`;

const Location = styled.div`
  ${"" /* 透過props傳入元件  會拿到{theme:dark , children:台北市 }*/}
  ${"" /* ${(props) => console.log(props)}  */}
  ${"" /* 第一種 透過props傳入的參數來更換顏色 */} 
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 1rem;
`;

const Description = styled.div`
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 2rem;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Temperature = styled.div`
  font-size: 100px;
  color: ${({ theme }) => theme.temperatureColor};
  position: relative;
`;

const Celsius = styled.div`
  font-size: 50px;
  position: absolute;
  right: -50px;
  top: -10px;
  font-weight: 300;
`;

const AirFlow = styled.div`
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 1rem;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 1rem;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Refresh = styled.div`
  text-align: right;
  color: ${({ theme }) => theme.textColor};
  margin: 0;
  cursor: pointer;
  svg {
    width: 15px;
    height: auto;
    margin-left: 10px;
    animation: rotate infinite 1.5s linear;
    animation-duration: ${({ isLoading }) => (isLoading ? "1.5s" : "0s")};
  }

  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;
const DayCloudy = styled(DayCloudyIcon)`
  flex-basis: 30%;
`;

function App() {
  //-----------------------------------state---------------------------------------------
  const [currentTheme, setCurrentTheme] = useState("light");
  const [currentWeather, setCurrentWeather] = useState({
    locationName: "台北市",
    description: "多雲時晴",
    windSpeed: "1.1",
    temperature: 22.9,
    rainPossibility: 48.3,
    observationTime: "2020-12-12 22:10:00",
    isLoading: true,
  });
  //-----------------------------------state---------------------------------------------

  //解構出來可以讓程式碼更整潔
  const {
    description,
    rainPossibility,
    isLoading,
    observationTime,
    temperature,
    windSpeed,
    locationName,
  } = currentWeather;

  //-----------------------------------function------------------------------------------
  const fetchCurrentWeather = async () => {
    setCurrentWeather({ ...currentWeather, isLoading: true });
    const myLocationName = "深坑";
    //氣象觀測資料
    const res = await axios
      .get(WEATHER + OBSERVE, {
        params: {
          Authorization: AUTH,
          locationName: myLocationName,
        },
      })
      .catch((e) => console.log(e, 111));

    const locationData = res.data.records.location[0];

    const weatherElement = locationData.weatherElement.reduce(
      (myWeatherElement, item) => {
        if (["WDSD", "TEMP"].includes(item.elementName)) {
          myWeatherElement[item.elementName] = item.elementValue;
        }

        return myWeatherElement;
      },
      {}
    );
    setCurrentWeather({
      ...currentWeather,
      locationName: locationData.locationName,
      windSpeed: weatherElement.WDSD,
      temperature: weatherElement.TEMP,
      observationTime: locationData.time.obsTime,
      isLoading: true,
    });

    //三十六小時天氣預報

    const myCity = "新北市";
    const res2 = await axios
      .get(WEATHER + TWO_DAY, {
        params: {
          Authorization: AUTH,
          locationName: myCity,
        },
      })
      .catch((e) => console.log(e, 222));

    const locationInfo = res2.data.records.location[0].weatherElement;

    const myData = locationInfo.filter((v) => {
      return ["Wx", "PoP"].includes(v.elementName);
    });

    setCurrentWeather({
      ...currentWeather,
      description: myData[0].time[0].parameter.parameterName,
      rainPossibility: myData[1].time[0].parameter.parameterName,
      isLoading: false,
    });

    // fetch(
    //   WEATHER +
    //     OBSERVE +
    //     "?Authorization=" +
    //     AUTH +
    //     "&locationName=" +
    //     myLocationName
    // )
    //   .then((r) => r.json())
    //   .then((data) => {
    //     const {
    //       records: { location },
    //     } = data;

    //     console.log(location);
    //   });
  };

  //-----------------------------------function------------------------------------------
  //-----------------------------------useEffect-----------------------------------------
  useEffect(() => {
    fetchCurrentWeather();
  }, []);

  //-----------------------------------useEffect-----------------------------------------

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        <WeatherCard>
          {console.log("render isLoading:" + currentWeather.isLoading)}
          <Location>{currentWeather.locationName}</Location>
          <Description>{currentWeather.description}</Description>
          <CurrentWeather>
            <Temperature>
              {Math.round(currentWeather.temperature)}
              <Celsius>°C</Celsius>
            </Temperature>
            <DayCloudy></DayCloudy>
          </CurrentWeather>
          <AirFlow>
            <AirFlowIcon></AirFlowIcon>
            {currentWeather.windSpeed} m/h
          </AirFlow>
          <Rain>
            <RainIcon></RainIcon>
            {currentWeather.rainPossibility}%
          </Rain>
          <Refresh onClick={fetchCurrentWeather} isLoading={isLoading}>
            最後觀測時間：
            {dayjs(currentWeather.observationTime)
              .locale("zh-tw")
              .format("a hh:mm")}
            {isLoading ? <LoadingIcon /> : <RefreshIcon />}
          </Refresh>
        </WeatherCard>
      </Container>
    </ThemeProvider>
  );
}

export default App;
