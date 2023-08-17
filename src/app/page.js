"use client";
import AppBar from "../../components/appbar";
import Advertisement from "../../components/advertisement";
import About from "../../components/about";
import SongSearchTable from "../../components/SongSearchTable";
import MusicCard from "../../components/MusicCard";
import * as React from "react";
import TopBar from "../../components/TopBar";
export const CurrentSongContext = React.createContext(null);
export default function BasicCard() {
  const [currentSong, setCurrentSong] = React.useState(null);
  return (
    <main>
      <script src="https://cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js"></script>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <AppBar />
      <Advertisement />
      <CurrentSongContext.Provider value={{ setCurrentSong }}>
        <div>
          <MusicCard currentSong={currentSong} />
          <SongSearchTable />
          <TopBar />
        </div>
      </CurrentSongContext.Provider>
      <About />
    </main>
  );
}
