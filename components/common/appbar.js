"use client";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Flex, Card } from "antd";
import { Avatar } from "@mui/material";

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
					</Toolbar>
				</AppBar>
			</Box>
			<Card>
				<Flex
					align="center"
					gap={"large"}
				>
					<Card.Meta
						style={{ whiteSpace: "pre-wrap" }}
						avatar={<Avatar />}
						title={"用户"}
						description={`知之者不如好之者，好之者不如乐之者。`}
					/>
				</Flex>
			</Card>
		</>
	);
}
