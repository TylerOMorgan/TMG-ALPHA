import { ARTIST_ROSTER, RELEASE_CATALOG, SOUND_ID_PREVIEWS } from "./realAssets";

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

export interface SelectableProofRecord {
  id: string;
  title: string;
  artist: string;
  image: string;
  streams: string;
  dailyAtPeak: string;
  breakoutPeriod: string;
  dateRange: string;
  tag: string;
  pathData: string;
  fillData: string;
  apexX: number;
  apexY: number;
  startDate: string;
  endDate: string;
  peakDaily: number;
  cumulativeBase: number;
  cumulativePeak: number;
  spotifyUrl?: string;
}

export interface TikTokVerifiedHit {
  id: string;
  title: string;
  artist: string;
  image: string;
  metric: string;
  caption: string;
  soundUrl?: string;
  tag: string;
  subtext?: string;
}

export interface GenreLane {
  index: string;
  name: string;
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

export const LANES_EYEBROW = "OUR LANES \u2022 INTERNET DRIVEN MUSIC";
export const LANES_TITLE = "INTERNET CULTURE DOES NOT WAIT.";
export const LANES_COPY =
  "The next sound starts before the charts. TRILLEX is built to recognize it, move with it, and build beside the artist shaping it.";

export const HERO_EYEBROW = "THE TRILLEX ROSTER";
export const HERO_TITLE = "ARTISTS";

export const HERO_STATS: HeroStat[] = [
  { value: "928", label: "SONGS SIGNED" },
  { value: "3.74B+", label: "TIKTOK VIEWS" },
  { value: "5M+", label: "UGC CREATIONS" },
  { value: "590M+", label: "SPOTIFY STREAMS" },
];

export const EXPLORE_ARTISTS: ExploreArtist[] = ARTIST_ROSTER.filter((artist) => artist.row === 1);

export const EXPLORE_ROW_2: ExploreArtist[] = ARTIST_ROSTER.filter((artist) => artist.row === 2);

export const SPOTIFY_EYEBROW = "SPOTIFY FOR ARTISTS";
export const SPOTIFY_COPY =
  "Real growth belongs beside the record that created it. Select a record to inspect breakout curves, illustrative growth curves. Original reporting data is pending.";

// Chart values are design examples, pending original Spotify growth exports.
const ILLUSTRATIVE_GROWTH = [
  {
    "streams": "6M+",
    "dailyAtPeak": "54K",
    "breakoutPeriod": "BREAKOUT MOMENT",
    "dateRange": "SEP 1 — SEP 30",
    "tag": "HARDTEKK",
    "pathData": "M0,205 C90,200 130,190 190,182 C260,172 300,190 360,165 C420,140 470,90 545,45 L600,25",
    "fillData": "M0,205 C90,200 130,190 190,182 C260,172 300,190 360,165 C420,140 470,90 545,45 L600,25 L600,220 L0,220 Z",
    "apexX": 598,
    "apexY": 25,
    "startDate": "1 SEP",
    "endDate": "30 SEP",
    "peakDaily": 54210,
    "cumulativeBase": 0.12,
    "cumulativePeak": 6.14
  },
  {
    "streams": "4.2M+",
    "dailyAtPeak": "41K",
    "breakoutPeriod": "VIRAL VELOCITY",
    "dateRange": "OCT — NOV",
    "tag": "BRAZILIAN FUNK",
    "pathData": "M0,210 C100,205 180,198 250,160 C320,122 390,80 470,48 L600,18",
    "fillData": "M0,210 C100,205 180,198 250,160 C320,122 390,80 470,48 L600,18 L600,220 L0,220 Z",
    "apexX": 598,
    "apexY": 18,
    "startDate": "5 OCT",
    "endDate": "27 NOV",
    "peakDaily": 41800,
    "cumulativeBase": 0.08,
    "cumulativePeak": 4.28
  },
  {
    "streams": "8.5M+",
    "dailyAtPeak": "72K",
    "breakoutPeriod": "GLOBAL SPIKE",
    "dateRange": "JUL — SEP",
    "tag": "BRAZILIAN FUNK",
    "pathData": "M0,200 C80,195 160,188 230,175 C300,150 360,110 440,55 L600,12",
    "fillData": "M0,200 C80,195 160,188 230,175 C300,150 360,110 440,55 L600,12 L600,220 L0,220 Z",
    "apexX": 598,
    "apexY": 12,
    "startDate": "12 JUL",
    "endDate": "18 SEP",
    "peakDaily": 72400,
    "cumulativeBase": 0.25,
    "cumulativePeak": 8.56
  },
  {
    "streams": "3.8M+",
    "dailyAtPeak": "36K",
    "breakoutPeriod": "SUSTAINED RUN",
    "dateRange": "AUG — OCT",
    "tag": "HARDTEKK",
    "pathData": "M0,212 C110,210 200,195 280,165 C360,135 440,95 520,50 L600,22",
    "fillData": "M0,212 C110,210 200,195 280,165 C360,135 440,95 520,50 L600,22 L600,220 L0,220 Z",
    "apexX": 598,
    "apexY": 22,
    "startDate": "20 AUG",
    "endDate": "30 OCT",
    "peakDaily": 36500,
    "cumulativeBase": 0.15,
    "cumulativePeak": 3.82
  },
  {
    "streams": "5.1M+",
    "dailyAtPeak": "48K",
    "breakoutPeriod": "BREAKOUT MOMENT",
    "dateRange": "NOV — DEC",
    "tag": "HOODTRAP",
    "pathData": "M0,205 C90,200 130,190 190,182 C260,172 300,190 360,165 C420,140 470,90 545,45 L600,25",
    "fillData": "M0,205 C90,200 130,190 190,182 C260,172 300,190 360,165 C420,140 470,90 545,45 L600,25 L600,220 L0,220 Z",
    "apexX": 598,
    "apexY": 25,
    "startDate": "8 NOV",
    "endDate": "19 DEC",
    "peakDaily": 48200,
    "cumulativeBase": 0.18,
    "cumulativePeak": 5.14
  },
  {
    "streams": "7.2M+",
    "dailyAtPeak": "63K",
    "breakoutPeriod": "VIRAL VELOCITY",
    "dateRange": "SEP — OCT",
    "tag": "BRAZILIAN FUNK",
    "pathData": "M0,210 C100,205 180,198 250,160 C320,122 390,80 470,48 L600,18",
    "fillData": "M0,210 C100,205 180,198 250,160 C320,122 390,80 470,48 L600,18 L600,220 L0,220 Z",
    "apexX": 598,
    "apexY": 18,
    "startDate": "2 SEP",
    "endDate": "28 OCT",
    "peakDaily": 63400,
    "cumulativeBase": 0.2,
    "cumulativePeak": 7.24
  },
  {
    "streams": "2.9M+",
    "dailyAtPeak": "29K",
    "breakoutPeriod": "SUSTAINED RUN",
    "dateRange": "JUN — AUG",
    "tag": "HARDTEKK",
    "pathData": "M0,200 C80,195 160,188 230,175 C300,150 360,110 440,55 L600,12",
    "fillData": "M0,200 C80,195 160,188 230,175 C300,150 360,110 440,55 L600,12 L600,220 L0,220 Z",
    "apexX": 598,
    "apexY": 12,
    "startDate": "15 JUN",
    "endDate": "22 AUG",
    "peakDaily": 29400,
    "cumulativeBase": 0.1,
    "cumulativePeak": 2.94
  },
  {
    "streams": "9.3M+",
    "dailyAtPeak": "81K",
    "breakoutPeriod": "GLOBAL SPIKE",
    "dateRange": "MAY — JUL",
    "tag": "HOODTRAP",
    "pathData": "M0,212 C110,210 200,195 280,165 C360,135 440,95 520,50 L600,22",
    "fillData": "M0,212 C110,210 200,195 280,165 C360,135 440,95 520,50 L600,22 L600,220 L0,220 Z",
    "apexX": 598,
    "apexY": 22,
    "startDate": "3 MAY",
    "endDate": "11 JUL",
    "peakDaily": 81200,
    "cumulativeBase": 0.3,
    "cumulativePeak": 9.36
  }
];

export const SPOTIFY_PROOF_RECORDS: SelectableProofRecord[] = RELEASE_CATALOG.map((release, index) => ({
  ...ILLUSTRATIVE_GROWTH[index],
  ...release,
  tag: release.lane,
}));

export const SOUND_EYEBROW = "TIKTOK SOUND IDS";
export const SOUND_TITLE = "ONE SOUND, MILLIONS OF VIDEOS.";
export const SOUND_COPY =
  "The number belongs outside the screenshot. Open any card to inspect the supplied Sound ID visual. Counts are shown as supplied, pending live source links.";
export const SOUND_GHOST = "5M+";

export const TIKTOK_VERIFIED_HITS: TikTokVerifiedHit[] = SOUND_ID_PREVIEWS;

export const RECORDS_EYEBROW = "SELECTED PROOF \u2022 REPEATABLE OUTCOMES";
export const RECORDS_TITLE = "THE RECORDS PEOPLE REPEAT.";

export const RECORDS: RecordEntry[] = RELEASE_CATALOG.map((release, index) => ({
  ...release,
  index: String(index + 1).padStart(2, "0"),
}));

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
export const CTA_COPY = "OUR A&R TEAM REVIEWS EVERY DEMO SUBMISSION";
export const CTA_BUTTON = "SUBMIT YOUR DEMO";
export const CTA_FOOTER_LEFT = "TRILLEX MUSIC GROUP";
export const CTA_FOOTER_RIGHT =
  "HARDTEKK \u2022 BRAZILIAN FUNK \u2022 HOODTRAP";
