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
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import JuanZeng from "../../../components/juanzeng";
import ScrollToTopFab from "../../../components/ScrollToTopFab";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export const CurrentSongContext = React.createContext(null);
export default function BasicCard() {
  const router = useRouter();
  const [currentSong, setCurrentSong] = React.useState(null);
  const [isPlayComplete, setisPlayComplete] = React.useState(false);
  const [playingpage, setplayingpage] = React.useState("");
  const [canlistplay, setcanlistplay] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };
  const CheckPolicy = () => {
    const state = localStorage.getItem("isAgreedPolicy");
    if (state !== "1") {
      handleClick();
      setTimeout(() => {
        router.push("/");
      }, 5000);
    }
  };
  const AddBaiDuTJ = () => {
    var _hmt = _hmt || [];
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?68cb9d0aa571714fd6cb36083949f31e";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
  };
  React.useEffect(() => {
    AddBaiDuTJ();
    CheckPolicy();
  }, []);
  return (
    <main>
      <link rel="icon" href="./favicon.ico" />
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <Snackbar open={open}>
        <Alert severity="warning" sx={{ width: "100%" }}>
          <span>您还没有同意用户协议与隐私政策，5秒后将自动跳转首页！</span>
        </Alert>
      </Snackbar>
      <AppBar />
      <Advertisement />
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
          />
          <SongSearchTable setcanlistplay={setcanlistplay} />
          <TopBar />
          <TopBarBS />
          <SongBar />
        </div>
        <ScrollToTopFab />
      </CurrentSongContext.Provider>
      <JuanZeng />
      <About />
    </main>
  );
}
