"use client";
import * as React from "react";
import $ from "jquery";
import { CurrentSongContext } from "../src/app/dashboard/page";
import {
  Button,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Table,
  TableContainer,
  CardContent,
  Card,
  CircularProgress,
  Pagination,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Paper,
} from "@mui/material";
const playlists = [
  { name: "短视频各样卡点/热血音乐-燃到极致！", id: "5335051744" },
  { name: "纯爱硬曲 高燃漫剪BGM", id: "8550146295" },
  { name: "精神乌托邦 | 电音如烟花般绽放希望与美好", id: "8400492541" },
  { name: "电子·中国风 I 感受角徵宫商的荡气回肠", id: "316223640" },
  { name: "【流行伤感】还是会有遗憾对吧", id: "8187890892" },
  { name: "身法大佬素材曲", id: "3192057802" },
  { name: "超燃战歌", id: "6791698520" },
];

const PlaylistComponent = ({ playlist }) => {
  const { setCurrentSong } = React.useContext(CurrentSongContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const [songs, setSongs] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  const [jy, setjy] = React.useState(false);
  const jzsj = () => {
    setIsLoading(true);
    setjy(true);
    setTimeout(() => {
      fetchMusicList();
    }, 1000);
  };

  const fetchMusicList = () => {
    const playlistId = playlist.id;
    $.ajax({
      url: "https://api.yimian.xyz/msc/",
      type: "get",
      dataType: "json",
      async: false,
      data: {
        type: "playlist",
        id: `${playlistId}`,
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
            // console.log(res);
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

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentSongs = songs.slice(firstIndex, lastIndex);
  const numPages = Math.ceil(songs.length / itemsPerPage);

  const handlePaginationChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Accordion key={playlist.id}>
      <AccordionSummary>
        <Typography>
          <span>{playlist.name}</span>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Button
          onClick={jzsj}
          disabled={jy}
          variant="contained"
          style={{ marginBottom: "10px" }}
        >
          加载数据
        </Button>
        <Paper>
          <TableContainer>
            {/* 此处是动态渲染的具体表单内容 */}
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
                <span>
                  暂无数据哦~若您没有点击加载数据按钮的话，点击一下加载数据按钮~
                </span>
              </div>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span>序号</span>
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
                        <span>{song.album}</span>
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
            )}
          </TableContainer>
        </Paper>
        {/* 此处是动态渲染的其他部分 */}
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
      </AccordionDetails>
    </Accordion>
  );
};

export default function TopBar() {
  return (
    <main>
      <Card sx={{ minWidth: 275 }} style={{ marginTop: "15px" }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            <span>歌单列表</span>
          </Typography>
          {/* 使用动态组件渲染每个歌单 */}
          {playlists.map((playlist) => (
            <PlaylistComponent key={playlist.id} playlist={playlist} />
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
