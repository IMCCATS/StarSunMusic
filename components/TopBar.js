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

  const fetchMusicList = () => {
    $.ajax({
      url: "https://api.gumengya.com/Api/MusicList",
      type: "post",
      dataType: "json",
      async: false,
      data: {
        format: "json",
        url: `https://music.163.com/playlist?id=3778678`,
      },
      beforeSend: function () {
        //请求中执行的代码
      },
      complete: function () {
        //请求完成执行的代码
      },
      error: function () {
        //请求成功失败执行的代码
      },
      success: function (res) {
        // 状态码 200 表示请求成功
        if (res.code === "200") {
          console.log(res);
          setSongs(res.data);
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
    $.ajax({
      url: "https://api.gumengya.com/Api/Netease",
      type: "post",
      dataType: "json",
      async: false,
      data: {
        format: "json",
        id: `${songId}`,
      },
      beforeSend: function () {
        //请求中执行的代码
      },
      complete: function () {
        //请求完成执行的代码
      },
      error: function () {
        //请求成功失败执行的代码
      },
      success: function (res) {
        // 状态码 200 表示请求成功
        if (res.code === 200) {
          console.log(res.data);
          setCurrentSong(res.data);
          setdisabled(false);
        } else {
          console.log(res);
          setdisabled(false);
        }
      },
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
                            disabled={disabled}
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
