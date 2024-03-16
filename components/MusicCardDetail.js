import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RepeatOneIcon from "@mui/icons-material/RepeatOne";
import {
	Card,
	CardContent,
	IconButton,
	Link,
	Slider,
	Tooltip,
	Typography,
} from "@mui/material";
import { Flex, Divider, Row, Col } from "antd";
import * as React from "react";

const MusicCard = ({ currentSong }) => {
	const [isAudioPlayable, setIsAudioPlayable] = React.useState(true);
	const [isPlaying, setIsPlaying] = React.useState(false);
	const [progress, setProgress] = React.useState(0);
	const [lyrics, setLyrics] = React.useState([]);
	const [lyricsFY, setLyricsFY] = React.useState([]);
	const [currentLyricIndex, setCurrentLyricIndex] = React.useState(0);
	const audioRef = React.useRef(null);
	const [isReplay, setisReplay] = React.useState(false);

	const handleAudioTimeUpdate = () => {
		const currentTime = audioRef.current.currentTime;
		let currentLyricIndexFY = lyricsFY.length - 1;
		let currentLyricIndex = lyrics.length - 1;

		if (Array.isArray(lyrics) && lyrics.length > 0) {
			const currentLyric = lyrics.find((lyric) => lyric.time > currentTime);
			if (currentLyric) {
				currentLyricIndex = lyrics.indexOf(currentLyric) - 1;
				if (currentLyricIndex < 0) {
					currentLyricIndex = 0;
				}
			}
		}

		setCurrentLyricIndex(currentLyricIndex);

		const duration = audioRef.current.duration;
		const progressPercent = (currentTime / duration) * 100;
		setProgress(progressPercent);
	};

	const parseLrcString = (lrcString) => {
		const lines = lrcString.split("\n");
		const lyrics = [];

		lines.forEach((line) => {
			const timeMatches = line.match(/\[(\d{2}):(\d{2}\.\d{2,3})\]/g);
			const textMatch = line.match(/](.*)/);

			if (timeMatches && textMatch) {
				const time = timeMatches[0].slice(1, -1);
				const minutes = parseInt(time.split(":")[0]);
				const seconds = parseFloat(time.split(":")[1]);
				const text = textMatch[1].trim();
				const timeInSeconds = minutes * 60 + seconds;

				lyrics.push({ time: timeInSeconds, text });
			}
		});

		return lyrics;
	};

	React.useEffect(() => {
		const updateLyrics = async () => {
			if (currentSong) {
				setIsPlaying(true);
				const lrcss = parseLrcString(currentSong.lyric);
				setLyrics(lrcss);
				if (currentSong.sub_lyric) {
					const lrcfy = parseLrcString(currentSong.sub_lyric);
					setLyricsFY(lrcfy);
				} else {
					setLyricsFY([]);
				}
			} else {
				setIsPlaying(false);
				setProgress(0);
				setLyrics([]);
				setLyricsFY([]);
				if (audioRef.current) {
					audioRef.current.pause();
					audioRef.current.currentTime = 0;
				}
			}
		};
		updateLyrics();
		const handleCanPlay = () => {
			setIsAudioPlayable(true);
		};

		const handleError = () => {
			setIsAudioPlayable(false);
		};

		if (audioRef.current) {
			audioRef.current.addEventListener("canplay", handleCanPlay);
			audioRef.current.addEventListener("error", handleError);
		}

		return () => {
			if (audioRef.current) {
				audioRef.current.removeEventListener("canplay", handleCanPlay);
				audioRef.current.removeEventListener("error", handleError);
			}
		};
	}, [currentSong]);
	const handleReplay = () => {
		if (isReplay) {
			setTimeout(() => {
				audioRef.current.currentTime = 0;
				audioRef.current.play();
				setIsPlaying(true);
			}, 1000);
		}
	};
	React.useEffect(() => {
		if (lyrics && lyrics.length > 0) {
			audioRef.current.src = currentSong.link;
			setIsPlaying(false);
			audioRef.current.addEventListener("play", () => setIsPlaying(true));
			audioRef.current.addEventListener("pause", () => setIsPlaying(false));
			audioRef.current.addEventListener("timeupdate", handleAudioTimeUpdate);
			audioRef.current.addEventListener("ended", () => setIsPlaying(false));

			return () => {
				if (audioRef.current) {
					audioRef.current.pause();
					audioRef.current.currentTime = 0;
				}
			};
		} else if (currentSong) {
			audioRef.current.src = currentSong.link;
			setIsPlaying(false);
			audioRef.current.addEventListener("play", () => setIsPlaying(true));
			audioRef.current.addEventListener("pause", () => setIsPlaying(false));
			audioRef.current.addEventListener("ended", () => setIsPlaying(false));

			return () => {
				if (audioRef.current) {
					audioRef.current.pause();
					audioRef.current.currentTime = 0;
				}
			};
		} else {
			setIsPlaying(false);
			return () => {
				if (audioRef.current) {
					audioRef.current.src = "";
					audioRef.current.currentTime = 0;
				}
			};
		}
	}, [lyrics, currentSong]);

	const handleSliderChange = async (event, newValue) => {
		setProgress(newValue);
		const duration = audioRef.current.duration;
		const currentTime = (newValue / 100) * duration;

		await audioRef.current.pause();
		audioRef.current.currentTime = currentTime;
		await audioRef.current.play();

		setIsPlaying(true); // 更新播放状态
	};

	const handleSliderDragEnd = async () => {
		const duration = audioRef.current.duration;
		const currentTime = (progress / 100) * duration;

		await audioRef.current.pause();
		audioRef.current.currentTime = currentTime;
		await audioRef.current.play();

		setIsPlaying(true); // 更新播放状态
	};

	const handleTogglePlay = () => {
		if (isPlaying) {
			audioRef.current.pause(); // 暂停音频
		} else {
			audioRef.current.play(); // 继续播放音频
		}

		setIsPlaying(!isPlaying); // 切换播放状态
	};

	const handleSetReplay = () => {
		if (isReplay === true) {
			setisReplay(false);
		} else if (isReplay === false) {
			setisReplay(true);
		}
	};

	const formatTime = (timeInSeconds) => {
		const minutes = Math.floor(timeInSeconds / 60);
		const seconds = Math.floor(timeInSeconds % 60);
		return `${minutes.toString().padStart(2, "0")}:${seconds
			.toString()
			.padStart(2, "0")}`;
	};

	return (
		<Card style={{ marginTop: "15px" }}>
			<CardContent id="MusicCard">
				{!currentSong && (
					<Typography variant="body1">
						<span>歌曲信息加载中~</span>
					</Typography>
				)}
				{currentSong && (
					<>
						<Row>
							<Col flex={1}>
								<Flex
									vertical
									gap={"2px"}
									align="center"
								>
									<Typography variant="h5">
										<span>{currentSong.title}</span>
									</Typography>
									<Typography variant="subtitle1">
										<span>{currentSong.artist}</span>
									</Typography>
									{currentSong.cover && (
										<img
											src={currentSong.cover}
											alt="Thumbnail"
											height={64}
											width={64}
											onError={() => {}}
										/>
									)}
									{!currentSong.cover && "暂无图片哦~"}
								</Flex>
							</Col>
							<Col flex={4}>
								<Flex
									vertical
									gap={"small"}
									align="center"
									justify="center"
								>
									{!currentSong && (
										<Typography variant="body1">
											<span
												style={{
													WebkitUserSelect: "none",
													MozUserSelect: "none",
													msUserSelect: "none",
													userSelect: "none",
													display: "flex",
													justifyContent: "center",
												}}
											>
												暂无歌词信息哦！
											</span>
										</Typography>
									)}
									{currentSong &&
										currentSong.lyric &&
										currentSong.lyric
											.split("\n")
											.filter((line) => {
												return (
													!line.startsWith("﻿[id:") &&
													!line.startsWith("[id:") &&
													line !== "" &&
													!line.startsWith("[ar:") &&
													!line.startsWith("[ti:") &&
													!line.startsWith("[by:") &&
													!line.startsWith("[hash:") &&
													!line.startsWith("[al:") &&
													!line.startsWith("[sign:") &&
													!line.startsWith("[qq:") &&
													!line.startsWith("[total:") &&
													!line.startsWith("[offset:")
												);
											})
											.map((line, index) => {
												const currentIndex =
													currentLyricIndex >= 0 ? currentLyricIndex : -1;

												// 修改这里，只展示当前及前后两句歌词
												if (
													index === currentIndex ||
													index === currentIndex - 1 ||
													index === currentIndex + 1 ||
													index === currentIndex + 2 ||
													index === currentIndex - 2
												) {
													const fontSize =
														index === currentIndex ? "larger" : "medium";
													const color =
														index === currentIndex ? "#1976D2" : "#808080";

													const cleanedLine = line.replace(
														/\[(\d{2}):(\d{2}\.\d{2,3})\]/g,
														""
													);

													return (
														<div
															key={index}
															style={{
																WebkitUserSelect: "none",
																MozUserSelect: "none",
																msUserSelect: "none",
																userSelect: "none",
																display: "flex",
																justifyContent: "center",
															}}
														>
															<span
																style={{
																	fontSize,
																	color,
																}}
															>
																{cleanedLine}
															</span>
															<br />
														</div>
													);
												}
												return null;
											})}
								</Flex>
							</Col>
						</Row>

						<audio
							ref={audioRef}
							onEnded={handleReplay}
						/>
						<Slider
							value={progress}
							onChange={handleSliderChange}
							onDragEnd={handleSliderDragEnd}
							disabled={isAudioPlayable === false}
						/>
						<Typography
							variant="caption"
							style={{ margin: "8px 0" }}
						>
							<span>
								{audioRef.current &&
								typeof audioRef.current.currentTime === "number" &&
								!isNaN(audioRef.current.currentTime) &&
								typeof audioRef.current.duration === "number" &&
								!isNaN(audioRef.current.duration)
									? `${formatTime(audioRef.current.currentTime)} / ${formatTime(
											audioRef.current.duration
									  )}`
									: "歌曲加载中"}
							</span>
						</Typography>
						<IconButton
							onClick={handleTogglePlay}
							disabled={isAudioPlayable === false}
						>
							{isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
						</IconButton>
						<Tooltip
							title="单曲循环"
							placement="top"
						>
							<IconButton
								onClick={handleSetReplay}
								disabled={isAudioPlayable === false}
							>
								{isReplay ? (
									<RepeatOneIcon color="primary" />
								) : (
									<RepeatOneIcon />
								)}
							</IconButton>
						</Tooltip>
						<Typography
							variant="caption"
							style={{ margin: "10px 0", marginLeft: "10px" }}
						>
							<span>更多功能请到系统内体验~</span>
						</Typography>
						<Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
						<Typography
							variant="caption"
							style={{ margin: "8px 0" }}
						>
							<span>
								本歌曲由 星阳音乐系统 · 单曲播放功能 提供 | 畅哥科技&trade;
								强力驱动 |{" "}
								<Link
									onClick={() => {
										window.open("https://music.lcahy.cn/");
									}}
									underline="hover"
									aria-label="前往星阳音乐系统"
								>
									<span>点击前往星阳音乐系统</span>
								</Link>
							</span>
						</Typography>
						<Typography
							variant="caption"
							style={{ margin: "8px 0" }}
						>
							<br />
							<span>
								免责声明：本系统内容来源于网络，仅提供检索服务，用于个人音乐欣赏。本系统不存储任何内容，也不承担任何责任。如果您需要使用本系统提供的检索服务，您应当自行负责获取相关内容的合法性和准确性。此外，本系统保留随时修改本声明的权利。如果您继续使用本系统，即表示您已经接受了本声明的所有修改。
							</span>
						</Typography>
					</>
				)}
			</CardContent>
		</Card>
	);
};

export default MusicCard;
