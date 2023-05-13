import React from "react";
import styled from "@emotion/styled";
import dayjs from "dayjs";

import WeatherIcon from "./../components/WeatherIcon";
import { ReactComponent as RainIcon } from "./../images/rain.svg";
import { ReactComponent as AirFlowIcon } from "./../images/airFlow.svg";
import { ReactComponent as RefreshIcon } from "./../images/refresh.svg";
import { ReactComponent as LoadingIcon } from "./../images/loading.svg";
import { ReactComponent as CogIcon } from "../images/cog.svg";

const WeatherCardWrapper = styled.div`
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

const Cog = styled(CogIcon)`
  position: absolute;
  top: 30px;
  right: 15px;
  width: 15px;
  height: 15px;
  cursor: pointer;
`;

const WeatherCard = ({
  weatherElement,
  moment,
  fetchData,
  handleCurrentPageChange,
  cityName,
}) => {
  //解構出來可以讓程式碼更整潔
  const {
    description,
    rainPossibility,
    isLoading,
    observationTime,
    temperature,
    windSpeed,
    comfortable,
    weatherCode,
  } = weatherElement;
  return (
    <WeatherCardWrapper>
      <Cog onClick={() => handleCurrentPageChange("WeatherSetting")} />
      <Location>{cityName}</Location>
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
    </WeatherCardWrapper>
  );
};

export default WeatherCard;
