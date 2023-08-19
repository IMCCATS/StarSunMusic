export default (req, res) => {
  const songId = req.query.songId;
  const url = `https://api.gmit.vip/Api/Netease?format=json&id=${songId}`;

  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        res.status(200).json({ song: data.data });
      } else {
        console.log(xhr.responseText);
        res.status(500).json({ error: "发生错误，请稍后再试。" });
      }
    }
  };
  xhr.send();
};
