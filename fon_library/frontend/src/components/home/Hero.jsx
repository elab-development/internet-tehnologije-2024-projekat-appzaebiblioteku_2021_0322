import libraryImage from '../../assets/library-img.jpg';

const Hero = () => {
  return (
    <section
      className='relative min-h-[80vh] flex items-center justify-center text-white px-4 sm:px-10'
      style={{
        background: `linear-gradient(rgba(141, 39, 174, 0.3), rgba(141, 39, 174, 0.5)), url('${libraryImage}') center/cover no-repeat`,
      }}
    >
      <div className='relative z-10 max-w-3xl text-center'>
        <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold capitalize mb-6'>
          Find your book of choice.
        </h2>
        <p className='text-sm sm:text-base md:text-lg font-light leading-relaxed'>
          Dive into a world of endless stories and knowledge. Whether you are
          searching for a gripping novel, a study resource, or your next big
          inspiration, our library has it all. Use the search below to discover
          your perfect read in seconds.
        </p>
      </div>
    </section>
  );
};

export default Hero;
