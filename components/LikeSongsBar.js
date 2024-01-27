"use client";
import * as React from "react";
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
  Backdrop,
  ButtonGroup,
  CardActions,
  TextField,
  Link,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { message } from "antd";
import {
  HandleListenSong,
  HandlePlayList,
  HandlePlayListBeiXuan,
} from "./common/fetchapi";

const PlaylistComponent = ({ playlist, index }) => {
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
    HandlePlayList(playlistId)
      .then((e) => {
        setSongs(e);
        setIsLoading(false);
      })
      .catch((error) => {
        setSongs([]);
        fetchMusicListBeiXuan(playlistId);
      });
  };

  const fetchMusicListBeiXuan = (playlistId) => {
    HandlePlayListBeiXuan(playlistId)
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


  return (
    <main>
      {contextHolder}
      <Accordion key={playlist.id}>
        <AccordionSummary>
          <Typography>
            <span>歌单{index + 1}</span>
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
    </main>
  );
};

export default function LikeSongBar() {
  const [playlists, setplaylists] = React.useState([]);
  const AddBar = (Term) => {
    if (!Term || playlists.includes(Term)) {
      return;
    }
    const newBars = [...playlists, Term];
    localStorage.setItem("Bars", JSON.stringify(newBars));
    setplaylists(newBars);
  };

  const AddBars = () => {
    const saved = JSON.parse(localStorage.getItem("Bars"));
    if (saved) {
      setplaylists(saved);
    }
  };

  React.useEffect(() => {
    AddBars();
  }, []);

  const [inputvalue, setinputvalue] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [openDelete, setDeleteOpen] = React.useState(false);

  const handleClickDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };
  const handleAdd = () => {
    if (inputvalue && inputvalue !== "") {
      AddBar({ id: inputvalue });
      setinputvalue("");
      handleClose();
    }
  };
  const RemoveBar = (index) => {
    if (!playlists[index]) {
      return;
    }
    const newBars = playlists.filter((_, i) => i !== index);
    localStorage.setItem("Bars", JSON.stringify(newBars));
    setplaylists(newBars);
  };

  return (
    <main>
      <React.Fragment>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            <span>请输入您的云音乐歌单ID</span>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <span>
                本功能设计初衷：便于用户收听自己喜欢的歌曲，无需繁琐搜索操作。
              </span>
              <br />
              <span>
                云音乐歌单ID获取：打开我喜欢的音乐歌单，点击分享到链接，链接中的"playlist?id="后面的数字就是歌单ID。
              </span>
              <br />
              <span>
                本功能支持平台 & 获取的音乐的版权方 & 特别致谢：
                <Link
                  href="https://music.163.com"
                  underline="hover"
                  aria-label="前往网易云音乐"
                  target="blank"
                >
                  <span>网易云音乐</span>
                </Link>
              </span>
              <br />
              <span>请大家支持正版！</span>
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="songid"
              label="歌单ID"
              type="number"
              value={inputvalue}
              onChange={(e) => {
                setinputvalue(e.target.value);
              }}
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAdd}>确定添加</Button>
            <Button onClick={handleClose}>取消</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
      <React.Fragment>
        <Dialog open={openDelete} onClose={handleDeleteClose}>
          <DialogTitle>
            <span>请选择您要删除的歌单</span>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <span style={{ color: "red" }}>
                删除后将不可恢复，请谨慎操作。
              </span>
              <br />
              <span>
                注：歌单是按照添加顺序排序的，删除会重置排序。例如：在删除歌单2之后，歌单3会重置为歌单2。
              </span>
            </DialogContentText>
            {Array.isArray(playlists) && playlists.length > 0 ? (
              <>
                {playlists.map((playlist, index) => (
                  <Button
                    onClick={() => {
                      RemoveBar(index);
                    }}
                    style={{ margin: "8px auto" }}
                  >
                    歌单{index + 1}
                    <br />
                    ID:{playlist.id}
                  </Button>
                ))}
              </>
            ) : (
              <span>还没有添加歌单哦~</span>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteClose}>取消</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
      <Card sx={{ minWidth: 275 }} style={{ marginTop: "15px" }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            <span>本地歌单列表</span>
          </Typography>
          {/* 使用动态组件渲染每个歌单 */}
          {Array.isArray(playlists) && playlists.length > 0 ? (
            <>
              {playlists.map((playlist, index) => (
                <PlaylistComponent
                  key={playlist.id}
                  playlist={playlist}
                  index={index}
                />
              ))}
            </>
          ) : (
            <Typography sx={{ mb: 1.5 }}>
              <span>还没有添加歌单哦~</span>
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            onClick={() => {
              handleClickOpen();
            }}
          >
            添加歌单
          </Button>
          <Button
            onClick={() => {
              handleClickDeleteOpen();
            }}
          >
            删除歌单
          </Button>
        </CardActions>
      </Card>
    </main>
  );
}
