import { ARTIST_ROSTER, SOUND_ID_PREVIEWS } from "./realAssets";
export { RECORDS } from "./artistsExperienceData";

export interface HeroStat {
  value: string;
  label: string;
}

export interface ExploreArtist {
  id: string;
  name: string;
  image: string;
  objectPosition?: string;
  spotifyUrl?: string;
}

export interface GenreLane {
  index: string;
  name: string;
}

export interface SpotifyProofCard {
  id: string;
  title: string;
  streams?: string;
  daily?: string;
  tag: string;
}

export interface ProofCard {
  id: string;
  image: string;
  soundUrl: string;
  pill: string;
  eyebrow: string;
  title: string;
  metric: string;
  caption: string;
}

export interface RecordEntry {
  index: string;
  title: string;
  lane: string;
  image: string;
}

export interface WorkPillar {
  index: string;
  title: string;
}

export const HERO_EYEBROW = "ARTISTS \u2022 WHY WORK WITH US";
export const HERO_TITLE = "ARTISTS";
export const HERO_COPY_HEAD = "The artists. The records. The proof.";
export const HERO_COPY_TAIL =
  "Built around the sounds moving internet culture.";

export const HERO_STATS: HeroStat[] = [
  { value: "900+", label: "SONGS SIGNED" },
  { value: "3.7B+", label: "TIKTOK VIEWS" },
  { value: "5M+", label: "UGC CREATIONS" },
  { value: "590M+", label: "SPOTIFY STREAMS" },
];

export const EXPLORE_ARTISTS: ExploreArtist[] = ARTIST_ROSTER.filter((artist) => artist.row === 1);

export const EXPLORE_ROW_2: ExploreArtist[] = ARTIST_ROSTER.filter((artist) => artist.row === 2);

export const LANES_EYEBROW = "OUR LANES \u2022 INTERNET DRIVEN MUSIC";
export const LANES_TITLE = "INTERNET CULTURE DOES NOT WAIT.";
export const LANES_COPY =
  "The next sound starts before the charts. TRILLEX is built to recognize it, move with it, and build beside the artist shaping it.";

export const GENRE_LANES: GenreLane[] = [
  { index: "01", name: "HARDTEKK" },
  { index: "02", name: "BRAZILIAN FUNK" },
  { index: "03", name: "HOODTRAP" },
];

export const SPOTIFY_EYEBROW = "SPOTIFY FOR ARTISTS \u2022 GROWTH PROOF";
export const SPOTIFY_COPY =
  "Real growth belongs beside the record that created it. Every curve, date, and result stays connected to the story.";
export const SPOTIFY_NOTE =
  "Charts and stream counts are design examples. Original Spotify reporting data is pending.";

export const SPOTIFY_CALLOUT = {
  title: "Illustrative growth preview.",
  body: "Charts and stream counts are design examples. Original Spotify reporting data is pending.",
};

export const FLOATING_BADGE =
  "MOTION CONCEPT \u2022 PLACEHOLDER MEDIA \u2022 PROOF REFRESH REQUIRED";

export const SPOTIFY_CARDS: SpotifyProofCard[] = [
  {
    id: "mimimi-hardtekk",
    title: "MIMIMI HARDTEKK",
    streams: "6M+",
    daily: "54K",
    tag: "SPOTIFY FOR ARTISTS",
  },
  { id: "growth-02", title: "GROWTH 02", tag: "SPOTIFY FOR ARTISTS" },
  { id: "artist-proof", title: "ARTIST (", tag: "SPOTIFY FOR ARTISTS" },
];

export const SOUND_EYEBROW = "SOUND IDS \u2022 CULTURAL REACH";
export const SOUND_TITLE = "ONE SOUND, MILLIONS OF VIDEOS.";
export const SOUND_COPY =
  "Supplied Sound ID visuals, with the post counts shown in each image. Live source links are pending.";
export const SOUND_GHOST = "5M+";

export const PROOF_CARDS: ProofCard[] = SOUND_ID_PREVIEWS.map((preview) => ({
  ...preview,
  pill: preview.tag,
  eyebrow: preview.artist,
}));

export const RECORDS_EYEBROW = "SELECTED PROOF \u2022 REPEATABLE OUTCOMES";
export const RECORDS_TITLE = "THE RECORDS PEOPLE REPEAT.";



export const WORK_EYEBROW = "WHAT THE PROOF MEANS FOR THE ARTIST";
export const WORK_TITLE =
  "MOVE FAST. COMMUNICATE CLEARLY. BUILD THE RECORD TOGETHER.";

export const WORK_PILLARS: WorkPillar[] = [
  { index: "01", title: "SOUND ID CLAIMING" },
  { index: "02", title: "RELEASE EXECUTION" },
  { index: "03", title: "ARTIST COMMUNICATION" },
];

export const CTA_EYEBROW = "THE NEXT SOUND STARTS HERE";
export const CTA_TITLE = "YOUR RECORD COULD BE NEXT.";
export const CTA_COPY =
  "Bring the record. Bring the ambition. We will tell you clearly if TRILLEX is the right team to build with.";
export const CTA_BUTTON = "SUBMIT YOUR DEMO";
export const CTA_FOOTER_LEFT = "TRILLEX MUSIC GROUP";
export const CTA_FOOTER_RIGHT =
  "HARDTEKK \u2022 BRAZILIAN FUNK \u2022 HOODTRAP";
