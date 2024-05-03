import CryptoJS from "crypto-js";
import axios from "axios";

//全局验证配置对象
const ShuanQConfig = {
	ShuanQ_Host: process.env.ShuanQ_Host, //后台配置-站点地址
	ShuanQ_AppId: process.env.ShuanQ_AppID, //后台配置-应用ID-在应用列表获得
	ShuanQ_AppKey: process.env.ShuanQ_AppKey, //后台配置-应用密钥-在应用列表获得
	ShuanQ_AesKey: process.env.ShuanQ_AesKey, //后台配置-算法密钥aes-在 接口通信与加密配置 里生成
	ShuanQ_SignatureTimeLimitMinimum: 90, //本地配置-允许请求时差最小值-单位为秒
	ShuanQ_SignatureTimeLimitMaximum: 90, //本地配置-允许请求时差最大值-单位为秒
	ShuanQ_HeartbeatFrequency: 300, //本地配置-心跳验证间隔频率-单位为秒
	Debug: false, //开启调试输出
};

//验证接口类
class ShuanQApiClient {
	_requestApi;
	_requestParams;
	_request_safe_code;
	_responseData;
	_responseJson;

	_requestFunc;
	_md5Func;
	_encryptFunc;
	_decryptFunc;

	//构造方法
	constructor(requestFunc, md5Func, encryptFunc, decryptFunc) {
		this._requestApi = ""; //请求接口地址
		this._requestParams = {}; //请求参数
		this._request_safe_code = this.getRandomString("", 32); //请求随机安全码-防劫持验证用
		this._responseData = ""; //响应数据(发送请求后这里则会被赋值)
		this._responseJson = {}; //响应数据json对象(发送请求后这里则会被赋值)

		this._requestFunc = requestFunc;
		this._md5Func = md5Func;
		this._encryptFunc = encryptFunc;
		this._decryptFunc = decryptFunc;
	}

	//设置请求接口地址
	setRequestApi(api) {
		this._requestApi = api;
	}

	//添加请求参数
	addRequestParam(key, value) {
		this._requestParams[key] = value;
	}

	//发送请求
	sendRequest() {
		this.log("==========请求接口开始==========");
		this.log("请求接口地址：", this._requestApi);

		this.log("原始请求参数：", this._requestParams);
		const actualRequestParams = this.paramHandle(this._requestParams);
		this.log("实际请求参数-已加密：", actualRequestParams);
		return new Promise((resolve, reject) => {
			this._requestFunc(
				ShuanQConfig.ShuanQ_Host + this._requestApi,
				actualRequestParams
			)
				.then((response) => {
					this._responseData = response;
					this._responseJson = JSON.parse(this._responseData);
					this.log("响应返回值：", response);
					resolve(response);
				})
				.catch((error) => {
					reject(error);
				});
			this.log("==========请求接口结束==========");
		});
	}

	//获取响应数据
	getResponseData() {
		return this._responseData;
	}

	//获取响应json对象
	getResponseJsonObject() {
		return this._responseJson;
	}

	//解密data数据
	getDecryptResponseData() {
		const dataOriginal = this._responseJson["data"];
		return this.decrypt(dataOriginal, ShuanQConfig.ShuanQ_AesKey);
	}

	//获取解密后的data json对象
	getDataJsonObject() {
		const dataJson = this.getDecryptResponseData();
		return JSON.parse(dataJson);
	}

	//请求安全码验证-响应数据防劫持验证
	requestSafeCodeVerify() {
		const responseDataJson = this.getDataJsonObject();
		if (
			this._request_safe_code !==
			responseDataJson.moreOtherData.request_safe_code
		) {
			return false;
		}
		return true;
	}

	//响应数据签名验证
	requestDataSignatureVerify() {
		const dataOriginal = this._responseJson["data"];
		const signature = this._responseJson["signature"];
		return (
			this.getStringMd5(
				dataOriginal +
					this._responseJson["timestamp"].toString() +
					ShuanQConfig.ShuanQ_AppKey
			) === signature
		);
	}

	//响应数据时差验证
	requestDataTimeDifferenceVerify() {
		const server_time = this._responseJson["timestamp"];
		const allow_time_scope_minimum =
			server_time - ShuanQConfig.ShuanQ_SignatureTimeLimitMinimum;
		const allow_time_scope_maximum =
			server_time + ShuanQConfig.ShuanQ_SignatureTimeLimitMaximum;
		const timestamp = this.getTimestamp();
		return !(
			timestamp > allow_time_scope_maximum ||
			timestamp < allow_time_scope_minimum
		);
	}

	//统一参数中转处理，返回最终处理完的必要参数、签名、加密的参数map
	paramHandle(params) {
		params["appid"] = ShuanQConfig.ShuanQ_AppId; //增加必要参数-应用ID
		params["timestamp"] = this.getTimestamp().toString(); //增加签名必要参数-时间戳
		params["request_safe_code"] = this._request_safe_code; //增加请求防劫持验证参数
		params["signature"] = this.getStringMd5(
			this.getParamsSignString(params) + ShuanQConfig.ShuanQ_AppKey
		);
		this.log("实际请求参数-未加密：", params);
		const keys = Object.keys(params);
		const encryptionRequestParams = { appid: params.appid };
		keys.map((key) => {
			if (key !== "appid") {
				//appid参数是不需要加密的
				encryptionRequestParams[
					this.encrypt(key, ShuanQConfig.ShuanQ_AesKey)
				] = this.encrypt(params[key], ShuanQConfig.ShuanQ_AesKey);
			}
		});
		return encryptionRequestParams;
	}

	//获取计算参数签名字符串
	getParamsSignString(params) {
		const keys = Object.keys(params).sort();
		const params_sort = {};
		for (let i = 0; i < keys.length; i++) {
			params_sort[keys[i]] = params[keys[i]];
		}
		let signStr = "";
		Object.keys(params_sort).map((item) => {
			if (
				params_sort[item] !== "" &&
				params_sort[item] !== undefined &&
				params_sort[item] != null &&
				item !== "signature" &&
				item !== "appid"
			) {
				signStr += `&${item}=${params_sort[item]}`;
			}
		});
		signStr = signStr.slice(1);
		this.log("参数签名字符串：", signStr);
		return signStr;
	}
	//获取当前时间戳
	getTimestamp() {
		return Math.round(new Date().getTime() / 1000);
	}

	//获取字符串md5值
	getStringMd5(str) {
		return this._md5Func(str).toString();
	}

	//获取随机字符串
	getRandomString(base_str, randomLength) {
		if (!base_str)
			base_str =
				"AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";
		let str = "";
		for (let i = 0; i < randomLength; i++) {
			str += base_str[parseInt(Math.random() * base_str.length)];
		}
		return str;
	}

	//加密方法
	encrypt(data, keyStr) {
		// 加密
		if (keyStr.length !== 16) {
			keyStr = keyStr.slice(0, 16);
		}
		return this._encryptFunc(data, keyStr).toString();
	}

	//解密方法
	decrypt(data, keyStr) {
		// 解密
		if (keyStr.length !== 16) {
			keyStr = keyStr.slice(0, 16);
		}
		return this._decryptFunc(data, keyStr).toString();
	}

	//日志输出
	log(...logs) {
		if (ShuanQConfig.Debug) {
			console.log(...logs);
		}
	}
}

//全局通用获取验证接口类实例方法
const getShuanQApiClient = () => {
	return new ShuanQApiClient(
		function (url, data) {
			return new Promise((resolve, reject) => {
				//使用axios实现请求
				axios({
					headers: {
						"Content-Type": "application/json;charset=UTF-8",
					},
					method: "post",
					url,
					data,
				})
					.then((response) => {
						resolve(JSON.stringify(response.data));
					})
					.catch((error) => {
						reject(error);
					});
			});
		},
		(str) => {
			return CryptoJS.MD5(str);
		},
		(data, keyStr) => {
			// 加密
			if (keyStr.length !== 16) {
				keyStr = keyStr.slice(0, 16);
			}
			let key = CryptoJS.enc.Utf8.parse(keyStr);
			let srcs = CryptoJS.enc.Utf8.parse(data);
			let encrypted = CryptoJS.AES.encrypt(srcs, key, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7,
			}); // 加密模式为ECB，补码方式为PKCS5Padding（也就是PKCS7）
			return encrypted.toString();
		},
		(data, keyStr) => {
			// 解密
			if (keyStr.length !== 16) {
				keyStr = keyStr.slice(0, 16);
			}
			let key = CryptoJS.enc.Utf8.parse(keyStr);
			let decrypt = CryptoJS.AES.decrypt(data, key, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7,
			});
			return CryptoJS.enc.Utf8.stringify(decrypt).toString();
		}
	);
};

export { getShuanQApiClient };
