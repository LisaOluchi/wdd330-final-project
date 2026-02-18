// main.js — MoodWave app entry point

import '../css/style.css';

import { renderMoodGrid } from './moodManager.js';
import { fetchQuote, fetchTracks } from './apiService.js';
import {
    showScreen,
    updateMoodBadge,
    showQuoteLoading, renderQuote, showQuoteError,
    showMusicLoading, renderTracks, showMusicError,
    renderFavorites,
    updateFavCount,
    stopAudio,
} from './uiRenderer.js';

let currentMood = null;

function init() {
    renderMoodGrid(document.getElementById('moodGrid'), onMoodSelected);
    updateFavCount();
    document.getElementById('backBtn').addEventListener('click', goBack);
    document.getElementById('closeFavBtn').addEventListener('click', goBack);
    document.getElementById('favoritesBtn').addEventListener('click', openFavorites);
    document.getElementById('refreshQuoteBtn').addEventListener('click', () => {
        if (currentMood) loadQuote(currentMood);
    });
    document.getElementById('retryQuoteBtn').addEventListener('click', () => {
        if (currentMood) loadQuote(currentMood);
    });
    document.getElementById('retryMusicBtn').addEventListener('click', () => {
        if (currentMood) loadTracks(currentMood);
    });
}

function onMoodSelected(mood) {
    currentMood = mood;
    updateMoodBadge(mood);
    showScreen('resultsScreen');
    loadQuote(mood);
    loadTracks(mood);
}

async function loadQuote(mood) {
    showQuoteLoading();
    try {
        const quote = await fetchQuote(mood.quoteTag);
        renderQuote(quote);
    } catch {
        showQuoteError();
    }
}

async function loadTracks(mood) {
    showMusicLoading();
    try {
        const tracks = await fetchTracks(mood.musicQuery);
        renderTracks(tracks);
    } catch {
        showMusicError();
    }
}

function goBack() {
    stopAudio();
    const onFav = document.getElementById('favoritesScreen').classList.contains('active');
    showScreen(onFav && currentMood ? 'resultsScreen' : 'moodScreen');
}

function openFavorites() {
    stopAudio();
    renderFavorites();
    showScreen('favoritesScreen');
}

init();

