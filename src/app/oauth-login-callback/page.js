"use client";
import { Container, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import Script from "next/script";
import * as React from "react";
import { HandleAjax } from "../../../components/common/fetchapi";
const crypto = require("crypto");
import yuxStorage from "@/app/api/yux-storage";

export default function LoginPage({ searchParams }) {
	const router = useRouter();
	const CheckScript = () => {
		yuxStorage.getItem("userprofile").then((state) => {
			if (state) {
				setTimeout(() => {
					router.push("/dashboard");
				}, 1500);
			} else if (searchParams.type && searchParams.code) {
				HandleAjax(
					`https://uniqueker.top/connect.php?act=callback&appid=${process.env.SocietyLoginAppid}&appkey=${process.env.SocietyLoginAppSe}&type=${searchParams.type}&code=${searchParams.code}`,
					"get",
					null
				)
					.then((e) => {
						if (e.code !== 0) {
							router.push("/oauth-login");
							return;
						}
						Suc(e.social_uid, e.access_token);
					})
					.catch((e) => {
						router.push("/oauth-login");
					});
			} else {
				router.push("/oauth-login");
			}
		});
	};

	React.useEffect(() => {
		CheckScript();
	}, []);

	const isLoading = true;

	const handleGo = () => {
		router.push("/dashboard");
	};

	const Suc = (uniqueid, access_token) => {
		function generateRandomString() {
			var result = "";
			var characters =
				"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			var charactersLength = characters.length;
			for (var i = 0; i < 6; i++) {
				result += characters.charAt(
					Math.floor(Math.random() * charactersLength)
				);
			}
			return result;
		}

		yuxStorage.setItem("userprofile", uniqueid).then((e) => {
			yuxStorage.setItem("mobiletoken", access_token).then((e) => {
				const skey = generateRandomString();
				yuxStorage.setItem("skey", skey);
				async function sha256(input) {
					return crypto.createHash("sha256").update(input).digest("hex");
				}
				const text = skey + uniqueid + access_token + skey;
				sha256(text).then((ykey) => {
					yuxStorage.setItem("ykey", ykey).then((e) => {
						setTimeout(function () {
							handleGo();
						}, 1000);
					});
				});
			});
		});
	};

	return (
		<Container>
			<Script src="https://static.geetest.com/v4/gt4.js" />
			<meta
				name="viewport"
				content="initial-scale=1, width=device-width"
			/>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "100vh",
				}}
			>
				<img
					src="/logo.png"
					alt="Logo"
					style={{ marginBottom: "24px", width: "220px", height: "220px" }}
				/>
				<Typography
					variant="h4"
					component="h4"
					gutterBottom
				>
					登录·星阳音乐系统
				</Typography>

				{isLoading && (
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							height: "100%",
						}}
					>
						<CircularProgress sx={{ mr: 1 }} />
						<p style={{ whiteSpace: "pre" }}>正在加载...</p>
					</div>
				)}
			</div>
		</Container>
	);
}
