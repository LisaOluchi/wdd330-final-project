// moodManager.js — Mood data and mood grid rendering

export const MOODS = [
  {
    id: 'happy',
    emoji: '😊',
    label: 'Happy',
    desc: 'Joyful & bright',
    color: '#f5c842',
    quoteTag: 'happiness',
    musicQuery: 'happy upbeat pop',
  },
  {
    id: 'calm',
    emoji: '🌿',
    label: 'Calm',
    desc: 'Peaceful & still',
    color: '#6db58e',
    quoteTag: 'peace',
    musicQuery: 'chill lofi ambient',
  },
  {
    id: 'sad',
    emoji: '🌧️',
    label: 'Sad',
    desc: 'Heavy & tender',
    color: '#7da8d4',
    quoteTag: 'inspirational',
    musicQuery: 'sad emotional ballad',
  },
  {
    id: 'anxious',
    emoji: '🌀',
    label: 'Anxious',
    desc: 'Unsettled & tense',
    color: '#c4775a',
    quoteTag: 'courage',
    musicQuery: 'calming meditation relaxing',
  },
  {
    id: 'motivated',
    emoji: '🔥',
    label: 'Motivated',
    desc: 'Driven & focused',
    color: '#e07b39',
    quoteTag: 'motivational',
    musicQuery: 'motivational workout energy',
  },
  {
    id: 'nostalgic',
    emoji: '🍂',
    label: 'Nostalgic',
    desc: 'Reflective & warm',
    color: '#c49a5a',
    quoteTag: 'life',
    musicQuery: 'nostalgic retro indie folk',
  },
  {
    id: 'tired',
    emoji: '🌙',
    label: 'Tired',
    desc: 'Weary & soft',
    color: '#9b8ac4',
    quoteTag: 'rest',
    musicQuery: 'sleep relaxing acoustic soft',
  },
  {
    id: 'grateful',
    emoji: '🌸',
    label: 'Grateful',
    desc: 'Thankful & open',
    color: '#d47ba3',
    quoteTag: 'gratitude',
    musicQuery: 'grateful acoustic soulful',
  },
];

let _currentMood = null;

export function renderMoodGrid(container, onSelect) {
  container.innerHTML = '';
  MOODS.forEach((mood) => {
    const btn = document.createElement('button');
    btn.className = 'mood-card';
    btn.setAttribute('data-mood-id', mood.id);
    btn.setAttribute('aria-label', `Select mood: ${mood.label}`);
    btn.style.setProperty('--mood-color', mood.color);
    btn.innerHTML = `
      <span class="mood-emoji" aria-hidden="true">${mood.emoji}</span>
      <span class="mood-label">${mood.label}</span>
      <span class="mood-desc">${mood.desc}</span>
    `;
    btn.addEventListener('click', () => {
      _currentMood = mood;
      onSelect(mood);
    });
    container.appendChild(btn);
  });
}

export function getCurrentMood() {
  return _currentMood;
}
export function setCurrentMood(mood) {
  _currentMood = mood;
}
