import https from "https";

export default async (req, res) => {
  const songId = req.query.songId;
  const url = `https://api.gmit.vip/Api/Netease?format=json&id=${songId}`;

  https
    .get(url, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        const responseData = JSON.parse(data);
        res.status(200).json({ song: responseData.data });
      });
    })
    .on("error", (error) => {
      console.log(error);
      res.status(500).json({ error: "发生错误，请稍后再试。" });
    });
};
