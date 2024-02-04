"use client";
import * as React from "react";
import yuxStorage from "@/app/api/yux-storage";
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
  Tooltip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import UserAgreementAndPrivacyPolicy from "../../components/common/UserAgreementAndPrivacyPolicy";
import { useRouter } from "next/navigation";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const HomePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [state, setstate] = React.useState(false);

  React.useEffect(() => {
    setstate(true);
    setTimeout(() => {
      handleClickOpen();
    }, 5000);
  }, []);

  const handleClickOpen = () => {
    yuxStorage
      .getItem("isAgreedPolicy")
      .then((state) => {
        if (state !== "1") {
          setOpen(true);
        } else if (state === "1") {
          handleClickPolicyed();
        }
      })
      .catch((err) => {
        setOpen(true);
      });
  };

  const handleClose = () => {
    setIsLoading(false);
    setOpen(false);
  };

  const handleClick = () => {
    yuxStorage.setItem("isAgreedPolicy", "1").then((e) => {
      setIsLoading(true);
      setOpen(false);
      router.push("/dashboard");
    });
  };

  const handleClickPolicyed = () => {
    setIsLoading(true);
    router.push("/dashboard");
  };

  return (
    <Container>
      <link rel="icon" href="./favicon.ico" />
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <Typography sx={{ ml: 2, flex: 1 }} variant="h2" component="div">
          <span>用户协议与隐私政策</span>
        </Typography>
        <Paper elevation={3}>
          <div style={{ margin: "20px" }}>
            <UserAgreementAndPrivacyPolicy />
          </div>
          <Button autoFocus color="inherit" onClick={handleClick}>
            <span>关闭</span>
          </Button>
          <Button autoFocus color="inherit" onClick={handleClick}>
            <span>同意协议并进入</span>
          </Button>
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
        <div
          style={{
            position: "relative", // 设置父容器为相对定位
            height: "100vh",
          }}
        >
          <img
            src="/StarSunMusic_MainGotoPic.png"
            alt="Logo"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "cover",
            }}
          />

          <div
            style={{
              position: "absolute", // 加载组件设为绝对定位
              top: "50%", // 水平居中
              left: "50%",
              transform: "translate(-50%, -50%)", // 使用CSS变换实现精确居中
              zIndex: 1, // 设置加载组件的层级较高，使其覆盖在图片之上
            }}
          >
            <CircularProgress />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default HomePage;
