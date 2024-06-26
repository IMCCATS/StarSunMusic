import yuxStorage from "@/app/api/yux-storage";
import $ from "jquery";
import { Base64 } from "js-base64";
import { Modal } from "antd-mobile";

export const revalidate = 3600; //数据缓存时间

/**
 * @description 转换接口提供的数据为程序可接受的数据
 * @author 韩研凌(小研同学)
 * @date 2024/02/06
 * @param {Array} serverJson 服务器提供的json
 * @returns {Array} 转换后的数据
 */
const ConvertJson = (serverJson, pt) => {
	const data = serverJson;
	const convertedJsons = [];

	for (let i = 0; i < data.length; i++) {
		const convertedJson = {
			id: data[i].songid,
			title: data[i].title,
			artist: data[i].author,
			author: data[i].author,
			cover: data[i].pic,
			lyric: data[i].lrc,
			link: data[i].url,
			name: data[i].title,
			fromst: pt,
		};
		convertedJsons.push(convertedJson);
	}

	return convertedJsons;
}; //转换服务器数据

/**
 * @description 转换接口提供的数据为程序可接受的数据
 * @author 韩研凌(小研同学)
 * @date 2024/02/06
 * @param {Array} serverJson 服务器提供的json
 * @returns {Array} 转换后的数据
 */
const ConvertJsonSJK = (serverJson) => {
	const data = serverJson;
	const convertedJsons = [];

	for (let i = 0; i < data.length; i++) {
		const convertedJson = {
			id: data[i].id,
			title: data[i].title,
			artist: data[i].artist,
			author: data[i].artist,
			cover: data[i].cover,
			lyric: data[i].lyric,
			link: atob(data[i].link),
			fromst: "sjk",
		};
		convertedJsons.push(convertedJson);
	}

	return convertedJsons;
};

/**
 * @description 转换接口提供的数据为程序可接受的数据
 * @author 韩研凌(小研同学)
 * @date 2024/02/06
 * @param {Array} serverJson 服务器提供的json
 * @returns {Array} 转换后的数据
 */
const ConvertJsonSong = (serverJson, pt) => {
	if (
		serverJson.data &&
		serverJson.data.songid &&
		serverJson.data.title &&
		serverJson.data.author &&
		serverJson.data.pic &&
		serverJson.data.url &&
		serverJson.data.lrc
	) {
		return {
			name: serverJson.data.title,
			id: serverJson.data.songid,
			title: serverJson.data.title,
			artist: serverJson.data.author,
			cover: serverJson.data.pic,
			link: serverJson.data.url,
			lyric: serverJson.data.lrc,
			fromst: pt,
		};
	} else {
		return {
			id: 1965822544,
			title: "钉钉视频会议来电铃声（电音完整版)",
			artist: "不会低调的狗",
			cover:
				"https://p2.music.126.net/W9fKQlL6b3YzcoTlZoT7nA==/109951167402688889.jpg?param=250y250",
			lyric:
				"[00:00.00] 作词 : 不会低调的狗\n[00:01.00] 作曲 : 不会低调的狗\n[00:02.00] 编曲 : 不会低调的狗\n[99:00.00]纯音乐，请欣赏\n",
			link: "https://music.163.com/song/media/outer/url?id=1965822544",
			fromst: "netease",
		};
	}
};

/**
 * @description 全局网络请求函数，接口使用Base64加密
 * @author 韩研凌(小研同学)
 * @date 2024/02/06
 * @param {string} url
 * @param {string} type
 * @param {Array} data 请求的数据，Json格式
 */
const HandleAjax = async (url, type, data) => {
	return new Promise((resolve, reject) => {
		const ad = encodeURIComponent(JSON.stringify({ url, data }));
		const adc = Base64.encode(ad);
		$.ajax({
			url: `/api/ajax`,
			type: type,
			dataType: "json",
			data: { string: adc },
			beforeSend: function () {
				//请求中执行的代码
			},
			complete: function () {
				//请求完成执行的代码
			},
			error: function () {
				$.Deferred().reject("请求失败，请稍后重试~");
				reject("请求失败，请稍后重试~");
			},
			success: function (res) {
				if (res.status === "success") {
					const data = Base64.decode(res.data);
					if (Array.isArray(data)) {
						$.Deferred().resolve(data);
						resolve(data);
					} else {
						const object = JSON.parse(data);
						$.Deferred().resolve(object);
						resolve(object);
					}
				} else {
					$.Deferred().reject("请求失败，请稍后重试~");
					reject("请求失败，请稍后重试~");
				}
			},
		});
	});
}; //全局网络请求函数

/**
 * @description 歌曲搜索函数，通过调用接口请求获取搜索到的歌曲
 * @author 韩研凌(小研同学)
 * @date 2024/02/06
 * @param {string} SearchPlatform 搜索的平台，可选netease,kugou,migu,kuwo(不可用)
 * @param {string} SearchTerm 搜索的内容
 * @returns {Promise<Array>} 返回从接口获取到的歌曲数据（数组）
 */
const SearchSong = async (SearchPlatform, SearchTerm) => {
	return new Promise((resolve, reject) => {
		HandleAjax("https://api.gumengya.com/Api/Music", "get", {
			format: "json",
			text: `${SearchTerm}`,
			site: `${SearchPlatform}`,
		})
			.then((res) => {
				const CCJson = ConvertJson(res.data, SearchPlatform);
				resolve(CCJson);
			})
			.catch((error) => {
				reject("请求失败，请稍后重试~");
			});
	});
}; //歌曲搜索函数

/**
 * @description 根据歌曲ID从接口获取歌曲信息并返回
 * @author 韩研凌(小研同学)
 * @date 2024/02/06
 * @param {string} id 歌曲云音乐ID
 * @returns {Promise<Array>} Promise对象返回歌曲的数据，如果获取错误则拒绝请求
 */
const HandleListenSong = async (id) => {
	return new Promise((resolve, reject) => {
		HandleAjax("https://api.paugram.com/netease/", "get", {
			id: `${id}`,
		})
			.then((res) => {
				resolve({ ...res, fromst: "netease" });
			})
			.catch((error) => {
				HandleAjax("https://api.gumengya.com/Api/Netease", "get", {
					id: `${id}`,
					format: "json",
				})
					.then((res) => {
						const C = ConvertJsonSong(res, "netease");
						resolve(C);
					})
					.catch((error) => {
						reject("请求失败，请稍后重试~");
					});
			});
	});
}; //歌曲解析函数

const HandleListenKugou = (id) => {
	return new Promise((resolve, reject) => {
		HandleAjax("https://api.gumengya.com/Api/KuGou", "get", {
			id: `${id}`,
			format: "json",
		})
			.then((res) => {
				const C = ConvertJsonSong(res, "kugou");
				resolve(C);
			})
			.catch((error) => {
				reject("请求失败，请稍后重试~");
			});
	});
};

const HandleListenMigu = (id) => {
	return new Promise((resolve, reject) => {
		HandleAjax("https://api.gumengya.com/Api/MiGu", "get", {
			id: `${id}`,
			format: "json",
		})
			.then((res) => {
				const C = ConvertJsonSong(res, "migu");
				resolve(C);
			})
			.catch((error) => {
				reject("请求失败，请稍后重试~");
			});
	});
};

/**
 * @description 从服务器获取歌单中的歌曲数据
 * @author 韩研凌(小研同学)
 * @date 2024/02/06
 * @param {string} ListId 歌单ID
 * @returns {Promise<Array>} res 歌单中歌曲数据，数组格式
 */
const HandlePlayListBeiXuan = async (ListId) => {
	return new Promise((resolve, reject) => {
		HandleAjax("https://api.yimian.xyz/msc/", "get", {
			type: "playlist",
			id: `${ListId}`,
		})
			.then((res) => {
				resolve(res);
			})
			.catch((error) => {
				reject("请求失败，请稍后重试~");
			});
	});
}; //歌单解析函数

/**
 * @description 转换接口提供的数据为程序可接受的数据
 * @author 韩研凌(小研同学)
 * @date 2024/02/06
 * @param {Array} serverJson 服务器提供的json
 * @returns {Array} 转换后的数据
 */
const ConvertJsonBeiXuanPlaylist = function (serverJson) {
	const data = serverJson;
	const convertedJsons = [];

	for (let i = 0; i < data.length; i++) {
		const convertedJson = {
			id: data[i].song_id,
			name: data[i].name,
			artist: data[i].artist,
			cover: data[i].cover,
			fromst: "netease",
		};
		convertedJsons.push(convertedJson);
	}

	return convertedJsons;
};

/**
 * @description 从服务器获取歌单中的歌曲数据
 * @author 韩研凌(小研同学)
 * @date 2024/02/06
 * @param {string} ListId 歌单ID
 * @returns {Promise<Array>} res 歌单中歌曲数据，数组格式
 */
const HandlePlayList = async (ListId) => {
	return new Promise((resolve, reject) => {
		HandleAjax(
			`https://api.gumengya.com/Api/MusicList?format=json&url=https://music.163.com/playlist?id=${ListId}`,
			"get"
		)
			.then((res) => {
				const C = ConvertJsonBeiXuanPlaylist(res.data);
				resolve(C);
			})
			.catch((error) => {
				reject("请求失败，请稍后重试~");
			});
	});
}; //备选歌单解析函数

/**
 * @description 从服务器获取更多歌曲，补充到前台
 * @author 韩研凌(小研同学)
 * @date 2024/02/06
 * @param {string} Term 搜索的内容
 * @param {string} Platform 搜索的平台
 * @param {string} Page 当前搜索的页面
 * @returns {Promise<Array>} CCJson 第Page页在服务器的歌曲数据
 */
const LoadMoreSearchSong = async (Term, Platform, Page) => {
	return new Promise((resolve, reject) => {
		HandleAjax("https://api.gumengya.com/Api/Music", "get", {
			format: "json",
			text: `${Term}`,
			site: `${Platform}`,
			page: `${Page}`,
		})
			.then((res) => {
				const CCJson = ConvertJson(res.data, Platform);
				resolve(CCJson);
			})
			.catch((error) => {
				reject("请求失败，请稍后重试~");
			});
	});
}; //加载更多歌曲函数

/**
 * @description 从接口获取每日一言返回前台，无需参数
 * @author 韩研凌(小研同学)
 * @date 2024/02/06
 */
const GetYiYan = async () => {
	return new Promise((resolve, reject) => {
		HandleAjax("https://v1.hitokoto.cn", "get", {
			c: "i",
		})
			.then((res) => {
				if (res && res.hitokoto && res.from) {
					resolve({
						text: res.hitokoto,
						from: res.from,
					});
				} else {
					resolve({
						text: "我自横刀向天笑，去留肝胆两昆仑。",
						from: "狱中题壁",
					});
				}
			})
			.catch((error) => {
				reject("请求失败，请稍后重试~");
			});
	});
}; //加载一言

/**
 * @description 文字转语音方法
 * @public
 * @param { text, rate, lang, volume, pitch } object
 * @param  text 要合成的文字内容，字符串
 * @param  rate 读取文字的语速 0.1~10  正常1
 * @param  lang 读取文字时的语言
 * @param  volume  读取时声音的音量 0~1  正常1
 * @param  pitch  读取时声音的音高 0~2  正常1
 * @returns SpeechSynthesisUtterance
 */
function speak(
	{ text, speechRate, lang, volume, pitch },
	endEvent,
	startEvent
) {
	if (!window.SpeechSynthesisUtterance) {
		console.warn("当前浏览器不支持文字转语音服务");
		return;
	}

	if (!text) {
		return;
	}

	const speechUtterance = new SpeechSynthesisUtterance();
	speechUtterance.text = text;
	speechUtterance.rate = speechRate || 1;
	speechUtterance.lang = lang || "zh-CN";
	speechUtterance.volume = volume || 1;
	speechUtterance.pitch = pitch || 1;
	speechUtterance.onend = function () {
		endEvent && endEvent();
	};
	speechUtterance.onstart = function () {
		startEvent && startEvent();
	};
	speechSynthesis.speak(speechUtterance);

	return speechUtterance;
}

export {
	HandleAjax,
	HandleListenSong,
	HandlePlayList,
	HandlePlayListBeiXuan,
	SearchSong,
	LoadMoreSearchSong,
	speak,
	GetYiYan,
	HandleListenKugou,
	HandleListenMigu,
};
