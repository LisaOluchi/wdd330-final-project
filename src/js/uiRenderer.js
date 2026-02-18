// uiRenderer.js — All DOM updates and screen rendering

import { formatDuration } from './apiService.js';
import { saveFavorite, removeFavorite, getFavorites, getFavoritesCount } from './storage.js';
import { showToast } from './toast.js';

export function showScreen(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export function updateMoodBadge(mood) {
  const badge = document.getElementById('moodBadge');
  if (!badge) return;
  badge.innerHTML = `<span aria-hidden="true">${mood.emoji}</span> ${mood.label}`;
  badge.style.background = `${mood.color}22`;
  badge.style.color = mood.color;
}

export function showQuoteLoading() {
  document.getElementById('quoteLoading').style.display = 'flex';
  document.getElementById('quoteContent').hidden = true;
  document.getElementById('quoteError').hidden = true;
}

export function renderQuote(quote) {
  document.getElementById('quoteLoading').style.display = 'none';
  document.getElementById('quoteError').hidden = true;
  document.getElementById('quoteText').textContent = quote.content;
  document.getElementById('quoteAuthor').textContent = quote.author;
  const saveBtn = document.getElementById('saveQuoteBtn');
  saveBtn.textContent = '♥ Save';
  saveBtn.classList.remove('saved');
  saveBtn.onclick = () => {
    if (saveFavorite({ type: 'quote', data: quote })) {
      saveBtn.textContent = '♥ Saved!';
      saveBtn.classList.add('saved');
      updateFavCount();
      showToast('Quote saved to favorites ♥');
    } else {
      showToast('Already in your favorites!');
    }
  };
  document.getElementById('quoteContent').hidden = false;
}

export function showQuoteError() {
  document.getElementById('quoteLoading').style.display = 'none';
  document.getElementById('quoteContent').hidden = true;
  document.getElementById('quoteError').hidden = false;
}

let _audio = null;

export function showMusicLoading() {
  document.getElementById('musicLoading').style.display = 'flex';
  document.getElementById('tracksList').hidden = true;
  document.getElementById('musicError').hidden = true;
}

export function renderTracks(tracks) {
  document.getElementById('musicLoading').style.display = 'none';
  document.getElementById('musicError').hidden = true;
  const list = document.getElementById('tracksList');
  list.innerHTML = '';
  if (!tracks?.length) {
    list.innerHTML = '<p class="loading-state">No tracks found for this mood.</p>';
    list.hidden = false;
    return;
  }
  tracks.forEach((track) => {
    const item = document.createElement('div');
    item.className = 'track-item';
    const coverHtml = track.cover
      ? `<img class="track-cover" src="${track.cover}" alt="${_esc(track.title)} cover" loading="lazy">`
      : `<div class="track-cover-placeholder" aria-hidden="true">♪</div>`;
    item.innerHTML = `
      ${coverHtml}
      <div class="track-info">
        <div class="track-title">${_esc(track.title)}</div>
        <div class="track-artist">${_esc(track.artist)}${track.album ? ' · ' + _esc(track.album) : ''}${track.duration ? ' · ' + formatDuration(track.duration) : ''}</div>
      </div>
      <div class="track-actions">
        ${track.preview ? `<button class="btn-play" aria-label="Play preview of ${_esc(track.title)}" title="Play 30s preview">▶</button>` : ''}
        <button class="btn-track-save" aria-label="Save ${_esc(track.title)}" title="Save to favorites">♥</button>
      </div>
    `;
    if (track.preview) {
      item.querySelector('.btn-play').addEventListener('click', (e) => _togglePlay(track, e.currentTarget));
    }
    item.querySelector('.btn-track-save').addEventListener('click', (e) => {
      if (saveFavorite({ type: 'track', data: track })) {
        e.currentTarget.style.color = 'var(--accent)';
        updateFavCount();
        showToast(`"${track.title}" saved ♥`);
      } else {
        showToast('Already in your favorites!');
      }
    });
    list.appendChild(item);
  });
  list.hidden = false;
}

function _togglePlay(track, btn) {
  if (_audio && _audio.src !== track.preview) {
    _audio.pause();
    document.querySelectorAll('.btn-play').forEach((b) => (b.textContent = '▶'));
  }
  if (!_audio || _audio.src !== track.preview) {
    _audio = new Audio(track.preview);
    _audio.addEventListener('ended', () => (btn.textContent = '▶'));
  }
  if (_audio.paused) {
    _audio.play().catch(() => showToast('Could not play preview'));
    btn.textContent = '⏸';
  } else {
    _audio.pause();
    btn.textContent = '▶';
  }
}

export function stopAudio() {
  if (_audio) {
    _audio.pause();
    _audio = null;
    document.querySelectorAll('.btn-play').forEach((b) => (b.textContent = '▶'));
  }
}

export function showMusicError() {
  document.getElementById('musicLoading').style.display = 'none';
  document.getElementById('tracksList').hidden = true;
  document.getElementById('musicError').hidden = false;
}

export function renderFavorites() {
  const list = document.getElementById('favoritesList');
  const empty = document.getElementById('emptyFavorites');
  const favs = getFavorites();
  list.innerHTML = '';
  if (!favs.length) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  favs.forEach((fav, i) => {
    const item = document.createElement('div');
    item.className = 'fav-item';
    if (fav.type === 'quote') {
      item.innerHTML = `
        <div>
          <div class="fav-type">Quote</div>
          <div class="fav-text">"${_esc(fav.data.content)}"</div>
          <div class="fav-sub">— ${_esc(fav.data.author)}</div>
        </div>
        <button class="btn-fav-remove" aria-label="Remove from favorites">✕</button>
      `;
    } else {
      item.innerHTML = `
        <div>
          <div class="fav-type">Track</div>
          <div class="fav-text">${_esc(fav.data.title)}</div>
          <div class="fav-sub">${_esc(fav.data.artist)}</div>
        </div>
        <button class="btn-fav-remove" aria-label="Remove from favorites">✕</button>
      `;
    }
    item.querySelector('.btn-fav-remove').addEventListener('click', () => {
      removeFavorite(i);
      updateFavCount();
      renderFavorites();
      showToast('Removed from favorites');
    });
    list.appendChild(item);
  });
}

export function updateFavCount() {
  const el = document.getElementById('favCount');
  if (el) el.textContent = getFavoritesCount();
}

function _esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

