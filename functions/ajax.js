export function onRequestPost(context) {
  //   return new Response("Hello, world!");
  const dataJson = context.request.json();
  const buff = Buffer.from(base64, dataJson);
  const deJson = buff.toString("utf-8");
  const Json = JSON.parse(deJson);
  const url = Json.url;
  const data = Json.data;
  fetch(url, data)
    .then((response) => response.json())
    .then((data) => {
      return new Response(data, 200);
    })
    .catch((error) => {
      return new Response(data, 404);
    });
}
