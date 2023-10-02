import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import {
  appupdatetime,
  appupdatecontent,
  appversion,
} from "@/app/api/appconfig";

const UpdateDialog = () => {
  const [open, setOpen] = useState(false);
  const [newVersion, setNewVersion] = useState("");
  const [updateTime, setUpdateTime] = useState("");
  const [updateContent, setUpdateContent] = useState("");

  // 获取本地存储的版本信息
  const getLocalVersion = () => {
    const storedVersion = localStorage.getItem("version");
    return storedVersion ? JSON.parse(storedVersion) : null;
  };

  // 检查版本信息并显示更新提示
  useEffect(() => {
    const localVersion = getLocalVersion();
    const currentVersion = appversion; // 这里替换为你的当前版本号
    if (!localVersion || localVersion < currentVersion) {
      setOpen(true);
      setNewVersion(currentVersion);
      setUpdateTime(appupdatetime); // 这里替换为你的更新时间
      setUpdateContent(appupdatecontent); // 这里替换为你的更新内容
    }
  }, []);

  // 将新版本保存到本地存储
  const handleClose = () => {
    localStorage.setItem("version", JSON.stringify(newVersion));
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <h2>🌟新版本更新啦🎇~</h2>
          <p>⭐新版本：{newVersion}</p>
          <p>⭐更新时间：{updateTime}</p>
          <p>⭐更新内容：{updateContent}</p>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            我知道啦~
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UpdateDialog;
