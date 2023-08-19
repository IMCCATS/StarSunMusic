export default (req, res) => {
  const playlistId = req.query.playlistId;
  const url = `https://api.gmit.vip/Api/MusicList?format=json&url=https://music.163.com/playlist?id=${playlistId}`;

  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        res.status(200).json({ songs: data.data });
      } else {
        console.log(xhr.responseText);
        res.status(500).json({ error: "发生错误，请稍后再试。" });
      }
    }
  };
  xhr.send();
};
