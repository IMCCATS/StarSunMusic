// 获取用户IP地址
function getUserIP(req) {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  return ip;
}

// API路由处理函数
async function IPcheck(req, res) {
  const ip = getUserIP(req);
  res.status(200).json({ ip });
}

// 导出API路由处理函数
export default IPcheck;
export const runtime = "edge";
