// ============================================
// АВТОРИЗАЦИЯ И ХРАНЕНИЕ ПОЛЬЗОВАТЕЛЕЙ
// ============================================

let currentUser = null;

function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '{}');
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function loadCurrentUser() {
  const email = localStorage.getItem('currentUser');
  if (email) {
    const users = getUsers();
    currentUser = users[email] || null;
  }
  return currentUser;
}

function register(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim().toLowerCase();
  const role = document.getElementById('reg-role').value;
  const password = document.getElementById('reg-password').value;

  const users = getUsers();
  if (users[email]) {
    showAuthError('reg-error', 'Пользователь с таким email уже зарегистрирован');
    return;
  }

  users[email] = {
    name, email, role, password,
    registeredAt: new Date().toISOString(),
    progress: {},
    xp: 0,
    badges: []
  };
  saveUsers(users);
  localStorage.setItem('currentUser', email);
  currentUser = users[email];

  window.location.href = 'dashboard.html';
}

function login(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;

  const users = getUsers();
  if (!users[email] || users[email].password !== password) {
    showAuthError('login-error', 'Неверный email или пароль');
    return;
  }

  localStorage.setItem('currentUser', email);
  currentUser = users[email];
  window.location.href = 'dashboard.html';
}

function logout() {
  localStorage.removeItem('currentUser');
  currentUser = null;
  window.location.href = 'index.html';
}

function showAuthError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 4000);
}

function requireAuth() {
  loadCurrentUser();
  if (!currentUser) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function renderUserNav() {
  const nav = document.getElementById('user-nav');
  if (!nav || !currentUser) return;
  nav.innerHTML = `
    <a href="dashboard.html">Курс</a>
    <span class="user-badge">${currentUser.name}</span>
    <a onclick="logout()" style="cursor:pointer">Выйти</a>
  `;
}

// ============================================
// ОБНОВЛЕНИЕ ПРОГРЕССА
// ============================================
function saveProgress(moduleId, data) {
  const users = getUsers();
  if (!users[currentUser.email].progress) {
    users[currentUser.email].progress = {};
  }
  users[currentUser.email].progress[moduleId] = {
    ...users[currentUser.email].progress[moduleId],
    ...data
  };
  saveUsers(users);
  currentUser = users[currentUser.email];
}

function addXP(amount) {
  const users = getUsers();
  users[currentUser.email].xp = (users[currentUser.email].xp || 0) + amount;
  saveUsers(users);
  currentUser = users[currentUser.email];
}

function addBadge(badgeName) {
  const users = getUsers();
  if (!users[currentUser.email].badges) users[currentUser.email].badges = [];
  if (!users[currentUser.email].badges.includes(badgeName)) {
    users[currentUser.email].badges.push(badgeName);
    saveUsers(users);
    currentUser = users[currentUser.email];
  }
}

function getLevel() {
  const xp = currentUser?.xp || 0;
  return Math.floor(xp / 100) + 1;
}
