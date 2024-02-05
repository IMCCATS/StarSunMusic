"use client";
import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
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
  Autocomplete,
} from "@mui/material";
import supabase from "@/app/api/supabase";
import { message } from "antd";
import copy from "copy-to-clipboard";
import {
  HandleListenSong,
  LoadMoreSearchSong,
  SearchSong,
} from "./common/fetchapi";
import Script from "next/script";
import yuxStorage from "@/app/api/yux-storage";
import { scroller, Element } from "react-scroll";

export default function SongSearchTable({ setcanlistplay }) {
  const {
    setCurrentSong,
    SetPlayingSongs,
    disabled,
    setdisabled,
    handleInsectSongClick,
  } = React.useContext(CurrentSongContext);
  const [isneteaseLoading, setIsneteaseLoading] = React.useState(true);
  const [iskgLoading, setIskgLoading] = React.useState(true);
  const [ismgLoading, setIsmgLoading] = React.useState(true);
  const [issjkLoading, setIssjkLoading] = React.useState(true);
  const [netease_songs, setNeteaseSongs] = React.useState([]);
  const [kugou_songs, setKGSongs] = React.useState([]);
  const [migu_songs, setMGSongs] = React.useState([]);
  const [sjk_songs, setSJKSongs] = React.useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [jzwz1, setneteasewz] = React.useState("搜索功能加载中...");
  const [jzwz2, setkgwz] = React.useState("搜索功能加载中...");
  const [jzwz3, setmgwz] = React.useState("搜索功能加载中...");
  const [jzwz4, setsjkwz] = React.useState("搜索功能加载中...");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [fxopen, fxsetOpen] = React.useState(false);
  const [shareurl, setshareurl] = React.useState("暂无~");
  const [neteasesearchxh, setneteasesearchxh] = React.useState(1);
  const [kgsearchxh, setKGsearchxh] = React.useState(1);
  const [mgsearchxh, setMGsearchxh] = React.useState(1);
  const [searchTermC, setSearchTermC] = React.useState("");
  const [SearchHistory, SetSearchHistory] = React.useState([]);
  const [value, setValue] = React.useState(0);

  const handleChangeValue = (event, newValue) => {
    setValue(newValue);
  };

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  React.useEffect(() => {
    AddSearchHistory();
  }, []);

  const setallwz = (wz) => {
    setneteasewz(wz);
    setkgwz(wz);
    setmgwz(wz);
    setsjkwz(wz);
  };

  const AddHistory = (searchTerm) => {
    if (!searchTerm || SearchHistory.includes(searchTerm)) {
      return;
    }

    const newSearchHistory = [...SearchHistory, searchTerm];
    yuxStorage
      .setItem("SearchHistory", JSON.stringify(newSearchHistory))
      .then((e) => {
        SetSearchHistory(newSearchHistory);
      });
  };

  const AddSearchHistory = () => {
    setallwz("搜索功能加载完成啦~\n请搜索歌曲哦~");
    yuxStorage.getItem("SearchHistory").then((e) => {
      if (e) {
        const savedSearchHistory = JSON.parse(e);
        if (savedSearchHistory) {
          SetSearchHistory(savedSearchHistory);
        }
      }
    });
  };

  const fxhandleClose = () => {
    fxsetOpen(false);
  };
  const fxhandleClickOpen = () => {
    fxsetOpen(true);
  };

  const SearchFunction = async () => {
    AddHistory(searchTerm);
    setSearchTermC(searchTerm);
    setIsneteaseLoading(true);
    setIskgLoading(true);
    setIsmgLoading(true);
    setIssjkLoading(true);
    AddSearchHistory();
    setValue(0);
    await handleSearch();
    scroller.scrollTo("SearchCard", {
      duration: 1500,
      delay: 0,
      smooth: "easeOutQuad",
      offset: -200,
    });
    await handleSearchKG();
    await handleSearchMG();
    await handleSearchSJK();
  };
  const [lastsearch, setlastsearch] = React.useState("");
  const searchOpen = () => {
    if (searchTerm) {
      if (searchTerm !== "" && searchTerm !== lastsearch) {
        setlastsearch(searchTerm);
        SearchFunction();
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

  const handleListenClick = (id) => {
    setdisabled(true);
    HandleListenSong(id)
      .then((e) => {
        setCurrentSong(e);
        SetPlayingSongs(netease_songs);
        setcanlistplay(true);
        setdisabled(false);
      })
      .catch((error) => {
        setdisabled(false);
      });
  };

  const handleListenClickLinethree = (song) => {
    setcanlistplay(false);
    setCurrentSong(song);
  };

  const handleSearchKG = async () => {
    if (!searchTerm) {
      messageApi.error("您没有输入搜索内容哦~");
      return;
    }
    setKGSongs([]);
    setkgwz("正在搜索中哦~\n搜索可能较慢，请耐心等待哦~");
    await SearchSong("kugou", searchTerm)
      .then((e) => {
        if (Array.isArray(e)) {
          setKGSongs(e);
        } else {
          setKGSongs([]);
        }
        setIskgLoading(false);
      })
      .catch((error) => {
        setKGSongs([]);
        setIskgLoading(false);
      });
  };

  const handleSearchMG = async () => {
    if (!searchTerm) {
      messageApi.error("您没有输入搜索内容哦~");
      return;
    }
    setMGSongs([]);
    setmgwz("正在搜索中哦~\n搜索可能较慢，请耐心等待哦~");
    await SearchSong("migu", searchTerm)
      .then((e) => {
        if (Array.isArray(e)) {
          setMGSongs(e);
        } else {
          setMGSongs([]);
        }
        setIsmgLoading(false);
      })
      .catch((error) => {
        setMGSongs([]);
        setIsmgLoading(false);
      });
  };

  const handleSearchSJK = async () => {
    if (!searchTerm) {
      messageApi.error("您没有输入搜索内容哦~");
      return;
    }
    setSJKSongs([]);
    setsjkwz("正在搜索中哦~\n搜索可能较慢，请耐心等待哦~");
    const { data, error } = await supabase
      .from("MusicSearch")
      .select("*")
      .textSearch("title", `${searchTerm}`, {
        type: "websearch",
      });
    if (data) {
      const CCJson = ConvertJsonSJK(data);
      setSJKSongs(CCJson);
      setIssjkLoading(false);
    } else {
      setSJKSongs([]);
      setIssjkLoading(false);
    }
  };
  const ConvertJsonSJK = function (serverJson) {
    const data = serverJson;
    const convertedJsons = [];

    for (let i = 0; i < data.length; i++) {
      const convertedJson = {
        id: data[i].id,
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

  const handleSearch = async () => {
    if (!searchTerm) {
      messageApi.error("您没有输入搜索内容哦~");
      return;
    }
    setNeteaseSongs([]);
    setneteasewz("正在搜索中哦~\n搜索可能较慢，请耐心等待哦~");
    await SearchSong("netease", searchTerm)
      .then((e) => {
        if (Array.isArray(e)) {
          setNeteaseSongs(e);
        } else {
          setNeteaseSongs([]);
        }
        setIsneteaseLoading(false);
      })
      .catch((error) => {
        setNeteaseSongs([]);
        setIsneteaseLoading(false);
      });
  };

  const ClearHistory = () => {
    yuxStorage.removeItem("SearchHistory").then((e) => {
      SetSearchHistory([]);
    });
  };

  const loadmoresong = (PlatF) => {
    setdisabled(true);
    if (!searchTermC) {
      messageApi.error("您没有输入搜索内容哦~");
      return;
    }
    let page;
    if (PlatF === "netease") {
      page = neteasesearchxh;
    } else if (PlatF === "kugou") {
      page = kgsearchxh;
    } else if (PlatF === "migu") {
      page = mgsearchxh;
    }
    const pagenow = page + 1;
    LoadMoreSearchSong(searchTermC, PlatF, pagenow)
      .then((res) => {
        const newsongArray = res;
        if (Array.isArray(newsongArray) && newsongArray.length > 0) {
          if (PlatF === "netease") {
            setNeteaseSongs((prevSongs) => prevSongs.concat(newsongArray));
            setneteasesearchxh(pagenow);
          } else if (PlatF === "kugou") {
            setKGSongs((prevSongs) => prevSongs.concat(newsongArray));
            setKGsearchxh(pagenow);
          } else if (PlatF === "migu") {
            setMGSongs((prevSongs) => prevSongs.concat(newsongArray));
            setMGsearchxh(pagenow);
          }
        } else {
          messageApi.info("暂无更多歌曲了哦！");
        }
        setdisabled(false);
      })
      .catch((error) => {
        setdisabled(false);
      });
  };

  return (
    <>
      {contextHolder}
      <Script src="https://static.geetest.com/v4/gt4.js" />
      <Dialog
        fullWidth
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
      <Element name="SearchCard">
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
                    >
                      <span>清除搜索历史记录</span>
                    </Button>
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
                >
                  <span>搜索</span>
                </Button>
              </Box>
            </div>
          )}
        </Box>
        <div id="captcha" />
        <Paper style={{ marginBottom: "10px", marginTop: "10px" }}>
          <TableContainer>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChangeValue}
                  aria-label="basic tabs example"
                >
                  <Tab label="通道一" {...a11yProps(0)} />
                  <Tab label="通道二" {...a11yProps(1)} />
                  <Tab label="通道三" {...a11yProps(2)} />
                  <Tab label="通道四" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                {isneteaseLoading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "200px",
                    }}
                  >
                    {jzwz1 !== "搜索功能加载完成啦~\n请搜索歌曲哦~" ? (
                      <CircularProgress />
                    ) : (
                      <CheckCircleIcon color="success" fontSize="large" />
                    )}
                    <p style={{ marginLeft: "10px", whiteSpace: "pre" }}>
                      {jzwz1}
                    </p>
                  </div>
                ) : (
                  <>
                    {netease_songs.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "20px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          <p style={{ marginLeft: "10px", whiteSpace: "pre" }}>
                            未搜索到内容哦，查看一下其他通道吧~
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
                          {netease_songs.map((song) => (
                            <TableRow key={song.id}>
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
                                    {song.author.length <= 10
                                      ? song.author
                                      : `${song.author.slice(0, 10)}...`}
                                  </span>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <ButtonGroup>
                                  <Grid
                                    container
                                    direction="column"
                                    spacing={2}
                                  >
                                    <Grid item>
                                      <Button
                                        onClick={() =>
                                          handleListenClick(song.id)
                                        }
                                        variant="contained"
                                        disabled={disabled}
                                      >
                                        <span>听歌曲</span>
                                      </Button>
                                    </Grid>
                                    <Grid item>
                                      <Button
                                        onClick={() =>
                                          handleInsectSongClick({
                                            id: song.id,
                                            name: song.title,
                                            artist: song.author,
                                          })
                                        }
                                        variant="contained"
                                        disabled={disabled}
                                      >
                                        <span>下首播</span>
                                      </Button>
                                    </Grid>
                                    <Grid item>
                                      <Button
                                        onClick={() => {
                                          setshareurl(
                                            "https://music.lcahy.cn/song/detail?songID=" +
                                              song.id
                                          );
                                          fxhandleClickOpen();
                                        }}
                                        variant="contained"
                                        disabled={disabled}
                                      >
                                        <span>分享它</span>
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </ButtonGroup>
                              </TableCell>
                            </TableRow>
                          ))}
                          <Button
                            disabled={disabled}
                            onClick={() => {
                              loadmoresong("netease");
                            }}
                          >
                            <span>加载更多歌曲</span>
                          </Button>
                        </TableBody>
                      </Table>
                    )}
                  </>
                )}
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                {iskgLoading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "200px",
                    }}
                  >
                    {jzwz2 !== "搜索功能加载完成啦~\n请搜索歌曲哦~" ? (
                      <CircularProgress />
                    ) : (
                      <CheckCircleIcon color="success" fontSize="large" />
                    )}
                    <p style={{ marginLeft: "10px", whiteSpace: "pre" }}>
                      {jzwz2}
                    </p>
                  </div>
                ) : (
                  <>
                    {kugou_songs.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "20px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          <p style={{ marginLeft: "10px", whiteSpace: "pre" }}>
                            未搜索到内容哦，查看一下其他通道吧~
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
                          {kugou_songs.map((song) => (
                            <TableRow key={song.id}>
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
                                  <Button
                                    onClick={() =>
                                      handleListenClickLinethree(song)
                                    }
                                    variant="contained"
                                    disabled={disabled}
                                  >
                                    <span>听歌曲</span>
                                  </Button>
                                </ButtonGroup>
                              </TableCell>
                            </TableRow>
                          ))}
                          <Button
                            disabled={disabled}
                            onClick={() => {
                              loadmoresong("kugou");
                            }}
                          >
                            <span>加载更多歌曲</span>
                          </Button>
                        </TableBody>
                      </Table>
                    )}
                  </>
                )}
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                {ismgLoading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "200px",
                    }}
                  >
                    {jzwz3 !== "搜索功能加载完成啦~\n请搜索歌曲哦~" ? (
                      <CircularProgress />
                    ) : (
                      <CheckCircleIcon color="success" fontSize="large" />
                    )}
                    <p style={{ marginLeft: "10px", whiteSpace: "pre" }}>
                      {jzwz3}
                    </p>
                  </div>
                ) : (
                  <>
                    {migu_songs.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "20px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          <p style={{ marginLeft: "10px", whiteSpace: "pre" }}>
                            未搜索到内容哦，查看一下其他通道吧~
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
                          {migu_songs.map((song) => (
                            <TableRow key={song.id}>
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
                                  <Button
                                    onClick={() =>
                                      handleListenClickLinethree(song)
                                    }
                                    variant="contained"
                                    disabled={disabled}
                                  >
                                    <span>听歌曲</span>
                                  </Button>
                                </ButtonGroup>
                              </TableCell>
                            </TableRow>
                          ))}
                          <Button
                            disabled={disabled}
                            onClick={() => {
                              loadmoresong("migu");
                            }}
                          >
                            <span>加载更多歌曲</span>
                          </Button>
                        </TableBody>
                      </Table>
                    )}
                  </>
                )}
              </CustomTabPanel>
              <CustomTabPanel value={value} index={3}>
                {issjkLoading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "200px",
                    }}
                  >
                    {jzwz4 !== "搜索功能加载完成啦~\n请搜索歌曲哦~" ? (
                      <CircularProgress />
                    ) : (
                      <CheckCircleIcon color="success" fontSize="large" />
                    )}
                    <p style={{ marginLeft: "10px", whiteSpace: "pre" }}>
                      {jzwz4}
                    </p>
                  </div>
                ) : (
                  <>
                    {sjk_songs.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "20px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          <p style={{ marginLeft: "10px", whiteSpace: "pre" }}>
                            未搜索到内容哦，查看一下其他通道吧~
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
                          {sjk_songs.map((song) => (
                            <TableRow key={song.id}>
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
                                  <Button
                                    onClick={() =>
                                      handleListenClickLinethree(song)
                                    }
                                    variant="contained"
                                    disabled={disabled}
                                  >
                                    <span>听歌曲</span>
                                  </Button>
                                </ButtonGroup>
                              </TableCell>
                            </TableRow>
                          ))}
                          <Button
                            disabled={disabled}
                            onClick={() => {
                              loadmoresong("sjk");
                            }}
                          >
                            <span>加载更多歌曲</span>
                          </Button>
                        </TableBody>
                      </Table>
                    )}
                  </>
                )}
              </CustomTabPanel>
            </Box>
          </TableContainer>
        </Paper>
      </Element>
    </>
  );
}
