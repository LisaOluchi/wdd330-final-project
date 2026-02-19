//apiService.js — All API calls (quotes + music) with fallbacks

const Quote_API = 'https://api.quotable.io/random';

const FALLBACK_QUOTES = {
    happiness: [{ content: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" }],
    peace: [{ content: "Peace begins with a smile.", author: "Mother Teresa" }],
    inspirational: [{ content: "The only way to do great work is to love what you do.", author: "Steve Jobs" }],
    courage: [{ content: "Courage is resistance to fear, mastery of fear, not absence of fear.", author: "Mark Twain" }],
    motivational: [{ content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" }],
    life: [{ content: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost" }],
    rest: [{ content: "Rest and be thankful.", author: "William Wordsworth" }],
    gratitude: [{ content: "Gratitude turns what we have into enough.", author: "Aesop" }],
};

export async function fetchQuote(tag) {
    try {
        const url = `${Quote_API}?tags=${encodeURIComponent(tag)}&maxLength=180`;
        const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
        if (!res.ok) throw new Error('HTTP ${res.status}');
        const data = await res.json();
        return { content: data.content, author: data.author };
    } catch (err) {
        console.warn('Quote API unavailable, using fallback:', err.message);
        const pool = FALLBACK_QUOTES[tag] ?? FALLBACK_QUOTES.inspirational;
        return pool[Math.floor(Math.random() * pool.length)];
    }
}

const ITUNES_API = 'https://itunes.apple.com/search';

const FALLBACK_TRACKS = [
    { id: 1, title: 'Weightless', artist: 'Marconi Union', album: 'Weightless', cover: '', preview: '', duration: 479 },
    { id: 2, title: 'Clair de Lune', artist: 'Claude Debussy', album: 'Piano Works', cover: '', preview: '', duration: 302 },
    { id: 3, title: 'River Flows in You', artist: 'Yiruma', album: 'First Love', cover: '', preview: '', duration: 214 },
    { id: 4, title: 'Sunset Lover', artist: 'Petit Biscuit', album: 'Petit Biscuit', cover: '', preview: '', duration: 213 },
    { id: 5, title: 'Bloom', artist: 'ODESZA', album: 'Summer\'s Gone', cover: '', preview: '', duration: 261 },
];

export async function fetchTracks(query) {
    try {
        const url = `${ITUNES_API}?term=${encodeURIComponent(query)}&media=music&limit=5`;
        const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
        if (!res.ok) throw new Error('HTTP ${res.status}');
        const data = await res.json();

        if (!data.results?.length) throw new Error('No tracks found');

        return data.results.slice(0, 5).map((t) => ({
            id: t.trackId,
            title: t.trackName,
            artist: t.artistName,
            album: t.collectionName || '',
            cover: t.artworkUrl100 || '',
            preview: t.previewUrl || '',
            duration: Math.floor((t.trackTimeMillis / 1000) || 0),
        }));
    } catch (err) {
        console.warn('Music API unavailable,using fallback:', err.message);
        return FALLBACK_TRACKS;
    }
}


export function formatDuration(s) {
    if (!s) return '';
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

