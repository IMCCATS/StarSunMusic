"use client";
import * as React from "react";
import { CurrentSongContext } from "../src/app/page";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import {
  Button,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  Paper,
  CardContent,
  Card,
  TextField,
  Box,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

export default function SongSearchTable() {
  const { setCurrentSong } = React.useContext(CurrentSongContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const [songs, setSongs] = React.useState([]);
  const [PT, setPT] = React.useState("netease");
  const [jzwz, setwz] = React.useState(
    "请搜索歌曲，搜索完成后会自动停止加载。"
  );
  const [searchTerm, setSearchTerm] = React.useState("");

  var isEnterPressed = false;
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (!isEnterPressed) {
        isEnterPressed = true;
        setTimeout(() => {
          handleSearch();
          isEnterPressed = false;
        }, 1000);
      }
    }
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleListenClick = (song) => {
    setCurrentSong(song);
  };
  const handleSearch = () => {
    if (!searchTerm) {
      return;
    }
    console.log("搜索关键字:", searchTerm);
    var xhr = new XMLHttpRequest();
    var url =
      "https://api.gmit.vip/Api/Music?text=" +
      encodeURIComponent(searchTerm) +
      "&format=" +
      encodeURIComponent("json") +
      "&site=" +
      encodeURIComponent(PT);
    xhr.open("GET", url);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        var res = JSON.parse(xhr.responseText);
        if (res.code == 200) {
          //console.log(res.data);
          setSongs(res.data);
          setIsLoading(false);
        } else {
          console.log(res.data);
        }
      }
    };
    xhr.send();
  };

  const handleChangec = (event, newPT) => {
    setPT(newPT);
  };
  const control = {
    value: PT,
    onChange: handleChangec,
    exclusive: true,
  };

  const children = [
    <ToggleButton value="netease" key="left">
      <FormatAlignLeftIcon />
    </ToggleButton>,
    <ToggleButton value="kugou" key="center">
      <FormatAlignCenterIcon />
    </ToggleButton>,
  ];

  return (
    <main>
      <Card sx={{ minWidth: 275 }} style={{ marginTop: "15px" }}>
        <CardContent>
          <Box
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              fullWidth
              label="搜点什么..."
              id="search"
              variant="outlined"
              onChange={handleChange}
              onKeyDown={handleKeyPress}
            />
            <ToggleButtonGroup
              size="small"
              {...control}
              aria-label="Small sizes"
            >
              {children}
            </ToggleButtonGroup>
          </Box>
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
                  <p style={{ marginLeft: "10px", whiteSpace: "pre" }}>
                    {jzwz}
                  </p>
                </div>
              ) : songs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <span>还没有进行搜索操作</span>
                </div>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <span>歌曲图片</span>
                      </TableCell>
                      <TableCell>
                        <span>标题</span>
                      </TableCell>
                      <TableCell>
                        <span>作者</span>
                      </TableCell>
                      <TableCell>
                        <span>链接</span>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {songs.map((song) => (
                      <TableRow key={song.songid}>
                        <TableCell>
                          <img src={song.pic} alt="Thumbnail" height="64" />
                        </TableCell>
                        <TableCell>
                          <span>{song.title}</span>
                        </TableCell>
                        <TableCell>
                          <span>{song.author}</span>
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleListenClick(song)}
                            variant="contained"
                          >
                            <span>听</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Paper>
        </CardContent>
      </Card>
    </main>
  );
}
