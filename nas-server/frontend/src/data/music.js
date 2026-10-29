/**
 * Demo music library for the frontend-only Music page.
 *
 * Keep every track in this one module so a future `/music` API can replace it
 * without touching the page component.
 */
export const ALBUMS = [
  {
    id: "neon-horizons",
    title: "Neon Horizons",
    artist: "Aster Vale",
    year: 2025,
    genre: "Electronic",
    cover: "/music/covers/neon-horizons.svg",
    description:
      "Slow-blooming synth pads and wide-screen arpeggios for late-night work sessions.",
    tracks: [
      {
        id: "neon-horizons-01",
        title: "First Light",
        duration: "0:22",
        genres: ["Electronic", "Ambient"],
        audio: "/music/neon-horizons-01.mp3",
        description:
          "A soft opening chord that widens into a patient, glowing pulse.",
      },
      {
        id: "neon-horizons-02",
        title: "Glass Skyline",
        duration: "0:24",
        genres: ["Electronic", "Synthwave"],
        audio: "/music/neon-horizons-02.mp3",
        description:
          "Bright harmonics drift over a steady low end, like city lights on a wet street.",
      },
      {
        id: "neon-horizons-03",
        title: "Afterglow",
        duration: "0:20",
        genres: ["Electronic", "Chill"],
        audio: "/music/neon-horizons-03.mp3",
        description:
          "The comedown: warm, rounded tones with plenty of space between them.",
      },
    ],
  },
  {
    id: "midnight-drive",
    title: "Midnight Drive",
    artist: "The Cassettes",
    year: 2024,
    genre: "Synthwave",
    cover: "/music/covers/midnight-drive.svg",
    description:
      "A road-trip record built from analog warmth, steady rhythms and rear-view neon.",
    tracks: [
      {
        id: "midnight-drive-01",
        title: "Headlights",
        duration: "0:23",
        genres: ["Synthwave", "Electronic"],
        audio: "/music/midnight-drive-01.mp3",
        description:
          "A low, rolling groove that keeps its eyes on the road ahead.",
      },
      {
        id: "midnight-drive-02",
        title: "Cassette Dreams",
        duration: "0:21",
        genres: ["Synthwave", "Chill"],
        audio: "/music/midnight-drive-02.mp3",
        description:
          "Hazy chords and a gentle wobble, recorded straight to tape in spirit.",
      },
      {
        id: "midnight-drive-03",
        title: "Last Exit",
        duration: "0:25",
        genres: ["Synthwave", "Ambient"],
        audio: "/music/midnight-drive-03.mp3",
        description:
          "The long fade home, all low end and slow-moving light.",
      },
    ],
  },
  {
    id: "paper-lanterns",
    title: "Paper Lanterns",
    artist: "Mira Sol",
    year: 2023,
    genre: "Ambient",
    cover: "/music/covers/paper-lanterns.svg",
    description:
      "Quiet, floating pieces for slow mornings, open windows and unfinished thoughts.",
    tracks: [
      {
        id: "paper-lanterns-01",
        title: "Slow River",
        duration: "0:26",
        genres: ["Ambient", "Chill"],
        audio: "/music/paper-lanterns-01.mp3",
        description:
          "A drifting bed of tone that moves like water finding its level.",
      },
      {
        id: "paper-lanterns-02",
        title: "Paper Boats",
        duration: "0:22",
        genres: ["Ambient"],
        audio: "/music/paper-lanterns-02.mp3",
        description:
          "Small, bright shapes carried along by a patient current.",
      },
      {
        id: "paper-lanterns-03",
        title: "Morning Fog",
        duration: "0:24",
        genres: ["Ambient", "Chill"],
        audio: "/music/paper-lanterns-03.mp3",
        description:
          "Soft edges and low contrast, the sound of a room before sunrise.",
      },
    ],
  },
  {
    id: "static-bloom",
    title: "Static Bloom",
    artist: "North Signal",
    year: 2025,
    genre: "Indie",
    cover: "/music/covers/static-bloom.svg",
    description:
      "Indie textures with a nervous edge: bright, slightly overdriven and always moving.",
    tracks: [
      {
        id: "static-bloom-01",
        title: "Radio Ghost",
        duration: "0:23",
        genres: ["Indie", "Electronic"],
        audio: "/music/static-bloom-01.mp3",
        description:
          "A half-remembered melody pushed through a wall of gentle interference.",
      },
      {
        id: "static-bloom-02",
        title: "Static Bloom",
        duration: "0:25",
        genres: ["Indie", "Synthwave"],
        audio: "/music/static-bloom-02.mp3",
        description:
          "The title track: wide-open chords that slowly turn into something warmer.",
      },
      {
        id: "static-bloom-03",
        title: "Open Frequency",
        duration: "0:21",
        genres: ["Indie", "Ambient"],
        audio: "/music/static-bloom-03.mp3",
        description:
          "A clear signal at last, held for as long as the tape allows.",
      },
    ],
  },
];

export const TRACKS = ALBUMS.flatMap((album) =>
  album.tracks.map((track) => ({
    ...track,
    album: album.title,
    albumId: album.id,
    artist: album.artist,
    year: album.year,
    cover: album.cover,
    albumDescription: album.description,
  }))
);

export const ARTISTS = [...new Set(TRACKS.map((track) => track.artist))].sort();

export const GENRES = [
  ...new Set(TRACKS.flatMap((track) => track.genres)),
].sort();
