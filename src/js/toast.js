// toast.js — Brief notification utility

let _timer = null;

export function showToast(message, duration = 2800) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  if (_timer) clearTimeout(_timer);
  toast.textContent = message;
  toast.classList.add('show');
  _timer = setTimeout(() => toast.classList.remove('show'), duration);
}

