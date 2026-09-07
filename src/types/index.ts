export type RootStackParamList = {
  BottomTabs: undefined;
  VideoPlayer: { videoId: string; albumId: string };
  CreateAlbum: undefined;
  EditAlbum: { albumId: string };
};

export type BottomTabsParamList = {
  Home: undefined;
  Albums: undefined;
  Bookmarks: undefined;
  History: undefined;
  Settings: undefined;
};