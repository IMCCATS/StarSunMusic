export const metadata = {
	title: "星阳音乐系统 - 让音韵流传 让乐章永恒",
	description:
		"创建令人沉醉的音乐之旅，从我们的创新音乐系统开始。探索无尽的旋律空间，享受高清音质带来的每一次心灵触碰。",
};

import "./a.css";

export default function RootLayout(props) {
	const { children } = props;
	return (
		<html lang="zh">
			<body>{children}</body>
		</html>
	);
}
