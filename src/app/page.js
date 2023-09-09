"use client";
import * as React from "react";
import {
  Button,
  Typography,
  Container,
  Dialog,
  Paper,
  Slide,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import UserAgreementAndPrivacyPolicy from "../../components/UserAgreementAndPrivacyPolicy";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const HomePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setIsLoading(false);
    setOpen(false);
  };
  const handleClick = () => {
    setIsLoading(true);
    setOpen(false);
    router.push("/dashboard");
  };

  return (
    <Container>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              <span>用户协议与隐私政策</span>
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClick}>
              <span>同意协议并进入</span>
            </Button>
          </Toolbar>
        </AppBar>
        <Paper elevation={3}>
          <div style={{ margin: "20px" }}>
            <UserAgreementAndPrivacyPolicy />
          </div>
        </Paper>
      </Dialog>
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
        <Typography variant="h3" component="h1" gutterBottom>
          <span>星阳音乐系统</span>
        </Typography>
        {isLoading ? (
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
              正在进入系统
            </p>
          </div>
        ) : (
          <Button
            variant="contained"
            startIcon={<DashboardIcon />}
            onClick={handleClickOpen}
            style={{
              marginTop: "2px",
              backgroundColor: "#2196f3",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#1976d2",
              },
            }}
          >
            <span>点击进入</span>
          </Button>
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
          <span>
            免责声明：本网站内容来源于网络，仅提供检索服务。本网站不存储任何内容，也不承担任何责任。如果您需要使用本网站提供的检索服务，您应当自行负责获取相关内容的合法性和准确性。此外，本网站保留随时修改本声明的权利。如果您继续使用本网站，即表示您已经接受了本声明的所有修改。
          </span>
          <br />
          <span>开发者：小研同学</span>
          <br />
          <span>运营：内蒙古畅哥计算机科技工作室</span>
          <br />
          <span>本系统仅用作个人音乐欣赏、学习交流，不可用于商业用途。</span>
          <br />
          <span>
            &copy; 2020 - {new Date().getFullYear()} 内蒙古畅哥计算机科技工作室
            版权所有.
          </span>
          <br />
          <span>应用程序可能响应较慢或无响应，烦请耐心等待，多次尝试~</span>
          <br />
          <span>如有侵权，请联系public@singtech.top删除。</span>
        </div>
      </div>
    </Container>
  );
};

export default HomePage;
