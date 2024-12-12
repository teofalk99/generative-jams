import Song from "./Song"
import preloadedSongs from "./preloadedSongs"
import { useState } from "react";


const MusicMenu = ({ handleAPICall }) => {

    const [currentSong, setCurrentSong] = useState(null)

    const changeCurrentSong = (song) => {
      setCurrentSong(song)
    }

    return (
      <div>
  <div class="grid grid-cols-4 gap-4">
    {
      preloadedSongs.map((song) => (
        <Song song={song} handleAPICall={handleAPICall} changeCurrentSong={changeCurrentSong} />
      ))
    }
  </div>
</div>

    );
};
export default MusicMenu;