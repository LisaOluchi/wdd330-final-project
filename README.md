# MoodWave 🎵
**Feel. Discover. Flow.**

A mood-based web app that suggests music and motivational quotes based on how you're feeling.

---

## 📁 Project Structure

```
moodwave/
├── index.html              ← Main HTML (single page app)
├── vite.config.js          ← Vite configuration
├── package.json            ← Project dependencies
├── public/
│   └── vite.svg         ← App icon
└── src/
    ├── main.js             ← App entry point (ties everything together)
    ├── styles/
    │   └── main.css        ← All styles
    └── modules/
        ├── moodManager.js  ← Mood data & mood card rendering
        ├── apiService.js   ← All API calls (quotes + music)
        ├── uiRenderer.js   ← DOM updates & rendering
        ├── storage.js      ← localStorage favorites management
        └── toast.js        ← Toast notification utility
```

---


---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎭 Mood Selection | 8 moods: Happy, Calm, Sad, Anxious, Motivated, Nostalgic, Tired, Grateful |
| 💬 Quotes | Fetches real quotes from Quotable.io API, with offline fallbacks |
| 🎵 Music | Fetches tracks from Deezer API matching the mood, with offline fallbacks |
| ▶️ Preview | Play 30-second audio previews of tracks |
| ♥ Favorites | Save quotes and tracks to localStorage |
| ↺ Refresh | Get a new quote without changing your mood |
| 📱 Responsive | Works on mobile and desktop |
| ♿ Accessible | ARIA labels, keyboard navigation, reduced-motion support |

---

## 📦 Modules Overview

### `main.js`
The app entry point. Initializes the UI, wires up event listeners, and orchestrates the data flow.

### `moodManager.js`
- Holds the `MOODS` array with all mood data (id, emoji, color, API queries)
- `renderMoodGrid()` — creates all mood cards in the DOM
- `getCurrentMood()` / `setCurrentMood()` — manages the active mood

### `apiService.js`
- `fetchQuote(category)` — calls Quotable.io API, falls back to built-in quotes
- `fetchTracks(query)` — calls Deezer API via CORS proxy, falls back to sample tracks
- `formatDuration(seconds)` — formats `mm:ss` for track duration

### `uiRenderer.js`
- `showScreen(id)` — switches between screens with animation
- `renderQuote(quote)` — displays quote card with save/refresh actions
- `renderTracks(tracks)` — renders track list with play and save buttons
- `renderFavorites()` — shows saved favorites list
- `showQuoteLoading()` / `showMusicLoading()` — loading spinners
- `showQuoteError()` / `showMusicError()` — error states with retry

### `storage.js`
- `getFavorites()` — reads from localStorage
- `saveFavorite(item)` — saves quote or track, prevents duplicates
- `removeFavorite(index)` — removes item by index
- `getFavoritesCount()` — returns count for badge display

### `toast.js`
- `showToast(message)` — shows a brief notification at bottom of screen

---

## 🎨 Design Decisions

- **Font**: Playfair Display (headings/quotes) + DM Sans (body)
- **Color Palette**: Warm terracotta (#c4775a) on soft cream (#f5f0eb)
- **Aesthetic**: Organic/editorial calm — soft, welcoming, minimal
- **Animations**: Fade-in-up on screen transitions, floating logo icon
- **Error Handling**: Every API call has a fallback so the app always works

---

## 🔌 APIs Used

| API | Purpose | Key Required |
|-----|---------|--------------|
| [Quotable.io](https://api.api-ninjas.com/v1/quotes) | Motivational quotes by category | ❌ Free |
| [ITUNES](https://itunes.apple.com/search) | Music track search | ❌ Free (via CORS proxy) |



---



## 📅 Project Timeline Status

| Week | Tasks | Status |
|------|-------|--------|
| Week 5 | Project setup, layout, mood UI | ✅ Done |
| Week 6 | API integration, quotes, music, favorites | ✅ Done |
| Week 7 | Animations, accessibility, deployment | 🔲 Add more polish |

---
