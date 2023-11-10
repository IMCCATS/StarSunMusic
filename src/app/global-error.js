"use client";
import { Button } from "@mui/material";
import { Result } from "antd";
import "./main.css";
export default function Error({ error, reset }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Noto+Sans+SC:100,300,400,500,700,900"
      />
      <link rel="icon" href="./favicon.ico" />
      <Result
        status="404"
        title="发生了一些错误"
        subTitle="抱歉小主，星阳音乐系统发生了一些错误，请点击按钮重试~"
        extra={
          <Button variant="contained" onClick={() => reset()}>
            <span>重试</span>
          </Button>
        }
      />
    </div>
  );
}
