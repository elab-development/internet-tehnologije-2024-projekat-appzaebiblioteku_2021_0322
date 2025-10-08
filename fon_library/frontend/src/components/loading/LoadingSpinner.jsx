import styles from '../../styles/loader.module.css';

const LoadingSpinner = () => {
  return (
    <div className='min-h-screen min-w-screen bg-purple-950 flex items-center justify-center relative overflow-hidden'>
      <span className={styles.loader}></span>
    </div>
  );
};

export default LoadingSpinner;
