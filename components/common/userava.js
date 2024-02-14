import yuxStorage from "@/app/api/yux-storage";
import { CurrentSongContext } from "@/app/dashboard/page";
import { AccountCircle } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import {
	Avatar,
	Button,
	Card,
	CardContent,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Menu,
	MenuItem,
	Typography,
} from "@mui/material";
import { Descriptions, Divider, Flex, message, Modal } from "antd";
import { useRouter } from "next/navigation";
import * as React from "react";
const crypto = require("crypto");

export default function UserAva() {
	const router = useRouter();
	const { setdisabled, profile, setprofile } =
		React.useContext(CurrentSongContext);

	const [anchorEl, setAnchorEl] = React.useState(null);
	const [messageApi, contextHolder] = message.useMessage();
	const [user, setuser] = React.useState("");
	const [mobile, setmobile] = React.useState("");

	const handleQuitLogin = () => {
		handleCloseC();
		Modal.confirm({
			title: "确认退出登录？",
			content: <p>此操作将退出您的账户登录。</p>,
			okText: "确认",
			cancelText: "取消",
			onOk() {
				setdisabled(true);
				yuxStorage.removeItem("userprofile").then(() => {
					yuxStorage.removeItem("mobiletoken").then(() => {
						yuxStorage.removeItem("ykey").then(() => {
							yuxStorage.removeItem("skey").then(() => {
								setprofile(false);
								setTimeout(() => {
									messageApi.success("退出登录成功~");
									setdisabled(false);
								}, 1000);
							});
						});
					});
				});
			},
			onCancel() {},
		});
	};

	React.useEffect(() => {
		const b = yuxStorage.getItem("mobiletoken");
		const c = yuxStorage.getItem("userprofile");
		const d = yuxStorage.getItem("ykey");
		const e = yuxStorage.getItem("skey");

		async function sha256(input) {
			return crypto.createHash("sha256").update(input).digest("hex");
		}

		Promise.all([b, c, d, e])
			.then(async ([bb, cc, dd, ee]) => {
				if (cc) {
					const fullPhone = cc;
					const lastFourDigits = fullPhone.slice(-4); // 获取手机号后四位
					setuser(`用户${lastFourDigits}`); // 组合成 "用户" + 手机号后四位

					// 格式化手机号，中间四位用*代替
					const maskedPhone = `${fullPhone.slice(0, 3)}****${lastFourDigits}`;
					setmobile(maskedPhone);
					const text = ee + cc + bb + ee;
					if (text) {
						const ecode = await sha256(text);
						if (ecode === dd) {
							setprofile(true);
						} else {
							// console.error([bb, cc, dd, ee, text, ecode]);
							// setprofile(false);
							// messageApi.error("自动登录失败或登录失效啦，请重新登录~");
							yuxStorage.removeItem("userprofile").then(() => {
								yuxStorage.removeItem("mobiletoken").then(() => {
									yuxStorage.removeItem("ykey").then(() => {
										yuxStorage.removeItem("skey").then(() => {
											setprofile(false);
											messageApi.error("自动登录失败或登录失效啦，请重新登录~");
										});
									});
								});
							});
						}
					} else {
						setprofile(false);
					}
				} else {
					setprofile(false);
				}
			})
			.catch((error) => {
				setprofile(false);
				messageApi.error("技术问题出现啦，快联系开发者修复~");
				if (process.env.NODE_ENV === "development") {
					messageApi.error("Error fetching app data:", error);
					console.error("Error fetching app data:", error);
				}
			});
	}, []);

	const handleLogin = () => {
		handleCloseC();
		yuxStorage
			.getItem("userprofile")
			.then((profile) => {
				if (!profile) {
					setdisabled(true);
					router.push("/oauth-login");
				} else {
					messageApi.info("您已经登录了哦~");
				}
			})
			.catch((err) => {
				setdisabled(true);
				router.push("/oauth-login");
			});
	};

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleCloseC = () => {
		setAnchorEl(null);
	};
	const [CurrentComponent, SetCurrentComponent] = React.useState(null);
	const [CurrentCptName, SetCurrentCptName] = React.useState("");
	const [Clickopen, SetClickopen] = React.useState(false);
	const handleopen = (name, component) => {
		SetClickopen(false);
		SetCurrentComponent(component);
		SetCurrentCptName(name);
		SetClickopen(true);
	};

	const UserInformations = ({ userInfo }) => {
		const { nickname, phoneNumber } = userInfo;
		const items = [
			{
				key: "1",
				label: "预览体验权限",
				children: "否",
			},
			{
				key: "2",
				label: "社群成员",
				children: "否",
			},
			{
				key: "3",
				label: "特约用户",
				children: "否",
			},
			{
				key: "4",
				label: "特别贡献成员",
				children: "否",
			},
			{
				key: "5",
				label: "捐赠成员",
				children: "否",
			},
			{
				key: "6",
				label: "开发成员",
				children: "否",
			},
			{
				key: "7",
				label: "用户积分",
				children: "0",
			},
		];
		return (
			<>
				<Card sx={{ minWidth: 275 }}>
					<CardContent>
						<Flex
							gap={"large"}
							vertical
						>
							{/* 用户信息部分 */}
							<Flex>
								<Avatar sx={{ mx: 2, mb: 2 }}>
									<AccountCircle />
								</Avatar>
								<Flex vertical>
									<Typography
										variant="h5"
										component="div"
									>
										{nickname}
									</Typography>
									<Typography sx={{ color: "text.secondary" }}>
										手机号: +86 {phoneNumber}
									</Typography>
								</Flex>
							</Flex>
							<Divider />
							{/* 用户资产与数据部分 */}
							<Descriptions
								column={{
									xs: 1,
									sm: 2,
									md: 3,
									lg: 3,
									xl: 4,
									xxl: 4,
								}}
								size="small"
								bordered
								title="权限信息"
								items={items}
							/>
						</Flex>
					</CardContent>
				</Card>
			</>
		);
	};

	const [MenuC, setMenuC] = React.useState(null);

	React.useEffect(() => {
		if (profile) {
			setMenuC([
				<MenuItem
					key={"userinfo"}
					onClick={() => {
						handleCloseC();
						handleopen(
							"用户信息",
							<UserInformations
								userInfo={{ nickname: user, phoneNumber: mobile }}
							/>
						);
					}}
				>
					<AccountCircle />
					{user}
				</MenuItem>,
				<MenuItem
					key={"login"}
					onClick={handleQuitLogin}
				>
					<LogoutIcon />
					退出登录
				</MenuItem>,
			]);
		} else {
			setMenuC([
				<MenuItem
					key={"login"}
					onClick={handleLogin}
				>
					<AccountCircle />
					未登录·点击登录
				</MenuItem>,
			]);
		}
	}, [profile]);

	return (
		<>
			{contextHolder}
			<Dialog
				fullWidth
				open={Clickopen}
				onClose={() => {
					SetClickopen(false);
				}}
				scroll={"paper"}
			>
				<DialogTitle>{CurrentCptName}</DialogTitle>
				<DialogContent dividers={true}>{CurrentComponent}</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							SetClickopen(false);
						}}
					>
						关闭
					</Button>
				</DialogActions>
			</Dialog>
			<IconButton
				size="large"
				aria-label="account of current user"
				aria-controls="menu-appbar"
				aria-haspopup="true"
				onClick={handleMenu}
				color="inherit"
			>
				<AccountCircle />
			</IconButton>
			<Menu
				id="menu-appbar"
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				keepMounted
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				open={Boolean(anchorEl)}
				onClose={handleCloseC}
				children={MenuC}
			/>
		</>
	);
}
