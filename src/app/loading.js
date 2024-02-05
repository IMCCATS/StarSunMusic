import { Spin } from "antd";
export default function Loading() {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "100vh",
			}}
		>
			<Spin size="large" />
			<span style={{ padding: "10px" }}>加载中...</span>
		</div>
	);
}
