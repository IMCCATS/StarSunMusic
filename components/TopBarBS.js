"use client";
import * as React from "react";
import { CurrentSongContext } from "../src/app/dashboard/page";
import {
  Button,
  Typography,
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
  ButtonGroup,
} from "@mui/material";
import { message } from "antd";
import {
  HandleListenSong,
  HandlePlayList,
  HandlePlayListBeiXuan,
} from "./common/fetchapi";
export default function TopBar() {
  const [messageApi, contextHolder] = message.useMessage();
  const {
    SetPlayingSongs,
    setCurrentSong,
    setLastPlayedSongIndex,
    setcanlistplay,
    setdisabled,
    disabled,
    handleInsectSongClick,
  } = React.useContext(CurrentSongContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const [songs, setSongs] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const fetchMusicList = () => {
    HandlePlayList("19723756")
      .then((e) => {
        setSongs(e);
        setIsLoading(false);
      })
      .catch((error) => {
        setSongs([]);
        fetchMusicListBeiXuan();
      });
  };

  React.useEffect(() => {
    fetchMusicList();
  }, []);

  const fetchMusicListBeiXuan = () => {
    HandlePlayListBeiXuan("19723756")
      .then((e) => {
        setSongs(e);
        setIsLoading(false);
      })
      .catch((error) => {
        setSongs([]);
        setIsLoading(false);
      });
  };
  const handleListenClick = (songId) => {
    setdisabled(true);
    HandleListenSong(songId)
      .then((e) => {
        setCurrentSong(e);
        SetPlayingSongs(songs);
        setLastPlayedSongIndex(songs.findIndex((song) => song.id === songId));
        setcanlistplay(true);
        setdisabled(false);
      })
      .catch((error) => {
        setdisabled(false);
      });
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
      <Card sx={{ minWidth: 275 }} style={{ marginTop: "15px" }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            <span>飙升榜</span>
          </Typography>
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
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <span>排名</span>
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
                              <span>收藏它</span>
                            </Button>
                            <Button
                              onClick={() =>
                                handleInsectSongClick({
                                  id: song.id,
                                  name: song.name,
                                  artist: song.artist,
                                })
                              }
                              variant="contained"
                              disabled={disabled}
                            >
                              <span>下首播</span>
                            </Button>
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
