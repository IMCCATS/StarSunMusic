"use client";
import DashboardIcon from "@mui/icons-material/Dashboard";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { Flex, message } from "antd";
import { useRouter } from "next/navigation";
import Script from "next/script";
import * as React from "react";
import { CodeLogin, GetRegCode } from "../../../components/common/fetchapi";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { addAppData, getAppData } from "../../../components/common/db";
const crypto = require("crypto");

const LoginPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [logined, setlogined] = React.useState(false);
  const CheckScript = () => {
    getAppData("userprofile").then((state) => {
      if (state) {
        setIsLoading(true);
        setlogined(true);
        setTimeout(() => {
          router.push("/dashboard");
          return null;
        }, 1500);
      }
    });
  };
  React.useEffect(() => {
    CheckScript();
  }, []);
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [username, setusername] = React.useState("");
  const [pass, setpass] = React.useState("");
  const handleUserNameChange = (event) => {
    setusername(event.target.value); // 更新状态为输入框的值
  };
  const handlePassChange = (event) => {
    setpass(event.target.value); // 更新状态为输入框的值
  };
  const handleGo = () => {
    router.push("/dashboard");
  };
  const checkPhone = (value) => {
    var mobile = value;
    var tel = /^0\d{2,3}-?\d{7,8}$/;
    var phone = /^1[3456789]\d{9}$/;
    if (mobile.length == 11) {
      //手机号码
      if (phone.test(mobile)) {
        return true;
      }
    } else if (mobile.length == 13 && mobile.indexOf("-") != -1) {
      //电话号码
      if (tel.test(mobile)) {
        return true;
      }
    }
    messageApi.error("信息未输入或有误，请检查后重试");
    setIsLoading(false);
  };

  const Suc = (mobileidc, token) => {
    function generateRandomString() {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < 6; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }
    setlogined(true);
    try {
      addAppData("userprofile", mobileidc).then(() => {
        addAppData("mobiletoken", token).then(() => {
          const skey = generateRandomString();
          addAppData("skey", skey).then(() => {
            async function sha256(input) {
              return crypto.createHash("sha256").update(input).digest("hex");
            }
            const text = skey + mobileidc + token + skey;
            sha256(text).then((ykey) => {
              addAppData("ykey", ykey).then(() => {
                setTimeout(function () {
                  handleGo();
                }, 1000);
              });
            });
          });
        });
      });
    } catch (error) {
      messageApi.error("登录失败，快联系开发者修复吧~");
      setIsLoading(false);
    }
  };

  const handleClickOpen = async () => {
    initGeetest4(
      {
        captchaId: "c1677059124b92b9dfb3c8919755b459",
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
            if (checkPhone(username)) {
              setIsLoading(true);
              CodeLogin(username, pass)
                .then((e) => {
                  Suc(e.mobile, e.tk);
                })
                .catch((e) => {
                  messageApi.error(e);
                  setIsLoading(false);
                });
            }
          });
      }
    );
  };

  const [disabledc, setdisabledc] = React.useState(false);

  const handleClickGetCode = async () => {
    if (checkPhone(username)) {
      initGeetest4(
        {
          captchaId: "c1677059124b92b9dfb3c8919755b459",
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
              GetRegCode(username)
                .then((e) => {
                  setdisabledc(true);
                  setTimeout(() => {
                    setdisabledc(false);
                  }, 60000);
                  messageApi.success("验证码发送成功，请注意查收");
                })
                .catch((e) => {
                  messageApi.error("发送失败，可能是间隔时间太短");
                });
            });
        }
      );
    }
  };

  return (
    <Container>
      <Script src="https://static.geetest.com/v4/gt4.js" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Noto+Sans+SC:100,300,400,500,700,900"
      />
      {contextHolder}
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <img
          src="/logo.png"
          alt="Logo"
          style={{ marginBottom: "2px", width: "220px", height: "220px" }}
        />
        <Typography variant="h4" component="h4" gutterBottom>
          <span>登录·星阳音乐系统</span>
        </Typography>
        <div id="captcha" />
        {isLoading ? (
          <div>
            {logined ? (
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
                  正在登录
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Card>
                  <CardContent>正在登录中...</CardContent>
                </Card>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div>
              <Box style={{ marginTop: "10px" }}>
                <Flex vertical="vertical" gap="middle">
                  <Flex gap="middle">
                    <TextField
                      id="outlined-basic"
                      label="手机号"
                      variant="outlined"
                      required
                      value={username}
                      onChange={handleUserNameChange}
                      style={{ marginRight: "5px" }}
                    />
                    <Button
                      variant="contained"
                      startIcon={<DashboardIcon />}
                      onClick={handleClickGetCode}
                      disabled={disabledc}
                    >
                      <span>获取验证码</span>
                    </Button>
                  </Flex>
                  <Flex gap="middle">
                    <TextField
                      id="outlined-basic"
                      label="验证码"
                      variant="outlined"
                      required
                      value={pass}
                      onChange={handlePassChange}
                      style={{ marginRight: "5px" }}
                    />
                    <Button
                      variant="contained"
                      startIcon={<KeyboardDoubleArrowRightIcon />}
                      onClick={handleClickOpen}
                    >
                      <span>去登录账号</span>
                    </Button>
                  </Flex>
                </Flex>
              </Box>
            </div>
          </div>
        )}
        <div
          style={{
            marginTop: "40px",
            marginBottom: "80px",
            fontSize: "14px",
            color: "#888",
            textAlign: "center",
          }}
        >
          <span>开发者：小研同学</span>
          <br />
          <span>
            &copy; 2020 - {new Date().getFullYear()} 内蒙古畅哥计算机科技工作室
            版权所有.
          </span>
          <br />
          <span>应用程序可能响应较慢或无响应，烦请耐心等待，多次尝试~</span>
        </div>
      </div>
    </Container>
  );
};

export default LoginPage;
