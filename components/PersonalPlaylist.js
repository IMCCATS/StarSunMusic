
import yuxStorage from "@/app/api/yux-storage";
import { ExperimentTwoTone } from "@ant-design/icons";
import {
	Button,
	ButtonGroup,
	Card,
	CardContent,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	ListItemText,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import { Empty, message } from "antd";
import * as React from "react";
import { List, SwipeAction } from "antd-mobile";
import { CurrentSongContext } from "../src/app/dashboard/page";
import {
	HandleListenKugou,
	HandleListenMigu,
	HandleListenSong,
} from "./common/fetchapi";

const PersonalPlaylist = () => {
	const [messageApi, contextHolder] = message.useMessage();
	const [openDialog, setOpenDialog] = React.useState(false);

	const handleClickOpen = () => {
		setOpenDialog(true);
	};

	const handleClose = () => {
		setOpenDialog(false);
	};

	const [uuidtext, setuuid] = React.useState("");
	const [playList, setPlayList] = React.useState([]);
	const [gedanidshow, setgedanidshow] = React.useState(false);
	const [sharedisabled, setsharedisabled] = React.useState(false);
	const [checkisabled, setcheckisabled] = React.useState(false);
	const [gedanidc, setgedanidc] = React.useState("");
	const {
		SetPlayingSongs,
		setCurrentSong,
		setLastPlayedSongIndex,
		setcanlistplay,
		setdisabled,
		disabled,
		handleInsectSongClick,
		profile,
	} = React.useContext(CurrentSongContext);
	const handleListenClick = (songc) => {
		const setSongData = (song) => {
			setCurrentSong(song);
			const mappedSongs = playList.map((songItem) => ({
				...songItem,
				name: songItem.title,
			}));
			SetPlayingSongs(mappedSongs);
			setLastPlayedSongIndex(
				mappedSongs.findIndex((songe) => songe.id === songc.id)
			);
			setcanlistplay(true);
		};

		if (songc.fromst !== "netease") {
			switch (songc.fromst) {
				case "sjk":
					setSongData(songc);
					break;
				case "kugou":
					setdisabled(true);
					HandleListenKugou(songc.id).then((e) => {
						setSongData(e);
						setdisabled(false);
					});
					break;
				case "migu":
					setdisabled(true);
					HandleListenMigu(songc.id).then((e) => {
						setSongData(e);
						setdisabled(false);
					});
					break;
			}
		} else {
			setdisabled(true);
			HandleListenSong(songc.id).then((e) => {
				setSongData(e);
				setdisabled(false);
			});
		}
	};

	// 获取播放列表的函数
	const getPlayList = () => {
		yuxStorage.getItem("playList").then((savedPlayList) => {
			if (savedPlayList) {
				setPlayList(JSON.parse(savedPlayList));
			}
		});
	};

	React.useEffect(() => {
		getPlayList();
	}, []);

	const handlechange = (event) => {
		setuuid(event.target.value);
	};

	const addSongsToLocalPlaylist = (songs) => {
		yuxStorage
			.getItem("playList")
			.then((playlist) => {
				if (playlist) {
					const playList = JSON.parse(playlist);

					// 过滤出不存在于播放列表中的歌曲
					const uniqueSongsToAdd = songs.filter(
						(song) => !playList.find((s) => s.id === song.id)
					);

					if (uniqueSongsToAdd.length > 0) {
						// 将新歌曲添加到播放列表
						playList.push(...uniqueSongsToAdd);
						yuxStorage
							.setItem("playList", JSON.stringify(playList))
							.then(() => {
								messageApi.success(
									`${uniqueSongsToAdd.length}首歌曲添加成功啦~`
								);
							})
							.catch((err) => {
								message.info("添加失败~");
							});
					} else {
						message.info("歌单已包含所有这些歌曲了哦~");
					}
				} else {
					// 如果播放列表为空，则直接将所有歌曲添加进去
					yuxStorage
						.setItem("playList", JSON.stringify(songs))
						.then(() => {
							messageApi.success(`${songs.length}首歌曲添加成功啦~`);
						})
						.catch((err) => {
							message.info("添加失败~");
						});
				}
			})
			.catch((err) => {
				message.info("添加失败~");
			});
	};

	// 删除歌曲的函数
	const handleDeleteClick = (index) => {
		const newPlayList = [...playList];
		newPlayList.splice(index, 1);
		setPlayList(newPlayList);
		yuxStorage.setItem("playList", JSON.stringify(newPlayList));
	};

	return (
		<>
			{contextHolder}
			<Paper elevation={3}>
				<div style={{ margin: "20px" }}>
					{Array.isArray(playList) && playList.length > 0 ? (
						<List>
							{playList.map((song, index) => (
								<SwipeAction
									key={index}
									leftActions={[
										{
											key: "delete",
											text: "删除",
											color: "danger",
											onclick: async () => {
												handleDeleteClick(index);
											},
										},
									]}
									rightActions={[
										{
											key: "insect",
											text: "下首播",
											color: "primary",
											onclick: async () => {
												handleInsectSongClick({
													id: song.id,
													name: song.title,
													artist: song.artist,
												});
											},
										},
										process.env.NODE_ENV === "development" && {
											key: "print",
											text: "打印",
											color: "primary",
											onclick: async () => {
												console.log(song);
											},
										},
									]}
								>
									<List.Item
										onClick={() => {
											handleListenClick(song);
										}}
									>
										<ListItemText
											primary={song.title}
											secondary={song.artist}
										/>
									</List.Item>
								</SwipeAction>
							))}
						</List>
					) : (
						<Empty description="还没有歌曲哦~" />
					)}
					<Card
						style={{
							marginTop: "10px",
						}}
					>
						<CardContent
							style={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Typography
								variant="body2"
								gutterBottom
								style={{ marginTop: "10px" }}
							>
								<span>注：个人歌单功能为</span>
								<ExperimentTwoTone />
								<span>
									实验性功能，且需要登录后才能分享歌单。
									<br />
									<br />
									请注意，我们系统会自动保存您在歌单方面的更改。
									<br />
									这些数据是保存在您本地设备上的，也就是说，除非您分享了歌单，否则只有您才能看到和听到您的歌单。
									<br />
									我们强烈建议您不要尝试自行修改歌单数据。如果您进行任何修改，可能会造成不可预测的系统问题，这可能会影响您歌单的完整性和可用性。
									<br />
									<br />
									当前仅支持部分歌曲加歌单播放，开发者正在全力开发啦~
									<br />
									如果您想分享歌单的话，攒够十首您和您好友喜欢听的歌，就可以分享啦~但是请合理使用哦，有时间限制哒~
								</span>
							</Typography>
							{gedanidshow ? (
								<Typography
									variant="body2"
									gutterBottom
									style={{ marginTop: "10px" }}
								>
									<span>
										分享成功啦~ 您的歌单ID为：
										<br />
										<br />
										{gedanidc}
										<br />
										<br />
										收好它哦！下次打开可能就没有啦~赶快把它分享给好友吧~
									</span>
								</Typography>
							) : (
								<></>
							)}
							<ButtonGroup style={{ marginTop: "10px" }}>
								<Button
									onClick={() => {
										setPlayList([]);
										yuxStorage.removeItem("playList");
									}}
									variant="contained"
									disabled={disabled || playList.length === 0}
								>
									<span>清空歌单</span>
								</Button>
							</ButtonGroup>
						</CardContent>
					</Card>
				</div>
			</Paper>
		</>
	);
};
export default PersonalPlaylist;
