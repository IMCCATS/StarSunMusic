"use client";
import AppBar from "../../../components/common/appbar";
import Advertisement from "../../../components/common/advertisement";
import About from "../../../components/common/about";
import SongSearchTable from "../../../components/SongSearchTable";
import MusicCard from "../../../components/MusicCard";
import * as React from "react";
import TopBar from "../../../components/TopBar";
import TopBarBS from "../../../components/TopBarBS";
import SongBar from "../../../components/SongBar";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import JuanZeng from "../../../components/common/juanzeng";
import ScrollToTopFab from "../../../components/ScrollToTopFab";
import PersonalPlaylist from "../../../components/PersonalPlaylist";
import UpdateDialog from "../../../components/common/updatedialog";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  DialogActions,
} from "@mui/material";

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
  const AddLocalStorageDebug = () => {
    window.addEventListener("storage", (e) => {
      if (e.key) {
        localStorage.setItem(e.key, e.oldValue);
        // handleClickOpen();
      }
    });
  };
  React.useEffect(() => {
    AddLocalStorageDebug();
    CheckPolicy();
  }, []);
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };
  return (
    <main>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Noto+Sans+SC:100,300,400,500,700,900"
      />
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>
          <span>🚨不要修改程序的本地数据！！！</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span>
              如果您修改了程序的本地数据，轻则可能会导致程序无法正常运作，重则可能会导致程序出现不可意料的结果！！！
            </span>
            <br />
            <br />
            <span>
              保持程序本地数据的合法性会让大家都有一个好的《星阳音乐系统》使用哦~
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            <span>我知道啦~</span>
          </Button>
        </DialogActions>
      </Dialog>
      <meta
        httpEquiv="Content-Security-Policy"
        content="upgrade-insecure-requests"
      />
      <link rel="icon" href="./favicon.ico" />
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <Snackbar open={open}>
        <Alert severity="warning" sx={{ width: "100%" }}>
          <span>您还没有同意用户协议与隐私政策，5秒后将自动跳转首页！</span>
        </Alert>
      </Snackbar>
      <AppBar />
      <Advertisement />
      <UpdateDialog />
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
          <PersonalPlaylist />
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
