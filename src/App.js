//套件模組
import React from "react";
import styled from "@emotion/styled";
//載入 emotion 的 styled套件
import { ReactComponent as DayCloudyIcon } from "./images/day-cloudy.svg";
import { ReactComponent as RainIcon } from "./images/rain.svg";
import { ReactComponent as AirFlowIcon } from "./images/airFlow.svg";
import { ReactComponent as RefreshIcon } from "./images/refresh.svg";

//css樣式
import "./App.css";
import "normalize.css"; //把不同瀏覽器預設樣式變成一樣

//記得跟元件一樣要使用大寫駝峰
//style.div代表要新增一個 div的元件 如果要新增 button 就是styled.button
const Container = styled.div`
  background-color: #ededed;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: 0 1px 3px 0 #999999;
  background-color: #f9f9f9;
  box-sizing: border-box;
  padding: 30px 15px 10px;
`;

const Location = styled.div`
  ${"" /* 透過props傳入元件  會拿到{theme:dark , children:台北市 }*/}
  ${(props) => console.log(props)} 
  font-size: 28px;
  ${"" /* 透過props傳入的參數來更換顏色 */}
  color: ${(props) => (props.theme === "dark" ? "#dadada" : "#212121")};
  margin-bottom: 1rem;
`;

const Description = styled.div`
  color: #ccc;
  margin-bottom: 2rem;
  ${
    "" /* &:hover {
    color: #000;
  } */
  }
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Temperature = styled.div`
  font-size: 100px;
  color: #777;
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
  color: #ccc;
  margin-bottom: 1rem;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  color: #ccc;
  margin-bottom: 1rem;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Refresh = styled.p`
  text-align: right;
  color: #ccc;
  margin: 0;
  svg {
    width: 15px;
    height: auto;
    margin-left: 10px;
    curser: pointer;
  }
`;
const DayCloudy = styled(DayCloudyIcon)`
  flex-basis: 30%;
`;

function App() {
  return (
    <Container>
      <WeatherCard>
        <Location theme="light">台北市</Location>
        {}
        <Description>多雲時晴</Description>
        <CurrentWeather>
          <Temperature>
            23<Celsius>°C</Celsius>
          </Temperature>
          <DayCloudy></DayCloudy>
        </CurrentWeather>
        <AirFlow>
          <AirFlowIcon></AirFlowIcon>23 m/h
        </AirFlow>
        <Rain>
          <RainIcon></RainIcon>48%
        </Rain>
        <Refresh>
          最後觀測時間： 上午12:03<RefreshIcon></RefreshIcon>
        </Refresh>
      </WeatherCard>
    </Container>
  );
}

export default App;
