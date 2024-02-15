import React, { useState, useEffect } from "react";
import $ from "jquery";
import { Flex } from "antd";

const isValidURL = (url) => {
	// 这里可以使用更复杂的逻辑来验证URL的有效性
	const pattern = new RegExp(
		"^(https?:\\/\\/)?" + // protocol
			"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
			"((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
			"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
			"(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
			"(\\#[-a-z\\d_]*)?$",
		"i"
	); // fragment locator
	return !!pattern.test(url);
};
const LinkChecker = ({ href, children }) => {
	const [status, setStatus] = useState("checking");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const checkStatus = async () => {
			setLoading(true);

			if (!isValidURL(href)) {
				setStatus("invalid");
			} else {
				setStatus("available");
				// try {
				// 	$.ajax({
				// 		url: "/api/CheckUrl",
				// 		data: { url: href },
				// 		type: "get",
				// 		success: function (e) {
				// 			if (e.url === href && e.status === "available") {
				// 				setStatus("available");
				// 			} else {
				// 				setStatus("unavailable");
				// 			}
				// 		},
				// 		error: function () {
				// 			setStatus("unavailable");
				// 		},
				// 		complete: () => {
				// 			setLoading(false);
				// 		},
				// 	});
				// } catch (error) {
				// 	setStatus("unavailable");
				// }
			}
			setLoading(false);
			// setStatus("checking");
		};

		if (href) {
			checkStatus();
		}
	}, [href]);

	return (
		<a
			target={status === "available" ? "_blank" : ""}
			href={status === "available" ? href : "#"}
			rel="noopener noreferrer nofollow external"
		>
			{loading
				? `${children}：正在检查链接可用性...`
				: status === "available"
				? children
				: status === "unavailable"
				? `${children}：网站不可用`
				: `${children}：网站链接无效`}
		</a>
	);
};

const NavLinkList = () => {
	return (
		<Flex
			wrap="wrap"
			gap="middle"
		>
			<LinkChecker href="https://yunfei.kemput.cn/">云飞导航网</LinkChecker>
			<LinkChecker href="https://www.esoot.com/">易搜特收录网</LinkChecker>
		</Flex>
	);
};

export default NavLinkList;
