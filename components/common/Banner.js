import React from "react";
import Marquee from "react-fast-marquee";
import { Alert } from "antd";
import { NotificationsOutlined } from "@mui/icons-material";
import { BannerText } from "@/app/api/appconfig";

const Banner = () => (
	<Alert
		banner
		style={{ marginTop: "10px" }}
		showIcon={true}
		icon={<NotificationsOutlined />}
		message={
			<Marquee
				speed={50}
				gradient={false}
			>
				{BannerText}
			</Marquee>
		}
	/>
);
export default Banner;
