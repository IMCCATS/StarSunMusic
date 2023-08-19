export default (req, res) => {
  const { searchTerm, PT } = req.query;

  if (!searchTerm) {
    return res.status(400).json({ error: "搜索条件不能为空。" });
  }

  const url = `https://api.gmit.vip/Api/Music?text=${encodeURIComponent(
    searchTerm
  )}&format=${encodeURIComponent("json")}&site=${encodeURIComponent(PT)}`;
  const xhr = new XMLHttpRequest();

  xhr.open("GET", url);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);

        if (data.code === 200) {
          res.status(200).json({ songs: data.data });
        } else {
          console.log(data.data);
          res
            .status(400)
            .json({ error: "搜索歌曲失败，请更换搜索词或搜索方式。" });
        }
      } else {
        console.log(xhr.responseText);
        res.status(500).json({ error: "发生错误，请稍后再试。" });
      }
    }
  };

  xhr.send();
};
