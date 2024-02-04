export const runtime = "edge";
export default function handler(req, res) {
  //   res.status(200).json({ message: "Hello from Next.js!" });
  if (req.method === "POST") {
    const dataJson = req.body;
    const buff = Buffer.from(dataJson, "base64");
    const deJson = buff.toString("utf-8");
    const Json = JSON.parse(deJson);
    const url = Json.url;
    const data = Json.data;
    fetch(url, data)
      .then((response) => response.json())
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => {
        res.status(404).json({
          message:
            "Failed to load resource: the server responded with a status of 404 ()",
        });
      });
  } else {
    res.status(500).json({
      message:
        "Failed to load resource: the server responded with a status of 500 ()",
    });
  }
}
