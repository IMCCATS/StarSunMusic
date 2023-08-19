"use client";
import * as React from "react";
import { CurrentSongContext } from "../src/app/page";
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
} from "@mui/material";
export default function TopBar() {
  const { setCurrentSong } = React.useContext(CurrentSongContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const [songs, setSongs] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  React.useEffect(() => {
    fetchMusicList();
  }, []);

  const fetchMusicList = async () => {
    try {
      const response = await fetch(`/api/fetch-music-list?playlistId=19723756`);
      const data = await response.json();

      if (response.ok) {
        setSongs(data.song);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleListenClick = async (songId) => {
    try {
      const response = await fetch(
        `https://api.gmit.vip/Api/Netease?format=json&id=${songId}`
      );
      const data = await response.json();

      if (response.ok) {
        setCurrentSong(data.song);
      }
    } catch (error) {
      console.log(error);
    }
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
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <span>飙升榜 · 排名</span>
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
                      <TableRow key={song.song_id}>
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
                          <Button
                            onClick={() => handleListenClick(song.song_id)}
                            variant="contained"
                          >
                            <span>听</span>
                          </Button>
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
              variant="outlined"
              shape="rounded"
              color="primary"
            />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
