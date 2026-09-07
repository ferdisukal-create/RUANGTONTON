import db from '../db/database';
import { Video, CreateVideoInput, VideoWithProgress } from '../models/Video';
import { v4 as uuid } from 'uuid';

export const videoService = {
  addVideo: async (input: CreateVideoInput): Promise<Video> => {
    return new Promise((resolve, reject) => {
      const id = uuid();
      const now = new Date().toISOString();
      const video: Video = {
        id,
        albumId: input.albumId,
        title: input.title,
        sourceType: input.sourceType,
        uri: input.uri,
        duration: input.duration,
        lastPosition: 0,
        watched: false,
        createdAt: now,
      };

      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO videos (id, albumId, title, sourceType, uri, duration, lastPosition, watched, createdAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [id, input.albumId, input.title, input.sourceType, input.uri, input.duration || null, 0, 0, now],
          () => resolve(video),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  getVideosByAlbum: async (albumId: string): Promise<Video[]> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM videos WHERE albumId = ? ORDER BY title ASC',
          [albumId],
          (_, result) => {
            const videos = result.rows._array.map((row: any) => ({
              ...row,
              watched: row.watched === 1,
            }));
            resolve(videos);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  getVideoById: async (id: string): Promise<Video | null> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM videos WHERE id = ?',
          [id],
          (_, result) => {
            if (result.rows.length > 0) {
              const video = result.rows._array[0];
              resolve({ ...video, watched: video.watched === 1 });
            } else {
              resolve(null);
            }
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  updateVideoProgress: async (videoId: string, position: number, duration: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      const watched = position >= duration * 0.9; // 90% considered watched
      const now = new Date().toISOString();

      db.transaction(tx => {
        tx.executeSql(
          `UPDATE videos 
           SET lastPosition = ?, watched = ?, lastWatchedAt = ? 
           WHERE id = ?`,
          [position, watched ? 1 : 0, now, videoId],
          () => resolve(),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  getContinueWatching: async (): Promise<VideoWithProgress[]> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM videos 
           WHERE lastPosition > 0 AND watched = 0 
           ORDER BY lastWatchedAt DESC 
           LIMIT 10`,
          [],
          (_, result) => {
            const videos = result.rows._array.map((row: any) => ({
              ...row,
              watched: row.watched === 1,
              progressPercent: row.duration ? Math.round((row.lastPosition / row.duration) * 100) : 0,
            }));
            resolve(videos);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  deleteVideo: async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM videos WHERE id = ?',
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
};