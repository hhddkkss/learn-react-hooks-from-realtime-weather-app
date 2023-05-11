//套件模組
import React, { useState, useEffect, useCallback, useMemo } from "react";
//載入 emotion 的 styled套件
import styled from "@emotion/styled";
//第二種 載入themeProvider 來使用主題色 就不用一個一個傳 props下去
import { ThemeProvider } from "@emotion/react";
import dayjs from "dayjs";
import "dayjs/locale/zh-tw";
import axios from "axios";

import WeatherIcon from "./components/WeatherIcon";
import { ReactComponent as RainIcon } from "./images/rain.svg";
import { ReactComponent as AirFlowIcon } from "./images/airFlow.svg";
import { ReactComponent as RefreshIcon } from "./images/refresh.svg";
import { ReactComponent as LoadingIcon } from "./images/loading.svg";

//css樣式
import "./App.css";
import "normalize.css"; //把不同瀏覽器預設樣式變成一樣

// API
import { WEATHER, AUTH, TWO_DAY, OBSERVE } from "./Api/weather.js";

// utils
import { getMoment } from "./utils/helpers";

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
    ${"" /* {isLoading} 是因為要從父元件解構 */}
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
const myLocationName = "石碇";
const myCity = "新北市";
//-----------------------------------function------------------------------------------
const fetchCurrentWeather = () => {
  //氣象觀測資料
  return axios
    .get(WEATHER + OBSERVE, {
      params: {
        Authorization: AUTH,
        locationName: myLocationName,
      },
    })
    .then((res) => {
      const locationData = res.data.records.location[0];

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
    .catch((e) => console.log(e, 111));
};

function fetchWeatherForecast() {
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
    .catch((e) => console.log(e, 222));
}

//-----------------------------------function------------------------------------------
function App() {
  //-----------------------------------state---------------------------------------------
  const [currentTheme, setCurrentTheme] = useState("dark");
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

  const moment = useMemo(() => getMoment(myCity), []);

  //-----------------------------------state---------------------------------------------
  //-----------------------------------function------------------------------------------

  //同時請求多個 api的話 建議把它變成並發請求 會是更好的選擇 可以最小延遲的加載頁面
  //useEffect 處理api 處理完在 setState
  //不要定義在useEffect內 拉到外面 可以讓重新整理的按鈕也使用fetchData這個 function

  /**
   *  當react 內的資料狀態有變動時 整個用來產生react元件的function 都會重新執行一次
   *
   */
  const fetchData = useCallback(async () => {
    setWeatherElement((prev) => ({
      ...prev,
      isLoading: true,
    }));

    const data = await axios.all([
      fetchCurrentWeather(),
      fetchWeatherForecast(),
    ]);

    const [currentWeather, weatherForecast] = data;

    setWeatherElement({
      ...currentWeather,
      ...weatherForecast,
      isLoading: false,
    });
  }, []);

  //-----------------------------------function------------------------------------------

  //-----------------------------------useEffect-----------------------------------------
  useEffect(() => {
    console.log("useEffect render");
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentTheme(moment === "day" ? "light" : "dark");
  }, [moment]);

  //-----------------------------------useEffect-----------------------------------------

  //解構出來可以讓程式碼更整潔
  const {
    description,
    rainPossibility,
    isLoading,
    observationTime,
    temperature,
    windSpeed,
    locationName,
    comfortable,
    weatherCode,
  } = weatherElement;

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      {console.log(weatherElement)}
      <Container>
        <WeatherCard>
          <Location>{locationName}</Location>
          <Description>
            {description} {comfortable}
          </Description>
          <CurrentWeather>
            <Temperature>
              {Math.round(temperature)}
              <Celsius>°C</Celsius>
            </Temperature>
            <WeatherIcon weatherCode={weatherCode} moment={moment} />
          </CurrentWeather>
          <AirFlow>
            <AirFlowIcon></AirFlowIcon>
            {windSpeed} m/h
          </AirFlow>
          <Rain>
            <RainIcon></RainIcon>
            {rainPossibility}%
          </Rain>
          <Refresh onClick={fetchData} isLoading={isLoading}>
            最後觀測時間：
            {dayjs(observationTime).locale("zh-tw").format("a hh:mm")}
            {isLoading ? <LoadingIcon /> : <RefreshIcon />}
          </Refresh>
        </WeatherCard>
      </Container>
    </ThemeProvider>
  );
}

export default App;
