
export const metadata = {
  title: "单曲播放 · 星阳音乐系统",
  description: "单曲播放 · 星阳音乐系统",
};

export default function RootLayout(props) {
  const { children } = props;
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
}
