import db from '../db/database';
import { Album, CreateAlbumInput, AlbumWithStats } from '../models/Album';
import { v4 as uuid } from 'uuid';

export const albumService = {
  createAlbum: async (input: CreateAlbumInput): Promise<Album> => {
    return new Promise((resolve, reject) => {
      const id = uuid();
      const now = new Date().toISOString();
      const album: Album = {
        id,
        title: input.title,
        coverUri: input.coverUri,
        createdAt: now,
        updatedAt: now,
      };

      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO albums (id, title, coverUri, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
          [id, input.title, input.coverUri || null, now, now],
          () => resolve(album),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  getAllAlbums: async (): Promise<AlbumWithStats[]> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT a.*, COUNT(v.id) as episodeCount 
           FROM albums a 
           LEFT JOIN videos v ON a.id = v.albumId 
           GROUP BY a.id 
           ORDER BY a.updatedAt DESC`,
          [],
          (_, result) => {
            const albums = result.rows._array.map((row: any) => ({
              id: row.id,
              title: row.title,
              coverUri: row.coverUri,
              createdAt: row.createdAt,
              updatedAt: row.updatedAt,
              episodeCount: row.episodeCount || 0,
            }));
            resolve(albums);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  getAlbumById: async (id: string): Promise<Album | null> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM albums WHERE id = ?',
          [id],
          (_, result) => {
            if (result.rows.length > 0) {
              resolve(result.rows._array[0]);
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

  updateAlbum: async (id: string, input: Partial<CreateAlbumInput>): Promise<Album | null> => {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const updates: string[] = [];
      const values: any[] = [];

      if (input.title) {
        updates.push('title = ?');
        values.push(input.title);
      }
      if (input.coverUri !== undefined) {
        updates.push('coverUri = ?');
        values.push(input.coverUri);
      }

      if (updates.length === 0) {
        resolve(await albumService.getAlbumById(id));
        return;
      }

      updates.push('updatedAt = ?');
      values.push(now);
      values.push(id);

      db.transaction(tx => {
        tx.executeSql(
          `UPDATE albums SET ${updates.join(', ')} WHERE id = ?`,
          values,
          async () => {
            const album = await albumService.getAlbumById(id);
            resolve(album);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  deleteAlbum: async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM albums WHERE id = ?',
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