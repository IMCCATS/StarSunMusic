import * as React from "react";
import { CurrentSongContext } from "../src/app/dashboard/page";
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
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import { Empty, message } from "antd";
import { ExperimentTwoTone } from "@ant-design/icons";
import supabase from "@/app/api/supabase";
import { HandleListenSong } from "./common/fetchapi";
const crypto = require("crypto");

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
  const [gedanidshow, setgedanidshow] = React.useState(false);
  const [sharedisabled, setsharedisabled] = React.useState(false);
  const [checkisabled, setcheckisabled] = React.useState(false);
  const [gedanidc, setgedanidc] = React.useState("");
  const {
    isPlayComplete,
    SetPlayingSongs,
    setCurrentSong,
    setLastPlayedSongIndex,
    setcanlistplay,
    setdisabled,
    disabled,
    handleInsectSongClick,
  } = React.useContext(CurrentSongContext);

  const handleListenClick = (songId) => {
    setdisabled(true);
    HandleListenSong(songId)
      .then((e) => {
        setCurrentSong(e);
        SetPlayingSongs(playList);
        setLastPlayedSongIndex(
          playList.findIndex((song) => song.id === songId)
        );
        setcanlistplay(true);
        setdisabled(false);
      })
      .catch((error) => {
        setdisabled(false);
      });
  };

  React.useEffect(() => {
    const b = localStorage.getItem("mobiletoken");
    const c = localStorage.getItem("userprofile");
    if (c) {
      const d = localStorage.getItem("ykey");
      const e = localStorage.getItem("skey");
      if (d && e) {
        async function sha256(input) {
          return crypto.createHash("sha256").update(input).digest("hex");
        }
        const text = e + c + b + e;
        sha256(text).then((ecode) => {
          if (ecode === d) {
            setprofile(true);
          } else {
            localStorage.removeItem("userprofile");
            localStorage.removeItem("mobiletoken");
            localStorage.removeItem("ykey");
            localStorage.removeItem("skey");
            setprofile(false);
            messageApi.error("自动登录失败或登录失效啦，请重新登录~");
          }
        });
      } else {
        localStorage.removeItem("userprofile");
        localStorage.removeItem("mobiletoken");
        localStorage.removeItem("ykey");
        localStorage.removeItem("skey");
        setprofile(false);
        messageApi.error("自动登录失败或登录失效啦，请重新登录~");
      }
    } else {
      setprofile(false);
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

  const handleGetMySongs = async () => {
    setdisabled(true);
    const mobile = localStorage.getItem("userprofile");
    const emobile = btoa(mobile);
    let { data: GedanS, error } = await supabase
      .from("GedanS")
      .select("*")
      .eq("mobile", emobile);
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
          setdisabled(false);
          setTimeout(() => {
            messageApi.success("您分享的歌曲已经全部添加完成啦~");
          }, 1000);
          setTimeout(() => {
            setcheckisabled(false);
          }, 300000);
        }
      } else {
        setdisabled(false);
        messageApi.error("系统发生错误了哦，快试试重新获取一下吧~");
      }
    }
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
    localStorage.removeItem("ykey");
    localStorage.removeItem("skey");
    setprofile(false);
    setTimeout(() => {
      messageApi.success("退出登录成功~");
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
      <Dialog onClose={onClose} open={open}>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              <span>个人歌单</span>
            </Typography>
            <Button
              onClick={() => {
                setPlayList([]);
                localStorage.removeItem("playList");
              }}
              autoFocus
              color="inherit"
            >
              <span>清空歌单</span>
            </Button>
          </Toolbar>
        </AppBar>
        <Paper elevation={3}>
          <div style={{ margin: "20px" }}>
            {Array.isArray(playList) && playList.length > 0 ? (
              <List>
                {playList.map((song, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={song.title}
                      secondary={song.artist}
                    />
                    <ButtonGroup>
                      <Button
                        onClick={() => handleListenClick(song.songId)}
                        variant="contained"
                        disabled={disabled}
                      >
                        <span>播放</span>
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(index)}
                        variant="contained"
                        disabled={disabled}
                      >
                        <span>删除</span>
                      </Button>
                      <Button
                        onClick={() =>
                          handleInsectSongClick({
                            id: song.songId,
                            name: song.title,
                            artist: song.artist,
                          })
                        }
                        variant="contained"
                        disabled={disabled}
                      >
                        <span>下首播</span>
                      </Button>
                    </ButtonGroup>
                  </ListItem>
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
                  <span>注：个人歌单功能为</span>
                  <ExperimentTwoTone />
                  <span>
                    实验性功能，且需要登录后才能分享歌单。
                    <br />
                    <br />
                    请注意，我们系统会自动保存您在歌单方面的更改。
                    <br />
                    这些数据是保存在您本地设备上的，也就是说，除非您分享了歌单，否则只有您才能看到和听到您的歌单。
                    <br />
                    我们强烈建议您不要尝试自行修改歌单数据。如果您进行任何修改，可能会造成不可预测的系统问题，这可能会影响您歌单的完整性和可用性。
                    <br />
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
                    onClick={() => handleGetMySongs()}
                    variant="contained"
                    disabled={disabled || !profile || checkisabled}
                  >
                    获取我的歌单
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
          </div>
        </Paper>
      </Dialog>
    </>
  );
};
export default PersonalPlaylist;
