import $ from "jquery";

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
};

export const SearchSong = async (SearchPlatform, SearchTerm) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "https://api.gumengya.com/Api/Music",
      type: "get",
      dataType: "json",
      data: {
        format: "json",
        text: `${SearchTerm}`,
        site: `${SearchPlatform}`,
      },
      beforeSend: function () {
        //请求中执行的代码
      },
      complete: function () {
        //请求完成执行的代码
      },
      error: function () {
        $.Deferred().reject("请求失败，请稍后重试~");
        reject("请求失败，请稍后重试~");
        return null;
      },
      success: function (res) {
        $.Deferred().resolve(res);
        const CCJson = ConvertJson(res.data);
        resolve(CCJson);
      },
    });
  });
};

export const HandleListenSong = async (SongId) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "https://api.paugram.com/netease/",
      type: "get",
      dataType: "json",
      data: {
        id: `${SongId}`,
      },
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
};

export const HandlePlayList = async (ListId) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "https://api.yimian.xyz/msc/",
      type: "get",
      dataType: "json",
      data: {
        type: "playlist",
        id: `${ListId}`,
      },
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
};
