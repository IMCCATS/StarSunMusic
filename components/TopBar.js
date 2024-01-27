"use client";
import * as React from "react";
import { CurrentSongContext } from "../src/app/dashboard/page";
import {
  Typography,
  TableContainer,
  Paper,
  CardContent,
  Card,
  CircularProgress,
  Pagination,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemAvatar,
  Avatar,
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

  React.useEffect(() => {
    fetchMusicList();
  }, []);

  const fetchMusicList = () => {
    HandlePlayList("3778678")
      .then((e) => {
        setSongs(e);
        setIsLoading(false);
      })
      .catch((error) => {
        setSongs([]);
        fetchMusicListBeiXuan();
      });
  };

  const fetchMusicListBeiXuan = () => {
    setIsLoading(true);
    HandlePlayListBeiXuan("3778678")
      .then((e) => {
        setSongs(e);
        setIsLoading(false);
      })
      .catch((error) => {
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

  return (
    <main>
      {contextHolder}
      <Card sx={{ minWidth: 275 }} style={{ marginTop: "15px" }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            <span>热歌榜</span>
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
                <div>
                  <List>
                    {currentSongs.map((song, index) => (
                      <ListItem>
                        <ListItemAvatar
                          onClick={() => {
                            handleInsectSongClick({
                              id: song.id,
                              name: song.name,
                              artist: song.artist,
                            });
                          }}
                        >
                          <Avatar src={song.cover} />
                        </ListItemAvatar>
                        <ListItemButton
                          onClick={() => {
                            handleListenClick(song.id);
                          }}
                        >
                          <ListItemText
                            primary={song.name}
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {song.artist}
                                </Typography>
                                {` — 排名${firstIndex + index + 1}`}
                              </React.Fragment>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
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
