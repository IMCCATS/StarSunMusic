import PouchDB from "pouchdb";
PouchDB.plugin(require("pouchdb-upsert"));

const db = new PouchDB("StarSunMusic_Data");
const Songdb = new PouchDB("StarSunMusic_Songs");

//向本地数据库设置数据
export const addAppData = (name, key) => {
  return new Promise((resolve, reject) => {
    function myDeltaFunction(doc) {
      doc.counter = doc.counter || 0;
      doc.counter++;
      doc.key = key;
      return doc;
    }

    db.upsert(name, myDeltaFunction)
      .then(function (e) {
        resolve(e);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

//获取数据库数据
export const getAppData = (name) => {
  return new Promise((resolve, reject) => {
    db.get(name)
      .catch(function (err) {
        if (err.name === "not_found") {
          return null;
        } else {
          reject(err);
        }
      })
      .then(function (result) {
        if (result && result.key) {
          resolve(result.key);
        } else {
          resolve(null);
        }
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

//删除指定数据库数据
export const delAppData = (name) => {
  return new Promise((resolve, reject) => {
    db.get(name)
      .then(function (doc) {
        return db.remove(doc);
      })
      .then(function (result) {
        resolve(result);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

export const delSongsData = () => {
  return new Promise((resolve, reject) => {
    Songdb.allDocs({
      include_docs: true,
    })
      .then(function (result) {
        try {
          result.rows.forEach((row) => {
            Songdb.remove(row);
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

//批量添加歌曲到本地
export const AddLargeSongsToPersonalPlaylist = (songs) => {
  return new Promise((resolve, reject) => {
    const docs = songs.map((song) => {
      return {
        _id: `${song.songId}_${song.title}_${song.artist}`,
        title: song.title,
        artist: song.artist,
        songId: song.songId,
      };
    });

    Songdb.bulkDocs(docs)
      .then(function (result) {
        console.log(result);
        resolve(result);
      })
      .catch(function (err) {
        console.log(err);
        reject(err);
      });
  });
};

//批量添加歌曲到本地
export const GetLargeSongsToPersonalPlaylist = (songs) => {
  return new Promise((resolve, reject) => {
    Songdb.allDocs({
      include_docs: true,
    })
      .then(function (result) {
        resolve(result.rows);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

//向本地数据库设置数据
export const addSongData = (song) => {
  return new Promise((resolve, reject) => {
    function myDeltaFunction(doc) {
      doc.counter = doc.counter || 0;
      doc.counter++;
      doc.title = song.title || "";
      doc.artist = song.artist || "";
      doc.songId = song.songId || "";
      return doc;
    }

    Songdb.upsert(song.title, myDeltaFunction)
      .then(function (e) {
        resolve(e);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

// //向本地数据库新增个人歌单-歌曲数据
// export const addSongData = (title, artist, cover, songId) => {
//   return new Promise((resolve, reject) => {
//     // 数据格式
//     const data = {
//       _id: new Date().toISOString(),
//       title,
//       artist,
//       cover,
//       songId,
//     };
//     Songdb.put(data)
//       .then(function (result) {
//         resolve(result);
//       })
//       .catch(function (err) {
//         reject(err);
//       });
//   });
// };
