import { CurrentSongContext } from "@/app/dashboard/page";
import {
	Button,
	List,
	ListItem,
	ListItemText,
	Pagination,
} from "@mui/material";
import { Flex, Modal, Tag } from "antd";
import React, { useState } from "react";

import { HandleListenSong } from "./common/fetchapi";

export default function SongList() {
	const [currentPage, setCurrentPage] = useState(1);
	const [songsPerPage] = useState(10);

	const {
		lastPlayedSongIndex,
		playstatus,
		SetPlayingSongs,
		setCurrentSong,
		setLastPlayedSongIndex,
		setcanlistplay,
		setdisabled,
		PlayingSongs,
	} = React.useContext(CurrentSongContext);

	const indexOfFirstSong = (currentPage - 1) * songsPerPage;
	const indexOfLastSong = indexOfFirstSong + songsPerPage;
	const currentSongs = PlayingSongs.slice(indexOfFirstSong, indexOfLastSong);

	const getGlobalIndexFromCurrentPage = (pageIndex) =>
		pageIndex + indexOfFirstSong;

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	const handleDelete = (indexOnCurrentPage) => {
		Modal.confirm({
			title: "是否确定删除？",
			content: <p>确定要删除歌曲吗？</p>,
			onOk() {
				const selectedGlobalIndexC =
					getGlobalIndexFromCurrentPage(indexOnCurrentPage);
				const updatedPlayingSongs = [...PlayingSongs];
				updatedPlayingSongs.splice(selectedGlobalIndexC, 1);
				SetPlayingSongs(updatedPlayingSongs);
			},
			onCancel() {},
			cancelText: "取消",
			okText: "确定",
		});
	};

	const handleListenClick = (id) => {
		setdisabled(true);
		HandleListenSong(id)
			.then((e) => {
				setCurrentSong(e);
				setLastPlayedSongIndex(
					PlayingSongs.findIndex((song) => song.id === id)
				);
				setcanlistplay(true);
				setdisabled(false);
			})
			.catch((error) => {
				setdisabled(false);
			});
	};

	return (
		<>
			{currentSongs &&
			lastPlayedSongIndex &&
			PlayingSongs &&
			PlayingSongs[lastPlayedSongIndex] ? (
				<>
					<p>
						当前正在播放 播放列表第{lastPlayedSongIndex + 1}首歌曲：
						{PlayingSongs[lastPlayedSongIndex].name
							? PlayingSongs[lastPlayedSongIndex].name
							: PlayingSongs[lastPlayedSongIndex].title}
						—{PlayingSongs[lastPlayedSongIndex].artist}
					</p>
				</>
			) : (
				<></>
			)}
			<List>
				{currentSongs.length > 0 ? (
					currentSongs.map((song, index) => (
						<ListItem key={song.id}>
							<>
								{lastPlayedSongIndex ===
								getGlobalIndexFromCurrentPage(index) ? (
									<img
										src="/playing.svg"
										style={{ marginRight: "5px" }}
										width={"20px"}
									/>
								) : lastPlayedSongIndex ===
								  getGlobalIndexFromCurrentPage(index - 1) ? (
									<Tag
										style={{ marginRight: "5px" }}
										color="blue"
									>
										下一曲
									</Tag>
								) : (
									<></>
								)}
							</>
							<ListItemText
								primary={`第${getGlobalIndexFromCurrentPage(index + 1)}首—${
									song.name
								}`}
								secondary={`${song.artist}`}
							/>
							<Flex gap="small">
								<Button
									onClick={() => {
										if (playstatus === "1") {
											handleListenClick(song.id);
										} else {
											setCurrentSong(song);
											setLastPlayedSongIndex(
												getGlobalIndexFromCurrentPage(index)
											);
										}
									}}
									variant="contained"
								>
									播放
								</Button>
								<Button
									color="error"
									onClick={() => handleDelete(index)}
									variant="contained"
								>
									删除
								</Button>
								{process.env.NODE_ENV === "development" && (
									<Button
										onClick={() => {
											console.log(song);
										}}
										variant="contained"
									>
										打印
									</Button>
								)}
							</Flex>
						</ListItem>
					))
				) : (
					<Flex
						justify={"center"}
						align={"center"}
						wrap="wrap"
					>
						<span>播放列表暂无歌曲哦~</span>
					</Flex>
				)}
			</List>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					marginTop: "20px",
				}}
			>
				<Pagination
					count={Math.ceil(PlayingSongs.length / songsPerPage)}
					page={currentPage}
					onChange={(event, value) => paginate(value)}
				/>
			</div>
		</>
	);
}
