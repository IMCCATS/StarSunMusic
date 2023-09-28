import * as React from "react";
import { CurrentSongContext } from "../src/app/dashboard/page";
import $ from "jquery";
import {
  Card,
  CardContent,
  Button,
  Typography,
  ButtonGroup,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { Drawer, List, Empty } from "antd";

const PlayListC = () => {
  const [open, setOpen] = React.useState(false);
  const [playList, setPlayList] = React.useState([]);
  const [disabled, setdisabled] = React.useState(false);
  const {
    playingpage,
    setplayingpage,
    isPlayComplete,
    setCurrentSong,
    setisPlayComplete,
    setcanlistplay,
  } = React.useContext(CurrentSongContext);
  const [lastPlayedSongIndex, setLastPlayedSongIndex] = React.useState(0);

  const handleNextSongClick = () => {
    const index = lastPlayedSongIndex + 1;
    if (playList[index] && playList[index].songId) {
      handleListenClick(playList[index].songId);
      setisPlayComplete(false);
    }
  };

  React.useEffect(() => {
    if (isPlayComplete && playingpage === "LocalGD") {
      handleNextSongClick();
    }
  }, [isPlayComplete]);

  // 获取播放列表的函数
  const getPlayList = () => {
    const savedPlayList = localStorage.getItem("playList");
    if (savedPlayList) {
      setPlayList(JSON.parse(savedPlayList));
    }
  };

  // 显示抽屉的函数
  const showDrawer = () => {
    setOpen(true);
    getPlayList();
  };

  // 关闭抽屉的函数
  const onClose = () => {
    setOpen(false);
  };

  // 播放歌曲的函数
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
          setdisabled(false);
        },
        success: function (res) {
          // 状态码 200 表示请求成功
          if (res) {
            //console.log(res);
            setdisabled(false);
            setcanlistplay(true);
            setplayingpage("LocalGD");
            setLastPlayedSongIndex(
              playList.findIndex((song) => song.songId === songId)
            );
            setCurrentSong(res);
          } else {
            setdisabled(false);
            console.log(res);
          }
        },
      });
    }, 1500);
  };

  // 删除歌曲的函数
  const handleDeleteClick = (index) => {
    const newPlayList = [...playList];
    newPlayList.splice(index, 1);
    setPlayList(newPlayList);
    localStorage.setItem("playList", JSON.stringify(newPlayList));
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={disabled}
      >
        <CircularProgress color="inherit" />
        <span style={{ marginLeft: "15px" }}>正在加载歌曲</span>
      </Backdrop>
      <Card style={{ marginTop: "15px" }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            <span>操作区</span>
          </Typography>
          <Button
            onClick={showDrawer}
            variant="contained"
            sx={{
              height: "56px",
              marginTop: "10px",
              marginRight: "10px",
            }}
          >
            <span>打开个人歌单</span>
          </Button>
          <Drawer
            title="个人歌单"
            placement="right"
            onClose={onClose}
            open={open}
            extra={
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <ButtonGroup>
                  <Button
                    disabled={playList.length === 0 || disabled}
                    onClick={() => {
                      setPlayList([]);
                      localStorage.removeItem("playList");
                    }}
                    variant="contained"
                  >
                    清空
                  </Button>
                </ButtonGroup>
              </div>
            }
          >
            {Array.isArray(playList) && playList.length > 0 ? (
              <List>
                {playList.map((song, index) => (
                  <List.Item key={index}>
                    <List.Item.Meta
                      title={song.title}
                      description={song.artist}
                    />
                    <ButtonGroup>
                      <Button
                        onClick={() => handleListenClick(song.songId)}
                        variant="contained"
                        disabled={disabled}
                      >
                        播放
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(index)}
                        variant="contained"
                        disabled={disabled}
                      >
                        删除
                      </Button>
                    </ButtonGroup>
                  </List.Item>
                ))}
              </List>
            ) : (
              <Empty description="还没有歌曲哦~" />
            )}
            <Card style={{ marginTop: "10px" }}>
              <CardContent>
                <Typography
                  variant="body2"
                  gutterBottom
                  style={{ marginTop: "10px" }}
                >
                  <span>
                    注：当前个人歌单功能为实验性功能，仅支持部分歌曲添加到歌单播放，开发者正在全力开发啦~
                  </span>
                </Typography>
              </CardContent>
            </Card>
          </Drawer>
        </CardContent>
      </Card>
    </>
  );
};
export default PlayListC;
