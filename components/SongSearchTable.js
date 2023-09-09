"use client";
import * as React from "react";
import $ from "jquery";
import { CurrentSongContext } from "../src/app/dashboard/page";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import ButtonGroup from "@mui/material/ButtonGroup";
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
  const [PT, setPT] = React.useState("default");
  const [jzwz, setwz] = React.useState(
    "请搜索歌曲，搜索完成后会自动停止加载。"
  );
  const [searchTerm, setSearchTerm] = React.useState("");

  var isEnterPressed = false;
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (!isEnterPressed) {
        isEnterPressed = true;
        setTimeout(() => {
          if (PT === "default") {
            handleSearch();
          } else if (PT === "kg") {
            handleSearchKG();
          } else {
            handleSearchMG();
          }
          isEnterPressed = false;
        }, 1000);
      }
    }
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
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

  const convertJson = function (serverJson) {
    const data = serverJson;
    const convertedJson = {
      id: data.songid,
      title: data.title,
      artist: data.author,
      cover: data.pic,
      lyric: data.lrc,
      link: data.url,
    };

    return convertedJson;
  };

  const CCJSONC = function (serverJson) {
    const data = serverJson;
    const convertedJsons = [];

    for (let i = 0; i < data.length; i++) {
      const convertedJson = {
        id: data[i].songid,
        title: data[i].title,
        artist: data[i].author,
        name: data[i].title,
        ar: [{ name: data[i].author }],
        cover: data[i].pic,
        lyric: data[i].lrc,
        link: data[i].url,
      };
      convertedJsons.push(convertedJson);
    }

    return convertedJsons;
  };

  const handleListenClickLinetwo = (songId) => {
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
        if (res) {
          //console.log(res.data);
          const convertedJson = convertJson(res.data);
          //console.log(convertedJson);
          setCurrentSong(convertedJson);
          setdisabled(false);
        } else {
          console.log(res);
          setdisabled(false);
        }
      },
    });
  };

  const handleListenClickLinethree = (song) => {
    setCurrentSong(song);
  };

  const handleSearchKG = () => {
    if (!searchTerm) {
      return;
    }
    setSongs([]);
    setIsLoading(true);
    setwz("正在搜索中，搜索可能较慢，请耐心等待哦~");
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
          site: "kugou",
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

  const handleSearchMG = () => {
    if (!searchTerm) {
      return;
    }
    setSongs([]);
    setIsLoading(true);
    setwz("正在搜索中，搜索可能较慢，请耐心等待哦~");
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
    setwz("正在搜索中，搜索可能较慢，请耐心等待哦~");
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

  const handleChangec = (event, newPT) => {
    setPT(newPT);
  };
  const control = {
    value: PT,
    onChange: handleChangec,
    exclusive: true,
  };

  const children = [
    <ToggleButton value="default" key="left">
      <FormatAlignLeftIcon />
    </ToggleButton>,
    <ToggleButton value="kg" key="center">
      <FormatAlignCenterIcon />
    </ToggleButton>,
    <ToggleButton value="mg" key="right">
      <FormatAlignRightIcon />
    </ToggleButton>,
  ];

  return (
    <main>
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
              ) : (
                <>
                  {songs.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <CircularProgress />
                        <p style={{ marginLeft: "10px", whiteSpace: "pre" }}>
                          搜索无内容返回，请重新搜索~
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Table>
                      <TableHead>
                        <TableRow>
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
                        {songs.map((song) => (
                          <TableRow key={song.id}>
                            <TableCell>
                              <span>{song.name}</span>
                            </TableCell>
                            <TableCell>
                              <span>{song.ar[0].name}</span>
                            </TableCell>
                            <TableCell>
                              <ButtonGroup>
                                {PT === "default" ? (
                                  <main>
                                    <Button
                                      onClick={() => handleListenClick(song.id)}
                                      variant="contained"
                                      disabled={PT !== "default" || disabled}
                                    >
                                      <span>线路1·听</span>
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        handleListenClickLinetwo(song.id)
                                      }
                                      variant="contained"
                                      disabled={PT !== "default" || disabled}
                                    >
                                      <span>线路2·听</span>
                                    </Button>
                                  </main>
                                ) : (
                                  <Button
                                    onClick={() =>
                                      handleListenClickLinethree(song)
                                    }
                                    variant="contained"
                                    disabled={PT === "default" || disabled}
                                  >
                                    <span>线路3·听</span>
                                  </Button>
                                )}
                              </ButtonGroup>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </>
              )}
            </TableContainer>
          </Paper>
        </CardContent>
      </Card>
    </main>
  );
}
