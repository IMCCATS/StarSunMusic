"use client";
import AppBar from "../../../components/common/appbar";
import Advertisement from "../../../components/common/advertisement";
import About from "../../../components/common/about";
import SongSearchTable from "../../../components/SongSearchTable";
import MusicCard from "../../../components/MusicCard";
import * as React from "react";
import TopBar from "../../../components/TopBar";
import TopBarBS from "../../../components/TopBarBS";
import SongBar from "../../../components/SongBar";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import JuanZeng from "../../../components/common/juanzeng";
import ScrollToTopFab from "../../../components/common/ScrollToTopFab";
import PersonalPlaylist from "../../../components/PersonalPlaylist";
import UpdateDialog from "../../../components/common/updatedialog";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import LikeSongBar from "../../../components/LikeSongsBar";
import { ConfigProvider, Flex, message } from "antd";
import { SafeArea, TabBar, Swiper, Image, Skeleton } from "antd-mobile";
import { UnorderedListOutline, UserOutline } from "antd-mobile-icons";
import { GetAppData } from "../../../components/common/fetchapi";
import {
	Backdrop,
	Button,
	Card,
	CardContent,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import SongList from "../../../components/Songlist";
import zhCN from "antd/locale/zh_CN";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import yuxStorage from "@/app/api/yux-storage";
import ListIcon from "@mui/icons-material/List";
import SearchIcon from "@mui/icons-material/Search";
import {
	AudiotrackOutlined,
	DeveloperBoard,
	Settings,
	QueueMusicOutlined,
} from "@mui/icons-material";
import SystemSettings from "../../../components/Settings/Settings";
import Banner from "../../../components/common/Banner";

const Alert = React.forwardRef(function Alert(props, ref) {
	return (
		<MuiAlert
			elevation={6}
			ref={ref}
			variant="filled"
			{...props}
		/>
	);
});
export const CurrentSongContext = React.createContext(null);

function StarSunMusic() {
	const router = useRouter();
	const [lastPlayedSongIndex, setLastPlayedSongIndex] = React.useState(0);
	const [currentSong, setCurrentSong] = React.useState(null);
	const [playingpage, setplayingpage] = React.useState("");
	const [canlistplay, setcanlistplay] = React.useState(false);
	const [PlayingSongs, SetPlayingSongs] = React.useState([]);
	const [open, setOpen] = React.useState(false);
	const [profile, setprofile] = React.useState(false);
	const [playstatus, Setplaystatus] = React.useState("");

	const handleClick = () => {
		setOpen(true);
	};
	const CheckPolicy = () => {
		yuxStorage
			.getItem("isAgreedPolicy")
			.then((state) => {
				if (state !== "1") {
					handleClick();
					setTimeout(() => {
						router.push("/");
					}, 5000);
				} else {
					GetAppData();
				}
			})
			.catch((e) => {
				handleClick();
				setTimeout(() => {
					router.push("/");
				}, 5000);
			});
	};

	React.useEffect(() => {
		CheckPolicy();
		let hm = document.createElement("script");
		hm.src = "https://hm.baidu.com/hm.js?68cb9d0aa571714fd6cb36083949f31e";
		let s = document.getElementsByTagName("script")[0];
		s.parentNode.insertBefore(hm, s);
		setloadc(true);
	}, []);

	const [messageApi, contextHolder] = message.useMessage();

	const handleInsectSongClick = (newSong) => {
		const index = lastPlayedSongIndex + 1;
		SetPlayingSongs((prevSongs) => {
			const a = [...prevSongs];
			a.splice(index, 0, newSong);
			return a;
		});
		messageApi.success("已经添加到下首播~");
	};

	const [disabled, setdisabled] = React.useState(false);
	const [fingerprintidc, setfingerprintidc] = React.useState("");

	React.useEffect(() => {
		FingerprintJS.load().then((fp) => {
			fp.get().then((result) => {
				const visitorId = result.visitorId;
				setfingerprintidc(visitorId);
				yuxStorage.setItem("fingerprintidc", visitorId);
			});
		});
	}, []);

	const [CurrentComponent, SetCurrentComponent] = React.useState(null);
	const [CurrentCptName, SetCurrentCptName] = React.useState("");
	const [Clickopen, SetClickopen] = React.useState(false);
	const handleopen = (name, component) => {
		SetClickopen(false);
		SetCurrentComponent(component);
		SetCurrentCptName(name);
		SetClickopen(true);
	};

	const tabs = [
		{
			key: "1",
			title: "首页",
			icon: <AudiotrackOutlined />,
		},
		{
			key: "2",
			title: "排行",
			icon: <UnorderedListOutline />,
		},
		{
			key: "3",
			title: "歌单",
			icon: <QueueMusicOutlined />,
		},
		{
			key: "4",
			title: "我的",
			icon: <UserOutline />,
		},
	];

	const pics = ["/bannerpic/pic1.png"];

	const items = pics.map((pic, index) => (
		<Swiper.Item key={index}>
			<div>
				<Image
					src={pic}
					fit="fill"
				/>
			</div>
		</Swiper.Item>
	));

	const [seeing, setseeing] = React.useState("1");
	const [loadc, setloadc] = React.useState(false);

	return (
		<>
			{loadc ? (
				<main
					style={{
						WebkitUserSelect: "none",
						MozUserSelect: "none",
						msUserSelect: "none",
						userSelect: "none",
					}}
				>
					<div>
						<SafeArea position="top" />
					</div>
					{contextHolder}
					<Backdrop
						sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
						open={disabled}
					>
						<CircularProgress color="inherit" />
						<span style={{ marginLeft: "15px" }}>正在加载</span>
					</Backdrop>
					<meta
						httpEquiv="Content-Security-Policy"
						content="upgrade-insecure-requests"
					/>
					<link
						rel="icon"
						href="./favicon.ico"
					/>
					<meta
						name="viewport"
						content="initial-scale=1, width=device-width"
					/>
					<Snackbar open={open}>
						<Alert
							severity="warning"
							sx={{ width: "100%" }}
						>
							<span>您还没有同意用户协议与隐私政策，5秒后将自动跳转首页！</span>
						</Alert>
					</Snackbar>
					<CurrentSongContext.Provider
						value={{
							setCurrentSong,
							setcanlistplay,
							playingpage,
							setplayingpage,
							PlayingSongs,
							SetPlayingSongs,
							lastPlayedSongIndex,
							setLastPlayedSongIndex,
							handleInsectSongClick,
							disabled,
							setdisabled,
							profile,
							setprofile,
							playstatus,
							Setplaystatus,
						}}
					>
						<div style={{ display: seeing === "1" ? "block" : "none" }}>
							<Swiper
								loop
								autoplay
							>
								{items}
							</Swiper>
							<Banner />
							<Advertisement />
							<UpdateDialog />
							<Dialog
								style={{ zIndex: 998 }}
								fullWidth
								maxWidth={"95vw"}
								open={Clickopen}
								onClose={() => {
									SetClickopen(false);
								}}
								scroll={"paper"}
							>
								<DialogTitle>{CurrentCptName}</DialogTitle>
								<DialogContent dividers={true}>
									{CurrentComponent}
								</DialogContent>
								<DialogActions>
									<Button
										onClick={() => {
											SetClickopen(false);
										}}
									>
										关闭
									</Button>
								</DialogActions>
							</Dialog>
							<Card>
								<CardContent>
									<Flex
										gap={"middle"}
										justify={"center"}
										align={"center"}
										wrap="wrap"
									>
										{process.env.NODE_ENV === "development" && (
											<Button
												variant="contained"
												sx={{
													height: "56px",
													marginTop: "10px",
													marginRight: "10px",
												}}
												onClick={() => {
													handleopen(
														"开发菜单",
														<Card>
															<CardContent>
																{currentSong && (
																	<>
																		<Typography
																			sx={{ fontSize: 14 }}
																			color="text.secondary"
																			gutterBottom
																		>
																			<span>当前歌曲信息：</span>
																		</Typography>
																		<Typography
																			sx={{ fontSize: 14 }}
																			color="text.secondary"
																			gutterBottom
																		>
																			<p>
																				歌曲名：
																				{currentSong.title}
																			</p>
																			<p>
																				歌作者：
																				{currentSong.artist}
																			</p>
																			<p>歌ID：{currentSong.id}</p>
																			<p>
																				歌封面：
																				{currentSong.cover}
																			</p>
																		</Typography>
																	</>
																)}
																{!currentSong && (
																	<>
																		<Typography
																			sx={{ fontSize: 14 }}
																			color="text.secondary"
																			gutterBottom
																		>
																			<p>暂无歌曲播放中</p>
																		</Typography>
																	</>
																)}
																<Typography
																	sx={{ fontSize: 14 }}
																	color="text.secondary"
																	gutterBottom
																>
																	<p>
																		UA：
																		{navigator.userAgent.toLowerCase()}
																	</p>
																</Typography>
																<Typography
																	sx={{ fontSize: 14 }}
																	color="text.secondary"
																	gutterBottom
																>
																	<p>FingerPrint：{fingerprintidc}</p>
																</Typography>
															</CardContent>
														</Card>
													);
												}}
											>
												<DeveloperBoard />
												开发菜单
											</Button>
										)}
										<Button
											variant="contained"
											sx={{
												height: "56px",
												marginTop: "10px",
												marginRight: "10px",
											}}
											onClick={() => {
												handleopen("个人歌单", <PersonalPlaylist />);
											}}
										>
											<BookmarksIcon />
											<span>个人歌单</span>
										</Button>
										<Button
											variant="contained"
											sx={{
												height: "56px",
												marginTop: "10px",
												marginRight: "10px",
											}}
											onClick={() => {
												handleopen(
													"搜索歌曲",
													<SongSearchTable setcanlistplay={setcanlistplay} />
												);
											}}
										>
											<SearchIcon />
											搜索歌曲
										</Button>
										<Button
											variant="contained"
											sx={{
												height: "56px",
												marginTop: "10px",
												marginRight: "10px",
											}}
											onClick={() => {
												handleopen("播放列表", <SongList />);
											}}
										>
											<ListIcon />
											播放列表
										</Button>
										<Button
											variant="contained"
											sx={{
												height: "56px",
												marginTop: "10px",
												marginRight: "10px",
											}}
											onClick={() => {
												handleopen("系统设置", <SystemSettings />);
											}}
										>
											<Settings />
											系统设置
										</Button>
									</Flex>
								</CardContent>
							</Card>
						</div>

						<div style={{ display: seeing === "2" ? "block" : "none" }}>
							<TopBar />
							<TopBarBS />
						</div>

						<div style={{ display: seeing === "3" ? "block" : "none" }}>
							<LikeSongBar />
							<SongBar />
						</div>

						<ScrollToTopFab />

						<div style={{ display: seeing === "4" ? "block" : "none" }}>
							<AppBar />
							<JuanZeng />
							<About />
						</div>

						<div
							style={{
								position: "fixed",
								bottom: 0,
								left: 0,
								right: 0,
								background: "white",
							}}
						>
							<MusicCard
								setdisabled={setdisabled}
								setLastPlayedSongIndex={setLastPlayedSongIndex}
								lastPlayedSongIndex={lastPlayedSongIndex}
								PlayingSongs={PlayingSongs}
								setCurrentSong={setCurrentSong}
								currentSong={currentSong}
								canlistplay={canlistplay}
							/>
							<TabBar
								onChange={(key) => {
									setseeing(key);
								}}
							>
								{tabs.map((item) => (
									<TabBar.Item
										key={item.key}
										icon={item.icon}
										title={item.title}
									/>
								))}
							</TabBar>
						</div>
					</CurrentSongContext.Provider>
					<div>
						<SafeArea position="bottom" />
					</div>
				</main>
			) : (
				<>
					<Skeleton.Title animated />
					<Skeleton.Paragraph
						lineCount={5}
						animated
					/>
				</>
			)}
		</>
	);
}

export default function ToggleColorMode() {

	const theme = createTheme({
		palette: {
			primary: { main: "#00BF63", light: "#05ED7D", dark: "#029C51" },
		},
	});

	return (
		<ThemeProvider theme={theme}>
			<ConfigProvider locale={zhCN}>
				<StarSunMusic />
			</ConfigProvider>
		</ThemeProvider>
	);
}
