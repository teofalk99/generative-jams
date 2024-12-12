import React, { useEffect, useState } from 'react';
import Recorder from './Recorder'
import axios from 'axios';


const RecorderMenu = ( {handleAPICall} ) => {
    const [currentRecording, setCurrentRecording] = useState(null)
    const [currentAudioFile, setCurrentAudioFile] = useState(null)

    const handleRecording = (audio) =>{
        setCurrentRecording(audio);
    }


    useEffect(() => {
        if (currentRecording) {
            console.log(`current audio is`);
            console.log(currentRecording);

            const convertToFile = async (url) => {
                let file = await fetch(url).then(r => r.blob()).then(blobFile => new File([blobFile], "audioRecording.webm", { type: "audio/webm" }))
                setCurrentAudioFile(file)
            }

            convertToFile(currentRecording.blobURL);
        }}, [currentRecording]
    )

    useEffect(() => {
        if (currentAudioFile) {
            console.log(`current audio file is`);
            console.log(currentAudioFile);

            const fetchSong = async (audioFile) => {
                try {
                    const formData = new FormData();
                    formData.append('file', audioFile);
                    const response = await axios.post('http://localhost:3001/shazamAPI', formData, {
                        headers : {
                            'Content-Type': 'multipart/form-data',
                          },
                    });

                  if (response.status != 200) {
                    console.log(`HTTP error status: ${response.status}`)
                    throw new Error(`HTTP error status: ${response.status}`);
                  }
                  console.log(response)
                  const content = response.data.content;
                  //set new song and trigger AI API call
                  const newSong = {artist:content.artist, title:content.title, lyrics:content.lyrics};
                  handleAPICall(newSong);

                } catch (error) {
                  console.log('error');
                }
              };


            const newSong = fetchSong(currentAudioFile);
        }},[currentAudioFile]
        )
    



    return (
        <div className='recorder-menu'>
            <Recorder handleRecording={handleRecording}/>
        </div>
    )
}

export default RecorderMenu;