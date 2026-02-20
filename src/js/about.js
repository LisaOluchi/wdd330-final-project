import '../css/style.css';
import { showToast } from './toast.js';

const form = document.getElementById('newsletterForm');
const successMsg = document.getElementById('successMsg');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();

  // Validate
  if (name.length < 2) {
    document.getElementById('nameError').textContent = 'Name too short';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('emailError').textContent = 'Invalid email';
    return;
  }

  // Mock API submission (replace with real endpoint)
  try {
    await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });

    form.hidden = true;
    successMsg.hidden = false;
    showToast('🎉 Successfully subscribed!');
  } catch {
    showToast('⚠️ Something went wrong. Try again!');
  }
});

// Dark mode toggle
document.getElementById('darkModeToggle')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  showToast(document.body.classList.contains('dark-mode') ? '🌙 Dark mode ON' : '☀️ Light mode ON');
});

// Apply saved dark mode
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}
