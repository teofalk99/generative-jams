import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const FeedbackForm = ({ metaData , submitData }) => {
  const [slider1, setSlider1] = useState(null);
  const [slider2, setSlider2] = useState(null);
  const [submitted, setSubmitted] = useState(false);


//   console.log(metaData);

 const submit = () =>{
    submitData({
        img_quality: slider1,
        img_relevance: slider2,
        exec_time: metaData.exec_time,
        num_words: metaData.num_words,
        num_images: metaData.num_images,
        model: metaData.model
    });
    //avoid multiple submissions
    setSubmitted(true);
 }

 const handleSubmit = (event) => {
    event.preventDefault();
    submit();
  };

  return (
    (submitted) ?
    (
        <div
      className="container mt-5 p-4 text-center"
      style={{
        maxWidth: '800px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}>
        Thank you for your feedback!
      </div>
    )
    :
    (<div
      className="container mt-5 p-4"
      style={{
        maxWidth: '800px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <form onSubmit={handleSubmit}>

        <div className="d-flex align-items-center">
          <div className="flex-grow-1 me-3 text-center">
            <label htmlFor="slider1" className="form-label">
            <div className="text-center">Image Quality</div>
            </label>
            <input
              type="range"
              className={`form-range opacity-${slider1 ? 100 : 50} color-blue`}
              id="slider1"
              min="0"
              max="100"
              value={slider1 ? (slider1) : 50}
              onChange={(e) => setSlider1(e.target.value)}
            />
          </div>

          <div className="flex-grow-1 me-3 text-center">
            <label htmlFor="slider2" className="form-label">
              Image Relevance
            </label>
            <input
              type="range"
              className={`form-range opacity-${slider2 ? 100 : 50} color-blue`}
              id="slider2"
              min="0"
              max="100"
              value={slider2 ? (slider2) : 50}
              onChange={(e) => setSlider2(e.target.value)}
            />
          </div>

          <div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>)
  );
};

export default FeedbackForm;