"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { ColorModeContext } from "@/app/dashboard/page";
export default function PrimarySearchAppBar() {
  const { colorMode } = React.useContext(ColorModeContext);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 1 }}
            onClick={colorMode.toggleColorMode}
          >
            <MusicNoteIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            <span>星阳音乐系统</span>
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
