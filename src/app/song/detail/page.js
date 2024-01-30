"use client";
import MusicCard from "../../../../components/MusicCardDetail";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HandleListenSong } from "../../../../components/common/fetchapi";

export const CurrentSongContext = React.createContext(null);
export default function BasicCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentSong, setCurrentSong] = React.useState(null);
  const [isPlayComplete, setisPlayComplete] = React.useState(false);
  const [playingpage, setplayingpage] = React.useState("");
  const [canlistplay, setcanlistplay] = React.useState(false);
  const params = { songID: searchParams.get("songID") };
  const AddLocalStorageDebug = () => {
    handleListenClick(params.songID);
  };
  const handleListenClick = (songId) => {
    if (params.songID || params.songID !== "") {
      HandleListenSong(songId)
        .then((e) => {
          setCurrentSong(e);
          setcanlistplay(false);
        })
        .catch((error) => {
          router.replace("/");
        });
    } else {
      router.replace("/");
    }
  };
  React.useEffect(() => {
    AddLocalStorageDebug();
  }, []);
  return (
    <main>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Noto+Sans+SC:100,300,400,500,700,900"
      />
      <meta
        httpEquiv="Content-Security-Policy"
        content="upgrade-insecure-requests"
      />
      <link rel="icon" href="./favicon.ico" />
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <CurrentSongContext.Provider
        value={{
          isPlayComplete,
          setCurrentSong,
          setisPlayComplete,
          setcanlistplay,
          playingpage,
          setplayingpage,
        }}
      >
        <div>
          <MusicCard
            currentSong={currentSong}
            setisPlayComplete={setisPlayComplete}
            canlistplay={canlistplay}
            setcanlistplay={setcanlistplay}
          />
        </div>
      </CurrentSongContext.Provider>
    </main>
  );
}
