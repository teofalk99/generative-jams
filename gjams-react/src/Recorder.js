import React, {useState} from 'react';
import { ReactMic } from 'react-mic';
import "bootstrap/dist/css/bootstrap.min.css";



const Recorder = ({ handleRecording }) => {
  
  const [record, setRecord] = useState(false)
  

  const startRecording = () => {
    setRecord(true);
    setTimeout(stopRecording, 5000);
  }

  const stopRecording = () => {
    setRecord(false);
  }

  const onData = (recordedBlob) => {
    console.log('chunk of real-time data is: ', recordedBlob);
  }

  const onStop = (recordedBlob) => {
    console.log('recordedBlob is: ', recordedBlob);
    handleRecording(recordedBlob)
    
  }

  return (
      <div>
        <ReactMic
          record={record}
          className="sound-wave"
          onStop={onStop}
          onData={onData}
          strokeColor="#000000"
          backgroundColor="#FFFFFF" />
          <div className='d-flex justify-content-center align-items-center'>
            {record ? 
            ('Recording...')
            :
            (<button onClick={startRecording} type="button" className='btn btn-secondary'>Record</button>)}
          </div>
      </div>
    );
  }

export default Recorder;


