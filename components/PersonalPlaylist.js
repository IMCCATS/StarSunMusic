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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Drawer, List, Empty, message } from "antd";
import { ExperimentTwoTone } from "@ant-design/icons";
import supabase from "@/app/api/supabase";

const PersonalPlaylist = () => {
  const router = useRouter();
  const [profile, setprofile] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };
  const [open, setOpen] = React.useState(false);
  const [uuidtext, setuuid] = React.useState("");
  const [playList, setPlayList] = React.useState([]);
  const [disabled, setdisabled] = React.useState(false);
  const [gedanidshow, setgedanidshow] = React.useState(false);
  const [sharedisabled, setsharedisabled] = React.useState(false);
  const [checkisabled, setcheckisabled] = React.useState(false);
  const [gedanidc, setgedanidc] = React.useState("");
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
    const c = localStorage.getItem("userprofile");
    if (c) {
      setprofile(true);
    }
  }, [isPlayComplete]);

  // 获取播放列表的函数
  const getPlayList = () => {
    const savedPlayList = localStorage.getItem("playList");
    if (savedPlayList) {
      setPlayList(JSON.parse(savedPlayList));
    }
  };

  const addSongToLocalPlaylist = (song) => {
    const playList = JSON.parse(localStorage.getItem("playList")) || [];
    const existingSongIndex = playList.findIndex(
      (s) => s.songId === song.songId
    );
    if (existingSongIndex === -1) {
      playList.push(song);
      localStorage.setItem("playList", JSON.stringify(playList));
      messageApi.success("添加成功啦~");
    } else {
      message.info("歌单已存在本歌曲了哦~");
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
  const handlechange = (event) => {
    setuuid(event.target.value);
  };

  const handleCheckUUID = async () => {
    handleClose();
    let { data: GedanS, error } = await supabase
      .from("GedanS")
      .select("*")
      .eq("gedanid", uuidtext);
    if (error) {
      setOpenDialog(false);
      messageApi.error("获取歌单失败了哦~请检查是否有问题~");
      setdisabled(false);
      return;
    }
    if (GedanS && Array.isArray(GedanS)) {
      if (GedanS.length > 0) {
        const gedan = GedanS[0].songs;
        if (Array.isArray(gedan) && gedan.length >= 10) {
          // 遍历数组中的每一首歌
          for (let i = 0; i < gedan.length; i++) {
            addSongToLocalPlaylist({
              title: gedan[i].title,
              artist: gedan[i].artist,
              songId: gedan[i].songId,
            });
          }
          setuuid("");
          setOpenDialog(false);
          onClose();
          setcheckisabled(true);
          setTimeout(() => {
            messageApi.success("分享的歌单歌曲已经全部添加完成啦~");
          }, 1000);
          setTimeout(() => {
            setcheckisabled(false);
          }, 300000);
        }
      } else {
        messageApi.error("歌单码错误了哦~");
      }
    }
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

  const handleShare = async () => {
    if (playList && Array.isArray(playList) && playList.length >= 10) {
      setdisabled(true);
      const mobile = localStorage.getItem("userprofile");
      const emobile = btoa(mobile);
      const { data, error } = await supabase
        .from("GedanS")
        .upsert({ songs: playList, mobile: emobile })
        .select();
      if (error) {
        setOpenDialog(false);
        messageApi.error(
          "分享歌单失败了哦~可能是您的歌单和别人的重复啦，再去添加一些别的歌曲吧~"
        );
        setdisabled(false);
        return;
      }
      if (data && Array.isArray(data)) {
        const UUID = data[0].gedanid;
        setgedanidc(UUID);
        setgedanidshow(true);
        setdisabled(false);
        setsharedisabled(true);
        setTimeout(() => {
          setsharedisabled(false);
        }, 300000);
      }
    }
  };

  // 删除歌曲的函数
  const handleDeleteClick = (index) => {
    const newPlayList = [...playList];
    newPlayList.splice(index, 1);
    setPlayList(newPlayList);
    localStorage.setItem("playList", JSON.stringify(newPlayList));
  };

  const handleLogin = () => {
    setdisabled(true);
    const profile = localStorage.getItem("userprofile");
    if (!profile) {
      router.push("/oauth-login");
    } else {
      messageApi.info("您已经登录了哦~");
    }
  };

  const handleQuitLogin = () => {
    setdisabled(true);
    localStorage.removeItem("userprofile");
    localStorage.removeItem("mobiletoken");
    setprofile(false);
    setTimeout(() => {
      messageApi.success("退出登录成功");
      setdisabled(false);
    }, 1000);
  };

  return (
    <>
      {contextHolder}
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>
          <span>请输入好友分享给你的歌单码</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span>
              当好友分享歌单后，会获得一个歌单码。请输入这个歌单码来获取这个歌单。获取成功后，分享的歌单中的歌曲将添加到您的歌单中。
            </span>
          </DialogContentText>
          <TextField
            margin="dense"
            label="歌单码"
            type="text"
            fullWidth
            variant="standard"
            value={uuidtext}
            onChange={handlechange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            <span>取消</span>
          </Button>
          <Button onClick={handleCheckUUID}>
            <span>加歌单</span>
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={disabled}
      >
        <CircularProgress color="inherit" />
        <span style={{ marginLeft: "15px" }}>正在加载</span>
      </Backdrop>
      <Card style={{ marginTop: "15px" }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            <span>操作区</span>
          </Typography>
          {profile ? (
            <Button
              onClick={handleQuitLogin}
              variant="contained"
              disabled={disabled}
              sx={{
                height: "56px",
                marginTop: "10px",
                marginRight: "10px",
              }}
            >
              <span>退出登录</span>
            </Button>
          ) : (
            <Button
              onClick={handleLogin}
              variant="contained"
              disabled={disabled}
              sx={{
                height: "56px",
                marginTop: "10px",
                marginRight: "10px",
              }}
            >
              <span>用户账户登录</span>
            </Button>
          )}
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
            <Card
              style={{
                marginTop: "10px",
              }}
            >
              <CardContent
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  gutterBottom
                  style={{ marginTop: "10px" }}
                >
                  <span>
                    注：个人歌单功能为
                    <ExperimentTwoTone />
                    实验性功能，且需要登录后才能分享歌单。
                    <br />
                    当前仅支持部分歌曲加歌单播放，开发者正在全力开发啦~
                    <br />
                    如果您想分享歌单的话，攒够十首您和您好友喜欢听的歌，就可以分享啦~但是请合理使用哦，有时间限制哒~
                  </span>
                </Typography>
                {gedanidshow ? (
                  <Typography
                    variant="body2"
                    gutterBottom
                    style={{ marginTop: "10px" }}
                  >
                    <span>
                      分享成功啦~ 您的歌单ID为：
                      <br />
                      <br />
                      {gedanidc}
                      <br />
                      <br />
                      收好它哦！下次打开可能就没有啦~赶快把它分享给好友吧~
                    </span>
                  </Typography>
                ) : (
                  <></>
                )}
                <ButtonGroup style={{ marginTop: "10px" }}>
                  <Button
                    onClick={() => {
                      handleShare();
                    }}
                    variant="contained"
                    disabled={
                      disabled ||
                      playList.length === 0 ||
                      playList.length < 10 ||
                      sharedisabled ||
                      !profile
                    }
                  >
                    分享我的歌单
                  </Button>
                  <Button
                    onClick={() => handleClickOpen()}
                    variant="contained"
                    disabled={disabled || checkisabled}
                  >
                    获取好友的歌单
                  </Button>
                </ButtonGroup>
              </CardContent>
            </Card>
          </Drawer>
        </CardContent>
      </Card>
    </>
  );
};
export default PersonalPlaylist;
