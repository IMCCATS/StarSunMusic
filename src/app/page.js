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
      router.push("/dashboard");
  };

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
