import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import {
  appupdatetime,
  appupdatecontent,
  appversion,
} from "@/app/api/appconfig";
import { addAppData, getAppData } from "./db";
import { message } from "antd";

const UpdateDialog = () => {
  const [open, setOpen] = useState(false);
  const [newVersion, setNewVersion] = useState("");
  const [updateTime, setUpdateTime] = useState("");
  const [updateContent, setUpdateContent] = useState("");

  // 获取本地存储的版本信息
  const getLocalVersion = () => {
    return new Promise((resolve, reject) => {
      getAppData("version")
        .then((storedVersion) => {
          const Json = JSON.parse(storedVersion);
          resolve(Json);
        })
        .catch((err) => {
          reject(null);
        });
    });
  };

  // 检查版本信息并显示更新提示
  useEffect(() => {
    getLocalVersion()
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
      .catch((e) => {});
  }, []);

  // 将新版本保存到本地存储
  const handleClose = () => {
    addAppData("version", JSON.stringify(newVersion))
      .then((e) => {
        setOpen(false);
      })
      .catch((e) => {
        message.info("保存数据失败，可能下次打开时仍会提示新版本。");
      });
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
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
