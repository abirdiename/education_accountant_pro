// ============================================
// ИНТЕРАКТИВНЫЕ ЭЛЕМЕНТЫ В УРОКАХ
// ============================================

// Микро-тесты по ходу чтения
function checkMicro(btn, isCorrect) {
  const quiz = btn.closest('.micro-quiz');
  const allBtns = quiz.querySelectorAll('button');
  const feedbacks = quiz.querySelectorAll('.feedback');

  allBtns.forEach(b => b.disabled = true);
  feedbacks.forEach(f => f.classList.remove('show'));

  if (isCorrect) {
    btn.classList.add('correct');
    quiz.querySelector('.feedback.right').classList.add('show');
    if (typeof addXP === 'function') addXP(5);
  } else {
    btn.classList.add('wrong');
    quiz.querySelector('.feedback.wrong').classList.add('show');
    allBtns.forEach(b => {
      const onclickAttr = b.getAttribute('onclick') || '';
      if (onclickAttr.includes('true')) b.classList.add('correct');
    });
  }

  setTimeout(() => {
    allBtns.forEach(b => {
      b.disabled = false;
      b.classList.remove('correct', 'wrong');
    });
    feedbacks.forEach(f => f.classList.remove('show'));
  }, 5000);
}

// ============================================
// КАЛЬКУЛЯТОРЫ
// ============================================
function calcSutochnye() {
  const daily = parseFloat(document.getElementById('calc-daily')?.value) || 0;
  const days = parseFloat(document.getElementById('calc-days')?.value) || 0;
  const limit = parseFloat(document.getElementById('calc-type')?.value) || 700;

  const totalSutochnye = daily * days;
  const limitTotal = limit * days;
  const taxable = Math.max(0, totalSutochnye - limitTotal);
  const ndfl = Math.round(taxable * 0.13);
  const insurance = Math.round(taxable * 0.302);

  const resultEl = document.getElementById('calc-result');
  if (!resultEl) return;

  resultEl.innerHTML = `
    Всего суточных: <strong>${totalSutochnye.toLocaleString('ru-RU')} ₽</strong><br>
    Без НДФЛ (лимит): ${limitTotal.toLocaleString('ru-RU')} ₽<br>
    Облагается НДФЛ: ${taxable.toLocaleString('ru-RU')} ₽<br>
    ${taxable > 0 ? `НДФЛ: <strong>${ndfl.toLocaleString('ru-RU')} ₽</strong><br>Страховые взносы: ~${insurance.toLocaleString('ru-RU')} ₽` : '✅ Налогов нет — в пределах лимита'}
  `;
}

function calcPredstav() {
  const fot = parseFloat(document.getElementById('calc-fot')?.value) || 0;
  const fact = parseFloat(document.getElementById('calc-fact')?.value) || 0;

  const limit = fot * 0.04;
  const accepted = Math.min(fact, limit);
  const overLimit = Math.max(0, fact - limit);

  const resultEl = document.getElementById('calc-result2');
  if (!resultEl) return;

  resultEl.innerHTML = `
    Лимит (4% ФОТ): <strong>${limit.toLocaleString('ru-RU')} ₽</strong><br>
    Принимается в расходы: <strong>${accepted.toLocaleString('ru-RU')} ₽</strong><br>
    ${overLimit > 0 ? `⚠️ Сверх лимита: ${overLimit.toLocaleString('ru-RU')} ₽` : '✅ Всё в лимите'}
  `;
}

function calcROI() {
  const reports = parseFloat(document.getElementById('roi-reports')?.value) || 0;
  const time = parseFloat(document.getElementById('roi-time')?.value) || 0;
  const cost = parseFloat(document.getElementById('roi-cost')?.value) || 0;

  const currentHours = (reports * time) / 60;
  const newHours = (reports * 5) / 60;
  const savedHours = currentHours - newHours;
  const savedMoney = Math.round(savedHours * cost);
  const yearlyMoney = savedMoney * 12;

  const resultEl = document.getElementById('roi-result');
  if (!resultEl) return;

  resultEl.innerHTML = `
    Сейчас: <strong>${currentHours.toFixed(1)} ч/мес</strong><br>
    После автоматизации: ${newHours.toFixed(1)} ч/мес<br>
    Экономия: <strong>${savedHours.toFixed(1)} часов</strong><br>
    В деньгах: <strong>${savedMoney.toLocaleString('ru-RU')} ₽/мес</strong><br>
    За год: <strong>${yearlyMoney.toLocaleString('ru-RU')} ₽</strong>
  `;
}

// ============================================
// СКАЧИВАНИЕ ШАБЛОНОВ
// ============================================
function downloadTemplate(type) {
  const templates = {
    reglament: `РЕГЛАМЕНТ работы с подотчётными средствами

1. ОБЩИЕ ПОЛОЖЕНИЯ
1.1. Регламент устанавливает порядок выдачи денежных средств под отчёт.
1.2. Обязателен для исполнения всеми сотрудниками.

2. ПОДОТЧЁТНЫЕ ЛИЦА
2.1. Деньги выдаются сотрудникам в штате или по договору ГПХ.
2.2. Список утверждается приказом руководителя.

3. ПОРЯДОК ВЫДАЧИ
3.1. Основание — заявление или приказ.
3.2. Лимиты:
   - Разовая выдача: до 50 000 ₽
   - Командировка РФ: до 100 000 ₽
   - Командировка за рубеж: до 300 000 ₽

4. СРОКИ ОТЧЁТА
4.1. 3 рабочих дня после возвращения/окончания срока.

5. ТРЕБОВАНИЯ К ДОКУМЕНТАМ
5.1. Кассовые чеки по 54-ФЗ (QR-код обязателен).
5.2. Электронные чеки в PDF.
5.3. Билеты + посадочные талоны.

6. ОТВЕТСТВЕННОСТЬ
6.1. При нарушении сроков — приостановка новых выдач.
6.2. Возможно удержание из ЗП (не более 20%).

[Адаптируйте под свою компанию]`,

    checklist: `ЧЕК-ЛИСТ ПРОВЕРКИ АВАНСОВОГО ОТЧЁТА

ОБЩЕЕ
□ Заполнены все поля
□ Указан период
□ Суммы совпадают с документами
□ Подпись подотчётника
□ Подпись руководителя

ПО ЧЕКАМ
□ Дата и время
□ Наименование и ИНН
□ Расшифровка товаров/услуг
□ QR-код
□ Фискальный признак
□ Дата соответствует периоду

КОМАНДИРОВКА
□ Приказ оформлен
□ Билеты + посадочные талоны
□ Документы по проживанию
□ Суточные в лимите (700/2500 ₽)

ПРЕДСТАВИТЕЛЬСКИЕ
□ Приказ о мероприятии
□ Смета
□ Отчёт с участниками
□ В лимите 4% ФОТ

✅ Все галочки — отчёт можно проводить!`,

    prikaz: `ПРИКАЗ № ___
от «___» _____________ 20__ г.

О выдаче денежных средств под отчёт

ПРИКАЗЫВАЮ:

1. Выдать сотруднику ___________________________________
   (должность, ФИО)
   денежные средства в сумме _______________ (______________) рублей
   на следующие цели: _____________________________________________

2. Срок: до «___» _____________ 20__ г.

3. Способ выдачи:
   ☐ наличными через кассу
   ☐ переводом на карту № _____________________

4. Отчёт предоставить в течение 3 (трёх) рабочих дней по окончании срока.

Руководитель: __________________ / _______________________ /

С приказом ознакомлен:
__________________ / _______________________ /

«___» _____________ 20__ г.`
  };

  const text = templates[type] || 'Шаблон';
  const filenames = {
    reglament: 'Регламент_подотчёт.txt',
    checklist: 'Чек-лист_авансовый_отчёт.txt',
    prikaz: 'Шаблон_приказа.txt'
  };

  const blob = new Blob(['\uFEFF' + text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filenames[type] || 'template.txt';
  a.click();
  URL.revokeObjectURL(url);
}
