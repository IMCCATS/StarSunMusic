import "./main.css";

export const metadata = {
  title: "星阳音乐系统",
  description: "星阳音乐系统",
};

export default function RootLayout(props) {
  const { children } = props;
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
