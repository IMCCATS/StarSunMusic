import https from "https";

export default (req, res) => {
  const { searchTerm, PT } = req.query;

  if (!searchTerm) {
    return res.status(400).json({ error: "搜索条件不能为空。" });
  }

  const url = `https://api.gmit.vip/Api/Music?text=${encodeURIComponent(
    searchTerm
  )}&format=${encodeURIComponent("json")}&site=${encodeURIComponent(PT)}`;

  https
    .get(url, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        const responseData = JSON.parse(data);

        if (responseData.code === 200) {
          res.status(200).json({ songs: responseData.data });
        } else {
          console.log(responseData.data);
          res
            .status(400)
            .json({ error: "搜索歌曲失败，请更换搜索词或搜索方式。" });
        }
      });
    })
    .on("error", (error) => {
      console.log(error);
      res.status(500).json({ error: "发生错误，请稍后再试。" });
    });
};
