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
import BookmarksIcon from "@mui/icons-material/Bookmarks";
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
import { ConfigProvider, Flex, message } from "antd";
import { HandleListenSong } from "../../../components/common/fetchapi";
import {
  Backdrop,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
} from "@mui/material";
import SongList from "../../../components/Songlist";
import zhCN from "antd/locale/zh_CN";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import yuxStorage from "@/app/api/yux-storage";
import ListIcon from "@mui/icons-material/List";
import SearchIcon from "@mui/icons-material/Search";
import { DeveloperBoard } from "@mui/icons-material";

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
  const [profile, setprofile] = React.useState(false);

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

  const [CurrentComponent, SetCurrentComponent] = React.useState(null);
  const [CurrentCptName, SetCurrentCptName] = React.useState("");
  const [Clickopen, SetClickopen] = React.useState(false);
  const handleopen = (name, component) => {
    SetClickopen(false);
    SetCurrentComponent(component);
    SetCurrentCptName(name);
    SetClickopen(true);
  };

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
        <span style={{ marginLeft: "15px" }}>正在加载</span>
      </Backdrop>
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
          profile,
          setprofile,
        }}
      >
        <AppBar />
        <Advertisement />
        <UpdateDialog />
        <div>
          <MusicCard
            currentSong={currentSong}
            setisPlayComplete={setisPlayComplete}
            canlistplay={canlistplay}
          />
          <Dialog
            fullWidth
            open={Clickopen}
            onClose={() => {
              SetClickopen(false);
            }}
            scroll={"paper"}
          >
            <DialogTitle>{CurrentCptName}</DialogTitle>
            <DialogContent dividers={true}>{CurrentComponent}</DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  SetClickopen(false);
                }}
              >
                关闭
              </Button>
            </DialogActions>
          </Dialog>
          <Card>
            <CardContent>
              <Flex
                gap={"middle"}
                justify={"center"}
                align={"center"}
                wrap="wrap"
              >
                {process.env.NODE_ENV === "development" && (
                  <Button
                    variant="contained"
                    sx={{
                      height: "56px",
                      marginTop: "10px",
                      marginRight: "10px",
                    }}
                    onClick={() => {
                      handleopen(
                        "开发菜单",
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
                      );
                    }}
                  >
                    <DeveloperBoard />
                    开发菜单
                  </Button>
                )}
                <Button
                  variant="contained"
                  sx={{
                    height: "56px",
                    marginTop: "10px",
                    marginRight: "10px",
                  }}
                  onClick={() => {
                    handleopen("个人歌单", <PersonalPlaylist />);
                  }}
                >
                  <BookmarksIcon />
                  <span>个人歌单</span>
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    height: "56px",
                    marginTop: "10px",
                    marginRight: "10px",
                  }}
                  onClick={() => {
                    handleopen(
                      "搜索歌曲",
                      <SongSearchTable setcanlistplay={setcanlistplay} />
                    );
                  }}
                >
                  <SearchIcon />
                  搜索歌曲
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    height: "56px",
                    marginTop: "10px",
                    marginRight: "10px",
                  }}
                  onClick={() => {
                    handleopen("播放列表", <SongList />);
                  }}
                >
                  <ListIcon />
                  播放列表
                </Button>
              </Flex>
            </CardContent>
          </Card>
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
  const [modec, setModec] = React.useState(0);

  // 在这里添加一个新的 useEffect 来监听 mode 的变化并存储到 yuxStorage
  React.useEffect(() => {
    if (modec === 1) {
      yuxStorage.setItem("LastColorMode", mode);
    }
  }, [mode]);

  // 保留原始 useEffect 以在页面加载时获取 LastColorMode
  React.useEffect(() => {
    yuxStorage.getItem("LastColorMode").then((e) => {
      if (e === "dark") {
        setMode("dark");
      }
    });
  }, []);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setModec(1);
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
        setTimeout(() => {
          setModec(0);
        }, 100);
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
