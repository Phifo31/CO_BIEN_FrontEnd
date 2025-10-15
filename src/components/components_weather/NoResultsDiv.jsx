import styles from '../weather.module.css';

const NoResultsDiv = () => {
  return (
    <div className={styles['no-results']}>
      <img
        src="icons_weather/no-result.svg"
        alt="No results found"
        className={styles.icon}
      />
      <h3 className={styles.title}>Something went wrong!</h3>
      <p className={styles.message}>
        We&apos;re unable to retrieve the weather details. Ensure you&apos;ve entered a valid city or try again later.
      </p>
    </div>
  );
};

export default NoResultsDiv;
