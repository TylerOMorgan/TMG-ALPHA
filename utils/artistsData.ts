import { ARTIST_ROSTER } from "./realAssets";

export type Artist = (typeof ARTIST_ROSTER)[number];
export const ARTISTS_DATA: Artist[] = ARTIST_ROSTER;
