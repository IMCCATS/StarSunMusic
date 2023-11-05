"use client";
import MusicCard from "../../../../components/MusicCardDetail";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ScrollToTopFab from "../../../../components/common/ScrollToTopFab";
import $ from "jquery";

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
    window.addEventListener("storage", (e) => {
      if (e.key) {
        localStorage.setItem(e.key, e.oldValue);
      }
    });
    handleListenClick(params.songID);
  };
  const handleListenClick = (songId) => {
    if (params.songID || params.songID !== "") {
      $.ajax({
        url: "https://api.paugram.com/netease/",
        type: "get",
        dataType: "json",

        data: {
          id: `${songId}`,
        },
        beforeSend: function () {
          //请求中执行的代码
        },
        complete: function () {
          //请求完成执行的代码
        },
        error: function () {},
        success: function (res) {
          $.Deferred().resolve(res);
          // 状态码 200 表示请求成功
          if (
            res &&
            res.title &&
            res.artist &&
            res.link &&
            res.id &&
            res.cover &&
            res.artist
          ) {
            setCurrentSong(res);
            setcanlistplay(false);
          } else {
            setTimeout(() => {
              router.replace("/");
            }, 1000);
          }
        },
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
