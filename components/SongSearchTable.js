"use client";
import * as React from "react";
import $, { error } from "jquery";
import { CurrentSongContext } from "../src/app/dashboard/page";
import ButtonGroup from "@mui/material/ButtonGroup";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Button,
  TableRow,
  Tooltip,
  Grid,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  Paper,
  TextField,
  Box,
  CircularProgress,
  DialogContentText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Backdrop,
  Autocomplete,
} from "@mui/material";
import { Turnstile } from "@marsidev/react-turnstile";
import supabase from "@/app/api/supabase";
import { message } from "antd";
import copy from "copy-to-clipboard";
import { HandleListenSong, SearchSong } from "./common/fetchapi";

export default function SongSearchTable({ setcanlistplay }) {
  const { setCurrentSong } = React.useContext(CurrentSongContext);
  const ref = React.useRef();
  const [isLoading, setIsLoading] = React.useState(true);
  const [songs, setSongs] = React.useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [PT, setPT] = React.useState("default");
  const [jzwz, setwz] = React.useState("搜索功能加载中...");
  const [isrobot, setisrobot] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [fxopen, fxsetOpen] = React.useState(false);
  const [shareurl, setshareurl] = React.useState("暂无~");
  const [searchxh, setsearchxh] = React.useState(1);
  const [searchTermC, setSearchTermC] = React.useState("");
  const [SearchHistory, SetSearchHistory] = React.useState([]);
  const [searchdesabled, setsearchdesabled] = React.useState(true);
  React.useEffect(() => {
    AddSearchHistory();
  }, []);
  React.useEffect(() => {
    if (!isrobot) {
      setsearchdesabled(false);
    } else {
      setsearchdesabled(true);
    }
  }, [isrobot]);

  const AddHistory = (searchTerm) => {
    if (!searchTerm || SearchHistory.includes(searchTerm)) {
      return;
    }

    const newSearchHistory = [...SearchHistory, searchTerm];
    localStorage.setItem("SearchHistory", JSON.stringify(newSearchHistory));
    SetSearchHistory(newSearchHistory);
  };

  const AddSearchHistory = () => {
    setwz("搜索功能加载完成啦~\n请搜索歌曲哦~");
    const savedSearchHistory = JSON.parse(
      localStorage.getItem("SearchHistory")
    );
    if (savedSearchHistory) {
      SetSearchHistory(savedSearchHistory);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const fxhandleClose = () => {
    fxsetOpen(false);
  };
  const fxhandleClickOpen = () => {
    fxsetOpen(true);
  };

  const close1 = () => {
    setOpen(false);
    setPT("default");
    handleSearch();
    AddHistory(searchTerm);
    setSearchTermC(searchTerm);
    ref.current.reset();
    setisrobot(true);
  };
  const close2 = () => {
    setOpen(false);
    setPT("kg");
    handleSearchKG();
    AddHistory(searchTerm);
    setSearchTermC(searchTerm);
    ref.current.reset();
    setisrobot(true);
  };
  const close3 = () => {
    setOpen(false);
    setPT("mg");
    handleSearchMG();
    AddHistory(searchTerm);
    setSearchTermC(searchTerm);
    ref.current.reset();
    setisrobot(true);
  };
  const close4 = () => {
    setOpen(false);
    setPT("sjk");
    handleSearchSJK();
    AddHistory(searchTerm);
    setSearchTermC(searchTerm);
    ref.current.reset();
    setisrobot(true);
  };

  const searchOpen = () => {
    if (searchTerm) {
      if (searchTerm != "") {
        handleClickOpen();
      }
    } else {
      messageApi.error("您没有输入搜索内容哦~");
    }
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const ChangeSearch = (event, value) => {
    setSearchTerm(value);
  };
  const [disabled, setdisabled] = React.useState(false);

  const handleListenClick = (songId) => {
    setdisabled(true);
    HandleListenSong(songId)
      .then((e) => {
        setCurrentSong(e);
        setdisabled(false);
        setcanlistplay(false);
      })
      .catch((error) => {
        setdisabled(false);
      });
  };

  const addSongToLocalPlaylist = (song) => {
    const playList = JSON.parse(localStorage.getItem("playList")) || [];
    const existingSongIndex = playList.findIndex(
      (s) => s.songId === song.songId
    );
    if (existingSongIndex === -1) {
      playList.push(song);
      localStorage.setItem("playList", JSON.stringify(playList));
      messageApi.success("添加成功啦~");
    } else {
      message.info("歌单已存在本歌曲了哦~");
    }
  };

  const handleListenClickLinethree = (song) => {
    setcanlistplay(false);
    setCurrentSong(song);
  };

  const handleSearchKG = () => {
    if (!searchTerm) {
      messageApi.error("您没有输入搜索内容哦~");
      return;
    }
    setSongs([]);
    setIsLoading(true);
    setwz("正在搜索中哦~\n搜索可能较慢，请耐心等待哦~");
    SearchSong("kugou", searchTerm)
      .then((e) => {
        if (Array.isArray(e)) {
          setSongs(e);
        } else {
          setSongs([]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setSongs([]);
        setIsLoading(false);
      });
  };

  const handleSearchMG = () => {
    if (!searchTerm) {
      messageApi.error("您没有输入搜索内容哦~");
      return;
    }
    setSongs([]);
    setIsLoading(true);
    setwz("正在搜索中哦~\n搜索可能较慢，请耐心等待哦~");
    SearchSong("migu", searchTerm)
      .then((e) => {
        if (Array.isArray(e)) {
          setSongs(e);
        } else {
          setSongs([]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setSongs([]);
        setIsLoading(false);
      });
  };

  const handleSearchSJK = () => {
    if (!searchTerm) {
      messageApi.error("您没有输入搜索内容哦~");
      return;
    }
    setSongs([]);
    setIsLoading(true);
    setwz("正在搜索中哦~\n搜索可能较慢，请耐心等待哦~");
    setTimeout(async () => {
      const { data, error } = await supabase
        .from("MusicSearch")
        .select("*")
        .textSearch("title", `${searchTerm}`, {
          type: "websearch",
        });
      if (data) {
        const CCJson = ConvertJsonSJK(data);
        setSongs(CCJson);
        setIsLoading(false);
      } else {
        setSongs([]);
        setIsLoading(false);
      }
    }, 1500);
  };
  const ConvertJsonSJK = function (serverJson) {
    const data = serverJson;
    const convertedJsons = [];

    for (let i = 0; i < data.length; i++) {
      const convertedJson = {
        songid: data[i].id,
        title: data[i].title,
        artist: data[i].artist,
        author: data[i].artist,
        cover: data[i].cover,
        lyric: data[i].lyric,
        link: atob(data[i].link),
      };
      convertedJsons.push(convertedJson);
    }

    return convertedJsons;
  };
  const ConvertJson = function (serverJson) {
    const data = serverJson;
    const convertedJsons = [];

    for (let i = 0; i < data.length; i++) {
      const convertedJson = {
        songid: data[i].songid,
        title: data[i].title,
        artist: data[i].author,
        author: data[i].author,
        cover: data[i].pic,
        lyric: data[i].lrc,
        link: data[i].url,
      };
      convertedJsons.push(convertedJson);
    }

    return convertedJsons;
  };

  const handleSearch = () => {
    if (!searchTerm) {
      messageApi.error("您没有输入搜索内容哦~");
      return;
    }
    setSongs([]);
    setIsLoading(true);
    setwz("正在搜索中哦~\n搜索可能较慢，请耐心等待哦~");
    SearchSong("netease", searchTerm)
      .then((e) => {
        if (Array.isArray(e)) {
          setSongs(e);
        } else {
          setSongs([]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setSongs([]);
        setIsLoading(false);
      });
  };

  const ClearHistory = () => {
    localStorage.removeItem("SearchHistory");
    SetSearchHistory([]);
  };

  const loadmoresong = () => {
    setdisabled(true);
    if (PT === "default") {
      if (!searchTermC) {
        messageApi.error("您没有输入搜索内容哦~");
        return;
      }
      setTimeout(() => {
        $.ajax({
          url: "https://api.gumengya.com/Api/Music",
          type: "get",
          dataType: "json",

          data: {
            text: `${searchTermC}`,
            page: `${searchxh + 1}`,
            site: "netease",
          },
          beforeSend: function () {
            //请求中执行的代码
          },
          complete: function () {
            //请求完成执行的代码
          },
          error: function () {
            setdisabled(false);
          },
          success: function (res) {
            $.Deferred().resolve(res);
            // 状态码 200 表示请求成功
            if (res) {
              if (res.data) {
                const newsongArray = res.data;
                if (Array.isArray(newsongArray) && newsongArray.length > 0) {
                  const newsongArrays = ConvertJson(newsongArray);
                  setSongs((prevSongs) => prevSongs.concat(newsongArrays));
                  const newxh = searchxh + 1;
                  setsearchxh(newxh);
                }
              }
              setdisabled(false);
            } else {
              setdisabled(false);
            }
          },
        });
      }, 1500);
    }
    if (PT === "kg") {
      if (!searchTermC) {
        messageApi.error("您没有输入搜索内容哦~");
        return;
      }
      setTimeout(() => {
        $.ajax({
          url: "https://api.gumengya.com/Api/Music",
          type: "get",
          dataType: "json",

          data: {
            text: `${searchTermC}`,
            page: `${searchxh + 1}`,
            site: "kugou",
          },
          beforeSend: function () {
            //请求中执行的代码
          },
          complete: function () {
            //请求完成执行的代码
          },
          error: function () {
            setdisabled(false);
          },
          success: function (res) {
            $.Deferred().resolve(res);
            // 状态码 200 表示请求成功
            if (res) {
              if (res.data) {
                const newsongArray = res.data;
                if (Array.isArray(newsongArray) && newsongArray.length > 0) {
                  const newsongArrays = ConvertJson(newsongArray);
                  setSongs((prevSongs) => prevSongs.concat(newsongArrays));
                  const newxh = searchxh + 1;
                  setsearchxh(newxh);
                }
              }
              setdisabled(false);
            } else {
              setdisabled(false);
            }
          },
        });
      }, 1500);
    }
    if (PT === "mg") {
      if (!searchTermC) {
        messageApi.error("您没有输入搜索内容哦~");
        return;
      }
      setTimeout(() => {
        $.ajax({
          url: "https://api.gumengya.com/Api/Music",
          type: "get",
          dataType: "json",

          data: {
            text: `${searchTermC}`,
            page: `${searchxh + 1}`,
            site: "migu",
          },
          beforeSend: function () {
            //请求中执行的代码
          },
          complete: function () {
            //请求完成执行的代码
          },
          error: function () {
            setdisabled(false);
          },
          success: function (res) {
            $.Deferred().resolve(res);
            // 状态码 200 表示请求成功
            if (res) {
              if (res.data) {
                const newsongArray = res.data;
                if (Array.isArray(newsongArray) && newsongArray.length > 0) {
                  const newsongArrays = ConvertJson(newsongArray);
                  setSongs((prevSongs) => prevSongs.concat(newsongArrays));
                  const newxh = searchxh + 1;
                  setsearchxh(newxh);
                }
              }
              setdisabled(false);
            } else {
              setdisabled(false);
            }
          },
        });
      }, 1500);
    }
  };

  return (
    <main>
      {contextHolder}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={disabled}
      >
        <CircularProgress color="inherit" />
        <span style={{ marginLeft: "15px" }}>正在加载歌曲</span>
      </Backdrop>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <span>请选择搜索通道</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <span>
              不同的搜索通道可能会有不同的搜索结果，请选择您要使用的搜索通道。
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={close1}>
            <span>通道1</span>
          </Button>
          <Button onClick={close2}>
            <span>通道2</span>
          </Button>
          <Button onClick={close3}>
            <span>通道3</span>
          </Button>
          <Button onClick={close4}>
            <span>通道4</span>
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={fxopen}
        onClose={fxhandleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <span>已生成分享链接！</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <span>您的分享链接是：{shareurl}</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              copy(
                "想象一下，你正站在一个山顶上，俯瞰着壮丽的风景。有一首歌曲就像山下的河流，蜿蜒曲折，流淌着激昂的旋律。每一个音符都像是你人生旅程中的一道风景线，让你流连忘返。现在，闭上眼睛，深呼吸，感受那首歌曲带来的能量。那是一种力量，它能够连接你和音乐之间的心灵感应。对，就是这种感觉！为了让你体验到这首歌曲的魔力，我使用星阳音乐系统特意为你准备了歌曲链接。让这首歌曲带你穿越时空，感受音乐带给你的无限可能！歌曲链接：" +
                  shareurl
              );
              fxhandleClose();
              messageApi.success("复制成功，快去分享吧~");
            }}
          >
            <span>复制</span>
          </Button>
          <Button onClick={fxhandleClose}>
            <span>好哒~</span>
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          "& > :not(style)": { m: 1 },
        }}
        noValidate
        autoComplete="off"
      >
        {Array.isArray(SearchHistory) && SearchHistory.length > 0 ? (
          <Autocomplete
            freeSolo
            disableClearable
            onChange={ChangeSearch}
            options={SearchHistory.map((option) => option)}
            renderInput={(params) => (
              <div>
                <TextField
                  {...params}
                  label="搜索..."
                  id="search"
                  variant="outlined"
                  onChange={handleChange}
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                  }}
                />
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                    marginTop: "10px",
                  }}
                >
                  <Button
                    onClick={searchOpen}
                    variant="contained"
                    sx={{
                      height: "63px",
                      marginTop: "15px",
                      marginRight: "10px",
                    }}
                    disabled={searchdesabled}
                  >
                    <span>搜索</span>
                  </Button>
                  <Button
                    onClick={ClearHistory}
                    variant="contained"
                    sx={{
                      height: "63px",
                      marginTop: "15px",
                      marginRight: "10px",
                    }}
                    disabled={searchdesabled}
                  >
                    <span>清除搜索历史记录</span>
                  </Button>

                  <Turnstile
                    siteKey="0x4AAAAAAALqaAbvdoAvmWG-"
                    ref={ref}
                    style={{
                      marginTop: "15px",
                      marginRight: "10px",
                    }}
                    onSuccess={(token) => {
                      setisrobot(false);
                    }}
                  />
                </Box>
              </div>
            )}
          />
        ) : (
          <div>
            <TextField
              label="搜索..."
              fullWidth
              id="search"
              variant="outlined"
              onChange={handleChange}
            />

            <Box
              style={{
                display: "flex",
                alignItems: "center",
                height: "100%",
                marginTop: "10px",
              }}
            >
              <Button
                onClick={searchOpen}
                variant="contained"
                sx={{
                  height: "63px",
                  marginTop: "15px",
                  marginRight: "10px",
                }}
                disabled={searchdesabled}
              >
                <span>搜索</span>
              </Button>
              <Turnstile
                siteKey="0x4AAAAAAALqaAbvdoAvmWG-"
                ref={ref}
                style={{
                  marginTop: "15px",
                  marginRight: "10px",
                }}
                onSuccess={(token) => {
                  setisrobot(false);
                }}
              />
            </Box>
          </div>
        )}
        <div id="captcha"></div>
      </Box>
      {isrobot ? (
        <span style={{ marginBottom: "10px", marginTop: "10px" }}>
          Tip:人机验证通过后搜索按钮会自动解锁。如果人机验证器没有出现，请刷新页面。
        </span>
      ) : (
        <span></span>
      )}
      <Paper>
        <TableContainer>
          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              {jzwz !== "搜索功能加载完成啦~\n请搜索歌曲哦~" ? (
                <CircularProgress />
              ) : (
                <CheckCircleIcon color="success" fontSize="large" />
              )}
              <p style={{ marginLeft: "10px", whiteSpace: "pre" }}>{jzwz}</p>
            </div>
          ) : (
            <>
              {songs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <CircularProgress />
                    <p style={{ marginLeft: "10px", whiteSpace: "pre" }}>
                      搜索无内容返回，请重新搜索~
                    </p>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <span>封面</span>
                      </TableCell>
                      <TableCell>
                        <span>标题</span>
                      </TableCell>
                      <TableCell>
                        <span>作者</span>
                      </TableCell>
                      <TableCell>
                        <span>操作</span>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {songs.map((song) => (
                      <TableRow key={song.songid}>
                        <TableCell>
                          {song.cover && (
                            <img
                              src={song.cover}
                              alt="CoverImage"
                              height="64"
                              onError={() => {}}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <span>{song.title}</span>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={song.author}>
                            <span>
                              {song.author.length <= 8
                                ? song.author
                                : `${song.author.slice(0, 8)}...`}
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <ButtonGroup>
                            {PT === "default" ? (
                              <main>
                                <Grid container direction="column" spacing={2}>
                                  <Grid item>
                                    <Button
                                      onClick={() =>
                                        handleListenClick(song.songid)
                                      }
                                      variant="contained"
                                      disabled={PT !== "default" || disabled}
                                    >
                                      <span>听歌曲</span>
                                    </Button>
                                  </Grid>
                                  <Grid item>
                                    <Button
                                      onClick={() =>
                                        addSongToLocalPlaylist({
                                          title: song.title,
                                          artist: song.author,
                                          songId: song.songid,
                                        })
                                      }
                                      variant="contained"
                                      disabled={PT !== "default" || disabled}
                                    >
                                      <span>加歌单</span>
                                    </Button>
                                  </Grid>
                                  <Grid item>
                                    <Button
                                      onClick={() => {
                                        setshareurl(
                                          "https://music.lcahy.cn/song/detail?songID=" +
                                            song.songid
                                        );
                                        fxhandleClickOpen();
                                      }}
                                      variant="contained"
                                      disabled={PT !== "default" || disabled}
                                    >
                                      <span>分享它</span>
                                    </Button>
                                  </Grid>
                                </Grid>
                              </main>
                            ) : (
                              <Button
                                onClick={() => handleListenClickLinethree(song)}
                                variant="contained"
                                disabled={PT === "default" || disabled}
                              >
                                <span>听歌曲</span>
                              </Button>
                            )}
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    ))}
                    <Button
                      disabled={disabled || PT === "sjk"}
                      onClick={loadmoresong}
                    >
                      <span>加载更多歌曲</span>
                    </Button>
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </TableContainer>
      </Paper>
    </main>
  );
}
