import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import {
  appupdatetime,
  appupdatecontent,
  appversion,
} from "@/app/api/appconfig";
import yuxStorage from "@/app/api/yux-storage";

const UpdateDialog = () => {
  const [open, setOpen] = useState(false);
  const [newVersion, setNewVersion] = useState("");
  const [updateTime, setUpdateTime] = useState("");
  const [updateContent, setUpdateContent] = useState("");

  // 检查版本信息并显示更新提示
  useEffect(() => {
    yuxStorage
      .getItem("version")
      .then((localVersion) => {
        const currentVersion = appversion; // 当前版本号

        // 将版本号字符串分割为主版本号和次版本号
        const localVersionParts = localVersion
          ? localVersion.split("_")
          : [0, 0];
        const currentVersionParts = currentVersion.split("_");

        // 分别比较主版本号和次版本号
        if (localVersion) {
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
        } else {
          setOpen(true);
          setNewVersion(currentVersion);
          setUpdateTime(appupdatetime); // 更新时间
          setUpdateContent(appupdatecontent); // 更新内容
        }
      })
      .catch((err) => {
        console.error("本地版本号读取失败");
      });
  }, []);

  // 将新版本保存到本地存储
  const handleClose = () => {
    yuxStorage.setItem("version", newVersion).then((e) => {
      setOpen(false);
    });
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogContent style={{ whiteSpace: "pre-wrap" }}>
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
