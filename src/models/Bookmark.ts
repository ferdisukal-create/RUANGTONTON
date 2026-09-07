export interface EpisodeBookmark {
  id: string;
  videoId: string;
  note?: string;
  createdAt: string;
}

export interface TimestampBookmark {
  id: string;
  videoId: string;
  timestamp: number;
  note?: string;
  createdAt: string;
}

export interface WatchHistory {
  id: string;
  videoId: string;
  position: number;
  watchedAt: string;
}