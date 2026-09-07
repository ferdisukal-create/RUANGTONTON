import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('ruangtonton.db');

export const initDatabase = async () => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      // Albums table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS albums (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          coverUri TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        );`,
        [],
        () => {},
        (_, error) => {
          reject(error);
          return false;
        }
      );

      // Videos table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS videos (
          id TEXT PRIMARY KEY,
          albumId TEXT NOT NULL,
          title TEXT NOT NULL,
          sourceType TEXT DEFAULT 'local',
          uri TEXT NOT NULL,
          duration INTEGER,
          lastPosition INTEGER DEFAULT 0,
          watched INTEGER DEFAULT 0,
          lastWatchedAt TEXT,
          createdAt TEXT NOT NULL,
          FOREIGN KEY(albumId) REFERENCES albums(id) ON DELETE CASCADE
        );`,
        [],
        () => {},
        (_, error) => {
          reject(error);
          return false;
        }
      );

      // Episode bookmarks table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS episode_bookmarks (
          id TEXT PRIMARY KEY,
          videoId TEXT NOT NULL,
          note TEXT,
          createdAt TEXT NOT NULL,
          FOREIGN KEY(videoId) REFERENCES videos(id) ON DELETE CASCADE
        );`,
        [],
        () => {},
        (_, error) => {
          reject(error);
          return false;
        }
      );

      // Timestamp bookmarks table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS timestamp_bookmarks (
          id TEXT PRIMARY KEY,
          videoId TEXT NOT NULL,
          timestamp INTEGER NOT NULL,
          note TEXT,
          createdAt TEXT NOT NULL,
          FOREIGN KEY(videoId) REFERENCES videos(id) ON DELETE CASCADE
        );`,
        [],
        () => {},
        (_, error) => {
          reject(error);
          return false;
        }
      );

      // Watch history table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS watch_history (
          id TEXT PRIMARY KEY,
          videoId TEXT NOT NULL,
          position INTEGER NOT NULL,
          watchedAt TEXT NOT NULL,
          FOREIGN KEY(videoId) REFERENCES videos(id) ON DELETE CASCADE
        );`,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export default db;