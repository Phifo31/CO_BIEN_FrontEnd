import styles from '../weather.module.css';
import { weatherCodes } from '../constants_weather';

const HourlyWeatherItem = ({ hourlyWeather }) => {
  // Extract and format temperature and time
  const temperature = Math.floor(hourlyWeather.temp_c);
  const time = hourlyWeather.time.split(' ')[1].substring(0, 5);

  // Find the appropriate weather icon
  const weatherIcon = Object.keys(weatherCodes).find((icon) =>
    weatherCodes[icon].includes(hourlyWeather.condition.code)
  );

  return (
    <li className={styles['weather-item']}>
      <p className={styles.time}>{time}</p>
      <img
        src={`icons_weather/${weatherIcon}.svg`}
        className={styles['weather-icon']}
        alt="weather icon"
      />
      <p className={styles.temperature}>{temperature}°</p>
    </li>
  );
};

export default HourlyWeatherItem;
