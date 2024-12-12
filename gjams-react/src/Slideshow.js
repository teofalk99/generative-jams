import React, { useState, useEffect } from 'react';

const Slideshow = ({ imageURLs }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (imageURLs.length === 0) return;

    // timer
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageURLs.length);
    }, 4000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [imageURLs]);

  return (
    <div>
      <div className='flex items-center justify-center'>
      <img
        src={imageURLs[currentIndex]}
        alt={`Slideshow ${currentIndex}`}
        style={{ width: '512px', height: '512px' }}
      />
      
      </div>

      <div style={styles.barContainer}>
        {imageURLs.map((_, index) => (
          <div
            onClick={() => setCurrentIndex(index)}
            key={index}
            style={{
              ...styles.barSegment,
              backgroundColor: index === currentIndex ? '#000' : '#ddd',
            }}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
    barContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '10px',
      marginTop: '10px',
    },
    barSegment: {
      flex: 1,
      height: '100%',
      margin: '0 2px',
      borderRadius: '5px',
    },
  };
  
export default Slideshow;