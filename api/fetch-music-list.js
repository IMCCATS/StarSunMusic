export default async (req, res) => {
  const playlistId = req.query.playlistId;

  const expectedReferer = "https://music.lcahy.cn";

  // 如果 Referer 不是期望的域名，返回错误响应
  if (req.headers.referer !== expectedReferer) {
    return res.status(404).json({ error: "页面未找到" });
  }

  const url = `https://api.gmit.vip/Api/MusicList?format=json&url=https://music.163.com/playlist?id=${playlistId}`;

  https
    .get(url, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        const responseData = JSON.parse(data);
        res.status(200).json({ songs: responseData.data });
      });
    })
    .on("error", (error) => {
      console.log(error);
      res.status(500).json({ error: "发生错误，请稍后再试。" });
    });
};
