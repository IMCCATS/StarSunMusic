"use client";
import * as React from "react";
import { Button, Typography, Container } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";


const HomePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  const classes = useStyles();

  return (
    <Container>
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
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            className={classes.button}
            startIcon={<DashboardIcon />}
            onClick={handleClick}
            style={{
              marginTop: "2px",
              backgroundColor: "#2196f3",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#1976d2",
              },
            }}
          >
            点击进入
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
          <span>开发者：小研同学</span>
          <br />
          <span>运营：内蒙古畅哥计算机科技工作室</span>
          <br />
          <span>本系统仅用作个人音乐欣赏、学习交流，不可用于商业用途。</span>
          <br />
          <span>
            &copy; 2020- {new Date().getFullYear()} 内蒙古畅哥计算机科技工作室
            版权所有.
          </span>
          <br />
          <span>音乐资源来自于网络，其版权归属音乐原版权方所有。</span>
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
