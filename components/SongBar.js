"use client";
import * as React from "react";
import { CurrentSongContext } from "../src/app/page";
import {
  Button,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Table,
  CardContent,
  Card,
  CircularProgress,
  Pagination,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
const playlists = [
  { name: "短视频各样卡点/热血音乐-燃到极致！", id: "5335051744" },
  { name: "纯爱硬曲 高燃漫剪BGM", id: "8550146295" },
  { name: "精神乌托邦 | 电音如烟花般绽放希望与美好", id: "8400492541" },
  { name: "电子·中国风 I 感受角徵宫商的荡气回肠", id: "316223640" },
];

const PlaylistComponent = ({ playlist }) => {
  const { setCurrentSong } = React.useContext(CurrentSongContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const [songs, setSongs] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  React.useEffect(() => {
    fetchMusicList();
  }, []);

  const fetchMusicList = () => {
    const xhr = new XMLHttpRequest();
    const playlistId = playlist.id;
    const url = `https://api.gmit.vip/Api/MusicList?format=json&url=https://music.163.com/playlist?id=${playlistId}`;

    xhr.open("GET", url, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setSongs(data.data);
          setIsLoading(false);
        } else {
          console.log(xhr.responseText);
        }
      }
    };
    xhr.send();
  };

  const handleListenClick = (songId) => {
    const xhr = new XMLHttpRequest();
    const url = `https://api.gmit.vip/Api/Netease?format=json&id=${songId}`;

    xhr.open("GET", url, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setCurrentSong(data.data);
        } else {
          console.log(xhr.responseText);
        }
      }
    };
    xhr.send();
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
            <span>暂无数据</span>
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
            variant="outlined"
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
