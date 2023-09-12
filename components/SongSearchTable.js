"use client";
import * as React from "react";
import { CurrentSongContext } from "../src/app/page";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
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
  TextField,
  Box,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

export default function SongSearchTable() {
  const { setCurrentSong } = React.useContext(CurrentSongContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const [songs, setSongs] = React.useState([]);
  const [PT, setPT] = React.useState("netease");
  const [jzwz, setwz] = React.useState(
    "请搜索歌曲，搜索完成后会自动停止加载。"
  );
  const [searchTerm, setSearchTerm] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [searchdesabled, setsearchdesabled] = React.useState(true);
  const addJB = () => {
    var script = document.createElement("script");
    script.src = "https://static.geetest.com/v4/gt4.js";
    script.async = true;
    script.addEventListener("load", function () {
      setwz("搜索功能加载完成啦~\n请搜索歌曲哦~");
      setsearchdesabled(false);
    });
    document.head.appendChild(script);
  };
  React.useEffect(() => {
    addJB();
    setTimeout(() => {}, 6000);
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const close1 = () => {
    setOpen(false);
    setPT("default");
    handleSearch();
  };
  const close4 = () => {
    setOpen(false);
    setPT("sjk");
    handleSearchSJK();
  };
  const close2 = () => {
    setOpen(false);
    setPT("kg");
    handleSearchKG();
  };
  const close3 = () => {
    setOpen(false);
    setPT("mg");
    handleSearchMG();
  };
  const searchOpen = () => {
    if (searchTerm) {
      if (searchTerm != "") {
        initGeetest4(
          {
            captchaId: "cbf4e068bc17eb10afa9e3b8a84d51d0",
            product: "bind",
          },
          function (captcha) {
            // captcha为验证码实例
            captcha.appendTo("#captcha");
            captcha
              .onReady(function () {
                captcha.showCaptcha();
              })
              .onSuccess(function () {
                handleClickOpen();
              });
          }
        );
      }
    }
  };
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleListenClick = (song) => {
    setCurrentSong(song);
  };

  const handleSearchMG = () => {
    if (!searchTerm) {
      return;
    }
    setSongs([]);
    setIsLoading(true);
    setwz("正在搜索中哦~\n搜索可能较慢，请耐心等待哦~");
    console.log("搜索关键字:", searchTerm);
    setTimeout(() => {
      $.ajax({
        url: "https://api.gumengya.com/Api/Music",
        type: "post",
        dataType: "json",
        async: false,
        data: {
          format: "json",
          text: `${searchTerm}`,
          site: "migu",
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
            const CCJson = CCJSONC(res.data);
            setSongs(CCJson);
            setIsLoading(false);
          } else {
            console.log(res);
            setSongs([]);
            setIsLoading(false);
          }
        },
      });
    }, 1500);
  };

  const handleSearch = () => {
    if (!searchTerm) {
      return;
    }
    setSongs([]);
    setIsLoading(true);
    setwz("正在搜索中哦~\n搜索可能较慢，请耐心等待哦~");
    console.log("搜索关键字:", searchTerm);
    setTimeout(() => {
      let timestamp = Date.now();
      $.ajax({
        url: "https://anywherecors.lcahy.cn/cloudsearch",
        type: "get",
        dataType: "json",
        async: false,
        data: {
          keywords: `${searchTerm}`,
          timestamp: timestamp,
          realIP: "116.25.146.177",
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
            setSongs(res.result.songs);
            setIsLoading(false);
          } else {
            console.log(res);
            setSongs([]);
            setIsLoading(false);
          }
        },
      });
    }, 1500);
  };

  return (
    <main>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <span>请选择搜索方式</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <span>
              不同的搜索方式可能会有不同的搜索结果，请选择您要使用的搜索方式。
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={close1}>
            <span>方式1</span>
          </Button>
          <Button onClick={close2}>
            <span>方式2</span>
          </Button>
          <Button onClick={close3}>
            <span>方式3</span>
          </Button>
        </DialogActions>
      </Dialog>
      <Card sx={{ minWidth: 275 }} style={{ marginTop: "15px" }}>
        <CardContent>
          <Box
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              fullWidth
              label="搜点什么..."
              id="search"
              variant="outlined"
              onChange={handleChange}
              onKeyDown={handleKeyPress}
            />
            <ToggleButtonGroup
              size="small"
              {...control}
              aria-label="Small sizes"
            >
              {children}
            </ToggleButtonGroup>
          </Box>
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
                  <p style={{ marginLeft: "10px", whiteSpace: "pre" }}>
                    {jzwz}
                  </p>
                </div>
              ) : songs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <span>还没有进行搜索操作</span>
                </div>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
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
                        <span>链接</span>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {songs.map((song) => (
                      <TableRow key={song.songid}>
                        <TableCell>
                          <img src={song.pic} alt="Thumbnail" height="64" />
                        </TableCell>
                        <TableCell>
                          <span>{song.title}</span>
                        </TableCell>
                        <TableCell>
                          <span>{song.author}</span>
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleListenClick(song)}
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
        </CardContent>
      </Card>
    </main>
  );
}
