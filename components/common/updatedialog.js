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
    const currentVersion = appversion; // 当前版本号

    // 将版本号字符串分割为主版本号和次版本号
    const localVersionParts = localVersion ? localVersion.split("_") : [0, 0];
    const currentVersionParts = currentVersion.split("_");

    // 分别比较主版本号和次版本号
    if (
      localVersionParts[0] < currentVersionParts[0] ||
      (localVersionParts[0] === currentVersionParts[0] &&
        localVersionParts[1] < currentVersionParts[1])
    ) {
      setOpen(true);
      setNewVersion(currentVersion);
      setUpdateTime(appupdatetime); // 更新时间
      setUpdateContent(appupdatecontent); // 更新内容
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
            <span>我知道啦~</span>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UpdateDialog;
