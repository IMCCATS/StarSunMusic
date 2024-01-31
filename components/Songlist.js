import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Pagination,
} from "@mui/material";
import { CurrentSongContext } from "@/app/dashboard/page";
import { Flex, Modal, Tag } from "antd";
import { HandleListenSong } from "./common/fetchapi";

export default function SongList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [songsPerPage] = useState(10);

  const {
    lastPlayedSongIndex,
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

  const moveUp = (indexOnCurrentPage) => {
    const selectedGlobalIndexC =
      getGlobalIndexFromCurrentPage(indexOnCurrentPage);
    if (getGlobalIndexFromCurrentPage(selectedGlobalIndexC - 1) >= 0) {
      const updatedPlayingSongs = [...PlayingSongs];
      const temp = updatedPlayingSongs[selectedGlobalIndexC - 1];
      updatedPlayingSongs[selectedGlobalIndexC - 1] =
        updatedPlayingSongs[selectedGlobalIndexC];
      updatedPlayingSongs[selectedGlobalIndexC] = temp;
      SetPlayingSongs(updatedPlayingSongs);
    }
  };

  const moveDown = (indexOnCurrentPage) => {
    const selectedGlobalIndexC =
      getGlobalIndexFromCurrentPage(indexOnCurrentPage);
    if (
      getGlobalIndexFromCurrentPage(selectedGlobalIndexC + 1) <
      PlayingSongs.length
    ) {
      const updatedPlayingSongs = [...PlayingSongs];
      const temp = updatedPlayingSongs[selectedGlobalIndexC + 1];
      updatedPlayingSongs[selectedGlobalIndexC + 1] =
        updatedPlayingSongs[selectedGlobalIndexC];
      updatedPlayingSongs[selectedGlobalIndexC] = temp;
      SetPlayingSongs(updatedPlayingSongs);
    }
  };

  const handleListenClick = (songId) => {
    setdisabled(true);
    HandleListenSong(songId)
      .then((e) => {
        setCurrentSong(e);
        setLastPlayedSongIndex(
          PlayingSongs.findIndex((song) => song.id === songId)
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
              <ListItemText
                primary={`第${getGlobalIndexFromCurrentPage(index + 1)}首—${
                  song.name
                }`}
                secondary={`${song.artist}`}
              />
              <Flex gap="small">
                <>
                  {lastPlayedSongIndex ===
                  getGlobalIndexFromCurrentPage(index) ? (
                    <Tag color="success">播放中</Tag>
                  ) : lastPlayedSongIndex ===
                    getGlobalIndexFromCurrentPage(index - 1) ? (
                    <Tag color="blue">下一曲</Tag>
                  ) : (
                    <></>
                  )}
                </>
                <Button
                  color="primary"
                  onClick={() => moveUp(index)}
                  disabled={getGlobalIndexFromCurrentPage(index) === 0}
                >
                  🔼
                </Button>
                <Button
                  color="primary"
                  onClick={() => moveDown(index)}
                  disabled={
                    getGlobalIndexFromCurrentPage(index) ===
                    PlayingSongs.length - 1
                  }
                >
                  🔽
                </Button>
                <Button
                  onClick={() => handleListenClick(song.id)}
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
              </Flex>
            </ListItem>
          ))
        ) : (
          <Flex justify={"center"} align={"center"} wrap="wrap">
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
