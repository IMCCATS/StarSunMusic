import yuxStorage from "@/app/api/yux-storage";
import { Card, Typography, Switch, message, List } from "antd";
import * as React from "react";
const { Text } = Typography;
export default function SystemSettings() {
	//变量定义
	const [messageApi, contextHolder] = message.useMessage();
	const [PlaylistEndSwitchState, setPlaylistEndSwitchState] =
		React.useState(null);
	const [ListPlayFailedSwitchState, setListPlayFailedSwitchState] =
		React.useState(null);
	//函数

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
			label: "列表播放失败时操作",
			description: "当列表播放时有歌曲播放失败时的操作",
			enableLabel: "语音提示",
			disabledLabel: "关闭提醒",
			switchState: ListPlayFailedSwitchState,
			switchOnchange: ListPlayFailedSwitchOnChange,
		},
	];

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
			.getItem("handleListPlayFailed")
			.then((e) => {
				if (e === "0") {
					setListPlayFailedSwitchState(false);
				} else {
					setListPlayFailedSwitchState(true);
				}
			})
			.catch((e) => {
				setListPlayFailedSwitchState(true);
			});
		setac(data);
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
	 * @description 操作保存：播放列表完成时事件
	 * @author 韩研凌(小研同学)
	 * @date 2024/02/08
	 * @param {boolean} state 设置状态：语音提示为1（默认），直接跳过为0
	 */
	const PlaylistEndSwitchOnChange = (state) => {
		let a = "0";
		if (state) {
			a = "1";
		}
		SaveSetting("handlePlaylistEnd", a)
			.then((e) => {
				messageApi.success("设置成功");
			})
			.catch((e) => {
				messageApi.error("设置失败");
			});
	};

	const ListPlayFailedSwitchOnChange = (state) => {
		let a = "0";
		if (state) {
			a = "1";
		}
		SaveSetting("handleListPlayFailed", a)
			.then((e) => {
				messageApi.success("设置成功");
			})
			.catch((e) => {
				messageApi.error("设置失败");
			});
	};

	const [ac, setac] = React.useState([]);

	return (
		<>
			{contextHolder}
			{isNaN(PlaylistEndSwitchState) || isNaN(ListPlayFailedSwitchState) ? (
				<Text>设置加载中...</Text>
			) : (
				<Card>
					<Card.Meta
						title={"播放设置"}
						description={"此处为音乐播放的配置"}
					/>
					<List
						style={{ marginTop: "10px" }}
						bordered
						dataSource={ac}
						renderItem={(item) => (
							<List.Item
								extra={
									<Switch
										checkedChildren={item.enableLabel}
										unCheckedChildren={item.disabledLabel}
										value={item.switchState}
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
