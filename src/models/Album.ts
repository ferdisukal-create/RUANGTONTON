export interface Album {
  id: string;
  title: string;
  coverUri?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlbumWithStats extends Album {
  episodeCount: number;
}

export interface CreateAlbumInput {
  title: string;
  coverUri?: string;
}