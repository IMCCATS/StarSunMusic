"use client";
import * as React from "react";
import $ from "jquery";
import { CurrentSongContext } from "../src/app/dashboard/page";
import {
  Button,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  Paper,
  CardContent,
  Card,
  CircularProgress,
  Pagination,
  Backdrop,
  ButtonGroup,
} from "@mui/material";
import { message } from "antd";
export default function TopBar() {
  const [messageApi, contextHolder] = message.useMessage();
  const {
    playingpage,
    setplayingpage,
    isPlayComplete,
    setCurrentSong,
    setisPlayComplete,
    setcanlistplay,
  } = React.useContext(CurrentSongContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const [songs, setSongs] = React.useState([]);
  const [lastPlayedSongIndex, setLastPlayedSongIndex] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const handleNextSongClick = () => {
    const index = lastPlayedSongIndex + 1;
    if (songs[index] && songs[index].id) {
      handleListenClick(songs[index].id);
      setisPlayComplete(false);
    }
  };

  React.useEffect(() => {
    fetchMusicList();
    if (isPlayComplete && playingpage === "TopBar") {
      handleNextSongClick();
    }
  }, [isPlayComplete]);

  const fetchMusicList = () => {
    $.ajax({
      url: "https://api.yimian.xyz/msc/",
      type: "get",
      dataType: "json",
      async: false,
      data: {
        type: "playlist",
        id: `3778678`,
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
          // console.log(res);
          setSongs(res);
          setIsLoading(false);
        } else {
          console.log(res);
          setIsLoading(false);
        }
      },
    });
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
            setLastPlayedSongIndex(
              songs.findIndex((song) => song.id === songId)
            );
            setcanlistplay(true);
            setplayingpage("TopBar");
          } else {
            console.log(res);
            setdisabled(false);
          }
        },
      });
    }, 1500);
  };

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentSongs = songs.slice(firstIndex, lastIndex);
  const numPages = Math.ceil(songs.length / itemsPerPage);

  const handlePaginationChange = (event, value) => {
    setCurrentPage(value);
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
      <Card sx={{ minWidth: 275 }} style={{ marginTop: "15px" }}>
        <CardContent>
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
                  <CircularProgress />
                  <p style={{ marginLeft: "10px" }}>加载中...</p>
                </div>
              ) : songs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <span>暂无数据</span>
                </div>
              ) : (
                <div>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <span>热歌榜 · 排名</span>
                        </TableCell>
                        <TableCell>
                          <span>歌曲图片</span>
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
                      {currentSongs.map((song, index) => (
                        <TableRow key={song.id}>
                          <TableCell>
                            <span>{firstIndex + index + 1}</span>
                          </TableCell>
                          <TableCell>
                            <img src={song.cover} alt="Thumbnail" height="64" />
                          </TableCell>
                          <TableCell>
                            <span>{song.name}</span>
                          </TableCell>
                          <TableCell>
                            <span>{song.artist}</span>
                          </TableCell>
                          <TableCell>
                            <ButtonGroup>
                              <Button
                                onClick={() => handleListenClick(song.id)}
                                variant="contained"
                                disabled={disabled}
                              >
                                <span>听歌曲</span>
                              </Button>
                              <Button
                                onClick={() =>
                                  addSongToLocalPlaylist({
                                    title: song.name,
                                    artist: song.artist,
                                    songId: song.id,
                                  })
                                }
                                variant="contained"
                                disabled={disabled}
                              >
                                <span>加歌单</span>
                              </Button>
                            </ButtonGroup>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TableContainer>
          </Paper>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Pagination
              count={numPages}
              page={currentPage}
              onChange={handlePaginationChange}
              shape="rounded"
              color="primary"
            />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
