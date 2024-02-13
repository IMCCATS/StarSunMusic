"use client";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import UserAva from "./userava";

export default function PrimarySearchAppBar() {
	return (
		<>
			<Box sx={{ flexGrow: 1, mb: "10px" }}>
				<AppBar position="static">
					<Toolbar>
						<IconButton
							size="large"
							edge="start"
							color="inherit"
							aria-label="open drawer"
							sx={{ mr: 1 }}
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
