export interface Video {
  id: string;
  albumId: string;
  title: string;
  sourceType: 'local' | 'url';
  uri: string;
  duration?: number;
  lastPosition: number;
  watched: boolean;
  lastWatchedAt?: string;
  createdAt: string;
}

export interface VideoWithProgress extends Video {
  progressPercent: number;
}

export interface CreateVideoInput {
  albumId: string;
  title: string;
  sourceType: 'local' | 'url';
  uri: string;
  duration?: number;
}