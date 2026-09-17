export interface HeroStat {
  value: string;
  label: string;
}

export interface ExploreArtist {
  id: string;
  name: string;
  image: string;
  objectPosition?: string;
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

export const EXPLORE_ARTISTS: ExploreArtist[] = [
  {
    id: "saint-rio",
    name: "SAINT RIO",
    image:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=600&q=70",
    objectPosition: "center 28%",
  },
  {
    id: "maya-sol",
    name: "MAYA SOL",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=70",
    objectPosition: "center 38%",
  },
  {
    id: "noa-vale",
    name: "NOA VALE",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=70",
    objectPosition: "center 25%",
  },
  {
    id: "lena-mori",
    name: "LENA MORI",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=70",
    objectPosition: "80% 70%",
  },
  {
    id: "juno",
    name: "JUNO",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=70",
    objectPosition: "center 42%",
  },
  {
    id: "sola",
    name: "SOLA",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=70",
    objectPosition: "center 70%",
  },
];

export const EXPLORE_ROW_2: ExploreArtist[] = [
  {
    id: "aster",
    name: "ASTER",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=70",
    objectPosition: "center center",
  },
  {
    id: "mira",
    name: "MIRA",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=70",
    objectPosition: "center center",
  },
  {
    id: "koda",
    name: "KODA",
    image:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=70",
    objectPosition: "center 65%",
  },
  {
    id: "elara",
    name: "ELARA",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=70",
    objectPosition: "center 25%",
  },
  {
    id: "lumen",
    name: "LUMEN",
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=70",
    objectPosition: "center center",
  },
  {
    id: "rafa",
    name: "RAFA",
    image:
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=70",
    objectPosition: "center center",
  },
];

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
  "Every final graph will use the original export, reporting period, source owner, and approval record.";

export const SPOTIFY_CALLOUT = {
  title: "Proof, not promises.",
  body: "Every final graph will use the original export, reporting period, source owner, and approval record.",
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
export const SOUND_TITLE = "ONE SOUND. MILLIONS OF VIDEOS.";
export const SOUND_COPY =
  "The number belongs outside the screenshot. Artists should understand the size of the movement before they open the proof.";
export const SOUND_GHOST = "5M+";

export const PROOF_CARDS: ProofCard[] = [
  {
    id: "mimimi",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=70",
    pill: "SOUND ID PROOF",
    eyebrow: "TRILLEX AVANT",
    title: "MIMIMI HARDTEKK",
    metric: "900K+",
    caption: "VIDEOS AT PROOF BASELINE",
  },
  {
    id: "odnogo",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=70",
    pill: "SOUND ID PROOF",
    eyebrow: "TRILLEX BOUNCE",
    title: "ODNOGO ULTRAFUNK",
    metric: "600K+",
    caption: "VIDEOS AT PROOF BASELINE",
  },
  {
    id: "catalog",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=70",
    pill: "CATALOG PROOF",
    eyebrow: "ACROSS TRILLEX",
    title: "INTERNET CULTURE IN MOTION",
    metric: "5M+",
    caption: "UGC CREATIONS",
  },
  {
    id: "next-winner",
    image:
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=70",
    pill: "SCREEN TREATMENT",
    eyebrow: "PRODUCTION SLOT",
    title: "NEXT WINNER EVIDENCE",
    metric: "LIVE",
    caption: "COUNT OUTSIDE THE SCREEN",
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
