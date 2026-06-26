// ============================================
// ЛИЧНЫЙ КАБИНЕТ
// ============================================

if (!requireAuth()) {
  // requireAuth уже сделал редирект
} else {
  renderUserNav();
  renderDashboard();
}

function renderDashboard() {
  document.getElementById('greeting').textContent = `Привет, ${currentUser.name}!`;

  const progress = currentUser.progress || {};
  const completed = Object.values(progress).filter(p => p.completed).length;
  const total = COURSE.modules.length;
  const percent = Math.round((completed / total) * 100);

  // Прогресс
  document.getElementById('progress-bar').style.width = percent + '%';
  document.getElementById('progress-text').textContent = `${completed} из ${total} модулей (${percent}%)`;

  // Статистика
  document.getElementById('level').textContent = getLevel();
  document.getElementById('xp').textContent = currentUser.xp || 0;
  document.getElementById('badges-count').textContent = (currentUser.badges || []).length;

  // Подзаголовок
  if (completed === 0) {
    document.getElementById('subtitle').textContent = 'Готовы начать приключение с Аней?';
  } else if (completed === total) {
    document.getElementById('subtitle').textContent = '🎉 Поздравляем! Курс пройден!';
    document.getElementById('certificate-cta').style.display = 'flex';
  } else {
    document.getElementById('subtitle').textContent = `Отлично! Продолжайте в том же духе 🚀`;
  }

  // Список модулей
  const list = document.getElementById('modules-list');
  list.innerHTML = '';

  COURSE.modules.forEach((module, idx) => {
    const isCompleted = progress[module.id]?.completed;
    const isLocked = idx > 0 && !progress[COURSE.modules[idx - 1].id]?.completed;

    const item = document.createElement('a');
    item.className = 'module-item' + (isCompleted ? ' completed' : '') + (isLocked ? ' locked' : '');

    if (!isLocked) {
      item.href = `lesson.html?id=${module.id}`;
    }

    item.innerHTML = `
      <div class="module-status">${isCompleted ? '✓' : (isLocked ? '🔒' : module.id)}</div>
      <div class="module-info">
        <h3>${module.title}</h3>
        <div class="meta-info">${module.duration} • ${module.lessonCount} • +${module.xpReward} XP ${isCompleted ? '• ✓ Пройдено' : ''}</div>
      </div>
      <div class="module-arrow">→</div>
    `;

    list.appendChild(item);
  });
}
