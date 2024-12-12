import './index.css';
import ModelMenu from './ModelMenu'
import MusicMenu from './MusicMenu'
import ImageContainer from './ImageContainer'
import React, { useState } from 'react';
import RecorderMenu from './RecorderMenu';
import "bootstrap/dist/css/bootstrap.min.css";


const App = () => {

  const [currentSong, setCurrentSong] = useState(null);
  const [currentModel, setCurrentModel] = useState('fastflux')
  const [appState, setAppState] = useState("waiting")

  const handleAPICall = (song) => {
    //pass song object
    setCurrentSong(song);
  }

  const changeModel = (model) => {
    setCurrentModel(model);
  }

  return (
    <div className="">
      <ModelMenu currentModel={currentModel} changeModel={changeModel}/>
      <div className='space-y-12 align-items-center'>
        <ImageContainer currentSong={currentSong} currentModel={currentModel}/>
        <div className='flex justify-center items-center pt-12'>
        <RecorderMenu handleAPICall={handleAPICall}/>
        </div>
        {/* pre-loaded songs, not using for now since music player not working */}
        {/* <MusicMenu handleAPICall={handleAPICall} /> */}
      </div>
    </div>
  );
}

export default App;