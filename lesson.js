// ============================================
// СТРАНИЦА УРОКА
// ============================================

if (!requireAuth()) {
  // редирект
} else {
  renderUserNav();

  const params = new URLSearchParams(window.location.search);
  const moduleId = parseInt(params.get('id'));
  const module = COURSE.modules.find(m => m.id === moduleId);

  if (!module) {
    window.location.href = 'dashboard.html';
  } else {
    window.currentModule = module;
    renderLesson(module);
  }
}

function renderLesson(module) {
  const container = document.getElementById('lesson-container');
  const nextModule = COURSE.modules.find(m => m.id === module.id + 1);
  const isLastModule = !nextModule;

  container.innerHTML = `
    <!-- Заголовок -->
    <div class="lesson-header">
      <h1>Модуль ${module.id}. ${module.title}</h1>
      <div class="meta-info">📖 ${module.duration} • ${module.lessonCount} • Награда: +${module.xpReward} XP</div>
    </div>

    <!-- Комикс -->
    <div class="comic-section">
      <h2 style="text-align: left;">📖 ${module.comic.title}</h2>
      <div class="comic-strip">
        ${module.comic.panels.map((panel, idx) => `
          <div class="comic-panel">
            <div class="comic-number">${idx + 1}</div>
            <img src="${panel.image}" alt="Кадр ${idx + 1}" onerror="this.outerHTML='<div class=\\'placeholder\\'>${panel.placeholder}</div>'">
            <div class="comic-caption">${panel.caption}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Карточки-слайды -->
    <div class="cards-slider">
      <h2 style="text-align: left;">💡 Главное по теме</h2>
      <div class="slides-container">
        ${module.slides.map((slide, idx) => `
          <div class="slide-card ${idx === 0 ? 'active' : ''}" data-slide="${idx}">
            <div class="slide-icon">${slide.icon}</div>
            <h3>${slide.title}</h3>
            <p>${slide.text}</p>
          </div>
        `).join('')}
        <div class="slides-controls">
          <button class="slide-btn" onclick="prevSlide()" id="prev-slide">← Назад</button>
          <div class="slides-dots">
            ${module.slides.map((_, idx) => `
              <div class="slide-dot ${idx === 0 ? 'active' : ''}" data-dot="${idx}" onclick="goToSlide(${idx})"></div>
            `).join('')}
          </div>
          <button class="slide-btn" onclick="nextSlide()" id="next-slide">Далее →</button>
        </div>
      </div>
    </div>

    <!-- Диалог -->
    <div class="dialog-section">
      <h2 style="text-align: left;">💬 ${module.dialog.title}</h2>
      <div class="dialog-container">
        ${module.dialog.messages.map(msg => {
          const character = CHARACTERS[msg.from];
          const isRight = msg.from === 'anya';
          const avatarImg = `images/characters/${msg.from}.png`;
          return `
            <div class="dialog-message ${isRight ? 'right' : ''}">
              <div class="dialog-avatar">
                <img src="${avatarImg}" alt="${msg.name}" onerror="this.outerHTML='<div class=\\'avatar-fallback\\' style=\\'background:${character?.color || '#AB87FF'}\\'>${character?.emoji || '👤'}</div>'">
              </div>
              <div class="dialog-bubble">
                <div class="dialog-name">${msg.name}</div>
                ${msg.text}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Основной контент -->
    <div class="lesson-content">
      ${module.content}
    </div>

    <!-- Квест -->
    <div class="lesson-content" style="border-top: 1px solid #eee;">
      <div class="quest">
        <span class="quest-label">🎮 КВЕСТ</span>
        <h4>${module.quest.title}</h4>
        <p>${module.quest.description}</p>
        <p style="margin-top: 16px; color: #fff; font-weight: 600;">${module.quest.instruction}</p>
        <div class="quest-items" id="quest-items">
          ${module.quest.items.map((item, idx) => `
            <div class="quest-item" data-correct="${item.correct}" data-idx="${idx}" onclick="questToggle(this)">
              ${item.text}
            </div>
          `).join('')}
        </div>
        <button class="btn btn-small" onclick="questCheck()">Проверить</button>
        <div class="quest-result" id="quest-result"></div>
      </div>
    </div>

    <!-- Финальный тест -->
    <div class="quiz-final">
      <h2>📝 Финальный тест по модулю</h2>
      <p style="color: #666;">Ответьте правильно на 70% вопросов, чтобы получить XP и открыть следующий модуль</p>
      ${module.quiz.questions.map((q, i) => `
        <div class="quiz-question" data-q="${i}">
          <p>${i + 1}. ${q.q}</p>
          ${q.options.map((opt, j) => `
            <label class="quiz-option">
              <input type="radio" name="q${i}" value="${j}">
              ${opt}
            </label>
          `).join('')}
        </div>
      `).join('')}
      <div class="quiz-result-final" id="quiz-result-final"></div>
      <button class="btn" id="check-quiz-btn" onclick="checkFinalQuiz()">Завершить модуль</button>
    </div>

    <!-- Блок завершения модуля (появится после теста) -->
    <div class="module-complete" id="module-complete">
      <div class="icon-big">🎉</div>
      <h2>Модуль ${module.id} пройден!</h2>
      <div class="xp-earned">+${module.xpReward} XP</div>
      <p>${isLastModule
        ? 'Вы прошли весь курс! Заберите ваш сертификат.'
        : `Следующий модуль: «${nextModule.title}»`}</p>
      <div class="actions" id="complete-actions">
        <a href="dashboard.html" class="btn btn-light">← К программе</a>
        ${isLastModule
          ? '<a href="certificate.html" class="btn">🎓 Получить сертификат</a>'
          : `<a href="lesson.html?id=${nextModule.id}" class="btn">Следующий модуль →</a>`}
      </div>
    </div>
  `;

  window.addEventListener('scroll', updateReadingProgress);
}

function updateReadingProgress() {
  const scrollTop = window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  const bar = document.getElementById('reading-progress');
  if (bar) bar.style.width = progress + '%';
}

// ============================================
// SLIDES
// ============================================
let currentSlideIdx = 0;

function goToSlide(idx) {
  const slides = document.querySelectorAll('.slide-card');
  const dots = document.querySelectorAll('.slide-dot');

  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));

  slides[idx].classList.add('active');
  dots[idx].classList.add('active');
  currentSlideIdx = idx;

  document.getElementById('prev-slide').disabled = idx === 0;
  document.getElementById('next-slide').disabled = idx === slides.length - 1;
}

function nextSlide() {
  const slides = document.querySelectorAll('.slide-card');
  if (currentSlideIdx < slides.length - 1) goToSlide(currentSlideIdx + 1);
}

function prevSlide() {
  if (currentSlideIdx > 0) goToSlide(currentSlideIdx - 1);
}

// ============================================
// КВЕСТ
// ============================================
function questToggle(item) {
  item.classList.toggle('selected');
}

function questCheck() {
  const items = document.querySelectorAll('#quest-items .quest-item');
  let correct = 0;
  let totalCorrect = 0;
  let errors = 0;

  items.forEach(item => {
    const isCorrect = item.dataset.correct === 'true';
    const isSelected = item.classList.contains('selected');

    if (isCorrect) totalCorrect++;

    if (isCorrect && isSelected) {
      item.classList.add('correct');
      correct++;
    } else if (!isCorrect && isSelected) {
      item.classList.add('wrong');
      errors++;
    } else if (isCorrect && !isSelected) {
      item.classList.add('correct');
    }
  });

  const result = document.getElementById('quest-result');
  result.classList.add('show');

  if (correct === totalCorrect && errors === 0) {
    result.className = 'quest-result show pass';
    result.innerHTML = `🎉 Идеально! +20 XP за квест!`;
    addXP(20);
  } else {
    result.className = 'quest-result show fail';
    result.innerHTML = `Правильных: ${correct} из ${totalCorrect}. Ошибок: ${errors}. Зелёным — правильные ответы.`;
  }
}

// ============================================
// ФИНАЛЬНЫЙ ТЕСТ
// ============================================
function checkFinalQuiz() {
  const module = window.currentModule;
  let correct = 0;
  const total = module.quiz.questions.length;

  module.quiz.questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const options = document.querySelectorAll(`[data-q="${i}"] .quiz-option`);

    options.forEach(opt => opt.classList.remove('correct', 'wrong'));

    if (selected) {
      const selectedIdx = parseInt(selected.value);
      if (selectedIdx === q.correct) {
        correct++;
        options[selectedIdx].classList.add('correct');
      } else {
        options[selectedIdx].classList.add('wrong');
        options[q.correct].classList.add('correct');
      }
    } else {
      options[q.correct].classList.add('correct');
    }
  });

  const result = document.getElementById('quiz-result-final');
  const passed = correct >= Math.ceil(total * 0.7);

  if (passed) {
    result.className = 'quiz-result-final show pass';
    result.innerHTML = `🎉 Отлично! ${correct} из ${total}. Модуль засчитан!`;
    completeModule(module.id);

    document.getElementById('check-quiz-btn').style.display = 'none';
    const completeBlock = document.getElementById('module-complete');
    completeBlock.classList.add('show');

    setTimeout(() => {
      completeBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 500);
  } else {
    result.className = 'quiz-result-final show fail';
    result.innerHTML = `${correct} из ${total}. Нужно минимум ${Math.ceil(total * 0.7)}. Попробуйте ещё раз!`;
  }
}

function completeModule(moduleId) {
  saveProgress(moduleId, {
    completed: true,
    completedAt: new Date().toISOString()
  });
  addXP(window.currentModule.xpReward);
  addBadge(`Модуль ${moduleId} пройден`);
}

// ============================================
// MODAL
// ============================================
function showModal(icon, title, text) {
  const modal = document.getElementById('modal');
  if (!modal) return;
  document.getElementById('modal-icon').textContent = icon;
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-text').textContent = text;
  modal.classList.add('show');
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) modal.classList.remove('show');
}
