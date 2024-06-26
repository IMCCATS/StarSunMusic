"use client";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
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
import { message } from "antd";
import * as React from "react";
import { CurrentSongContext } from "../src/app/dashboard/page";
import {
	HandleListenSong,
	HandlePlayList,
	HandlePlayListBeiXuan,
} from "./common/fetchapi";
const playlists = [
	{ name: "高考必背古诗文72篇", id: "2295399719" },
	{ name: "高考必背篇目", id: "7564558989" },
	{ name: "初中必背古诗词", id: "2112252573" },
	{ name: "短视频各样卡点/热血音乐-燃到极致！", id: "5335051744" },
	{ name: "纯爱硬曲 高燃漫剪BGM", id: "8550146295" },
	{ name: "精神乌托邦 | 电音如烟花般绽放希望与美好", id: "8400492541" },
	{ name: "电子·中国风 I 感受角徵宫商的荡气回肠", id: "316223640" },
	{ name: "【流行伤感】还是会有遗憾对吧", id: "8187890892" },
	{ name: "身法大佬素材曲", id: "3192057802" },
	{ name: "超燃战歌", id: "6791698520" },
	{ name: "那些你熟悉却又不知道名字的轻音乐", id: "26467411" },
	{ name: "治愈轻音｜宁静致远 安抚心绪 净化心灵", id: "8846341333" },
];

const PlaylistComponent = ({ playlist }) => {
	const [messageApi, contextHolder] = message.useMessage();
	const {
		SetPlayingSongs,
		setCurrentSong,
		setLastPlayedSongIndex,
		setcanlistplay,
		setdisabled,
		disabled,
		handleInsectSongClick,
	} = React.useContext(CurrentSongContext);
	const [isLoading, setIsLoading] = React.useState(false);
	const [songs, setSongs] = React.useState([]);
	const [currentPage, setCurrentPage] = React.useState(1);
	const itemsPerPage = 10;
	const [jy, setjy] = React.useState(false);
	const jzsj = () => {
		setIsLoading(true);
		setjy(true);
		setTimeout(() => {
			fetchMusicList();
		}, 1000);
	};

	const fetchMusicList = () => {
		const playlistId = playlist.id;
		HandlePlayList(playlistId)
			.then((e) => {
				setSongs(e);
				setIsLoading(false);
			})
			.catch((error) => {
				setSongs([]);
				fetchMusicListBeiXuan(playlistId);
			});
	};

	const fetchMusicListBeiXuan = (playlistId) => {
		HandlePlayListBeiXuan(playlistId)
			.then((e) => {
				setSongs(e);
				setIsLoading(false);
			})
			.catch((error) => {
				setSongs([]);
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
			{contextHolder}
			<Accordion key={playlist.id}>
				<AccordionSummary>
					<Typography>
						<span>{playlist.name}</span>
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Button
						onClick={jzsj}
						disabled={jy}
						variant="contained"
						style={{ marginBottom: "10px" }}
					>
						加载数据
					</Button>
					<Paper>
						<TableContainer>
							{/* 此处是动态渲染的具体表单内容 */}
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
									<span>
										暂无数据哦~若您没有点击加载数据按钮的话，点击一下加载数据按钮~
									</span>
								</div>
							) : (
								<>
									{process.env.NODE_ENV === "development" && (
										<Button
											onClick={() => {
												currentSongs.forEach((url, index) => {
													// 创建一个新的 iframe 元素
													let iframe =
														document.createElement("iframe");

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
									<List>
										{currentSongs.map((song, index) => (
											<ListItem>
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
								</>
							)}
						</TableContainer>
					</Paper>
					{/* 此处是动态渲染的其他部分 */}
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
				</AccordionDetails>
			</Accordion>
		</>
	);
};

export default function TopBar() {
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
						<span>歌单列表</span>
					</Typography>
					{/* 使用动态组件渲染每个歌单 */}
					{playlists.map((playlist) => (
						<PlaylistComponent
							key={playlist.id}
							playlist={playlist}
						/>
					))}
				</CardContent>
			</Card>
		</>
	);
}
