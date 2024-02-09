import yuxStorage from "@/app/api/yux-storage";
import { Card, Flex, Typography, Switch, message, List } from "antd";
import * as React from "react";
const { Text } = Typography;
export default function SystemSettings() {
	//变量定义
	const [messageApi, contextHolder] = message.useMessage();
	const [PlaylistEndSwitchState, setPlaylistEndSwitchState] =
		React.useState(null);
	const [CannotPlaySwitchState, setCannotPlaySwitchState] =
		React.useState(null);
	const [LeftEventSwitchState, setLeftEventSwitchState] = React.useState(null);
	//函数
	React.useEffect(() => {
		yuxStorage
			.getItem("handlePlaylistEnd")
			.then((e) => {
				if (e === "0") {
					setPlaylistEndSwitchState(false);
				} else {
					setPlaylistEndSwitchState(true);
				}
			})
			.catch((e) => {
				setPlaylistEndSwitchState(true);
			});
		yuxStorage
			.getItem("handleCannotPlay")
			.then((e) => {
				if (e === "0") {
					setCannotPlaySwitchState(false);
				} else {
					setCannotPlaySwitchState(true);
				}
			})
			.catch((e) => {
				setCannotPlaySwitchState(true);
			});
		yuxStorage
			.getItem("handleLeftEvent")
			.then((e) => {
				if (e === "0") {
					setLeftEventSwitchState(false);
				} else {
					setLeftEventSwitchState(true);
				}
			})
			.catch((e) => {
				setLeftEventSwitchState(true);
			});
	}, []);
	/**
	 * @description 本地保存设置项
	 * @author 韩研凌(小研同学)
	 * @date 2024/02/08
	 * @param {String} Name 设置项
	 * @param {Promise<string>} state 设置状态，数字类型，参照《设置项参照表》
	 */
	const SaveSetting = (Name, state) => {
		return new Promise((resolve, reject) => {
			yuxStorage
				.setItem(Name, state)
				.then((e) => {
					resolve("success");
				})
				.catch((e) => {
					reject("failed");
				});
		});
	};
	/**
	 * @description 操作保存：列表播放完成时操作
	 * @author 韩研凌(小研同学)
	 * @date 2024/02/08
	 * @param {boolean} state 设置状态：语音提示为1（默认），关闭提醒为0
	 */
	const PlaylistEndSwitchOnChange = (state) => {
		let a = "0";
		if (state) {
			a = "1";
		}
		SaveSetting("handlePlaylistEnd", a)
			.then((e) => {
				let c = "语音提示";
				if (!state) {
					c = "关闭提醒";
				}
				messageApi.success("设置成功，当前状态为：" + c);
			})
			.catch((e) => {
				messageApi.error("设置失败");
			});
	};

	/**
	 * @description 操作保存：无法播放时操作
	 * @author 韩研凌(小研同学)
	 * @date 2024/02/08
	 * @param {boolean} state 设置状态：语音提示为1（默认），直接跳过为0
	 */
	const CannotPlaySwitchOnChange = (state) => {
		let a = "0";
		if (state) {
			a = "1";
		}
		SaveSetting("handleCannotPlay", a)
			.then((e) => {
				let c = "语音提示";
				if (!state) {
					c = "直接跳过";
				}
				messageApi.success("设置成功，当前状态为：" + c);
			})
			.catch((e) => {
				messageApi.error("设置失败");
			});
	};

	const LeftEventSwitchOnChange = (state) => {
		let a = "0";
		if (state) {
			a = "1";
		}
		SaveSetting("handleLeftEvent", a)
			.then((e) => {
				let c = "收藏歌曲";
				if (!state) {
					c = "无操作";
				}
				messageApi.success("设置成功，当前状态为：" + c);
			})
			.catch((e) => {
				messageApi.error("设置失败");
			});
	};

	const data = [
		{
			label: "列表播放完成时操作",
			description: "当列表播放时列表歌曲全部播放完成时的操作",
			enableLabel: "语音提示",
			disabledLabel: "关闭提醒",
			switchState: PlaylistEndSwitchState,
			switchOnchange: PlaylistEndSwitchOnChange,
		},
		{
			label: "无法播放时操作",
			description: "当列表播放时有歌曲无法播放时的操作",
			enableLabel: "语音提示",
			disabledLabel: "直接跳过",
			switchState: CannotPlaySwitchState,
			switchOnchange: CannotPlaySwitchOnChange,
		},
		{
			label: "系统‘上一曲’事件",
			description: "系统触发上一曲命令时执行的操作",
			enableLabel: "收藏歌曲",
			disabledLabel: "无操作",
			switchState: LeftEventSwitchState,
			switchOnchange: LeftEventSwitchOnChange,
		},
	];

	return (
		<>
			{contextHolder}
			{isNaN(PlaylistEndSwitchState || CannotPlaySwitchState) ? (
				<Text>设置加载中...</Text>
			) : (
				<Card>
					<Card.Meta
						title={"播放设置"}
						description={
							"此处为音乐播放的配置，所有配置需要重新打开设置后方可正常展示。"
						}
					/>
					<List
						style={{ marginTop: "10px" }}
						bordered
						dataSource={data}
						renderItem={(item) => (
							<List.Item
								extra={
									<Switch
										checkedChildren={item.enableLabel}
										unCheckedChildren={item.disabledLabel}
										checked={item.switchState}
										onChange={item.switchOnchange}
									/>
								}
							>
								<List.Item.Meta
									title={item.label}
									description={item.description}
								/>
							</List.Item>
						)}
					/>
				</Card>
			)}
		</>
	);
}
