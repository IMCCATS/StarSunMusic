"use client";
import {
	Box,
	Container,
	Stepper,
	Step,
	StepLabel,
	Button,
	TextField,
	Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { Flex, message } from "antd";
import { useRouter } from "next/navigation";
import Script from "next/script";
import * as React from "react";
import { CodeLogin, GetRegCode } from "../../../components/common/fetchapi";
const crypto = require("crypto");
import yuxStorage from "@/app/api/yux-storage";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { KeyboardDoubleArrowLeft } from "@mui/icons-material";

export default function LoginPage() {
	const [activeStep, setActiveStep] = React.useState(0);
	const steps = ["输入您的手机号", "输入您获取的验证码", "立即登录吧~"];
	const [messageApi, contextHolder] = message.useMessage();
	const CheckScript = () => {
		yuxStorage.getItem("userprofile").then((state) => {
			if (state) {
				setIsLoading(true);
				setTimeout(() => {
					router.push("/dashboard");
					return null;
				}, 1500);
			}
		});
	};
	React.useEffect(() => {
		CheckScript();
	}, []);
	const router = useRouter();
	const [isLoading, setIsLoading] = React.useState(false);
	const [username, setusername] = React.useState("");
	const [pass, setpass] = React.useState("");
	const [sending, setsending] = React.useState(false);
	const handleUserNameChange = (event) => {
		setusername(event.target.value); // 更新状态为输入框的值
	};
	const handlePassChange = (event) => {
		setpass(event.target.value); // 更新状态为输入框的值
	};
	const handleGo = () => {
		router.push("/dashboard");
	};
	const checkPhone = (value) => {
		var mobile = value;
		var tel = /^0\d{2,3}-?\d{7,8}$/;
		var phone = /^1[3456789]\d{9}$/;
		if (mobile.length == 11) {
			//手机号码
			if (phone.test(mobile)) {
				return true;
			}
		} else if (mobile.length == 13 && mobile.indexOf("-") != -1) {
			//电话号码
			if (tel.test(mobile)) {
				return true;
			}
		}
		messageApi.error("信息未输入或有误，请检查后重试");
		setIsLoading(false);
	};

	const Suc = (mobileidc, token) => {
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

		yuxStorage.setItem("userprofile", mobileidc).then((e) => {
			yuxStorage.setItem("mobiletoken", token).then((e) => {
				const skey = generateRandomString();
				yuxStorage.setItem("skey", skey);
				async function sha256(input) {
					return crypto.createHash("sha256").update(input).digest("hex");
				}
				const text = skey + mobileidc + token + skey;
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

	const handleClickOpen = async () => {
		initGeetest4(
			{
				captchaId: "c1677059124b92b9dfb3c8919755b459",
				product: "bind",
			},
			function (captcha) {
				// captcha为验证码实例
				captcha.appendTo("#captcha");
				captcha
					.onReady(function () {
						captcha.showCaptcha();
					})
					.onSuccess(function () {
						if (checkPhone(username)) {
							setIsLoading(true);
							CodeLogin(username, pass)
								.then((e) => {
									Suc(e.mobile, e.tk);
								})
								.catch((e) => {
									messageApi.error(e);
									setIsLoading(false);
								});
						}
					});
			}
		);
	};

	const handleClickGetCode = async () => {
		if (checkPhone(username)) {
			try {
				initGeetest4(
					{
						captchaId: "c1677059124b92b9dfb3c8919755b459",
						product: "bind",
					},
					function (captcha) {
						// captcha为验证码实例
						captcha.appendTo("#captcha");
						captcha
							.onReady(function () {
								captcha.showCaptcha();
							})
							.onSuccess(function () {
								setsending(true);
								GetRegCode(username)
									.then((e) => {
										setActiveStep(
											(prevActiveStep) => prevActiveStep + 1
										);
										setsending(false);
										messageApi.success("验证码发送成功，请注意查收");
									})
									.catch((e) => {
										messageApi.error("发送失败，可能是间隔时间太短");
									});
							});
					}
				);
			} catch (error) {
				messageApi.error("验证脚本加载失败了哦，请您检查是否被浏览器拦截~");
			}
		}
	};

	return (
		<Container>
			<Script src="https://static.geetest.com/v4/gt4.js" />
			{contextHolder}
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

				{isLoading ? (
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
				) : (
					<>
						<Stepper
							activeStep={activeStep}
							alternativeLabel
							sx={{ mt: 1, mb: 1 }}
						>
							{steps.map((label) => (
								<Step key={label}>
									<StepLabel>{label}</StepLabel>
								</Step>
							))}
						</Stepper>

						{activeStep === 0 && (
							<Box sx={{ mt: 2 }}>
								<Flex gap="middle">
									<TextField
										id="outlined-basic"
										label="手机号"
										variant="outlined"
										required
										value={username}
										onChange={handleUserNameChange}
										style={{ marginRight: "5px" }}
									/>
								</Flex>
							</Box>
						)}
						{activeStep === 1 && (
							<Box sx={{ mt: 2 }}>
								<Flex gap="middle">
									<TextField
										id="outlined-basic"
										label="验证码"
										variant="outlined"
										required
										value={pass}
										onChange={handlePassChange}
										style={{ marginRight: "5px" }}
									/>
								</Flex>
							</Box>
						)}

						{!isLoading && activeStep === 0 && (
							<Button
								color="primary"
								sx={{ mt: "10px", mb: "10px" }}
								variant="outlined"
								startIcon={<KeyboardDoubleArrowLeft />}
								onClick={() => {
									setIsLoading(true);
									router.push("/dashboard");
								}}
							>
								返回主页
							</Button>
						)}

						{!isLoading && activeStep > 0 && (
							<Button
								color="primary"
								sx={{ mt: "10px", mb: "10px" }}
								variant="outlined"
								startIcon={<KeyboardDoubleArrowLeft />}
								onClick={() =>
									setActiveStep((prevActiveStep) => prevActiveStep - 1)
								}
							>
								上一步
							</Button>
						)}

						{!isLoading && activeStep < steps.length - 1 && (
							<Button
								color="primary"
								sx={{ mt: "10px" }}
								disabled={sending}
								variant="contained"
								startIcon={<KeyboardDoubleArrowRightIcon />}
								onClick={() => {
									if (activeStep === 0) {
										handleClickGetCode();
									} else {
										setActiveStep(
											(prevActiveStep) => prevActiveStep + 1
										);
									}
								}}
							>
								下一步
							</Button>
						)}

						{/* 在最后一步显示登录按钮 */}
						{!isLoading && activeStep === steps.length - 1 && (
							<Button
								variant="contained"
								color="primary"
								startIcon={<KeyboardDoubleArrowRightIcon />}
								onClick={handleClickOpen}
							>
								去登录账号
							</Button>
						)}
					</>
				)}
			</div>
		</Container>
	);
}
