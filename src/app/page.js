"use client";
import AppBar from "../../components/appbar";
import Advertisement from "../../components/advertisement";
import About from "../../components/about";
import SongSearchTable from "../../components/SongSearchTable";
import MusicCard from "../../components/MusicCard";
import * as React from "react";
import TopBar from "../../components/TopBar";
import TopBarBS from "../../components/TopBarBS";
export const CurrentSongContext = React.createContext(null);
export default function BasicCard() {
  const [currentSong, setCurrentSong] = React.useState(null);
  return (
    <main>
      <link rel="icon" href="./favicon.ico" />
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <AppBar />
      <Advertisement />
      <CurrentSongContext.Provider value={{ setCurrentSong }}>
        <div>
          <MusicCard currentSong={currentSong} />
          <SongSearchTable />
          <TopBar />
          <TopBarBS />
        </div>
      </CurrentSongContext.Provider>
      <About />
    </main>
  );
}
