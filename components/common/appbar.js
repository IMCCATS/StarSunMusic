"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import yuxStorage from "@/app/api/yux-storage";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { ColorModeContext } from "@/app/dashboard/page";
import { ExperimentTwoTone } from "@ant-design/icons";
import { Link } from "@mui/material";
import UserAva from "./userava";

export default function PrimarySearchAppBar() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const CheckStatus = () => {
    yuxStorage
      .getItem("DarkModeChecked")
      .then((status) => {
        if (status !== "yes") {
          yuxStorage.setItem("DarkModeChecked", "yes");
          handleClickOpen();
        }
      })
      .catch((e) => {
        yuxStorage.setItem("DarkModeChecked", "yes");
        handleClickOpen();
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { colorMode } = React.useContext(ColorModeContext);

  return (
    <>
      <React.Fragment>
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle>
            <span>发现了一个</span>
            <ExperimentTwoTone />
            <span>实验性功能！</span>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <span>哇，恭喜你发现了一个实验性功能：深色模式！</span>
              <br />
              <span>
                这个功能可能存在着一定的问题或者Bug，导致程序出现异常，如果小主发现了异常，请告诉开发者哦~
                反馈平台：
              </span>
            </DialogContentText>
            <Link
              href="https://support.qq.com/product/615590"
              underline="hover"
              aria-label="点击前往反馈平台"
              target="blank"
            >
              <span>星阳音乐系统-反馈与建议平台</span>
            </Link>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>好哒~</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
      <Box sx={{ flexGrow: 1, mb: "10px" }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 1 }}
              onClick={() => {
                colorMode.toggleColorMode();
                CheckStatus();
              }}
            >
              <MusicNoteIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              <span>星阳音乐系统</span>
            </Typography>
            <UserAva />
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}
