import SearchSection from "./components_weather/SearchSection";
import CurrentWeather from "./components_weather/CurrentWeather";
import HourlyWeatherItem from "./components_weather/HourlyWeather";
import { weatherCodes } from "./constants_weather";
import { useEffect, useRef, useState } from "react";
import NoResultsDiv from "./components_weather/NoResultsDiv";
import styles from "./weather.module.css";

const WeatherPage = () => {
  const [currentWeather, setCurrentWeather] = useState({});
  const [hourlyForecasts, setHourlyForecasts] = useState([]);
  const [hasNoResults, setHasNoResults] = useState(false);
  const searchInputRef = useRef(null);
  const API_KEY = process.env.REACT_APP_API_KEY;

  const filterHourlyForecast = (hourlyData) => {
    const currentHour = new Date().setMinutes(0, 0, 0);
    const next24Hours = currentHour + 24 * 60 * 60 * 1000;
    const next24HoursData = hourlyData.filter(({ time }) => {
      const forecastTime = new Date(time).getTime();
      return forecastTime >= currentHour && forecastTime <= next24Hours;
    });
    setHourlyForecasts(next24HoursData);
  };

  const getWeatherDetails = async (API_URL) => {
    setHasNoResults(false);
    if (window.innerWidth <= 768) searchInputRef.current?.blur();

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error();
      const data = await response.json();

      const temperature = Math.floor(data.current.temp_c);
      const description = data.current.condition.text;
      const weatherIcon = Object.keys(weatherCodes).find((icon) =>
        weatherCodes[icon].includes(data.current.condition.code)
      );

      setCurrentWeather({ temperature, description, weatherIcon });

      const combinedHourlyData = [
        ...data.forecast.forecastday[0].hour,
        ...data.forecast.forecastday[1].hour,
      ];
      if (searchInputRef.current) {
        searchInputRef.current.value = data.location.name;
      }
      filterHourlyForecast(combinedHourlyData);
    } catch {
      setHasNoResults(true);
    }
  };

  useEffect(() => {
    const defaultCity = "London";
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${defaultCity}&days=2`;
    getWeatherDetails(API_URL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.weatherRoot}>
      <div className={styles.container}>
        {/* Search section */}
        <SearchSection
          getWeatherDetails={getWeatherDetails}
          searchInputRef={searchInputRef}
        />

        {/* Content */}
        {hasNoResults ? (
          <NoResultsDiv />
        ) : (
          <div className={styles["weather-section"]}>
            <CurrentWeather currentWeather={currentWeather} />
            <div className={styles["hourly-forecast"]}>
              <ul className={styles["weather-list"]}>
                {hourlyForecasts.map((hourlyWeather) => (
                  <HourlyWeatherItem
                    key={hourlyWeather.time_epoch}
                    hourlyWeather={hourlyWeather}
                  />
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherPage;
