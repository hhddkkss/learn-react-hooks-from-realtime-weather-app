//套件模組
import React, { useState, useEffect, useCallback, useMemo } from "react";
//載入 emotion 的 styled套件
import styled from "@emotion/styled";
//第二種 載入themeProvider 來使用主題色 就不用一個一個傳 props下去
import { ThemeProvider } from "@emotion/react";
import "dayjs/locale/zh-tw";

//元件
import WeatherCard from "./views/WeatherCard";
import WeatherSetting from "./views/WeatherSetting";

//css樣式
import "./App.css";
import "normalize.css"; //把不同瀏覽器預設樣式變成一樣
//hook
import useWeatherAPi from "./hooks/useWeatherAPi";

// utils
import { getMoment, findLocation } from "./utils/helpers";

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

function App() {
  const [currentTheme, setCurrentTheme] = useState("dark");

  //條件轉譯來選擇要顯示的畫面
  const [currentPage, setCurrentPage] = useState("WeatherCard");
  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage);
  };

  // method 1.可以這樣寫
  // const storedCity = localStorage.getItem("cityName") || "新北市";

  // const [currentCity, setCurrentCity] = useState(storedCity);

  // method 2. 可以在 useState 中放入一個函式 函式的回傳值會等於state的預設值

  const [currentCity, setCurrentCity] = useState(
    () => localStorage.getItem("cityName") || "新北市"
  );

  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity);
  };

  const currentLocation = useMemo(
    () => findLocation(currentCity),
    [currentCity]
  );
  // {
  //   cityName: "新北市",
  //   locationName: "板橋",
  //   sunriseCityName: "新北市",
  // },

  const { cityName, locationName, sunriseCityName } = currentLocation;

  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);

  const [weatherElement, fetchData] = useWeatherAPi({ locationName, cityName });

  useEffect(() => {
    setCurrentTheme(moment === "day" ? "light" : "dark");
  }, [moment]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === "WeatherCard" && (
          <WeatherCard
            cityName={cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            handleCurrentPageChange={handleCurrentPageChange}
          />
        )}
        {currentPage === "WeatherSetting" && (
          <WeatherSetting
            handleCurrentPageChange={handleCurrentPageChange}
            handleCurrentCityChange={handleCurrentCityChange}
            cityName={cityName}
          />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
