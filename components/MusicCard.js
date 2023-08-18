import * as React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Slider,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

const MusicCard = ({ currentSong }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [lyrics, setLyrics] = React.useState([]);
  const [currentLyricIndex, setCurrentLyricIndex] = React.useState(0);
  const audioRef = React.useRef(null);

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
      const timeMatches = line.match(/\[(\d{2}):(\d{2}\.\d{2})\]/g);
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
        const lrcss = await parseLrcString(currentSong.lrc);
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
  }, [currentSong]);

  React.useEffect(() => {
    if (lyrics.length > 0) {
      audioRef.current.src = currentSong.url;
      audioRef.current.play();

      audioRef.current.addEventListener("timeupdate", handleAudioTimeUpdate);
      audioRef.current.addEventListener("ended", () => setIsPlaying(false));

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      };
    }
  }, [lyrics]);

  const formatLyrics = () => {
    if (lyrics.length > 0) {
      return (
        <Typography
          key={lyrics[currentLyricIndex].time}
          variant="body1"
          style={{ whiteSpace: "pre-line" }}
        >
          <span>{lyrics[currentLyricIndex].text}</span>
        </Typography>
      );
    } else {
      return (
        <Typography variant="body1">
          <span>无歌词信息，该歌曲可能不支持播放。</span>
        </Typography>
      );
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
    if (isPlaying) {
      audioRef.current.pause(); // 暂停音频
    } else {
      audioRef.current.play(); // 继续播放音频
    }

    setIsPlaying(!isPlaying); // 切换播放状态
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
            <Typography variant="h5">
              <span>{currentSong.title}</span>
            </Typography>
            <Typography variant="subtitle1">
              <span>{currentSong.author}</span>
            </Typography>
            <img src={currentSong.pic} alt="Thumbnail" height="64" />
            <div>{formatLyrics()}</div>
            <audio ref={audioRef} />
            <Slider
              value={progress}
              onChange={handleSliderChange}
              onDragEnd={handleSliderDragEnd}
            />
          </>
        )}
        <IconButton onClick={handleTogglePlay}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default MusicCard;
