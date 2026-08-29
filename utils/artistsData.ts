export interface Artist {
  id: string;
  name: string;
  role: string;
  genre: string;
  subLabel: 'Trillex Avant' | 'Trillex Bounce' | 'Trillex Records';
  image: string;
  monthlyListeners: string;
  totalStreams: string;
  followers: string;
  topTrack: string;
  spotifyUrl: string;
  instagramUrl: string;
  soundcloudUrl?: string;
  bio: string;
  verified: boolean;
  featured?: boolean;
}

export const ARTISTS_DATA: Artist[] = [
  {
    id: 'kairo-shade',
    name: 'KAIRO SHADE',
    role: 'Producer / Live Act',
    genre: 'Melodic Techno / Cyber',
    subLabel: 'Trillex Avant',
    image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=800&q=80',
    monthlyListeners: '1.4M',
    totalStreams: '38.2M',
    followers: '290K',
    topTrack: 'NEON VOID (Original Mix)',
    spotifyUrl: 'https://open.spotify.com/artist/trillex',
    instagramUrl: 'https://www.instagram.com/trillexavant',
    bio: 'Pioneering immersive synth soundscapes and deep hypnotic basslines that bridge underground warehouse grit with futuristic cinematic depth.',
    verified: true,
    featured: true
  },
  {
    id: 'vex-protocol',
    name: 'VEX PROTOCOL',
    role: 'DJ & Sound Architect',
    genre: 'Brazilian Phonk / Drift',
    subLabel: 'Trillex Bounce',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    monthlyListeners: '2.8M',
    totalStreams: '74.5M',
    followers: '480K',
    topTrack: 'TOKYO SHADOWS (Slowed + Reverb)',
    spotifyUrl: 'https://open.spotify.com/artist/trillex',
    instagramUrl: 'https://www.instagram.com/trillexbounce',
    bio: 'High-octane basslines and aggressive Memphis samples redefining modern dark drift and phonk culture worldwide.',
    verified: true,
    featured: true
  },
  {
    id: 'nyx-valen',
    name: 'NYX VALEN',
    role: 'Vocalist & Producer',
    genre: 'Dark Electro-Pop / Wave',
    subLabel: 'Trillex Avant',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    monthlyListeners: '920K',
    totalStreams: '21.7M',
    followers: '195K',
    topTrack: 'ECHOES IN CHROME',
    spotifyUrl: 'https://open.spotify.com/artist/trillex',
    instagramUrl: 'https://www.instagram.com/trillexavant',
    bio: 'Ethereal haunting vocals layered over analog synths and aggressive halftime industrial percussion.',
    verified: true,
    featured: false
  },
  {
    id: 'reign-harding',
    name: 'REIGN HARDING',
    role: 'Electronic Artist',
    genre: 'Bass House / Club',
    subLabel: 'Trillex Bounce',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    monthlyListeners: '1.8M',
    totalStreams: '46.1M',
    followers: '310K',
    topTrack: 'OVERDRIVE PULSE',
    spotifyUrl: 'https://open.spotify.com/artist/trillex',
    instagramUrl: 'https://www.instagram.com/trillexbounce',
    bio: 'Heavyweight bass drops and festival-grade anthems tearing up mainstages across Europe and Asia.',
    verified: true,
    featured: true
  },
  {
    id: 'cipher-zero',
    name: 'CIPHER ZERO',
    role: 'Live Synthesist',
    genre: 'Cyberpunk Synthwave',
    subLabel: 'Trillex Avant',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    monthlyListeners: '760K',
    totalStreams: '18.4M',
    followers: '142K',
    topTrack: 'GRID RUNNER 2088',
    spotifyUrl: 'https://open.spotify.com/artist/trillex',
    instagramUrl: 'https://www.instagram.com/trillexmusicgroup',
    bio: 'Hardware modular synth wizard weaving relentless arpeggios and retro-futurist neon atmosphere.',
    verified: true,
    featured: false
  },
  {
    id: 'sol-mirage',
    name: 'SOL MIRAGE',
    role: 'Producer & Songwriter',
    genre: 'Afro-House / Deep Tech',
    subLabel: 'Trillex Records',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    monthlyListeners: '1.1M',
    totalStreams: '29.3M',
    followers: '230K',
    topTrack: 'SAHARA BREEZE',
    spotifyUrl: 'https://open.spotify.com/artist/trillex',
    instagramUrl: 'https://www.instagram.com/trillexmusicgroup',
    bio: 'Warm organic percussions infused with soulful melodies and deep hypnotic club rhythms.',
    verified: true,
    featured: true
  },
  {
    id: 'zenith-raw',
    name: 'ZENITH RAW',
    role: 'Producer Duo',
    genre: 'Raw Hardstyle / Bounce',
    subLabel: 'Trillex Bounce',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    monthlyListeners: '2.1M',
    totalStreams: '55.9M',
    followers: '360K',
    topTrack: 'DEVASTATION KICK',
    spotifyUrl: 'https://open.spotify.com/artist/trillex',
    instagramUrl: 'https://www.instagram.com/trillexbounce',
    bio: 'Uncompromising distortion, massive screech leads, and relentless 160BPM energy dominating underground raves.',
    verified: true,
    featured: false
  },
  {
    id: 'aria-flux',
    name: 'ARIA FLUX',
    role: 'Sound Designer / DJ',
    genre: 'Leftfield Bass / Trap',
    subLabel: 'Trillex Avant',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    monthlyListeners: '890K',
    totalStreams: '19.8M',
    followers: '175K',
    topTrack: 'QUANTUM GRAVITY',
    spotifyUrl: 'https://open.spotify.com/artist/trillex',
    instagramUrl: 'https://www.instagram.com/trillexavant',
    bio: 'Intricate spatial sound design meeting earth-shattering 808 sub frequencies.',
    verified: true,
    featured: false
  }
];

export const ROSTER_STATS = {
  totalStreams: '300M+',
  monthlyListeners: '10.8M+',
  rosterArtists: '24+',
  globalReleases: '180+'
};
