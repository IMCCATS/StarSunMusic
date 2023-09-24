"use client";
import { Button } from "@mui/material";
import { Result } from "antd";
import { useRouter } from "next/navigation";
const App = () => {
  const router = useRouter();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Result
        status="404"
        title="404 未找到资源"
        subTitle="抱歉小主，星阳音乐系统没有找到你想要的资源哦~"
        extra={
          <Button
            variant="contained"
            onClick={() => {
              router.push("/");
            }}
          >
            <span>返回首页</span>
          </Button>
        }
      />
    </div>
  );
};
export default App;
