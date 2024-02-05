export const dynamic = "force-dynamic";
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dataac = searchParams.get("string");
  if (dataac) {
    const c = atob(dataac);
    const dataJson = JSON.parse(c);
    const url = dataJson.url;

    let queryParams;
    let urlWithParams;
    if (dataJson.data) {
      // 若API不接受JSON格式查询参数，需要将其转换为键值对的形式：
      queryParams = Object.entries(dataJson.data)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");
      urlWithParams = new URL(`${url}?${queryParams}`);
    } else {
      urlWithParams = new URL(url);
    }

    try {
      const res = await fetch(urlWithParams);

      const data = await res.json();

      return Response.json({ status: "success", data });
    } catch (error) {
      return Response.json({ status: "failure", messageobj: error });
    }
  } else {
  }
}
