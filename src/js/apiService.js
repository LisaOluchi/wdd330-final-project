// apiService.js — All API calls (quotes + music) with fallbacks

// ─── QUOTES ─── Using API Ninjas (free, reliable, HTTPS)
const QUOTES_API = 'https://api.api-ninjas.com/v1/quotes';
const API_KEY = 'qhNv8RLHdTus0JacHqRGPg==vGXhuJGrnE5Vbo8s'; // Free tier API key

const FALLBACK_QUOTES = {
  happiness: [
    {
      content: 'Happiness is not something ready-made. It comes from your own actions.',
      author: 'Dalai Lama',
    },
    {
      content: "The most important thing is to enjoy your life—to be happy—it's all that matters.",
      author: 'Audrey Hepburn',
    },
  ],
  peace: [
    {
      content: 'Do not let the behavior of others destroy your inner peace.',
      author: 'Dalai Lama',
    },
    { content: 'Peace comes from within. Do not seek it without.', author: 'Buddha' },
  ],
  inspirational: [
    { content: 'Even the darkest night will end and the sun will rise.', author: 'Victor Hugo' },
    { content: "Believe you can and you're halfway there.", author: 'Theodore Roosevelt' },
  ],
  courage: [
    { content: "Breathe. It's just a bad day, not a bad life.", author: 'Unknown' },
    {
      content:
        'You are braver than you believe, stronger than you seem, and smarter than you think.',
      author: 'A.A. Milne',
    },
  ],
  motivational: [
    { content: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
    { content: "Don't watch the clock; do what it does. Keep going.", author: 'Sam Levenson' },
  ],
  life: [
    {
      content:
        "In the end, it's not the years in your life that count. It's the life in your years.",
      author: 'Abraham Lincoln',
    },
    { content: "Life is what happens when you're busy making other plans.", author: 'John Lennon' },
  ],
  rest: [
    {
      content:
        'Almost everything will work again if you unplug it for a few minutes, including you.',
      author: 'Anne Lamott',
    },
    { content: "Rest when you're weary. Refresh and renew yourself.", author: 'Ralph Marston' },
  ],
  gratitude: [
    { content: 'Gratitude turns what we have into enough.', author: 'Melody Beattie' },
    {
      content:
        'Enjoy the little things, for one day you may look back and realize they were the big things.',
      author: 'Robert Brault',
    },
  ],
};

export async function fetchQuote(tag) {
  try {
    const res = await fetch(`${QUOTES_API}?category=${tag}`, {
      headers: { 'X-Api-Key': API_KEY },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && data[0]) {
      return { content: data[0].quote, author: data[0].author };
    }
    throw new Error('No quote returned');
  } catch (err) {
    console.warn('Quotes API failed, using fallback:', err.message);
    const pool = FALLBACK_QUOTES[tag] ?? FALLBACK_QUOTES.inspirational;
    return pool[Math.floor(Math.random() * pool.length)];
  }
}

// ─── MUSIC ─── iTunes Search API
const ITUNES_API = 'https://itunes.apple.com/search';

const FALLBACK_TRACKS = [
  {
    id: 1,
    title: 'Weightless',
    artist: 'Marconi Union',
    album: 'Weightless',
    cover: '',
    preview: '',
    duration: 479,
  },
  {
    id: 2,
    title: 'Clair de Lune',
    artist: 'Claude Debussy',
    album: 'Piano Works',
    cover: '',
    preview: '',
    duration: 302,
  },
  {
    id: 3,
    title: 'River Flows in You',
    artist: 'Yiruma',
    album: 'First Love',
    cover: '',
    preview: '',
    duration: 214,
  },
  {
    id: 4,
    title: 'Sunset Lover',
    artist: 'Petit Biscuit',
    album: 'Petit Biscuit',
    cover: '',
    preview: '',
    duration: 213,
  },
  {
    id: 5,
    title: 'Bloom',
    artist: 'ODESZA',
    album: "Summer's Gone",
    cover: '',
    preview: '',
    duration: 261,
  },
];

export async function fetchTracks(query) {
  try {
    const url = `${ITUNES_API}?term=${encodeURIComponent(query)}&media=music&entity=song&limit=5`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data.results?.length) throw new Error('No tracks returned');

    return data.results.slice(0, 5).map((t) => ({
      id: t.trackId,
      title: t.trackName,
      artist: t.artistName,
      album: t.collectionName || '',
      cover: t.artworkUrl100 || '',
      preview: t.previewUrl || '',
      duration: Math.floor((t.trackTimeMillis || 0) / 1000),
    }));
  } catch (err) {
    console.warn('Music API unavailable, using fallback:', err.message);
    return FALLBACK_TRACKS;
  }
}

export function formatDuration(s) {
  if (!s) return '';
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
