import { CATEGORIES, STAGES, GUIDE } from './content.js';
import { gardenScene, plantIcon } from './art.js';
import { CREATORS, NEEDS, renderLearningView, renderPracticeModal, renderPracticeNotes } from './learning-ui.js';
import { STORAGE_KEY, todayKey, stageOf, normalizeState, loadState, saveState, addWish, prepareSession, completeSession, archiveWish, updateWish, selectWish, addPracticeNote, totalStats } from './state.js';

const app = document.querySelector('#app');
const modal = document.querySelector('#modal');
const loaded = loadState();
let state = loaded.state;
let storageWarning = loaded.warning;
let view = 'garden';
let modalKind = '';
let chosenCategory = 'growth';
let ritual = null;
let pendingImport = null;
let editingId = null;
let plantPractice = null;
let learningFilters = { language: 'all', need: 'all' };
let toastTimer;
let audioContext;
let lastDay = todayKey();

const paths = {
  leaf: '<path d="M12 21V11M12 15C4 16 3 9 4 5c6 0 10 4 8 10Zm0-4C12 4 17 2 22 3c0 6-4 10-10 8Z"/>',
  seed: '<path d="M12 21v-9M12 15C5 15 4 10 5 6c5 0 8 3 7 9Zm0-4c0-6 4-8 8-8 1 5-2 9-8 8Z"/><path d="M6 22h12"/>',
  spark: '<path d="m12 3 2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2L12 3Z"/><path d="m20 2 .5 1.5L22 4l-1.5.5L20 6l-.5-1.5L18 4l1.5-.5L20 2Z"/>',
  book: '<path d="M12 6c-3-3-7-3-10-2v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-3-1-7-1-10 2ZM12 6v14"/><path d="M5 8h3M5 12h3M16 8h3M16 12h3"/>',
  heart: '<path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 1v2M12 21v2M1 12h2M21 12h2M4.2 4.2l1.5 1.5M18.3 18.3l1.5 1.5M4.2 19.8l1.5-1.5M18.3 5.7l1.5-1.5"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z"/>',
  cat: '<path d="m4 10 1-7 5 4h4l5-4 1 7c3 7-1 11-8 11S1 17 4 10Z"/><path d="M7 12v1M17 12v1m-7 3 2 1 2-1M1 14l4 1M23 14l-4 1M2 18h4M22 18h-4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 14v3"/>',
  sound: '<path d="M11 4 5 9H2v6h3l6 5V4ZM15 8a6 6 0 0 1 0 8M18 4a11 11 0 0 1 0 16"/>',
  muted: '<path d="M11 4 5 9H2v6h3l6 5V4Zm5 5 6 6m0-6-6 6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 15v5h16v-5"/>',
  upload: '<path d="M12 15V3m-5 5 5-5 5 5M4 15v5h16v-5"/>',
  archive: '<path d="M4 9v12h16V9M3 3h18v6H3zM9 13h6"/>',
  edit: '<path d="m16 3 5 5L8 21H3v-5L16 3Zm-3 3 5 5"/>',
  shuffle: '<path d="M3 6h3c5 0 7 12 12 12h3m-4-4 4 4-4 4M3 18h3c2 0 3-2 4-4M14 9c1-2 2-3 4-3h3m-4-4 4 4-4 4"/>',
  water: '<path d="M12 2S4 11 4 16a8 8 0 0 0 16 0c0-5-8-14-8-14Z"/><path d="M8 16a4 4 0 0 0 4 4"/>',
  moon: '<path d="M21 13a9 9 0 1 1-10-10 7 7 0 0 0 10 10Z"/>',
  flower: '<path d="M12 12c-9-1-7-10-3-9 3 0 3 5 3 9Zm0 0c-1-9 8-10 9-6 1 3-4 5-9 6Zm0 0c8-4 13 4 9 6-3 2-6-2-9-6Zm0 0c6 7-1 13-4 10-2-2 1-7 4-10Zm0 0C7 19 0 14 2 10c2-3 6 0 10 2Z"/>',
};
function icon(name, extra = '') { return '<svg class="icon ' + extra + '" viewBox="0 0 24 24" aria-hidden="true">' + (paths[name] || paths.spark) + '</svg>'; }
function esc(value = '') { return String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
function category(id) { return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1]; }
function activeWishes() { return state.wishes.filter(w => !w.archived); }
function selectedWish() { return activeWishes().find(w => w.id === state.selectedId) || activeWishes()[0]; }
function findWish(id) { return state.wishes.find(w => w.id === id); }
function sessionOf(wish) { return wish?.sessions.find(s => s.date === todayKey()); }
function currentCategory(wish) { return category(wish?.category); }
function prettyDate(value) { const d = new Date(value.length === 10 ? value + 'T12:00:00+08:00' : value); return Number.isNaN(d.getTime()) ? '' : new Intl.DateTimeFormat('zh-HK', { timeZone:'Asia/Shanghai', year:'numeric', month:'long', day:'numeric' }).format(d); }
function randomItem(items, except) { const pool = items.filter(x => x !== except); return pool[Math.floor(Math.random() * pool.length)] || items[0]; }
function persist(next) {
  state = next;
  const result = saveState(state);
  storageWarning = result.ok ? null : result.error;
  render();
  if (!result.ok) toast(result.error);
}
function refreshSavedProgress() {
  // Keep the current form, but never let it overwrite a newer garden from another tab.
  if (storageWarning) return;
  const latest = loadState();
  if (latest.warning) { storageWarning=latest.warning; render(); return; }
  if (JSON.stringify(latest.state) === JSON.stringify(state)) return;
  const targetId = ritual?.wishId || editingId || modal.querySelector('[data-id]')?.dataset.id;
  state=latest.state;
  if (modal.open && targetId && !state.wishes.some(w=>w.id===targetId && !w.archived)) {
    closeModal();toast('這顆心願已在另一個分頁更新。花園已同步最新進度。');
  } else if (modal.open && targetId && ['ritual','complete','edit-action'].includes(modalKind) && sessionOf(findWish(targetId))?.completedAt) {
    closeModal();toast('今天的行動已在另一個分頁記錄，花園已同步。');
  }
  render();
}
function toast(message) {
  clearTimeout(toastTimer);
  const node = document.querySelector('#toast');
  node.textContent = message;
  node.classList.add('visible');
  toastTimer = setTimeout(() => node.classList.remove('visible'), 4500);
}
function chime(kind = 'light') {
  if (!state.preferences.sound) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') void audioContext.resume().catch(() => {});
    const frequencies = kind === 'success' ? [523.25, 659.25, 783.99] : [523.25 + (ritual?.collected.size || 0) * 65.4];
    frequencies.forEach((frequency, i) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = audioContext.currentTime + i * .12;
      oscillator.type = 'sine'; oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(.055, start + .015); gain.gain.exponentialRampToValueAtTime(.001, start + .65);
      oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(start); oscillator.stop(start + .7);
    });
  } catch { /* Audio is optional and may be unavailable in this browser. */ }
}
function burst(x, y) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < 9; i++) {
    const particle = document.createElement('span');
    particle.className = 'spark-burst';
    particle.style.left = x + 'px'; particle.style.top = y + 'px';
    particle.style.setProperty('--dx', (Math.cos(i * .7) * (25 + Math.random() * 40)) + 'px');
    particle.style.setProperty('--dy', (Math.sin(i * .7) * (25 + Math.random() * 40)) + 'px');
    document.body.append(particle); setTimeout(() => particle.remove(), 850);
  }
}
function header() {
  return `<header class="site-header">
    <button class="brand" data-action="garden" aria-label="LUMINA 顯化花園首頁"><span class="brand-mark">${icon('leaf')}</span><span><span class="brand-name">LUMINA</span><span class="brand-sub">顯化花園</span></span></button>
    <nav class="main-nav" aria-label="主要導覽">
      <button class="nav-btn ${view === 'garden' ? 'active' : ''}" data-action="garden" ${view === 'garden' ? 'aria-current="page"' : ''}>${icon('seed')}我的花園</button>
      <button class="nav-btn ${view === 'learn' ? 'active' : ''}" data-action="learn" ${view === 'learn' ? 'aria-current="page"' : ''}>${icon('compass')}靈感書房</button>
      <button class="nav-btn ${view === 'journal' ? 'active' : ''}" data-action="journal" ${view === 'journal' ? 'aria-current="page"' : ''}>${icon('book')}心願手帳</button>
      <button class="nav-btn" data-action="guide">${icon('info')}遊玩指南</button>
    </nav>
    <div class="header-tools"><span class="private-label">${icon('lock')}本機進度</span><button class="icon-button ${state.preferences.sound ? 'on' : ''}" data-action="sound" aria-label="${state.preferences.sound ? '關閉音效' : '開啟音效'}" title="${state.preferences.sound ? '關閉音效' : '開啟音效'}" aria-pressed="${state.preferences.sound}">${icon(state.preferences.sound ? 'sound' : 'muted')}</button></div>
  </header>`;
}
function footer() {
  return `<footer class="site-footer"><span class="footer-quote">${icon('spark')}想像給方向，行動讓花園生長。照自己的步調就好。</span><span class="footer-brand">GROW AT YOUR PACE</span></footer>`;
}
function statsRow() {
  const stats = totalStats(state);
  return `<section class="stats-row" aria-label="花園累積"><div class="stat"><span class="stat-number">${stats.active.toString().padStart(2,'0')}</span><span class="stat-label">顆心願種子</span></div><div class="stat"><span class="stat-number">${stats.lights.toString().padStart(2,'0')}</span><span class="stat-label">點收集的微光</span></div><div class="stat"><span class="stat-number">${stats.completed.toString().padStart(2,'0')}</span><span class="stat-label">次真實小行動</span></div><div class="stat"><span class="stat-number">${stats.days.toString().padStart(2,'0')}</span><span class="stat-label">天溫柔的累積</span></div></section>`;
}
function growthTrack(wish, compact = false) {
  return `<div class="${compact ? 'tile-progress' : 'growth-track'}" aria-label="已累積 ${wish.growth} 次行動，7 次開花">${Array.from({length:7}, (_, i) => `<${compact ? 'i' : 'span'} class="${i < wish.growth ? 'filled' : ''}"></${compact ? 'i' : 'span'}>`).join('')}</div>`;
}
function ritualPanel(wish) {
  if (!wish) return `<aside class="ritual-panel"><div class="eyebrow">A SEED OF POSSIBILITY</div><div class="panel-body"><div class="ritual-emblem">${icon('seed')}</div><h2 class="empty-panel-title">第一顆心願，<br>從這裡開始。</h2><p class="empty-panel-copy">不必一次想好整個人生。<br>選一件你想慢慢靠近的事，<br>為它留一小片花園。</p></div><button class="btn btn-primary full-width" data-action="plant">種下第一個心願${icon('arrow')}</button><div class="ritual-footer"><span>${icon('seed')}種下願望</span><i>·</i><span>${icon('spark')}收集微光</span><i>·</i><span>${icon('water')}行動澆灌</span></div></aside>`;
  const cat = currentCategory(wish);
  const session = sessionOf(wish);
  const label = `<span class="category-tag">${icon(cat.icon)}${esc(cat.name)}</span>`;
  const title = `<h2 class="panel-wish-title">${esc(wish.title)}</h2>`;
  const growth = `<div class="growth-row"><span>${STAGES[stageOf(wish)]}</span><span>${Math.min(wish.growth,7)} / 7 次澆灌</span></div>${growthTrack(wish)}`;
  if (session?.completedAt) return `<aside class="ritual-panel"><div class="eyebrow">A LITTLE CLOSER, EVERY DAY</div><div class="panel-body">${label}${title}${growth}<div class="complete-bloom">${icon('flower')}</div><div class="action-heading">你已經往前一步。</div><p>今天的行動已留在花園裡。<br>每一點累積，都算數。</p><div class="status-line">${icon('check')}今日已澆灌 · +1 次成長</div></div><div class="button-stack"><button class="btn btn-primary full-width" data-action="journal">看看今天的記錄${icon('arrow')}</button><button class="btn btn-ghost" data-action="detail" data-id="${wish.id}">查看這顆心願</button></div></aside>`;
  if (session) return `<aside class="ritual-panel panel-pending"><div class="eyebrow">TAKE YOUR LIGHT INTO LIFE</div><div class="panel-body">${label}${title}${growth}<div class="status-line">${icon('spark')}微光已收集 · 今天的小行動</div><div class="action-copy">${esc(session.action)}</div><p>做完後，回來記錄這一步。<br>讓想像慢慢走進生活。</p></div><div class="button-stack"><button class="btn btn-primary full-width" data-action="complete" data-id="${wish.id}">記錄已完成的行動${icon('check')}</button><button class="btn btn-ghost" data-action="edit-action" data-id="${wish.id}">調整今天的行動</button></div></aside>`;
  return `<aside class="ritual-panel"><div class="eyebrow">YOUR DAILY RITUAL</div><div class="panel-body">${label}${title}${wish.vision ? `<p class="wish-vision">${esc(wish.vision)}</p>` : ''}${growth}<div class="action-heading">給心願一點光。</div><p>一段想像、六顆微光，<br>一個今天做得到的小行動。</p></div><div class="button-stack"><button class="btn btn-primary full-width" data-action="ritual" data-id="${wish.id}">開始今日儀式${icon('spark')}</button><button class="btn btn-ghost" data-action="detail" data-id="${wish.id}">查看與編輯心願</button></div></aside>`;
}
function wishTile(wish) {
  const cat = currentCategory(wish);
  const selected = selectedWish()?.id === wish.id;
  return `<button class="wish-tile ${selected ? 'selected' : ''}" data-action="select" data-id="${wish.id}" aria-pressed="${selected}" aria-label="選擇心願：${esc(wish.title)}"><span class="tile-plant">${plantIcon(wish.category,stageOf(wish),cat.color)}</span><span class="tile-info"><span class="tile-category">${esc(cat.name)}</span><span class="tile-title" style="display:block">${esc(wish.title)}</span><span class="tile-stage">${sessionOf(wish)?.completedAt ? icon('check') : ''}${STAGES[stageOf(wish)]}</span>${growthTrack(wish,true)}</span>${selected ? '<span class="tile-selected-dot" aria-hidden="true"></span>' : ''}</button>`;
}
function gardenView() {
  const wishes = activeWishes();
  const wish = selectedWish();
  return `<main id="main"><section class="intro"><div><div class="eyebrow">A LITTLE MAGIC. A REAL LITTLE STEP.</div><h1>讓心願，<em>慢慢開花。</em></h1></div><p class="intro-copy">種下一個願望，收集一點微光。<br>把今天的小行動，變成花園裡的生長。</p></section>
    <section class="play-space" aria-label="互動花園"><div class="garden-world"><div class="world-head"><span class="world-title">${icon('spark')}晨光花房</span><span class="world-weather">${icon('sun')}A QUIET BEGINNING</span></div><div class="world-art">${gardenScene(wishes.map(w => ({...w,level:stageOf(w),color:category(w.category).color})),{activeId:wish?.id})}</div>${!wishes.length ? `<button class="world-float" data-action="plant">${icon('plus')}這裡，留給你的第一個心願</button>` : ''}<div class="world-caption">${wishes.length ? '點選花房裡的植物，照顧你想靠近的生活。' : '一片小小的花園，盛放你所有的可能。'}</div></div>${ritualPanel(wish)}</section>
    ${statsRow()}<section class="wish-section"><div class="section-heading"><div><h2>我的心願種子</h2><p>${wishes.length ? '每一顆心願，都有自己的生長節奏。' : '從你此刻最在意的一件事開始。'}</p></div>${wishes.length ? `<button class="text-button" data-action="plant">${icon('plus')}${wishes.length < 6 ? '再種一個心願' : '花園位置已滿'}</button>` : '<span class="text-button" aria-hidden="true">CHOOSE YOUR SEED</span>'}</div>${wishes.length ? `<div class="wish-grid">${wishes.map(wishTile).join('')}${wishes.length < 6 ? `<button class="wish-tile empty-tile" data-action="plant"><span class="empty-circle">${icon('plus')}</span><span>留一個位置<small>給下一個想靠近的願望</small></span></button>` : ''}</div>` : `<div class="empty-state-row">${CATEGORIES.map(c=>`<button class="theme-teaser" style="--theme-color:${c.color}" data-action="plant" data-category="${c.id}">${icon(c.icon)}${esc(c.name)}</button>`).join('')}</div>`}</section><section class="learning-invite"><div><span class="eyebrow">A LITTLE INSPIRATION</span><h2>還沒找到自己的起點？</h2><p>借一個提問，慢慢寫出你的答案。五位創作者，五段可帶進生活的練習。</p></div><button class="btn btn-dark-outline" data-action="learn">到靈感書房看看${icon('arrow')}</button></section></main>`;
}
function journalView() {
  const stats = totalStats(state);
  const archived = state.wishes.filter(w=>w.archived);
  return `<main id="main"><section class="intro journal-intro"><div><div class="eyebrow">LITTLE STEPS, LOVINGLY KEPT</div><h1>每一步，<em>都有回聲。</em></h1><p class="intro-copy">把微小卻真實的前進，好好留在這裡。</p></div><div class="journal-tools"><button class="btn btn-dark-outline" data-action="export">${icon('download')}匯出備份</button><button class="btn btn-dark-outline" data-action="import">${icon('upload')}匯入備份</button></div></section><div class="journal-layout"><section class="journal-content" aria-label="行動記錄">${state.journal.length ? state.journal.map(entry => `<article class="journal-entry"><div class="entry-date">${prettyDate(entry.date)}</div><div class="entry-card"><div class="entry-category">${icon(category(entry.category).icon)}${esc(category(entry.category).name)}</div><h3>${esc(entry.wishTitle)}</h3><p class="entry-action">${icon('check')}<span>${esc(entry.action)}</span></p>${entry.note ? `<p class="entry-note">${esc(entry.note)}</p>` : ''}</div></article>`).join('') : `<div class="journal-empty">${icon('book')}<h2>第一頁，留給今天的你。</h2><p>完成一次小行動，再回到花園記錄。你的心願、行動與感受，就會慢慢填滿這本手帳。</p><button class="btn btn-light" data-action="garden">回到花園${icon('arrow')}</button></div>`}</section><aside class="journal-side"><div class="modal-eyebrow">YOUR QUIET PROGRESS</div><h2>慢慢來，也會長大。</h2><p>這裡記下的是累積的日子。<br>中途休息，已長出的葉子也會留下。</p><div class="journal-summary"><div><strong>${stats.active}</strong><span>生長中的心願</span></div><div><strong>${stats.completed}</strong><span>次真實行動</span></div><div><strong>${stats.days}</strong><span>天的累積</span></div><div><strong>${state.wishes.filter(w=>w.growth >= 7).length}</strong><span>朵綻放的花</span></div></div><p class="storage-note">${icon('lock')}進度儲存在目前的瀏覽器。換裝置或清除瀏覽資料前，可以先匯出備份，再於另一裝置匯入。</p></aside></div>${renderPracticeNotes(state.practiceNotes,{esc,icon,prettyDate})}${archived.length ? `<section class="archive-section"><h2>珍藏的心願</h2><div class="archive-grid">${archived.map(w=>`<article class="archive-item"><div class="tile-plant">${plantIcon(w.category,stageOf(w),category(w.category).color)}</div><div><h3>${esc(w.title)}</h3><p>${STAGES[stageOf(w)]} · ${w.growth} 次澆灌</p></div><button class="text-button" data-action="restore" data-id="${w.id}" aria-label="把 ${esc(w.title)} 種回花園">種回花園</button></article>`).join('')}</div></section>` : ''}</main>`;
}
function render() {
  app.innerHTML = `<div class="shell">${header()}${storageWarning ? `<div class="data-warning" role="status">${esc(storageWarning)} 可到「心願手帳」匯出備份。</div>` : ''}${view === 'learn' ? renderLearningView(learningFilters,{esc,icon}) : view === 'journal' ? journalView() : gardenView()}${footer()}</div>`;
}
function setModal(html, kind) {
  modalKind = kind;
  modal.innerHTML = `<button class="icon-button modal-close" data-action="close" aria-label="關閉視窗">${icon('close')}</button>${html}`;
  if (!modal.open) modal.showModal();
  requestAnimationFrame(() => { const heading = modal.querySelector('#dialog-title'); if (heading) {heading.tabIndex = -1; heading.focus({preventScroll:true});} });
}
function closeModal() { modal.close(); modalKind = ''; ritual = null; editingId = null; pendingImport = null; plantPractice = null; }
function formError(error) { const node = modal.querySelector('#form-error'); if (node) {node.textContent = error.message || String(error); node.setAttribute('role','alert');} else toast(error.message || String(error)); }
function openPlant(categoryId = 'growth', practice = null) {
  if (activeWishes().length >= 6) { toast('六個位置都已有心願了。可以先把一顆心願移到珍藏，騰出新的空間。'); return; }
  plantPractice = practice;
  chosenCategory = category(categoryId).id;
  const cat = category(chosenCategory);
  setModal(`<div class="modal-wrap"><div class="modal-eyebrow">PLANT A POSSIBILITY</div><h2 id="dialog-title">你想靠近怎樣的生活？</h2><p class="modal-description">選一顆種子，寫下一個屬於你的願望。<br>從小小的、真正在意的事開始。</p><div class="category-grid" aria-label="心願主題">${CATEGORIES.map(c=>`<button class="category-option ${c.id===chosenCategory?'chosen':''}" data-action="category" data-category="${c.id}" aria-pressed="${c.id===chosenCategory}">${icon(c.icon)}${esc(c.name)}</button>`).join('')}</div><form id="plant-form"><div class="form-field"><label for="wish-title">我的心願<span class="optional">必填 · 最多 80 字</span></label><input class="form-input" id="wish-title" name="title" type="text" maxlength="80" required placeholder="${esc(cat.titlePlaceholder)}" autocomplete="off"></div><div class="form-field"><label for="wish-vision">想像它成為日常的畫面<span class="optional">選填</span></label><textarea class="form-input" id="wish-vision" name="vision" rows="3" maxlength="400" placeholder="${esc(cat.visionPlaceholder)}"></textarea><p class="field-hint">寫下你會看見、感受到的小細節，之後也可以修改。</p></div><p id="form-error" class="form-error"></p><button class="btn btn-primary full-width" type="submit">種下這顆心願${icon('seed')}</button></form></div>`,'plant');
  if (practice) modal.querySelector('#wish-vision').value = practice.reflection.slice(0,400);
}
function chooseCategory(id) {
  chosenCategory = category(id).id;
  modal.querySelectorAll('[data-action="category"]').forEach(node=> {const selected = node.dataset.category===chosenCategory; node.classList.toggle('chosen',selected);node.setAttribute('aria-pressed',String(selected));});
  modal.querySelector('#wish-title').placeholder = category(chosenCategory).titlePlaceholder;
  modal.querySelector('#wish-vision').placeholder = category(chosenCategory).visionPlaceholder;
}
function openGuide() {
  setModal(`<div class="modal-wrap"><div class="modal-eyebrow">A GARDEN THAT GROWS WITH YOU</div><h2 id="dialog-title">把心願，慢慢種進生活。</h2><p class="modal-description">每天幾分鐘，給想去的方向一點光。</p><div class="guide-list">${GUIDE.map((item,i)=>`<div class="guide-item"><span class="guide-number">0${i+1}</span><div><h3>${item.title}</h3><p>${item.body}</p></div></div>`).join('')}</div><div class="guide-note">每顆心願每天可以收集 6 點微光，完成並記錄一個行動後成長一次。累積 1、3、5、7 次行動，依序長出新芽、枝葉、花苞和花朵。<div class="guide-stages">${STAGES.map((name,i)=>`<span>${plantIcon('custom',i,'#a4b880')}${name}</span>`).join('')}</div></div><p class="modal-description">花朵記錄的是你的付出。願望的方向可以調整，休息幾天也不會失去進度。</p><p class="field-hint">同時最多種植 6 顆心願；心願可移到手帳珍藏。進度保存在目前瀏覽器，可在手帳匯出或匯入備份。</p><button class="btn btn-primary full-width" style="margin-top:23px" data-action="close">準備好了${icon('arrow')}</button></div>`,'guide');
}
function openRitual(id, suggestedAction = '') {
  const wish = findWish(id);
  if (!wish || wish.archived) return;
  if (sessionOf(wish)?.completedAt) {toast('這顆心願今天已澆灌過了，下次再帶一點新的光回來。');return;}
  if (sessionOf(wish)) {openComplete(id);return;}
  ritual = {wishId:id,step:0,collected:new Set(),action:suggestedAction || randomItem(category(wish.category).actions)};
  renderRitual();
}
function renderRitual() {
  if (!ritual) return;
  const wish = findWish(ritual.wishId);
  const cat = category(wish.category);
  const stepHead = `<div class="step-label"><span>今日儀式</span><span>0${ritual.step+1} / 03</span></div><div class="step-dots">${[0,1,2].map(i=>`<span class="${i<=ritual.step?'active':''}"></span>`).join('')}</div>`;
  let body;
  if (ritual.step===0) {
    body = `<div class="modal-eyebrow">MAKE ROOM FOR YOUR WISH</div><h2 id="dialog-title">先和那個畫面，待一會。</h2><p class="modal-description">${esc(wish.title)}</p><div class="imagine-orb">${plantIcon(wish.category,Math.max(1,stageOf(wish)),cat.color)}</div><div class="vision-quote">${esc(wish.vision || cat.reflections[0])}</div><p class="imagine-tip">讓肩膀放鬆，想像其中一個小細節。<br>準備好了，就把這份心意帶進花園。</p><button class="btn btn-primary full-width" data-action="ritual-next">準備好了，去收集微光${icon('arrow')}</button>`;
  } else if (ritual.step===1) {
    const positions = [[24,24],[66,19],[82,50],[64,78],[25,77],[16,49]];
    body = `<div class="modal-eyebrow">GATHER A LITTLE LIGHT</div><h2 id="dialog-title">收集六顆，屬於你的微光。</h2><p class="modal-description">輕點每一顆發光的小星。沒有倒數，慢慢來。</p><div class="light-field"><span class="light-center">${icon('seed')}</span>${positions.map(([x,y],i)=>`<button class="light-target ${ritual.collected.has(i)?'collected':''}" style="left:${x}%;top:${y}%;--delay:${i*-.6}s" data-action="collect" data-light="${i}" aria-label="收集第 ${i+1} 顆微光" ${ritual.collected.has(i)?'disabled':''}></button>`).join('')}</div><div class="light-counter" aria-live="polite">${icon('spark')}<span id="light-count">${ritual.collected.size} / 6 點微光</span></div><div class="light-dots" aria-hidden="true">${[0,1,2,3,4,5].map(i=>`<span class="${i<ritual.collected.size?'filled':''}"></span>`).join('')}</div><p class="collect-tip" id="collect-tip">每一點光，都是一次回到此刻。</p><button class="btn btn-primary full-width" id="light-next" data-action="ritual-next" ${ritual.collected.size<6?'disabled':''}>帶著微光，抽一張行動卡${icon('arrow')}</button>`;
  } else {
    body = `<div class="modal-eyebrow">LET THE WISH BECOME A STEP</div><h2 id="dialog-title">今天，靠近它一點點。</h2><p class="modal-description">抽一張行動卡，也可以改成更適合你的事。</p><div class="action-card"><div class="card-number">A SMALL ACT OF POSSIBILITY</div>${icon(cat.icon)}<div class="card-text" id="drawn-action">${esc(ritual.action)}</div><div class="shuffle-row"><button type="button" class="btn btn-ghost" data-action="shuffle">${icon('shuffle')}再抽一張</button></div></div><form id="ritual-form"><div class="form-field"><label for="today-action">我今天想做的一小步<span class="optional">可自由修改</span></label><textarea class="form-input" id="today-action" name="action" rows="2" maxlength="240" required>${esc(ritual.action)}</textarea></div><p id="form-error" class="form-error"></p><button class="btn btn-primary full-width" type="submit">收下行動卡 · 帶回 6 點微光${icon('arrow')}</button><p class="field-hint" style="text-align:center;margin-top:12px">在生活裡完成它，再回來讓心願生長。</p></form>`;
  }
  setModal(`<div class="modal-wrap">${stepHead}${body}</div>`,'ritual');
}
function collectLight(node, event) {
  if (!ritual || ritual.step!==1) return;
  const index = Number(node.dataset.light);
  if (ritual.collected.has(index)) return;
  ritual.collected.add(index);
  node.classList.add('collected'); node.disabled = true;
  document.querySelector('#light-count').textContent = ritual.collected.size + ' / 6 點微光';
  modal.querySelectorAll('.light-dots span').forEach((dot,i)=>dot.classList.toggle('filled',i<ritual.collected.size));
  const box = node.getBoundingClientRect(); burst(event.clientX || box.x+box.width/2,event.clientY || box.y+box.height/2);
  chime();
  if (ritual.collected.size===6) {
    const next = modal.querySelector('#light-next'); next.disabled = false;
    modal.querySelector('#collect-tip').textContent = '微光收好了。把它們變成今天的小小行動吧。';
    if (event.detail===0) next.focus();
  } else if (event.detail===0) modal.querySelector('.light-target:not(:disabled)')?.focus();
}
function openComplete(id) {
  const wish = findWish(id); const session = sessionOf(wish);
  if (!wish || !session || session.completedAt) return;
  editingId = id;
  setModal(`<div class="modal-wrap"><div class="modal-eyebrow">ONE REAL STEP, ONE NEW LEAF</div><h2 id="dialog-title">把做過的小事，好好記下。</h2><p class="modal-description">先在生活裡完成這一步，再回來澆灌心願。<br>「${esc(wish.title)}」</p><form id="complete-form"><div class="form-field"><label for="done-action">我已完成的行動<span class="optional">可按實際情況修改</span></label><textarea class="form-input" id="done-action" name="action" rows="2" required maxlength="240">${esc(session.action)}</textarea></div><div class="form-field"><label for="action-note">有甚麼想留給未來的自己？<span class="optional">選填</span></label><textarea class="form-input" id="action-note" name="note" rows="3" maxlength="600" placeholder="一個感受、一點發現，或一句想對自己說的話……"></textarea></div><p id="form-error" class="form-error"></p><button class="btn btn-primary full-width" type="submit">我已完成，讓心願生長${icon('water')}</button></form></div>`,'complete');
}
function openActionEdit(id, suggestedAction = '') {
  const wish = findWish(id); const session = sessionOf(wish);
  if (!session || session.completedAt) return;
  editingId = id;
  setModal(`<div class="modal-wrap"><div class="modal-eyebrow">MAKE IT YOUR OWN</div><h2 id="dialog-title">選一個今天做得到的版本。</h2><p class="modal-description">小一點，也很好。把行動改成現在的你能照顧到的程度。</p><form id="edit-action-form"><div class="form-field"><label for="edit-action">今天的小行動</label><textarea class="form-input" id="edit-action" name="action" required rows="3" maxlength="240">${esc(session.action)}</textarea></div><p id="form-error" class="form-error"></p><button class="btn btn-primary full-width" type="submit">保存這個小步驟${icon('check')}</button></form></div>`,'edit-action');
  if (suggestedAction) {
    modal.querySelector('#edit-action').value = suggestedAction;
    modal.querySelector('.modal-description').textContent = '靈感筆記已保存。確認後，這個小步驟會取代今天尚未完成的行動。';
  }
}
function openPractice(id) {
  const creator = CREATORS.find(item => item.id === id);
  if (!creator) return;
  setModal(renderPracticeModal(creator,{wishes:activeWishes(),selectedId:selectedWish()?.id},{esc,icon}),'practice');
}
function savePractice(form, data, intent) {
  const creator = CREATORS.find(item => item.id === form.dataset.creator);
  if (!creator) throw new Error('請從靈感書房重新選擇一個練習。');
  const choice = String(data.get('wishId') || '');
  const target = choice && choice !== 'new' ? findWish(choice) : null;
  if (choice && choice !== 'new' && (!target || target.archived)) throw new Error('這顆心願已更新，請重新選擇，或只保存筆記。');
  if (intent === 'use' && !choice) throw new Error('選一顆心願，或選擇「建立新心願」，就能把練習帶進花園。你也可以先存成靈感筆記。');
  if (intent === 'use' && choice === 'new' && activeWishes().length >= 6) throw new Error('花園的位置已滿，可以先存成筆記，再到手帳珍藏一顆心願。');
  const oldIds = new Set(state.practiceNotes.map(note => note.id));
  let next = addPracticeNote(state,{
    creatorId:creator.id,creatorName:creator.name,practiceTitle:creator.practice.title,
    reflection:data.get('reflection'),action:data.get('action'),wishId:target?.id || null
  });
  const note = next.practiceNotes.find(item => !oldIds.has(item.id));
  if (target && intent === 'use') next = {...next,selectedId:target.id};
  view = intent === 'use' ? 'garden' : 'journal';
  persist(next);
  closeModal();
  if (intent !== 'use') {
    toast(storageWarning ? '筆記已留在這次開啟的花園，請匯出備份保存。' : '靈感筆記已保存，想再看看時，就來心願手帳。');
    document.querySelector('#practice-notes')?.scrollIntoView({behavior:'instant',block:'start'});
    return;
  }
  window.scrollTo({top:0,behavior:'instant'});
  if (choice === 'new') {
    openPlant('custom',{noteId:note.id,action:note.action,reflection:note.reflection});
    toast('筆記已保存。為這份靈感種下一顆心願吧。');
  } else if (sessionOf(target)?.completedAt) {
    toast('筆記已保存。這顆心願今天已澆灌，可以把新靈感留給下一步。');
  } else if (sessionOf(target)) {
    openActionEdit(target.id,note.action);
  } else {
    openRitual(target.id,note.action);
    toast('筆記已保存，你寫下的小步驟會成為今天的行動卡。');
  }
}
function openDetail(id) {
  const wish = findWish(id); if(!wish) return;
  const cat = category(wish.category);
  setModal(`<div class="modal-wrap"><div class="modal-eyebrow">${esc(cat.name)} · YOUR POSSIBILITY</div><h2 id="dialog-title">${esc(wish.title)}</h2><div class="detail-plant">${plantIcon(wish.category,stageOf(wish),cat.color)}</div><p class="detail-meta">${STAGES[stageOf(wish)]} · 已累積 ${wish.growth} 次行動 · ${wish.lights} 點微光</p><div class="detail-vision">${esc(wish.vision || '為這個心願補上一個日常畫面，讓方向更清晰。')}</div><p class="field-hint" style="margin-top:12px">${prettyDate(wish.createdAt)} 種下</p><div class="wish-detail-actions"><button class="btn btn-ghost" data-action="edit-wish" data-id="${wish.id}">${icon('edit')}編輯心願</button><button class="btn btn-ghost" data-action="archive-confirm" data-id="${wish.id}">${icon('archive')}移到珍藏</button></div><button class="btn btn-primary full-width" data-action="close" style="margin-top:15px">回到花園</button></div>`,'detail');
}
function openWishEdit(id) {
  const wish = findWish(id); if(!wish) return;
  editingId=id;
  setModal(`<div class="modal-wrap"><div class="modal-eyebrow">YOUR WISH CAN GROW WITH YOU</div><h2 id="dialog-title">讓心願更像現在的你。</h2><p class="modal-description">方向可以慢慢調整，已累積的成長會保留。</p><form id="edit-wish-form"><div class="form-field"><label for="edit-title">我的心願</label><input class="form-input" id="edit-title" name="title" value="${esc(wish.title)}" maxlength="80" required></div><div class="form-field"><label for="edit-vision">想像它成為日常的畫面<span class="optional">選填</span></label><textarea class="form-input" id="edit-vision" name="vision" rows="4" maxlength="400">${esc(wish.vision)}</textarea></div><p id="form-error" class="form-error"></p><button class="btn btn-primary full-width" type="submit">保存心願${icon('check')}</button></form></div>`,'edit-wish');
}
function openArchiveConfirm(id) {
  const wish = findWish(id); if(!wish) return;
  setModal(`<div class="modal-wrap"><div class="modal-eyebrow">KEEP IT CLOSE, GIVE IT SPACE</div><h2 id="dialog-title">先把這個心願珍藏起來？</h2><p class="modal-description">「${esc(wish.title)}」的心願與行動記錄會保留，也會空出一個種植位置。需要時，可以從手帳重新種回花園。</p><div class="modal-actions"><button class="btn btn-outline" data-action="detail" data-id="${wish.id}">再看看</button><button class="btn btn-primary" data-action="archive" data-id="${wish.id}">${icon('archive')}移到珍藏</button></div></div>`,'archive');
}
function showSuccess(id, previousStage) {
  const wish = findWish(id); const cat=category(wish.category); const stage=stageOf(wish);
  setModal(`<div class="modal-wrap success-wrap"><div class="modal-eyebrow">A LITTLE CLOSER TO YOUR POSSIBILITY</div><div class="detail-plant">${plantIcon(wish.category,stage,cat.color)}</div><div class="success-badge">${icon('water')}+1 次成長${stage>previousStage?' · '+STAGES[stage]:''}</div><h2 id="dialog-title">${stage===4 && previousStage<4?'看，你的心願開花了。':stage>previousStage?'一點用心，長出了新模樣。':'今天的你，又往前了一點。'}</h2><p class="modal-description">${esc(wish.title)}</p><p class="success-note">${esc(randomItem(cat.affirmations))}<br>${wish.growth>=7?'這朵花記得你的付出，接下來仍可繼續澆灌。':'每一次真實的小行動，都會留在花園裡。'}</p><button class="btn btn-primary full-width" data-action="close">看看我的花園${icon('arrow')}</button></div>`,'success');
  chime('success');
}
function exportBackup() {
  try {
    const blob = new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='lumina-garden-'+todayKey()+'.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);
    toast('備份已準備下載。它包含你的心願、行動與靈感筆記。');
  } catch {toast('暫時未能匯出，請稍後再試。');}
}
async function readBackup(file) {
  if(!file) return;
  if(file.size>16*1024*1024) {toast('這個檔案太大了，請選擇 LUMINA 匯出的 JSON 備份。');return;}
  try {
    const next=normalizeState(JSON.parse(await file.text()));pendingImport=next;
    const stats=totalStats(next);
    setModal(`<div class="modal-wrap"><div class="modal-eyebrow">WELCOME YOUR GARDEN BACK</div><h2 id="dialog-title">要載入這座花園嗎？</h2><p class="modal-description">備份裡有 ${next.wishes.length} 顆心願、${stats.completed} 次行動、${next.practiceNotes.length} 則靈感筆記和 ${stats.days} 天的累積。</p><div class="guide-note">載入會取代目前瀏覽器的進度。如果現在也有想保留的記錄，請先匯出目前備份。</div><p id="form-error" class="form-error"></p><div class="modal-actions"><button class="btn btn-outline" data-action="export">先匯出目前備份</button><button class="btn btn-primary" data-action="confirm-import">載入這份備份</button></div></div>`,'import');
  } catch(error) {toast(error instanceof SyntaxError?'這不是可讀取的 JSON 備份，請選擇 LUMINA 匯出的檔案。':error.message);}
}

document.addEventListener('click',event=>{
  const node=event.target.closest('[data-action],[data-plant-id],[data-empty-slot]'); if(!node) return;
  if(node.hasAttribute('data-plant-id')) {persist(selectWish(state,node.dataset.plantId));chime();return;}
  if(node.hasAttribute('data-empty-slot')) {openPlant();return;}
  const action=node.dataset.action,id=node.dataset.id;
  try {
    switch(action) {
      case 'garden': closeModal();view='garden';render();window.scrollTo({top:0,behavior:'instant'});break;
      case 'journal': closeModal();view='journal';render();window.scrollTo({top:0,behavior:'instant'});break;
      case 'learn': closeModal();view='learn';render();window.scrollTo({top:0,behavior:'instant'});break;
      case 'learn-language': if(['all','zh','en'].includes(node.dataset.language)) {learningFilters.language=node.dataset.language;render();document.querySelector(`[data-action="learn-language"][data-language="${learningFilters.language}"]`)?.focus({preventScroll:true});}break;
      case 'learn-need': if(node.dataset.need==='all' || NEEDS.some(need=>need.id===node.dataset.need)) {learningFilters.need=node.dataset.need;render();document.querySelector(`[data-action="learn-need"][data-need="${learningFilters.need}"]`)?.focus({preventScroll:true});}break;
      case 'learn-reset': learningFilters={language:'all',need:'all'};render();break;
      case 'practice': openPractice(id);break;
      case 'guide': openGuide();break;
      case 'sound': persist({...state,preferences:{...state.preferences,sound:!state.preferences.sound}});chime();toast(state.preferences.sound?'輕柔音效已開啟。':'音效已關閉。');break;
      case 'plant': openPlant(node.dataset.category || 'growth');break;
      case 'category': chooseCategory(node.dataset.category);break;
      case 'close': closeModal();break;
      case 'select': persist(selectWish(state,id));chime();if(innerWidth<681) document.querySelector('.ritual-panel')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});break;
      case 'ritual': openRitual(id);break;
      case 'ritual-next': if(ritual && ritual.step<2 && (ritual.step!==1 || ritual.collected.size===6)) {ritual.step++;renderRitual();}break;
      case 'collect': collectLight(node,event);break;
      case 'shuffle': if(ritual) {ritual.action=randomItem(category(findWish(ritual.wishId).category).actions,ritual.action);document.querySelector('#drawn-action').textContent=ritual.action;document.querySelector('#today-action').value=ritual.action;chime();}break;
      case 'complete': openComplete(id);break;
      case 'edit-action': openActionEdit(id);break;
      case 'detail': openDetail(id);break;
      case 'edit-wish': openWishEdit(id);break;
      case 'archive-confirm': openArchiveConfirm(id);break;
      case 'archive': persist(archiveWish(state,id));closeModal();toast('心願已好好珍藏，記錄會留在手帳裡。');break;
      case 'restore': if(activeWishes().length>=6) {toast('花園目前有六顆心願，請先珍藏其中一顆再種回來。');break;}persist({...state,selectedId:id,wishes:state.wishes.map(w=>w.id===id?{...w,archived:false}:w)});view='garden';render();toast('這顆心願回到花園了，之前的成長都還在。');window.scrollTo({top:0,behavior:'instant'});break;
      case 'export': exportBackup();break;
      case 'import': document.querySelector('#import-file').click();break;
      case 'confirm-import': if(pendingImport) {const next=pendingImport;try {window.localStorage.setItem(STORAGE_KEY,JSON.stringify(next));} catch {formError(new Error('目前瀏覽器無法儲存備份，現有進度未被取代。'));break;}state=next;storageWarning=null;closeModal();view='garden';render();toast('花園已載入，歡迎回來。');}break;
    }
  } catch(error) {formError(error);}
});
document.addEventListener('keydown',event=>{
  if((event.key==='Enter'||event.key===' ') && event.target.matches('[data-plant-id],[data-empty-slot]')) {event.preventDefault();event.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}
});
document.addEventListener('submit',event=>{
  if(!['plant-form','ritual-form','complete-form','edit-action-form','edit-wish-form','practice-form'].includes(event.target.id)) return;
  event.preventDefault();const data=new FormData(event.target);
  try {
    switch(event.target.id) {
      case 'plant-form': {
        const practice=plantPractice;
        let next=addWish(state,{category:chosenCategory,title:data.get('title'),vision:data.get('vision')});
        const id=next.selectedId;
        if(practice) next={...next,practiceNotes:next.practiceNotes.map(note=>note.id===practice.noteId?{...note,wishId:id}:note)};
        view='garden';persist(next);closeModal();chime('success');toast('心願已種下。開始今日儀式，為它拾一點光。');document.querySelector('.garden-world')?.classList.add('reveal');
        if(practice) openRitual(id,practice.action);
        break;
      }
      case 'practice-form': savePractice(event.target,data,event.submitter?.value || 'save');break;
      case 'ritual-form': {
        if(!ritual || ritual.collected.size!==6) return;
        persist(prepareSession(state,ritual.wishId,data.get('action')));closeModal();toast('帶回 6 點微光。完成生活裡的小行動，再回來澆灌。');break;
      }
      case 'complete-form': {
        const id=editingId;const before=findWish(id);const previous=stageOf(before);const next=completeSession(state,id,{action:data.get('action'),note:data.get('note')});
        if(next.wishes.find(w=>w.id===id).growth===before.growth){closeModal();toast('今天的行動已記錄，成長進度會好好保留。');break;}
        persist(next);showSuccess(id,previous);break;
      }
      case 'edit-action-form': persist(prepareSession(state,editingId,data.get('action')));closeModal();toast('行動已更新，照你今天的步調就好。');break;
      case 'edit-wish-form': {const id=editingId;persist(updateWish(state,id,{title:data.get('title'),vision:data.get('vision')}));openDetail(id);toast('心願已更新，成長進度保留。');break;}
    }
  } catch(error) {formError(error);}
});
modal.addEventListener('cancel',()=>{modalKind='';ritual=null;editingId=null;pendingImport=null;plantPractice=null;});
modal.addEventListener('click',event=>{if(event.target===modal){const rect=modal.getBoundingClientRect();if(event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom)closeModal();}});
document.querySelector('#import-file').addEventListener('change',event=>{void readBackup(event.target.files[0]);event.target.value='';});
window.addEventListener('focus',()=>{const day=todayKey();if(day!==lastDay){lastDay=day;if(['ritual','complete','edit-action'].includes(modalKind)){closeModal();toast('新的一天開始了，可以重新選擇今天的小行動。');}render();}refreshSavedProgress();});
window.addEventListener('storage',event=>{if(event.key===STORAGE_KEY){storageWarning=null;refreshSavedProgress();}});
render();
