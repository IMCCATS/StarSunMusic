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
import ScrollToTopFab from "../../../components/common/ScrollToTopFab";
import PersonalPlaylist from "../../../components/PersonalPlaylist";
import UpdateDialog from "../../../components/common/updatedialog";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import LikeSongBar from "../../../components/LikeSongsBar";
import { ConfigProvider, message } from "antd";
import { HandleListenSong } from "../../../components/common/fetchapi";
import { Backdrop, Card, CardContent, CircularProgress } from "@mui/material";
import SongList from "../../../components/Songlist";
import zhCN from "antd/locale/zh_CN";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import yuxStorage from "@/app/api/yux-storage";
import copy from "copy-to-clipboard";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export const CurrentSongContext = React.createContext(null);
export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});
function StarSunMusic() {
  const router = useRouter();
  const [lastPlayedSongIndex, setLastPlayedSongIndex] = React.useState(0);
  const [currentSong, setCurrentSong] = React.useState(null);
  const [isPlayComplete, setisPlayComplete] = React.useState(false);
  const [playingpage, setplayingpage] = React.useState("");
  const [canlistplay, setcanlistplay] = React.useState(false);
  const [PlayingSongs, SetPlayingSongs] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };
  const CheckPolicy = () => {
    yuxStorage
      .getItem("isAgreedPolicy")
      .then((state) => {
        if (state !== "1") {
          handleClick();
          setTimeout(() => {
            router.push("/");
          }, 5000);
        }
      })
      .catch((e) => {
        handleClick();
        setTimeout(() => {
          router.push("/");
        }, 5000);
      });
  };
  // const AddyuxStorageDebug = () => {
  //   window.addEventListener("storage", (e) => {
  //     if (e.key) {
  //       yuxStorage.setItem(e.key, e.oldValue);
  //     }
  //   });
  // };
  React.useEffect(() => {
    // AddyuxStorageDebug();
    CheckPolicy();
  }, []);

  const [messageApi, contextHolder] = message.useMessage();

  const handleListenClick = (songId, index) => {
    setdisabled(true);
    HandleListenSong(songId)
      .then((e) => {
        setCurrentSong(e);
        setLastPlayedSongIndex(index);
        setdisabled(false);
      })
      .catch((error) => {
        setdisabled(false);
      });
  };

  const handleInsectSongClick = (newSong) => {
    const index = lastPlayedSongIndex + 1;
    SetPlayingSongs((prevSongs) => {
      const a = [...prevSongs];
      a.splice(index, 0, newSong);
      return a;
    });
    messageApi.success("已经添加到下首播~");
  };

  const handleNextSongClick = () => {
    const index = lastPlayedSongIndex + 1;
    // 检查索引是否越界
    if (index >= PlayingSongs.length) {
      messageApi.success("列表播放已完成");
      return;
    }
    if (PlayingSongs[index] && PlayingSongs[index].id) {
      handleListenClick(PlayingSongs[index].id, index);
      setisPlayComplete(false);
    }
  };

  React.useEffect(() => {
    if (isPlayComplete) {
      handleNextSongClick();
    }
  }, [isPlayComplete]);

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [disabled, setdisabled] = React.useState(false);
  const [fingerprintidc, setfingerprintidc] = React.useState("");

  React.useEffect(() => {
    FingerprintJS.load().then((fp) => {
      fp.get().then((result) => {
        const visitorId = result.visitorId;
        setfingerprintidc(visitorId);
        yuxStorage.setItem("fingerprintidc", visitorId);
      });
    });
  }, []);

  return (
    <main
      style={{
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none",
      }}
    >
      {contextHolder}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={disabled}
      >
        <CircularProgress color="inherit" />
        <span style={{ marginLeft: "15px" }}>正在加载歌曲</span>
      </Backdrop>
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
          PlayingSongs,
          SetPlayingSongs,
          lastPlayedSongIndex,
          setLastPlayedSongIndex,
          handleInsectSongClick,
          disabled,
          setdisabled,
        }}
      >
        <div>
          <MusicCard
            currentSong={currentSong}
            setisPlayComplete={setisPlayComplete}
            canlistplay={canlistplay}
          />
          {process.env.NODE_ENV === "development" && (
            <Accordion
              expanded={expanded === "操作区开发专用"}
              onChange={handleChange("操作区开发专用")}
              TransitionProps={{ unmountOnExit: true }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>
                  <span>操作区—开发专用</span>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Card>
                  <CardContent>
                    {currentSong && (
                      <>
                        <Typography
                          sx={{ fontSize: 14 }}
                          color="text.secondary"
                          gutterBottom
                        >
                          <span>当前歌曲信息：</span>
                        </Typography>
                        <Typography
                          sx={{ fontSize: 14 }}
                          color="text.secondary"
                          gutterBottom
                        >
                          <p>歌曲名：{currentSong.title}</p>
                          <p>歌作者：{currentSong.artist}</p>
                          <p>歌ID：{currentSong.id}</p>
                          <p>歌封面：{currentSong.cover}</p>
                        </Typography>
                      </>
                    )}
                    {!currentSong && (
                      <>
                        <Typography
                          sx={{ fontSize: 14 }}
                          color="text.secondary"
                          gutterBottom
                        >
                          <p>暂无歌曲播放中</p>
                        </Typography>
                      </>
                    )}
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      <p>UA：{navigator.userAgent.toLowerCase()}</p>
                    </Typography>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      <p>FingerPrint：{fingerprintidc}</p>
                    </Typography>
                  </CardContent>
                </Card>
              </AccordionDetails>
            </Accordion>
          )}
          <Accordion
            expanded={expanded === "操作区"}
            onChange={handleChange("操作区")}
            TransitionProps={{ unmountOnExit: true }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>
                <span>操作区</span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <PersonalPlaylist />
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "搜索区"}
            onChange={handleChange("搜索区")}
            TransitionProps={{ unmountOnExit: true }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>
                <span>搜索区</span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <SongSearchTable setcanlistplay={setcanlistplay} />
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "播放列表"}
            onChange={handleChange("播放列表")}
            TransitionProps={{ unmountOnExit: true }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>
                <span>当前播放列表</span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <SongList />
            </AccordionDetails>
          </Accordion>
          <TopBar />
          <TopBarBS />
          <LikeSongBar />
          <SongBar />
        </div>
        <ScrollToTopFab />
      </CurrentSongContext.Provider>
      <JuanZeng />
      <About />
    </main>
  );
}
export default function ToggleColorMode() {
  const [mode, setMode] = React.useState("light");
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={{ colorMode }}>
      <ThemeProvider theme={theme}>
        <ConfigProvider locale={zhCN}>
          <StarSunMusic />
        </ConfigProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
