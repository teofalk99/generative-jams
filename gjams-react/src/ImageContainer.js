
import { tailspin } from 'ldrs'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slideshow from './Slideshow';
import FeedbackForm from './FeedbackForm';


// Default values shown


const ImageContainer = ({ currentSong, currentModel }) => {

    const [imageURLs, setImageURLs] = useState([]);
    const [metaData, setMetaData] = useState(null);
    const [error, setError] = useState(false);

    var model = currentModel

    const submitData = (data) => {
      console.log("SUBMITTING TO DATABASE:");
      console.log(data);
      submitToDatabase(data);
    }

    const submitToDatabase = async (data) => {
      try {
        const response = await axios.post('http://localhost:3001/DBstore', {
          params: data,
        });
        if (response.status != 200) {
          throw new Error(`HTTP error status: ${response.status}`);
        }}

      catch (error) {
        console.log('Database storage error');
      }
    }

    useEffect(() => {
      if (currentModel){
        model = currentModel
        console.log('setting model to', model)
      }
    }, [currentModel]);

    useEffect(() => {
      if (currentSong) {
        // Respond to the new state, reset song array
        setImageURLs([])
        console.log("New song:", currentSong);
        console.log("attempting to use model", model)

        const fetchURLs = async () => {
          try {
            const response = await axios.get('http://localhost:3001/generateImage', {
              params: {
                artistName: currentSong.artist,
                songLyrics: currentSong.lyrics,
                songTitle: currentSong.title,
                model: model
              },
            });
            if (response.status != 200) {
              console.log(`HTTP error status: ${response.status}`)
              throw new Error(`HTTP error status: ${response.status}`);
            }


            const data = response.data[0]
            console.log(data)
            setMetaData({
                exec_time: data.exec_time, 
                num_words: data.prompt_num_words,
                num_images: data.urls.length,
                model: data.model
              })
            setImageURLs(response.data[0].urls)

          } catch (error) {
            alert('Error - please try again');
            setError(true);
          }
        };
    
        fetchURLs();
      }
  }, [currentSong]);

    tailspin.register()
    return (
      <div class="flex justify-center items-center pt-12">
        {currentSong == null ? (
            <div className='h-96 border-solid border-gray-50'>

              <div className='mt-5'>{"Start recording a song and generated images will be produced shortly!"}</div>
            </div>) : (
                imageURLs.length == 0 ? (
                  <div className='h-96 border-solid border-gray-50'>
                  <div className="d-flex justify-content-center align-items-center">
                  <l-tailspin
                      size="150"
                      stroke="5"
                      speed="0.9" 
                      color="black">
                      </l-tailspin>    
                  </div>
            </div>
                )
                :
                (
                  <div>
                    <div className="d-flex justify-content-center align-items-center font-weight-bold fs-3">
                      {currentSong.artist} - {currentSong.title}
                    </div>
                    <Slideshow imageURLs={imageURLs}/>
                    <FeedbackForm metaData={metaData} submitData={submitData}/>
                  </div>
                )            
            
            )}
      </div>

    );
};
export default ImageContainer;