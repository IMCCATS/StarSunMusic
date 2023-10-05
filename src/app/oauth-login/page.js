"use client";
import * as React from "react";
import {
  Button,
  Typography,
  Container,
  TextField,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import { message } from "antd";

const LoginPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [logined, setlogined] = React.useState(false);
  const CheckScript = () => {
    const state = localStorage.getItem("userprofile");
    if (state) {
      setIsLoading(true);
      setlogined(true);
      setTimeout(() => {
        router.push("/dashboard");
        return null;
      }, 1500);
    } else {
      const script = document.createElement("script");
      script.src = "https://cdn.jijiancode.com/jijian-sdk.min.js";
      script.async = true;
      document.body.appendChild(script);
      // 在组件卸载前移除JS文件
      return () => {
        document.body.removeChild(script);
      };
    }
  };
  React.useEffect(() => {
    CheckScript();
  }, []);
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [username, setusername] = React.useState("");
  const handleUserNameChange = (event) => {
    setusername(event.target.value); // 更新状态为输入框的值
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
    messageApi.error("手机号未输入或格式无效！");
    setIsLoading(false);
  };
  const handleClickOpen = async () => {
    if (checkPhone(username)) {
      setIsLoading(true);
      Jijian.verify({
        appId: "b54246d06f6a68320927641a", //应用appId
        show: "inner", // 包括 inner，dialog两种方式
        option: "barcode", // 当 show='inner' 时，此处传元素的 id；当 show='dialog' 时，此值为 null；
        mobile: username, //用户手机
        success: function (mobileidc, token) {
          setlogined(true);
          localStorage.setItem("userprofile", mobileidc);
          localStorage.setItem("mobiletoken", token);
          setTimeout(function () {
            handleGo();
          }, 1000);
        },
        onshow: function (qrcode) {},
        cancel: function () {
          setIsLoading(false);
        },
        fail: function (msg) {
          setIsLoading(false);
        },
      });
    }
  };

  return (
    <Container>
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
                  <CardContent>
                    <div id="barcode"></div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ) : (
          <div>
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Button
                variant="contained"
                startIcon={<DashboardIcon />}
                onClick={handleClickOpen}
                style={{
                  marginBottom: "10px",
                  backgroundColor: "#2196f3",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#1976d2",
                  },
                }}
              >
                <span>点击登录</span>
              </Button>
            </Box>
            <div>
              <Box style={{ marginTop: "10px" }}>
                <TextField
                  id="outlined-basic"
                  label="手机号"
                  variant="outlined"
                  required
                  value={username}
                  onChange={handleUserNameChange}
                  style={{ marginRight: "5px" }}
                />
              </Box>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  marginTop: "10px",
                }}
              ></Box>
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
