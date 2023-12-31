import $ from "jquery";
import { cache } from "react";
import supabase from "@/app/api/supabase";
import { getShuanQApiClient } from "@/app/api/Api";

export const revalidate = 3600; //数据缓存时间

const ConvertJson = function (serverJson) {
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
    };
    convertedJsons.push(convertedJson);
  }

  return convertedJsons;
}; //转换服务器数据

const ConvertJsonSJK = function (serverJson) {
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
    };
    convertedJsons.push(convertedJson);
  }

  return convertedJsons;
};

const ConvertJsonSong = function (serverJson) {
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
      id: serverJson.data.songid,
      title: serverJson.data.title,
      artist: serverJson.data.author,
      cover: serverJson.data.pic,
      link: serverJson.data.url,
      lyric: serverJson.data.lrc,
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
    };
  }
};

export const HandleAjax = cache(async (url, type, data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: type,
      dataType: "json",
      data: data,
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
        $.Deferred().resolve(res);
        resolve(res);
      },
    });
  });
}); //全局网络请求函数

export const SearchSong = cache(async (SearchPlatform, SearchTerm) => {
  return new Promise((resolve, reject) => {
    HandleAjax("https://api.gumengya.com/Api/Music", "get", {
      format: "json",
      text: `${SearchTerm}`,
      site: `${SearchPlatform}`,
    })
      .then((res) => {
        const CCJson = ConvertJson(res.data);
        resolve(CCJson);
      })
      .catch((error) => {
        reject("请求失败，请稍后重试~");
      });
  });
}); //歌曲搜索函数

export const HandleListenSong = cache(async (SongId) => {
  return new Promise((resolve, reject) => {
    HandleAjax("https://api.paugram.com/netease/", "get", {
      id: `${SongId}`,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        HandleAjax("https://api.gumengya.com/Api/Netease", "get", {
          id: `${SongId}`,
          format: "json",
        })
          .then((res) => {
            const C = ConvertJsonSong(res);
            resolve(C);
          })
          .catch((error) => {
            reject("请求失败，请稍后重试~");
          });
      });
  });
}); //歌曲解析函数

export const HandleListenSongDatabase = cache(async (SongId) => {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("MusicSearch")
      .select("*")
      .eq("id", SongId);
    if (error) {
      reject(error);
    }
    const datajson = ConvertJsonSJK(data);
    if (Array.isArray(datajson) && datajson.length > 0) {
      resolve(datajson[0]);
    } else {
      reject("请求错误了哦~");
    }
  });
}); //歌曲解析函数

export const HandlePlayList = cache(async (ListId) => {
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
}); //歌单解析函数

const ConvertJsonBeiXuanPlaylist = function (serverJson) {
  const data = serverJson;
  const convertedJsons = [];

  for (let i = 0; i < data.length; i++) {
    const convertedJson = {
      id: data[i].song_id,
      name: data[i].name,
      artist: data[i].artist,
      cover: data[i].cover,
    };
    convertedJsons.push(convertedJson);
  }

  return convertedJsons;
};

export const HandlePlayListBeiXuan = cache(async (ListId) => {
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
}); //备选歌单解析函数

export const LoadMoreSearchSong = cache(async (Term, Platform, Page) => {
  return new Promise((resolve, reject) => {
    HandleAjax("https://api.gumengya.com/Api/Music", "get", {
      format: "json",
      text: `${Term}`,
      site: `${Platform}`,
      page: `${Page}`,
    })
      .then((res) => {
        const CCJson = ConvertJson(res.data);
        resolve(CCJson);
      })
      .catch((error) => {
        reject("请求失败，请稍后重试~");
      });
  });
}); //加载更多歌曲函数

export const GetYiYan = cache(async () => {
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
}); //加载一言

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
export default function speak(
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

// export const Login = async (account, password, machine_code, machine_info) => {
//   return new Promise((resolve, reject) => {
//     const LoginApi = getShuanQApiClient();
//     LoginApi.setRequestApi("/api/member_app/login");

//     //开始添加参数
//     LoginApi.addRequestParam("account", account);
//     LoginApi.addRequestParam("machine_info", machine_info);
//     LoginApi.addRequestParam("password", password);
//     LoginApi.addRequestParam("machine_code", machine_code);
//     //参数添加完成

//     LoginApi.sendRequest()
//       .then((response) => {
//         const responseJson = LoginApi.getResponseJsonObject(); //获取响应json对象
//         const responseCode = responseJson.code; //得到请求响应返回状态码
//         const responseMessage = responseJson.message; //得到请求响应返回信息
//         if (responseCode !== 1) {
//           //接口业务码响应非成功-将服务器返回信息提示
//           console.warn(responseMessage);
//           if (responseMessage == "用户名或密码错误不存在") {
//             reject("用户名或密码错误");
//           } else {
//             reject("请求错误，登录失败。请检查信息是否正确！");
//           }
//           return;
//         }
//         if (!LoginApi.requestDataSignatureVerify()) {
//           //响应数据验签检测未通过
//           console.warn("响应数据验签失败");
//           return;
//         }
//         if (!LoginApi.requestSafeCodeVerify()) {
//           //防劫持验证检测未通过
//           console.warn("检测到数据被劫持篡改了，请检查网络环境是否安全！");
//           return;
//         }
//         if (!LoginApi.requestDataTimeDifferenceVerify()) {
//           //响应数据检测验证不通过
//           console.warn(
//             "响应数据异常，与服务器时差相差过多，请检查系统时钟是否正确！"
//           );
//           return;
//         }
//         const dataJson = LoginApi.getDecryptResponseData(); // 解密aes得到原始未加密的dataJson数据

//         let data = JSON.parse(dataJson);
//         //console.log("data：", JSON.stringify(data));

//         //业务代码

//         resolve({
//           mobile: data.data.userInfo.account,
//           tk: data.user_token,
//         });
//       })
//       .catch((error) => {
//         console.log("请求失败" + error);
//         reject("请求失败");
//       });
//   });
// }; //登录

export const GetRegCode = async (phone) => {
  return new Promise((resolve, reject) => {
    const GetRegisterCodeApi = getShuanQApiClient();
    GetRegisterCodeApi.setRequestApi("/api/member_app/get_login_sms_code");

    //开始添加参数
    GetRegisterCodeApi.addRequestParam("phone", phone);
    //参数添加完成

    GetRegisterCodeApi.sendRequest()
      .then((response) => {
        const responseJson = GetRegisterCodeApi.getResponseJsonObject(); //获取响应json对象
        const responseCode = responseJson.code; //得到请求响应返回状态码
        const responseMessage = responseJson.message; //得到请求响应返回信息
        if (responseCode !== 1) {
          //接口业务码响应非成功-将服务器返回信息提示
          console.warn(responseMessage);
          reject("请求失败");
          return;
        }
        if (!GetRegisterCodeApi.requestDataSignatureVerify()) {
          //响应数据验签检测未通过
          console.warn("响应数据验签失败");
          return;
        }
        if (!GetRegisterCodeApi.requestSafeCodeVerify()) {
          //防劫持验证检测未通过
          console.warn("检测到数据被劫持篡改了，请检查网络环境是否安全！");
          return;
        }
        if (!GetRegisterCodeApi.requestDataTimeDifferenceVerify()) {
          //响应数据检测验证不通过
          console.warn(
            "响应数据异常，与服务器时差相差过多，请检查系统时钟是否正确！"
          );
          return;
        }
        const dataJson = GetRegisterCodeApi.getDecryptResponseData(); // 解密aes得到原始未加密的dataJson数据

        let data = JSON.parse(dataJson);
        //console.log("data：", JSON.stringify(data));

        //业务代码
        resolve("发送成功");
      })
      .catch((error) => {
        console.log("请求失败" + error);
        reject("请求失败");
      });
  });
};

export const CodeLogin = async (phone, code) => {
  return new Promise((resolve, reject) => {
    const CodeLoginApi = getShuanQApiClient();
    CodeLoginApi.setRequestApi("/api/member_app/phone_login");

    //开始添加参数
    CodeLoginApi.addRequestParam("phone", phone);
    CodeLoginApi.addRequestParam("code", code);
    CodeLoginApi.addRequestParam("machine_code", phone);
    //参数添加完成

    CodeLoginApi.sendRequest()
      .then((response) => {
        const responseJson = CodeLoginApi.getResponseJsonObject(); //获取响应json对象
        const responseCode = responseJson.code; //得到请求响应返回状态码
        const responseMessage = responseJson.message; //得到请求响应返回信息
        if (responseCode !== 1) {
          //接口业务码响应非成功-将服务器返回信息提示
          console.warn(responseMessage);
          if (responseMessage == "手机验证码错误") {
            reject("验证码错误或已到期");
          } else {
            reject("请求错误，登录失败。请检查信息是否正确！");
          }
          return;
        }
        if (!CodeLoginApi.requestDataSignatureVerify()) {
          //响应数据验签检测未通过
          console.warn("响应数据验签失败");
          return;
        }
        if (!CodeLoginApi.requestSafeCodeVerify()) {
          //防劫持验证检测未通过
          console.warn("检测到数据被劫持篡改了，请检查网络环境是否安全！");
          return;
        }
        if (!CodeLoginApi.requestDataTimeDifferenceVerify()) {
          //响应数据检测验证不通过
          console.warn(
            "响应数据异常，与服务器时差相差过多，请检查系统时钟是否正确！"
          );
          return;
        }
        const dataJson = CodeLoginApi.getDecryptResponseData(); // 解密aes得到原始未加密的dataJson数据

        let data = JSON.parse(dataJson);
        //console.log("data：", JSON.stringify(data));

        //业务代码
        resolve({
          mobile: data.data.userInfo.account,
          tk: data.user_token,
        });
      })
      .catch((error) => {
        console.log("请求失败" + error);
        reject("请求失败");
      });
  });
};
