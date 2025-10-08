import styles from '../../styles/loader.module.css';

const LoadingSpinnerSection = () => {
  return (
    <div className='w-full h-[150px] flex items-center justify-center'>
      <span className={styles.loader}></span>
    </div>
  );
};

export default LoadingSpinnerSection;
