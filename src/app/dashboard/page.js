"use client";
import AppBar from "../../../components/appbar";
import Advertisement from "../../../components/advertisement";
import About from "../../../components/about";
import SongSearchTable from "../../../components/SongSearchTable";
import MusicCard from "../../../components/MusicCard";
import * as React from "react";
import TopBar from "../../../components/TopBar";
import TopBarBS from "../../../components/TopBarBS";
import SongBar from "../../../components/SongBar";
export const CurrentSongContext = React.createContext(null);
(function () {
  setInterval(function () {
    check();
  }, 1000);
  var check = function () {
    function doCheck(a) {
      if (("" + a / a)["length"] !== 1 || a % 20 === 0) {
        (function () {})["constructor"]("debugger")();
      } else {
        (function () {})["constructor"]("debugger")();
      }
      doCheck(++a);
    }
    try {
      doCheck(0);
    } catch (err) {}
  };
  check();
})();
export default function BasicCard() {
  const [currentSong, setCurrentSong] = React.useState(null);
  const AddBaiDuTJ = () => {
    var _hmt = _hmt || [];
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?68cb9d0aa571714fd6cb36083949f31e";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
  };
  React.useEffect(() => {
    AddBaiDuTJ();
  }, []);
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
          <SongBar />
        </div>
      </CurrentSongContext.Provider>
      <About />
    </main>
  );
}
