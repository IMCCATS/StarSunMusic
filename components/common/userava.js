import * as React from "react";
import { AccountCircle } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { CurrentSongContext } from "@/app/dashboard/page";
import yuxStorage from "@/app/api/yux-storage";
import { message } from "antd";
import { useRouter } from "next/navigation";
import LogoutIcon from "@mui/icons-material/Logout";
const crypto = require("crypto");

export default function UserAva() {
  const router = useRouter();
  const {
    setdisabled,
    profile,
    setprofile,
  } = React.useContext(CurrentSongContext);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [user, setuser] = React.useState("");

  const handleQuitLogin = () => {
    handleCloseC();
    setdisabled(true);
    yuxStorage.removeItem("userprofile").then(() => {
      yuxStorage.removeItem("mobiletoken").then(() => {
        yuxStorage.removeItem("ykey").then(() => {
          yuxStorage.removeItem("skey").then(() => {
            setprofile(false);
            setTimeout(() => {
              messageApi.success("退出登录成功~");
              setdisabled(false);
            }, 1000);
          });
        });
      });
    });
  };

  React.useEffect(() => {
    yuxStorage.getItem("userprofile").then((a) => {
      setuser("当前登录用户：" + a);
    });
    const b = yuxStorage.getItem("mobiletoken");
    const c = yuxStorage.getItem("userprofile");
    const d = yuxStorage.getItem("ykey");
    const e = yuxStorage.getItem("skey");

    async function sha256(input) {
      return crypto.createHash("sha256").update(input).digest("hex");
    }

    Promise.all([b, c, d, e])
      .then(async ([bb, cc, dd, ee]) => {
        if (c) {
          const text = ee + cc + bb + ee;
          if (text) {
            const ecode = await sha256(text);
            if (ecode === dd) {
              setprofile(true);
            } else {
              // console.error([bb, cc, dd, ee, text, ecode]);
              // setprofile(false);
              // messageApi.error("自动登录失败或登录失效啦，请重新登录~");
              yuxStorage.removeItem("userprofile").then(() => {
                yuxStorage.removeItem("mobiletoken").then(() => {
                  yuxStorage.removeItem("ykey").then(() => {
                    yuxStorage.removeItem("skey").then(() => {
                      setprofile(false);
                      messageApi.error("自动登录失败或登录失效啦，请重新登录~");
                    });
                  });
                });
              });
            }
          } else {
            setprofile(false);
          }
        } else {
          messageApi.error("技术问题出现啦，快联系开发者修复~");
          setprofile(false);
        }
      })
      .catch((error) => {
        setprofile(false);
        messageApi.error("技术问题出现啦，快联系开发者修复~");
        if (process.env.NODE_ENV === "development") {
          messageApi.error("Error fetching app data:", error);
          console.error("Error fetching app data:", error);
        }
      });
  }, []);

  const handleLogin = () => {
    handleCloseC();
    yuxStorage
      .getItem("userprofile")
      .then((profile) => {
        if (!profile) {
          setdisabled(true);
          router.push("/oauth-login");
        } else {
          messageApi.info("您已经登录了哦~");
        }
      })
      .catch((err) => {
        setdisabled(true);
        router.push("/oauth-login");
      });
  };

  React.useEffect(() => {
    if (profile) {
      yuxStorage.getItem("userprofile").then((e) => {
        const fullPhone = e; // 假设 e.phone 包含完整的手机号
        const lastFourDigits = fullPhone.slice(-4); // 获取手机号后四位
        setuser(`用户${lastFourDigits}`); // 组合成 "用户" + 手机号后四位
      });
    }
  }, [profile]);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseC = () => {
    setAnchorEl(null);
  };
  return (
    <>
      {contextHolder}
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleCloseC}
      >
        {profile ? (
          <>
            <MenuItem>
              <AccountCircle />
              {user}
            </MenuItem>
            <MenuItem onClick={handleQuitLogin}>
              <LogoutIcon />
              退出登录
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={handleLogin}>
              <AccountCircle />
              未登录·点击登录
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
}
