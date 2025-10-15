// const CurrentWeather = ({ currentWeather }) => {
//   return (
//     <div className="current-weather">
//       <img src={`icons/${currentWeather.weatherIcon}.svg`} className="weather-icon" />
//       <h2 className="temperature">
//         {currentWeather.temperature} <span>°C</span>
//       </h2>
//       <p className="description">{currentWeather.description}</p>
//     </div>
//   );
// };
// export default CurrentWeather;

import styles from '../weather.module.css';

const CurrentWeather = ({ currentWeather }) => {
  return (
    <div className={styles['current-weather']}>
      <img
        src={`icons_weather/${currentWeather.weatherIcon}.svg`}
        alt="weather icon"
        className={styles['weather-icon']}
      />
      <h2 className={styles.temperature}>
        {currentWeather.temperature} <span>°C</span>
      </h2>
      <p className={styles.description}>{currentWeather.description}</p>
    </div>
  );
};

export default CurrentWeather;
