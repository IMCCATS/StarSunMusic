"use client";
import * as React from "react";
import $ from "jquery";
import { CurrentSongContext } from "../src/app/dashboard/page";
import ButtonGroup from "@mui/material/ButtonGroup";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Button,
  TableRow,
  Grid,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  Paper,
  CardContent,
  Card,
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
import supabase from "@/app/api/supabase";
import { message } from "antd";

export default function SongSearchTable({ setcanlistplay }) {
  const { setCurrentSong } = React.useContext(CurrentSongContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const [songs, setSongs] = React.useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [PT, setPT] = React.useState("default");
  const [jzwz, setwz] = React.useState("搜索功能加载中...");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [searchxh, setsearchxh] = React.useState(1);
  const [searchTermC, setSearchTermC] = React.useState("");
  const [SearchHistory, SetSearchHistory] = React.useState([]);
  const [searchdesabled, setsearchdesabled] = React.useState(true);
  const addJB = () => {
    var script = document.createElement("script");
    script.src = "https://static.geetest.com/v4/gt4.js";
    script.async = true;
    script.addEventListener("load", function () {
      setwz("搜索功能加载完成啦~\n请搜索歌曲哦~");
      setsearchdesabled(false);
    });
    document.head.appendChild(script);
  };
  React.useEffect(() => {
    addJB();
    AddSearchHistory();
  }, []);

  const AddHistory = (searchTerm) => {
    if (!searchTerm || SearchHistory.includes(searchTerm)) {
      return;
    }

    const newSearchHistory = [...SearchHistory, searchTerm];
    localStorage.setItem("SearchHistory", JSON.stringify(newSearchHistory));
    SetSearchHistory(newSearchHistory);
  };

  const AddSearchHistory = () => {
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
  const close1 = () => {
    setOpen(false);
    setPT("default");
    handleSearch();
    AddHistory(searchTerm);
    setSearchTermC(searchTerm);
  };
  const close2 = () => {
    setOpen(false);
    setPT("kg");
    handleSearchKG();
    AddHistory(searchTerm);
    setSearchTermC(searchTerm);
  };
  const close3 = () => {
    setOpen(false);
    setPT("mg");
    handleSearchMG();
    AddHistory(searchTerm);
    setSearchTermC(searchTerm);
  };
  const close4 = () => {
    setOpen(false);
    setPT("sjk");
    handleSearchSJK();
    AddHistory(searchTerm);
    setSearchTermC(searchTerm);
  };
  const searchOpen = () => {
    if (searchTerm) {
      if (searchTerm != "") {
        initGeetest4(
          {
            captchaId: "cbf4e068bc17eb10afa9e3b8a84d51d0",
            product: "bind",
          },
          function (captcha) {
            // captcha为验证码实例
            captcha.appendTo("#captcha");
            captcha
              .onReady(function () {
                captcha.showCaptcha();
              })
              .onSuccess(function () {
                handleClickOpen();
              });
          }
        );
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
    setTimeout(() => {
      $.ajax({
        url: "https://api.paugram.com/netease/",
        type: "get",
        dataType: "json",
        async: false,
        data: {
          id: `${songId}`,
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
          // 状态码 200 表示请求成功
          if (res) {
            //console.log(res);
            setCurrentSong(res);
            setdisabled(false);
            setcanlistplay(false);
          } else {
            console.log(res);
            setdisabled(false);
          }
        },
      });
    }, 1500);
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
    console.log("搜索关键字:", searchTerm);
    setTimeout(() => {
      $.ajax({
        url: "https://api.gumengya.com/Api/Music",
        type: "get",
        dataType: "json",
        async: false,
        data: {
          format: "json",
          text: `${searchTerm}`,
          site: "kugou",
        },
        beforeSend: function () {
          //请求中执行的代码
        },
        complete: function () {
          //请求完成执行的代码
        },
        error: function () {
          setSongs([]);
          setIsLoading(false);
        },
        success: function (res) {
          // 状态码 200 表示请求成功
          if (res) {
            //console.log(res);
            const CCJson = ConvertJson(res.data);
            setSongs(CCJson);
            setIsLoading(false);
          } else {
            console.log(res);
            setSongs([]);
            setIsLoading(false);
          }
        },
      });
    }, 1500);
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

  const handleSearchMG = () => {
    if (!searchTerm) {
      messageApi.error("您没有输入搜索内容哦~");
      return;
    }
    setSongs([]);
    setIsLoading(true);
    setwz("正在搜索中哦~\n搜索可能较慢，请耐心等待哦~");
    console.log("搜索关键字:", searchTerm);
    setTimeout(() => {
      $.ajax({
        url: "https://api.gumengya.com/Api/Music",
        type: "get",
        dataType: "json",
        async: false,
        data: {
          format: "json",
          text: `${searchTerm}`,
          site: "migu",
        },
        beforeSend: function () {
          //请求中执行的代码
        },
        complete: function () {
          //请求完成执行的代码
        },
        error: function () {
          setSongs([]);
          setIsLoading(false);
        },
        success: function (res) {
          // 状态码 200 表示请求成功
          if (res) {
            //console.log(res);
            const CCJson = ConvertJson(res.data);
            setSongs(CCJson);
            setIsLoading(false);
          } else {
            console.log(res);
            setSongs([]);
            setIsLoading(false);
          }
        },
      });
    }, 1500);
  };

  const handleSearchSJK = () => {
    if (!searchTerm) {
      messageApi.error("您没有输入搜索内容哦~");
      return;
    }
    setSongs([]);
    setIsLoading(true);
    setwz("正在搜索中哦~\n搜索可能较慢，请耐心等待哦~");
    console.log("搜索关键字:", searchTerm);
    setTimeout(async () => {
      const { data, error } = await supabase
        .from("MusicSearch")
        .select("*")
        .textSearch("title", `${searchTerm}`, {
          type: "websearch",
        });
      if (data) {
        //console.log(res);
        const CCJson = ConvertJsonSJK(data);
        setSongs(CCJson);
        setIsLoading(false);
      } else {
        console.log(res);
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

  const handleSearch = () => {
    if (!searchTerm) {
      messageApi.error("您没有输入搜索内容哦~");
      return;
    }
    setSongs([]);
    setIsLoading(true);
    setwz("正在搜索中哦~\n搜索可能较慢，请耐心等待哦~");
    console.log("搜索关键字:", searchTerm);
    setTimeout(() => {
      $.ajax({
        url: "https://api.gumengya.com/Api/Music",
        type: "get",
        dataType: "json",
        async: false,
        data: {
          text: `${searchTerm}`,
          site: "netease",
        },
        beforeSend: function () {
          //请求中执行的代码
        },
        complete: function () {
          //请求完成执行的代码
        },
        error: function () {
          setSongs([]);
          setIsLoading(false);
        },
        success: function (res) {
          // 状态码 200 表示请求成功
          if (res) {
            //console.log(res);
            const datac = ConvertJson(res.data);
            setSongs(datac);
            setIsLoading(false);
          } else {
            console.log(res);
            setSongs([]);
            setIsLoading(false);
          }
        },
      });
    }, 1500);
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
      console.log("继续搜索关键字:", searchTermC);
      setTimeout(() => {
        $.ajax({
          url: "https://api.gumengya.com/Api/Music",
          type: "get",
          dataType: "json",
          async: false,
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
            // 状态码 200 表示请求成功
            if (res) {
              //console.log(res);
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
              console.log(res);
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
      console.log("继续搜索关键字:", searchTermC);
      setTimeout(() => {
        $.ajax({
          url: "https://api.gumengya.com/Api/Music",
          type: "get",
          dataType: "json",
          async: false,
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
            // 状态码 200 表示请求成功
            if (res) {
              //console.log(res);
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
              console.log(res);
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
      console.log("继续搜索关键字:", searchTermC);
      setTimeout(() => {
        $.ajax({
          url: "https://api.gumengya.com/Api/Music",
          type: "get",
          dataType: "json",
          async: false,
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
            // 状态码 200 表示请求成功
            if (res) {
              //console.log(res);
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
              console.log(res);
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
          <span>请选择搜索方式</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <span>
              不同的搜索方式可能会有不同的搜索结果，请选择您要使用的搜索方式。
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={close1}>
            <span>方式1</span>
          </Button>
          <Button onClick={close2}>
            <span>方式2</span>
          </Button>
          <Button onClick={close3}>
            <span>方式3</span>
          </Button>
          <Button onClick={close4}>
            <span>方式4</span>
          </Button>
        </DialogActions>
      </Dialog>
      <Card sx={{ minWidth: 275 }} style={{ marginTop: "15px" }}>
        <CardContent>
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
                    <Button
                      onClick={searchOpen}
                      variant="contained"
                      sx={{
                        height: "56px",
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
                      sx={{ height: "56px", marginTop: "15px" }}
                      disabled={searchdesabled}
                    >
                      <span>清除搜索历史记录</span>
                    </Button>
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
                <Button
                  onClick={searchOpen}
                  variant="contained"
                  sx={{
                    height: "56px",
                    marginTop: "15px",
                    marginRight: "10px",
                  }}
                  disabled={searchdesabled}
                >
                  <span>搜索</span>
                </Button>
              </div>
            )}
            <div id="captcha"></div>
          </Box>
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
                  <p style={{ marginLeft: "10px", whiteSpace: "pre" }}>
                    {jzwz}
                  </p>
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
                              <span>{song.title}</span>
                            </TableCell>
                            <TableCell>
                              <span>{song.author}</span>
                            </TableCell>
                            <TableCell>
                              <ButtonGroup>
                                {PT === "default" ? (
                                  <main>
                                    <Grid
                                      container
                                      direction="column"
                                      spacing={2}
                                    >
                                      <Grid item>
                                        <Button
                                          onClick={() =>
                                            handleListenClick(song.songid)
                                          }
                                          variant="contained"
                                          disabled={
                                            PT !== "default" || disabled
                                          }
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
                                          disabled={
                                            PT !== "default" || disabled
                                          }
                                        >
                                          <span>加歌单</span>
                                        </Button>
                                      </Grid>
                                    </Grid>
                                  </main>
                                ) : (
                                  <Button
                                    onClick={() =>
                                      handleListenClickLinethree(song)
                                    }
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
        </CardContent>
      </Card>
    </main>
  );
}
