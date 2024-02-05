"use client";
import {
	Avatar,
	Button,
	Card,
	CardContent,
	CircularProgress,
	List,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	Pagination,
	Paper,
	TableContainer,
	Typography,
} from "@mui/material";
import * as React from "react";
import { CurrentSongContext } from "../src/app/dashboard/page";
import {
	HandleListenSong,
	HandlePlayList,
	HandlePlayListBeiXuan,
} from "./common/fetchapi";
export default function TopBar() {
	const {
		SetPlayingSongs,
		setCurrentSong,
		setLastPlayedSongIndex,
		setcanlistplay,
		setdisabled,
		handleInsectSongClick,
	} = React.useContext(CurrentSongContext);
	const [isLoading, setIsLoading] = React.useState(true);
	const [songs, setSongs] = React.useState([]);
	const [currentPage, setCurrentPage] = React.useState(1);
	const itemsPerPage = 10;
	React.useEffect(() => {
		fetchMusicList();
	}, []);

	const fetchMusicList = () => {
		HandlePlayList("3778678")
			.then((e) => {
				setSongs(e);
				setIsLoading(false);
			})
			.catch((error) => {
				setSongs([]);
				fetchMusicListBeiXuan();
			});
	};

	const fetchMusicListBeiXuan = () => {
		setIsLoading(true);
		HandlePlayListBeiXuan("3778678")
			.then((e) => {
				setSongs(e);
				setIsLoading(false);
			})
			.catch((error) => {
				setIsLoading(false);
			});
	};

	const handleListenClick = (id) => {
		setdisabled(true);
		HandleListenSong(id)
			.then((e) => {
				setCurrentSong(e);
				SetPlayingSongs(songs);
				setLastPlayedSongIndex(songs.findIndex((song) => song.id === id));
				setcanlistplay(true);
				setdisabled(false);
			})
			.catch((error) => {
				setdisabled(false);
			});
	};

	const lastIndex = currentPage * itemsPerPage;
	const firstIndex = lastIndex - itemsPerPage;
	const currentSongs = songs.slice(firstIndex, lastIndex);
	const numPages = Math.ceil(songs.length / itemsPerPage);

	const handlePaginationChange = (event, value) => {
		setCurrentPage(value);
	};

	return (
		<>
			<Card
				sx={{ minWidth: 275 }}
				style={{ marginTop: "15px" }}
			>
				<CardContent>
					<Typography
						sx={{ fontSize: 14 }}
						color="text.secondary"
						gutterBottom
					>
						<span>热歌榜</span>
					</Typography>
					{process.env.NODE_ENV === "development" && (
						<Button
							onClick={() => {
								currentSongs.forEach((url, index) => {
									// 创建一个新的 iframe 元素
									let iframe = document.createElement("iframe");

									// 将 iframe 的 'src' 属性设置为文件的 URL
									iframe.src = url.url;

									// 设置 iframe 的 'id' 以便稍后移除
									iframe.id = "download_iframe_" + index;

									// 将 iframe 设置为隐藏
									iframe.style.display = "none";

									// 将 iframe 添加到页面中
									document.body.appendChild(iframe);
								});

								// 一段时间后移除这些 iframe
								setTimeout(() => {
									currentSongs.forEach((url, index) => {
										let iframe = document.getElementById(
											"download_iframe_" + index
										);
										document.body.removeChild(iframe);
									});
								}, 5000);
							}}
						>
							<span>创建一键下载任务（当前分页）</span>
						</Button>
					)}
					<Paper>
						<TableContainer>
							{isLoading ? (
								<div
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										height: "200px",
									}}
								>
									<CircularProgress />
									<p style={{ marginLeft: "10px" }}>加载中...</p>
								</div>
							) : songs.length === 0 ? (
								<div style={{ textAlign: "center", padding: "20px" }}>
									<span>暂无数据</span>
								</div>
							) : (
								<div>
									<List>
										{currentSongs.map((song, index) => (
											<ListItem key={index}>
												<ListItemAvatar
													onClick={() => {
														handleInsectSongClick({
															id: song.id,
															name: song.name,
															artist: song.artist,
														});
													}}
												>
													<Avatar src={song.cover} />
												</ListItemAvatar>
												<ListItemButton
													onClick={() => {
														handleListenClick(song.id);
													}}
												>
													<ListItemText
														primary={song.name}
														secondary={
															<React.Fragment>
																<Typography
																	sx={{ display: "inline" }}
																	component="span"
																	variant="body2"
																	color="text.primary"
																>
																	{song.artist}
																</Typography>
																{` — 排名${
																	firstIndex + index + 1
																}`}
																{process.env.NODE_ENV ===
																	"development" &&
																	` — 歌曲ID：${song.id}`}
															</React.Fragment>
														}
													/>
												</ListItemButton>
											</ListItem>
										))}
									</List>
								</div>
							)}
						</TableContainer>
					</Paper>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							marginTop: "20px",
						}}
					>
						<Pagination
							count={numPages}
							page={currentPage}
							onChange={handlePaginationChange}
							shape="rounded"
							color="primary"
						/>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
