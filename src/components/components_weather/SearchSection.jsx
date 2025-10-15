import styles from '../weather.module.css';

const SearchSection = ({ getWeatherDetails, searchInputRef }) => {
  const API_KEY = process.env.REACT_APP_API_KEY;

  // Handles city search form submission
  const handleCitySearch = (e) => {
    e.preventDefault();
    const value = (searchInputRef.current?.value || '').trim();
    if (!value) return;
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
      value
    )}&days=2`;
    getWeatherDetails(API_URL);
  };

  // Gets user's current location (latitude/longitude)
  const handleLocationSearch = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=2`;
        getWeatherDetails(API_URL);
        if (window.innerWidth >= 768) searchInputRef.current?.focus();
      },
      () => {
        alert('Location access denied. Please enable permissions to use this feature.');
      }
    );
  };

  return (
    <div className={styles['search-section']}>
      <form action="#" className={styles['search-form']} onSubmit={handleCitySearch}>
        <span className="material-symbols-rounded">search</span>
        <input
          type="search"
          placeholder="Enter a city name"
          className={styles['search-input']}
          ref={searchInputRef}
          required
        />
      </form>
      <button className={styles['location-button']} onClick={handleLocationSearch}>
        <span className="material-symbols-rounded">my_location</span>
      </button>
    </div>
  );
};

export default SearchSection;
