"use client";
import yuxStorage from "@/app/api/yux-storage";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Avatar,
	Button,
	Card,
	CardActions,
	CardContent,
	CircularProgress,
	Link,
	List,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	Pagination,
	Paper,
	TableContainer,
	TextField,
	Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { message } from "antd";
import * as React from "react";
import { CurrentSongContext } from "../src/app/dashboard/page";
import {
	HandleListenSong,
	HandlePlayList,
	HandlePlayListBeiXuan,
} from "./common/fetchapi";

const PlaylistComponent = ({ playlist, index }) => {
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
						<span>{playlist.title}</span>
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
												}, 100000);
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

export default function LikeSongBar() {
	const [playlists, setplaylists] = React.useState([]);
	const AddBar = (Term) => {
		if (!Term || playlists.includes(Term)) {
			return;
		}
		const newBars = [...playlists, Term];
		yuxStorage.setItem("Bars", JSON.stringify(newBars)).then((e) => {
			setplaylists(newBars);
		});
	};

	const AddBars = () => {
		yuxStorage.getItem("Bars").then((e) => {
			if (e) {
				const saved = JSON.parse(e);
				if (saved) {
					setplaylists(saved);
				}
			}
		});
	};

	React.useEffect(() => {
		AddBars();
	}, []);

	const [inputvalue, setinputvalue] = React.useState("");
	const [inputname, setinputname] = React.useState("");
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const [openDelete, setDeleteOpen] = React.useState(false);

	const handleClickDeleteOpen = () => {
		setDeleteOpen(true);
	};

	const handleDeleteClose = () => {
		setDeleteOpen(false);
	};
	const handleAdd = () => {
		if (inputvalue && inputvalue !== "" && inputname !== "") {
			AddBar({ id: inputvalue, title: inputname });
			setinputvalue("");
			setinputname("");
			handleClose();
		}
	};
	const RemoveBar = (index) => {
		if (!playlists[index]) {
			return;
		}
		const newBars = playlists.filter((_, i) => i !== index);
		yuxStorage.setItem("Bars", JSON.stringify(newBars)).then((e) => {
			setplaylists(newBars);
		});
	};

	return (
		<>
			<React.Fragment>
				<Dialog
					open={open}
					onClose={handleClose}
					fullWidth
				>
					<DialogTitle>
						<span>请输入您的云音乐歌单ID与歌单名</span>
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							<span>
								本功能设计初衷：便于用户收听自己喜欢的歌曲，无需繁琐搜索操作。
							</span>
							<br />
							<span>
								云音乐歌单ID获取：打开我喜欢的音乐歌单，点击分享到链接，链接中的"playlist?id="后面的数字就是歌单ID。
							</span>
							<br />
							<span>
								本功能支持平台 & 获取的音乐的版权方 & 特别致谢：
								<Link
									href="https://music.163.com"
									underline="hover"
									aria-label="前往网易云音乐"
									target="blank"
								>
									<span>网易云音乐</span>
								</Link>
							</span>
							<br />
							<span>请大家支持正版！</span>
						</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							id="songid"
							label="歌单ID"
							type="number"
							value={inputvalue}
							onChange={(e) => {
								setinputvalue(e.target.value);
							}}
							fullWidth
							variant="standard"
						/>
						<TextField
							margin="dense"
							id="songname"
							label="歌单名"
							type="text"
							value={inputname}
							onChange={(e) => {
								setinputname(e.target.value);
							}}
							fullWidth
							variant="standard"
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleAdd}>确定添加</Button>
						<Button onClick={handleClose}>取消</Button>
					</DialogActions>
				</Dialog>
			</React.Fragment>
			<React.Fragment>
				<Dialog
					open={openDelete}
					onClose={handleDeleteClose}
					fullWidth
				>
					<DialogTitle>
						<span>请选择您要删除的歌单</span>
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							<span style={{ color: "red" }}>
								删除后将不可恢复，请谨慎操作。
							</span>
							<br />
							<span>
								注：歌单是按照添加顺序排序的，删除会重置排序。例如：在删除歌单2之后，歌单3会重置为歌单2。
							</span>
						</DialogContentText>
						{Array.isArray(playlists) && playlists.length > 0 ? (
							<>
								{playlists.map((playlist, index) => (
									<Button
										onClick={() => {
											RemoveBar(index);
										}}
										style={{ margin: "8px auto" }}
									>
										{playlist.title}
										<br />
										ID:{playlist.id}
									</Button>
								))}
							</>
						) : (
							<span>还没有添加歌单哦~</span>
						)}
					</DialogContent>
					<DialogActions>
						<Button onClick={handleDeleteClose}>取消</Button>
					</DialogActions>
				</Dialog>
			</React.Fragment>
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
						<span>本地歌单列表</span>
					</Typography>
					{/* 使用动态组件渲染每个歌单 */}
					{Array.isArray(playlists) && playlists.length > 0 ? (
						<>
							{playlists.map((playlist, index) => (
								<PlaylistComponent
									key={playlist.id}
									playlist={playlist}
									index={index}
								/>
							))}
						</>
					) : (
						<Typography sx={{ mb: 1.5 }}>
							<span>还没有添加歌单哦~</span>
						</Typography>
					)}
				</CardContent>
				<CardActions>
					<Button
						onClick={() => {
							handleClickOpen();
						}}
					>
						添加歌单
					</Button>
					<Button
						onClick={() => {
							handleClickDeleteOpen();
						}}
					>
						删除歌单
					</Button>
				</CardActions>
			</Card>
		</>
	);
}
