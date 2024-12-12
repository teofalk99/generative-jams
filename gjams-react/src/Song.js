import React, { useState } from 'react';


const Song = ({ song, handleAPICall, changeCurrentSong }) => {


    const handleSongClick = () => {
        changeCurrentSong(song);
        handleAPICall(song);
    }



    return (
        <div className="border-solid border-gray-400 hover:border-black border-2 w-48 h-64 content-top" onClick={() => {handleSongClick()}}>
            <img src={require(`./assets/images/${song.filename}`)} className=""></img>
            <div className="text-center text-lg">{song.title}</div>
            <div className="text-center text-sm">{song.artist}</div>
        </div>

    );
};
export default Song;