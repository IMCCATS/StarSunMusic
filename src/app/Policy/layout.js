
export const metadata = {
  title: "用户协议与隐私政策 · 星阳音乐系统",
  description: "用户协议与隐私政策 · 星阳音乐系统",
};

export default function RootLayout(props) {
  const { children } = props;
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
}
