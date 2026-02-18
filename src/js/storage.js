// STORAGE. JS - Handles localStorage interactions for moods and quotes

const KEY = 'moodwave_favorites';

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function saveFavorite(item) {
  const favs = getFavorites();
  const isDuplicate = favs.some(
    (f) => f.type === item.type && JSON.stringify(f.data) === JSON.stringify(item.data)
  );
  if (isDuplicate) return false;
  favs.unshift({ ...item, savedAt: Date.now() });
  localStorage.setItem(KEY, JSON.stringify(favs));
  return true;
}

export function removeFavorite(index) {
  const favs = getFavorites();
  favs.splice(index, 1);
  localStorage.setItem(KEY, JSON.stringify(favs));
}

export function getFavoritesCount() {
  return getFavorites().length;
}

