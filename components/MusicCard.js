import * as React from "react";
import {
  Card,
  Button,
  CardContent,
  Typography,
  IconButton,
  Slider,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import FileIcon from "@mui/icons-material/Article";

const MusicCard = ({ currentSong }) => {
  const [isAudioPlayable, setIsAudioPlayable] = React.useState(true);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(100);
  const [progress, setProgress] = React.useState(0);
  const [lyrics, setLyrics] = React.useState([]);
  const [currentLyricIndex, setCurrentLyricIndex] = React.useState(0);
  const audioRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAudioTimeUpdate = () => {
    const currentTime = audioRef.current.currentTime;
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
      const timeMatches = line.match(/\[(\d{2}):(\d{2}\.\d{3})\]/g);
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
        const lrcss = await parseLrcString(currentSong.lyric);
        setLyrics(lrcss);
      } else {
        setIsPlaying(false);
        setProgress(0);
        setLyrics([]);
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

  React.useEffect(() => {
    if (lyrics && lyrics.length > 0) {
      audioRef.current.src = currentSong.link;
      audioRef.current.play();

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
      audioRef.current.play();

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

  const formatLyrics = () => {
    if (!isAudioPlayable) {
      return (
        <Typography variant="body1">
          <span>本歌曲暂不支持播放哦~</span>
        </Typography>
      );
    } else {
      if (lyrics && lyrics.length > 0) {
        // console.log(lyrics);
        return (
          <Typography
            key={
              currentLyricIndex >= 0 && lyrics[currentLyricIndex] !== undefined
                ? lyrics[currentLyricIndex].time
                : undefined
            }
            variant="body1"
            style={{ whiteSpace: "pre-line" }}
          >
            {currentLyricIndex >= 0 &&
            lyrics[currentLyricIndex] !== undefined &&
            lyrics[currentLyricIndex].text ? (
              <span>{lyrics[currentLyricIndex].text}</span>
            ) : (
              <span></span>
            )}
          </Typography>
        );
      } else {
        return (
          <Typography variant="body1">
            <span>暂无歌词信息哦，可尝试点击查看完整歌词~</span>
          </Typography>
        );
      }
    }
  };

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
    audioRef.current.volume = volume / 100;
    if (isPlaying) {
      audioRef.current.pause(); // 暂停音频
    } else {
      audioRef.current.play(); // 继续播放音频
    }

    setIsPlaying(!isPlaying); // 切换播放状态
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    audioRef.current.volume = newValue / 100;
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
      <CardContent>
        {!currentSong && (
          <Typography variant="body1">
            <span>您还没有操作播放歌曲呢~</span>
          </Typography>
        )}
        {currentSong && (
          <>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>
                <span>歌曲歌词</span>
              </DialogTitle>
              <DialogContent>
                {!currentSong && (
                  <Typography variant="body1">
                    <span>暂无歌词信息哦！</span>
                  </Typography>
                )}
                {currentSong &&
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
                      const isPlaying =
                        currentLyricIndex >= 0 && index === currentLyricIndex;
                      const fontSize = isPlaying ? "larger" : "smaller";
                      const color = isPlaying ? "#1976D2" : "black";
                      const cleanedLine = line.replace(
                        /\[(\d{2}):(\d{2}\.\d{3})\]/g,
                        ""
                      );
                      return (
                        <main>
                          <span key={index} style={{ fontSize, color }}>
                            {cleanedLine}
                          </span>
                          <br />
                        </main>
                      );
                    })}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>
                  <span>好的</span>
                </Button>
              </DialogActions>
            </Dialog>
            <Typography variant="h5">
              <span>{currentSong.title}</span>
            </Typography>
            <Typography variant="subtitle1">
              <span>{currentSong.artist}</span>
            </Typography>
            <img src={currentSong.cover} alt="Thumbnail" height="64" />
            <div>{formatLyrics()}</div>
            <audio ref={audioRef} />
            <Slider
              value={progress}
              onChange={handleSliderChange}
              onDragEnd={handleSliderDragEnd}
              disabled={isAudioPlayable === false}
            />
            <Typography variant="caption" style={{ margin: "8px 0" }}>
              <span>
                {audioRef.current &&
                typeof audioRef.current.currentTime === "number" &&
                !isNaN(audioRef.current.currentTime) &&
                typeof audioRef.current.duration === "number" &&
                !isNaN(audioRef.current.duration)
                  ? `${formatTime(audioRef.current.currentTime)} / ${formatTime(
                      audioRef.current.duration
                    )}`
                  : "无时间信息"}
              </span>
            </Typography>
            <IconButton
              onClick={handleTogglePlay}
              disabled={isAudioPlayable === false}
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton
              aria-label="file button"
              onClick={handleClickOpen}
              disabled={isAudioPlayable === false}
            >
              <FileIcon />
            </IconButton>
            <Slider
              value={volume}
              onChange={handleVolumeChange}
              disabled={isAudioPlayable === false}
            />
            <Typography variant="caption" style={{ margin: "8px 0" }}>
              <span>音量: {volume}%</span>
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MusicCard;
