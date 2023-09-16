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
  Box,
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
        //请求成功失败执行的代码
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
          //请求成功失败执行的代码
        },
        success: function (res) {
          // 状态码 200 表示请求成功
          if (res) {
            //console.log(res);
            setCurrentSong(res);
            setdisabled(false);
          } else {
            console.log(res);
            setdisabled(false);
          }
        },
      });
    }, 1500);
  };
  let timeoutId;

  function handleSongList(songs, index = 0) {
    if (index >= songs.length) {
      return;
    }

    const song = songs[index];
    handleListenClick(song.id);

    // 3.5分钟后调用这个函数，index加1
    timeoutId = setTimeout(
      () => handleSongList(songs, index + 1),
      3.5 * 60 * 1000
    );
  }

  // 停止执行函数
  function stopExecution() {
    clearTimeout(timeoutId);
  }

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
                <div>
                  <Box>
                    <Button
                      style={{ marginLeft: "10px", marginTop: "10px" }}
                      variant="contained"
                      onClick={() => {
                        handleSongList(currentSongs);
                      }}
                    >
                      列表播放
                    </Button>
                    <Button
                      style={{ marginLeft: "10px", marginTop: "10px" }}
                      variant="contained"
                      onClick={() => {
                        stopExecution();
                      }}
                    >
                      取消列表播放
                    </Button>
                    <p style={{ marginLeft: "10px" }}>
                      （实验性功能）功能原理：每3.5分钟切换下一曲。
                    </p>
                  </Box>
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
                            <Button
                              onClick={() => handleListenClick(song.id)}
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
