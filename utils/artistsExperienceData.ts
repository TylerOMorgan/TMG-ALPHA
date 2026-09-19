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
  soundUrl: string;
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

export const HERO_EYEBROW = "ARTISTS \u2022 WHY WORK WITH US";
export const HERO_TITLE = "ARTISTS";

export const HERO_STATS: HeroStat[] = [
  { value: "928", label: "SONGS SIGNED" },
  { value: "3.74B+", label: "TIKTOK VIEWS" },
  { value: "5M+", label: "UGC CREATIONS" },
  { value: "590M+", label: "SPOTIFY STREAMS" },
];

export const EXPLORE_ARTISTS: ExploreArtist[] = [
  {
    id: "saint-rio",
    name: "SAINT RIO",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=70",
    objectPosition: "center 25%",
    spotifyUrl: "https://open.spotify.com",
  },
  {
    id: "maya-sol",
    name: "MAYA SOL",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=70",
    objectPosition: "center 38%",
    spotifyUrl: "https://open.spotify.com",
  },
  {
    id: "noa-vale",
    name: "NOA VALE",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=70",
    objectPosition: "center 28%",
    spotifyUrl: "https://open.spotify.com",
  },
  {
    id: "lena-mori",
    name: "LENA MORI",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=70",
    objectPosition: "80% 70%",
    spotifyUrl: "https://open.spotify.com",
  },
  {
    id: "juno",
    name: "JUNO",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=70",
    objectPosition: "center 42%",
    spotifyUrl: "https://open.spotify.com",
  },
  {
    id: "sola",
    name: "SOLA",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=70",
    objectPosition: "center 70%",
    spotifyUrl: "https://open.spotify.com",
  },
];

export const EXPLORE_ROW_2: ExploreArtist[] = [
  {
    id: "aster",
    name: "ASTER",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=70",
    objectPosition: "center center",
    spotifyUrl: "https://open.spotify.com",
  },
  {
    id: "mira",
    name: "MIRA",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=70",
    objectPosition: "center center",
    spotifyUrl: "https://open.spotify.com",
  },
  {
    id: "koda",
    name: "KODA",
    image:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=70",
    objectPosition: "center 65%",
    spotifyUrl: "https://open.spotify.com",
  },
  {
    id: "elara",
    name: "ELARA",
    image:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=600&q=70",
    objectPosition: "center 28%",
    spotifyUrl: "https://open.spotify.com",
  },
  {
    id: "lumen",
    name: "LUMEN",
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=70",
    objectPosition: "center center",
    spotifyUrl: "https://open.spotify.com",
  },
  {
    id: "rafa",
    name: "RAFA",
    image:
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=70",
    objectPosition: "center center",
    spotifyUrl: "https://open.spotify.com",
  },
];

export const SPOTIFY_EYEBROW = "SPOTIFY FOR ARTISTS \u2022 GROWTH PROOF";
export const SPOTIFY_COPY =
  "Real growth belongs beside the record that created it. Select a record to inspect breakout curves, verified streams, and daily momentum.";

export const SPOTIFY_PROOF_RECORDS: SelectableProofRecord[] = [
  {
    id: "mimimi-hardtekk",
    title: "MIMIMI HARDTEKK",
    artist: "SAINT RIO \u2022 TRILLEX AVANT",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=70",
    streams: "6M+",
    dailyAtPeak: "54K",
    breakoutPeriod: "BREAKOUT MOMENT",
    dateRange: "SEP \u2014 OCT",
    tag: "HARDTEKK",
    pathData:
      "M0,205 C90,200 130,190 190,182 C260,172 300,190 360,165 C420,140 470,90 545,45 L600,25",
    fillData:
      "M0,205 C90,200 130,190 190,182 C260,172 300,190 360,165 C420,140 470,90 545,45 L600,25 L600,220 L0,220 Z",
    apexX: 598,
    apexY: 25,
    startDate: "1 SEP",
    endDate: "23 OCT",
    peakDaily: 54210,
    cumulativeBase: 0.12,
    cumulativePeak: 6.14,
    spotifyUrl: "https://open.spotify.com",
  },
  {
    id: "odnogo-ultrafunk",
    title: "ODNOGO ULTRAFUNK",
    artist: "MAYA SOL \u2022 TRILLEX BOUNCE",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=70",
    streams: "4.2M+",
    dailyAtPeak: "41K",
    breakoutPeriod: "VIRAL VELOCITY",
    dateRange: "OCT \u2014 NOV",
    tag: "BRAZILIAN FUNK",
    pathData:
      "M0,210 C100,205 180,198 250,160 C320,122 390,80 470,48 L600,18",
    fillData:
      "M0,210 C100,205 180,198 250,160 C320,122 390,80 470,48 L600,18 L600,220 L0,220 Z",
    apexX: 598,
    apexY: 18,
    startDate: "5 OCT",
    endDate: "27 NOV",
    peakDaily: 41800,
    cumulativeBase: 0.08,
    cumulativePeak: 4.28,
    spotifyUrl: "https://open.spotify.com",
  },
  {
    id: "stereo-love-funk",
    title: "STEREO LOVE FUNK",
    artist: "ASTER \u2022 TRILLEX BOUNCE",
    image:
      "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=800&q=70",
    streams: "8.5M+",
    dailyAtPeak: "72K",
    breakoutPeriod: "GLOBAL SPIKE",
    dateRange: "JUL \u2014 SEP",
    tag: "BRAZILIAN FUNK",
    pathData:
      "M0,200 C80,195 160,188 230,175 C300,150 360,110 440,55 L600,12",
    fillData:
      "M0,200 C80,195 160,188 230,175 C300,150 360,110 440,55 L600,12 L600,220 L0,220 Z",
    apexX: 598,
    apexY: 12,
    startDate: "12 JUL",
    endDate: "18 SEP",
    peakDaily: 72400,
    cumulativeBase: 0.25,
    cumulativePeak: 8.56,
    spotifyUrl: "https://open.spotify.com",
  },
  {
    id: "cant-fight-this-feeling",
    title: "CANT FIGHT THIS FEELING",
    artist: "KODA \u2022 TRILLEX AVANT",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=70",
    streams: "3.8M+",
    dailyAtPeak: "36K",
    breakoutPeriod: "SUSTAINED RUN",
    dateRange: "AUG \u2014 OCT",
    tag: "HARDTEKK",
    pathData:
      "M0,212 C110,210 200,195 280,165 C360,135 440,95 520,50 L600,22",
    fillData:
      "M0,212 C110,210 200,195 280,165 C360,135 440,95 520,50 L600,22 L600,220 L0,220 Z",
    apexX: 598,
    apexY: 22,
    startDate: "20 AUG",
    endDate: "30 OCT",
    peakDaily: 36500,
    cumulativeBase: 0.15,
    cumulativePeak: 3.82,
    spotifyUrl: "https://open.spotify.com",
  },
];

export const SOUND_EYEBROW = "TIKTOK SOUND IDS \u2022 CULTURAL REACH";
export const SOUND_TITLE = "ONE SOUND. MILLIONS OF VIDEOS.";
export const SOUND_COPY =
  "The number belongs outside the screenshot. Click any record to inspect the verified TikTok Sound ID and live UGC volume.";
export const SOUND_GHOST = "5M+";

export const TIKTOK_VERIFIED_HITS: TikTokVerifiedHit[] = [
  {
    id: "mimimi",
    title: "MIMIMI HARDTEKK",
    artist: "SAINT RIO",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=70",
    metric: "900K+",
    caption: "TIKTOK CREATIONS",
    soundUrl: "https://www.tiktok.com/music/Mimimi-Hardtekk-7281928471928491",
    tag: "VERIFIED SOUND ID",
    subtext: "LISTEN ON TIKTOK",
  },
  {
    id: "odnogo",
    title: "ODNOGO ULTRAFUNK",
    artist: "MAYA SOL",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=70",
    metric: "600K+",
    caption: "TIKTOK CREATIONS",
    soundUrl: "https://www.tiktok.com/music/Odnogo-Ultrafunk-7291039481928374",
    tag: "VERIFIED SOUND ID",
    subtext: "LISTEN ON TIKTOK",
  },
  {
    id: "stereo-love",
    title: "STEREO LOVE FUNK",
    artist: "ASTER",
    image:
      "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=800&q=70",
    metric: "1.2M+",
    caption: "TIKTOK CREATIONS",
    soundUrl: "https://www.tiktok.com/music/Stereo-Love-Funk-7301928491827461",
    tag: "VERIFIED SOUND ID",
    subtext: "LISTEN ON TIKTOK",
  },
  {
    id: "cant-fight",
    title: "CANT FIGHT THIS FEELING",
    artist: "KODA",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=70",
    metric: "450K+",
    caption: "TIKTOK CREATIONS",
    soundUrl:
      "https://www.tiktok.com/music/Cant-Fight-This-Feeling-Hardtekk-7310928471928374",
    tag: "VERIFIED SOUND ID",
    subtext: "LISTEN ON TIKTOK",
  },
];

export const RECORDS_EYEBROW = "SELECTED PROOF \u2022 REPEATABLE OUTCOMES";
export const RECORDS_TITLE = "THE RECORDS PEOPLE REPEAT.";

export const RECORDS: RecordEntry[] = [
  {
    index: "01",
    title: "MIMIMI HARDTEKK",
    lane: "HARDTEKK",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=70",
  },
  {
    index: "02",
    title: "ODNOGO ULTRAFUNK",
    lane: "BRAZILIAN FUNK",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=70",
  },
  {
    index: "03",
    title: "I WAS MADE FOR LOVIN YOU HARDTEKK",
    lane: "HARDTEKK",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=70",
  },
  {
    index: "04",
    title: "CANT FIGHT THIS FEELING HARDTEKK",
    lane: "HARDTEKK",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=70",
  },
  {
    index: "05",
    title: "STEREO LOVE FUNK",
    lane: "BRAZILIAN FUNK",
    image:
      "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=800&q=70",
  },
];

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
