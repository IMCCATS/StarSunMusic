import $ from "jquery";
import { cache } from "react";
import supabase from "@/app/api/supabase";

export const revalidate = 3600; //数据缓存时间

const ConvertJson = function (serverJson) {
  const data = serverJson;
  const convertedJsons = [];

  for (let i = 0; i < data.length; i++) {
    const convertedJson = {
      songid: data[i].songid,
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
      songid: data[i].id,
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
        reject("请求失败，请稍后重试~");
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
