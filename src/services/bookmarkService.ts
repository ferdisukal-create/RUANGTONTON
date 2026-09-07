import db from '../db/database';
import { EpisodeBookmark, TimestampBookmark, WatchHistory } from '../models/Bookmark';
import { v4 as uuid } from 'uuid';

export const bookmarkService = {
  // Episode Bookmarks
  addEpisodeBookmark: async (videoId: string, note?: string): Promise<EpisodeBookmark> => {
    return new Promise((resolve, reject) => {
      const id = uuid();
      const now = new Date().toISOString();

      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO episode_bookmarks (id, videoId, note, createdAt) VALUES (?, ?, ?, ?)',
          [id, videoId, note || null, now],
          () => resolve({ id, videoId, note, createdAt: now }),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  removeEpisodeBookmark: async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM episode_bookmarks WHERE id = ?',
          [id],
          () => resolve(),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  isEpisodeBookmarked: async (videoId: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT COUNT(*) as count FROM episode_bookmarks WHERE videoId = ?',
          [videoId],
          (_, result) => {
            resolve(result.rows._array[0].count > 0);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  getAllEpisodeBookmarks: async (): Promise<EpisodeBookmark[]> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM episode_bookmarks ORDER BY createdAt DESC',
          [],
          (_, result) => resolve(result.rows._array),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  // Timestamp Bookmarks
  addTimestampBookmark: async (videoId: string, timestamp: number, note?: string): Promise<TimestampBookmark> => {
    return new Promise((resolve, reject) => {
      const id = uuid();
      const now = new Date().toISOString();

      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO timestamp_bookmarks (id, videoId, timestamp, note, createdAt) VALUES (?, ?, ?, ?, ?)',
          [id, videoId, timestamp, note || null, now],
          () => resolve({ id, videoId, timestamp, note, createdAt: now }),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  removeTimestampBookmark: async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM timestamp_bookmarks WHERE id = ?',
          [id],
          () => resolve(),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  getTimestampBookmarksByVideo: async (videoId: string): Promise<TimestampBookmark[]> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM timestamp_bookmarks WHERE videoId = ? ORDER BY timestamp ASC',
          [videoId],
          (_, result) => resolve(result.rows._array),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  getAllTimestampBookmarks: async (): Promise<TimestampBookmark[]> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM timestamp_bookmarks ORDER BY createdAt DESC',
          [],
          (_, result) => resolve(result.rows._array),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  updateTimestampBookmark: async (id: string, note: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE timestamp_bookmarks SET note = ? WHERE id = ?',
          [note, id],
          () => resolve(),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  // Watch History
  addWatchHistory: async (videoId: string, position: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      const id = uuid();
      const now = new Date().toISOString();

      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO watch_history (id, videoId, position, watchedAt) VALUES (?, ?, ?, ?)',
          [id, videoId, position, now],
          () => resolve(),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  getWatchHistory: async (): Promise<WatchHistory[]> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM watch_history ORDER BY watchedAt DESC LIMIT 50',
          [],
          (_, result) => resolve(result.rows._array),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  clearWatchHistory: async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM watch_history',
          [],
          () => resolve(),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },
};