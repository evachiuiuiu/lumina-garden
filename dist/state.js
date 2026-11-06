import { t, toSimplified } from './i18n.js';

const STATE_MESSAGES = {
  "練習記錄": "Practice note",
  "這不是可讀取的花園備份，請選擇 LUMINA 的第 1 版備份檔。": "This backup cannot be read. Please choose a LUMINA version 1 backup file.",
  "原有的花園資料暫時無法讀取，已保留原檔。你可以繼續這次遊玩，新的進度暫時不會覆蓋原檔。": "Your saved garden could not be read. The original is preserved. You can keep playing, but this session will not overwrite it.",
  "瀏覽器暫時無法儲存花園。你可以繼續這次遊玩，離開前請匯出備份。": "This browser cannot save your garden right now. You can keep playing; export a backup before you leave.",
  "原有資料仍需修復，新進度暫時只保留在這次遊玩中。請先匯出備份，避免覆蓋原檔。": "Your original data still needs repair. New progress is kept only for this session. Export a backup to protect it.",
  "目前無法儲存進度。你仍可繼續遊玩，離開前請匯出備份。": "Progress cannot be saved right now. You can keep playing; export a backup before you leave.",
  "找不到這個心願，請先在花園選擇一顆種子。": "This wish could not be found. Choose a seed in your garden first.",
  "請先為這個心願寫下一個名字。": "Give this wish a name first.",
  "請寫下一個今天能做到的小行動。": "Write one small action you can take today.",
  "花園的 6 個位置已種滿，先珍藏一個心願，就能騰出新的位置。": "All six spaces are planted. Archive a wish to make room for a new one.",
  "花園已收藏 60 個心願，請先匯出備份。": "You have saved 60 wishes. Please export a backup first.",
  "先收集光點並選一個小行動，再回來記錄完成。": "Collect your lights and choose a small action before recording it as complete.",
  "找不到這個心願。": "This wish could not be found.",
  "找不到這位創作者的練習，請從靈感書房重新選擇。": "This practice could not be found. Choose it again in the Inspiration Library.",
  "找不到要連結的心願，請重新選擇，或先不連結心願。": "The wish you want to link could not be found. Choose another wish, or save this note without a link.",
  "已保留 2,000 則練習筆記，請先匯出備份。": "You have saved 2,000 practice notes. Please export a backup first."
};
function stateMessage(hant) { return t(hant,STATE_MESSAGES[hant]); }
export function localizeStateMessage(message) {
  for(const [hant,english] of Object.entries(STATE_MESSAGES)) {
    if(message===hant || message===english || message===toSimplified(hant))return t(hant,english);
  }
  return message;
}

/**
 * Browser-local garden state. Every mutation returns a new state and never writes
 * storage by itself. A wish earns six lights once when its daily session is
 * prepared, and one growth step once when that session is completed.
 */
export const STORAGE_KEY = 'lumina.garden.v1';

const CATEGORY_IDS = new Set(['growth', 'love', 'abundance', 'travel', 'wellbeing', 'cat', 'custom']);
const PRACTICE_CREATOR_IDS = new Set(['jolie', 'lee', 'lavendaire', 'roxie', 'gabby']);
const MAX_ACTIVE = 6;
const MAX_WISHES = 60;
const MAX_SESSIONS = 10000;
const MAX_JOURNAL = 30000;
const MAX_PRACTICE_NOTES = 2000;
const SAFE_ID = /^[A-Za-z0-9_-]{1,120}$/;
const corruptStorage = new WeakMap();

const now = () => new Date().toISOString();
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = (value, length) => typeof value === 'string'
  ? value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, length)
  : '';
const category = value => CATEGORY_IDS.has(value) ? value : 'custom';
const integer = (value, max = 1000000) => Number.isFinite(value)
  ? Math.max(0, Math.min(max, Math.floor(value))) : 0;
const validId = value => typeof value === 'string' && SAFE_ID.test(value);
const iso = (value, fallback = null) => {
  if (typeof value !== 'string' || !value.trim()) return fallback;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : fallback;
};

function uid(prefix = 'wish') {
  const random = globalThis.crypto?.randomUUID?.();
  return `${prefix}_${random || `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`}`;
}

export function todayKey() {
  // The garden follows the client calendar (Macau/Hong Kong, UTC+8),
  // independent of the preview server or a travelling device's timezone.
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone:'Asia/Shanghai', year:'numeric', month:'2-digit', day:'2-digit'
  }).formatToParts(new Date()).map(part => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function validDay(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1900 || year > 9999) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function stageOf(wish) {
  const growth = integer(wish?.growth);
  return growth >= 7 ? 4 : growth >= 5 ? 3 : growth >= 3 ? 2 : growth >= 1 ? 1 : 0;
}

export function emptyState() {
  return {
    version: 1,
    createdAt: now(),
    selectedId: null,
    wishes: [],
    journal: [],
    practiceNotes: [],
    preferences: { sound: false }
  };
}

function normalizeSessions(input, fallbackTime) {
  const sessions = new Map();
  for (const raw of (Array.isArray(input) ? input : []).slice(0, MAX_SESSIONS)) {
    if (!object(raw) || !validDay(raw.date)) continue;
    const action = text(raw.action, 240);
    if (!action) continue;
    const session = {
      date: raw.date,
      action,
      note: text(raw.note, 600),
      preparedAt: iso(raw.preparedAt, fallbackTime),
      completedAt: iso(raw.completedAt)
    };
    const previous = sessions.get(session.date);
    // Prefer an already completed session if duplicate dates were imported.
    if (!previous || (!previous.completedAt && session.completedAt)) sessions.set(session.date, session);
  }
  return [...sessions.values()].sort((a, b) => a.date.localeCompare(b.date));
}

function normalizePracticeNotes(input, wishById) {
  const notes = new Map();
  for (const raw of Array.isArray(input) ? input : []) {
    if (!object(raw) || !validId(raw.id) || !PRACTICE_CREATOR_IDS.has(raw.creatorId)) continue;
    const action = text(raw.action, 240);
    const createdAt = iso(raw.createdAt);
    if (!action || !createdAt) continue;
    const note = {
      id: raw.id,
      creatorId: raw.creatorId,
      creatorName: text(raw.creatorName, 100),
      practiceTitle: text(raw.practiceTitle, 100) || stateMessage("練習記錄"),
      reflection: text(raw.reflection, 1000),
      action,
      // Keep the note even if its original wish was omitted from an import.
      wishId: validId(raw.wishId) && wishById.has(raw.wishId) ? raw.wishId : null,
      createdAt
    };
    const previous = notes.get(note.id);
    if (!previous || previous.createdAt < note.createdAt) notes.set(note.id, note);
  }
  return [...notes.values()]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, MAX_PRACTICE_NOTES);
}

/** Validate imported data and discard unknown fields. Text remains plain text;
 * consumers must render it with textContent or escape it before HTML insertion. */
export function normalizeState(input) {
  if (!object(input) || input.version !== 1 || !Array.isArray(input.wishes)) {
    throw new Error(stateMessage("這不是可讀取的花園備份，請選擇 LUMINA 的第 1 版備份檔。"));
  }
  const createdAt = iso(input.createdAt, now());
  const wishes = [];
  const seenIds = new Set();
  let activeCount = 0;
  for (const raw of input.wishes.slice(0, MAX_WISHES)) {
    if (!object(raw)) continue;
    const title = text(raw.title, 80);
    if (!title) continue;
    let id = validId(raw.id) ? raw.id : uid();
    while (seenIds.has(id)) id = uid();
    seenIds.add(id);
    const wishTime = iso(raw.createdAt, createdAt);
    const archived = raw.archived === true || activeCount >= MAX_ACTIVE;
    if (!archived) activeCount += 1;
    wishes.push({
      id,
      category: category(raw.category),
      title,
      vision: text(raw.vision, 400),
      createdAt: wishTime,
      growth: integer(raw.growth, MAX_SESSIONS),
      lights: integer(raw.lights, MAX_SESSIONS * 6),
      archived,
      sessions: normalizeSessions(raw.sessions, wishTime)
    });
  }
  const wishById = new Map(wishes.map(wish => [wish.id, wish]));
  const journal = [];
  const seenJournal = new Set();
  for (const raw of (Array.isArray(input.journal) ? input.journal : []).slice(0, MAX_JOURNAL)) {
    if (!object(raw) || !validId(raw.wishId) || !wishById.has(raw.wishId) || !validDay(raw.date)) continue;
    const action = text(raw.action, 240);
    const completedAt = iso(raw.completedAt);
    const key = `${raw.wishId}/${raw.date}`;
    if (!action || !completedAt || seenJournal.has(key)) continue;
    seenJournal.add(key);
    const wish = wishById.get(raw.wishId);
    journal.push({
      id: validId(raw.id) ? raw.id : uid('entry'),
      wishId: wish.id,
      wishTitle: text(raw.wishTitle, 80) || wish.title,
      category: category(raw.category),
      action,
      note: text(raw.note, 600),
      date: raw.date,
      completedAt
    });
  }
  journal.sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  const selected = wishes.find(wish => !wish.archived && wish.id === input.selectedId);
  return {
    version: 1,
    createdAt,
    selectedId: selected?.id || wishes.find(wish => !wish.archived)?.id || null,
    wishes,
    journal,
    practiceNotes: normalizePracticeNotes(input.practiceNotes, wishById),
    preferences: { sound: input.preferences?.sound === true }
  };
}

function storageTarget(storage) {
  // Reading localStorage itself may throw in privacy modes, so resolve it inside
  // callers' try blocks rather than in a default-parameter expression.
  return storage === undefined ? globalThis.localStorage : storage;
}

export function loadState(storage) {
  let target;
  let raw;
  try {
    target = storageTarget(storage);
    if (!target || typeof target.getItem !== 'function') throw new Error('unavailable');
    raw = target.getItem(STORAGE_KEY);
    if (raw === null) return { state: emptyState(), warning: null };
    const state = normalizeState(JSON.parse(raw));
    corruptStorage.delete(target);
    return { state, warning: null };
  } catch (error) {
    const corrupted = raw !== undefined && raw !== null;
    if (corrupted && target && object(target)) corruptStorage.set(target, raw);
    return {
      state: emptyState(),
      warning: corrupted
        ? stateMessage("原有的花園資料暫時無法讀取，已保留原檔。你可以繼續這次遊玩，新的進度暫時不會覆蓋原檔。")
        : stateMessage("瀏覽器暫時無法儲存花園。你可以繼續這次遊玩，離開前請匯出備份。")
    };
  }
}

export function saveState(state, storage) {
  try {
    const target = storageTarget(storage);
    if (!target || typeof target.setItem !== 'function') throw new Error('unavailable');
    if (corruptStorage.has(target)) {
      const original = corruptStorage.get(target);
      if (target.getItem(STORAGE_KEY) === original) {
        return { ok: false, error: stateMessage("原有資料仍需修復，新進度暫時只保留在這次遊玩中。請先匯出備份，避免覆蓋原檔。") };
      }
      corruptStorage.delete(target);
    }
    target.setItem(STORAGE_KEY, JSON.stringify(normalizeState(state)));
    return { ok: true, error: null };
  } catch (error) {
    return { ok: false, error: stateMessage("目前無法儲存進度。你仍可繼續遊玩，離開前請匯出備份。") };
  }
}

function activeWish(state, id) {
  const wish = state.wishes.find(item => item.id === id && !item.archived);
  if (!wish) throw new Error(stateMessage("找不到這個心願，請先在花園選擇一顆種子。"));
  return wish;
}

function replaceWish(state, changed) {
  return { ...state, wishes: state.wishes.map(wish => wish.id === changed.id ? changed : wish) };
}

function requireTitle(value) {
  const title = text(value, 80);
  if (!title) throw new Error(stateMessage("請先為這個心願寫下一個名字。"));
  return title;
}

function requireAction(value) {
  const action = text(value, 240);
  if (!action) throw new Error(stateMessage("請寫下一個今天能做到的小行動。"));
  return action;
}

export function addWish(state, { category: requestedCategory, title, vision } = {}) {
  const cleanTitle = requireTitle(title);
  if (state.wishes.filter(wish => !wish.archived).length >= MAX_ACTIVE) {
    throw new Error(stateMessage("花園的 6 個位置已種滿，先珍藏一個心願，就能騰出新的位置。"));
  }
  if (state.wishes.length >= MAX_WISHES) throw new Error(stateMessage("花園已收藏 60 個心願，請先匯出備份。"));
  const wish = {
    id: uid(),
    category: category(requestedCategory),
    title: cleanTitle,
    vision: text(vision, 400),
    createdAt: now(),
    growth: 0,
    lights: 0,
    archived: false,
    sessions: []
  };
  return { ...state, selectedId: wish.id, wishes: [...state.wishes, wish] };
}

export function prepareSession(state, id, action) {
  const wish = activeWish(state, id);
  const date = todayKey();
  const previous = wish.sessions.find(session => session.date === date);
  if (previous?.completedAt) return state;
  const cleanAction = requireAction(action);
  const session = previous
    ? { ...previous, action: cleanAction }
    : { date, action: cleanAction, note: '', preparedAt: now(), completedAt: null };
  const changed = {
    ...wish,
    lights: wish.lights + (previous ? 0 : 6),
    sessions: previous
      ? wish.sessions.map(item => item.date === date ? session : item)
      : [...wish.sessions, session]
  };
  return replaceWish(state, changed);
}

export function completeSession(state, id, { action, note } = {}) {
  const wish = activeWish(state, id);
  const date = todayKey();
  const previous = wish.sessions.find(session => session.date === date);
  if (!previous) throw new Error(stateMessage("先收集光點並選一個小行動，再回來記錄完成。"));
  if (previous.completedAt) return state;
  const cleanAction = requireAction(action === undefined ? previous.action : action);
  const completedAt = now();
  const session = {
    ...previous,
    action: cleanAction,
    note: text(note === undefined ? previous.note : note, 600),
    completedAt
  };
  const next = replaceWish(state, {
    ...wish,
    growth: wish.growth + 1,
    sessions: wish.sessions.map(item => item.date === date ? session : item)
  });
  const entry = {
    id: uid('entry'),
    wishId: wish.id,
    wishTitle: wish.title,
    category: wish.category,
    action: session.action,
    note: session.note,
    date,
    completedAt
  };
  return {
    ...next,
    journal: [entry, ...state.journal.filter(item => !(item.wishId === id && item.date === date))]
  };
}

export function archiveWish(state, id) {
  const wish = state.wishes.find(item => item.id === id);
  if (!wish) throw new Error(stateMessage("找不到這個心願。"));
  if (wish.archived) return state;
  const next = replaceWish(state, { ...wish, archived: true });
  return {
    ...next,
    selectedId: state.selectedId === id
      ? next.wishes.find(item => !item.archived)?.id || null
      : state.selectedId
  };
}

export function updateWish(state, id, { title, vision } = {}) {
  const wish = activeWish(state, id);
  return replaceWish(state, {
    ...wish,
    title: title === undefined ? wish.title : requireTitle(title),
    vision: vision === undefined ? wish.vision : text(vision, 400)
  });
}

export function selectWish(state, id) {
  activeWish(state, id);
  return state.selectedId === id ? state : { ...state, selectedId: id };
}

/** Save a learning-hub reflection separately from completed garden actions.
 * Writing a practice note never awards lights, growth, or completed-day credit. */
export function addPracticeNote(state, {
  creatorId, creatorName, practiceTitle, reflection, action, wishId = null
} = {}) {
  if (!PRACTICE_CREATOR_IDS.has(creatorId)) {
    throw new Error(stateMessage("找不到這位創作者的練習，請從靈感書房重新選擇。"));
  }
  const cleanAction = requireAction(action);
  const linkedWishId = wishId === undefined || wishId === null || wishId === '' ? null : wishId;
  if (linkedWishId !== null && (!validId(linkedWishId) || !state.wishes.some(wish => wish.id === linkedWishId))) {
    throw new Error(stateMessage("找不到要連結的心願，請重新選擇，或先不連結心願。"));
  }
  const existing = normalizePracticeNotes(
    state.practiceNotes,
    new Map(state.wishes.map(wish => [wish.id, wish]))
  );
  if (existing.length >= MAX_PRACTICE_NOTES) {
    throw new Error(stateMessage("已保留 2,000 則練習筆記，請先匯出備份。"));
  }
  const note = {
    id: uid('practice'),
    creatorId,
    creatorName: text(creatorName, 100),
    practiceTitle: text(practiceTitle, 100) || stateMessage("練習記錄"),
    reflection: text(reflection, 1000),
    action: cleanAction,
    wishId: linkedWishId,
    createdAt: now()
  };
  return {
    ...state,
    practiceNotes: [note, ...existing].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  };
}

export function totalStats(state) {
  return {
    active: state.wishes.filter(wish => !wish.archived).length,
    growth: state.wishes.reduce((sum, wish) => sum + integer(wish.growth), 0),
    lights: state.wishes.reduce((sum, wish) => sum + integer(wish.lights), 0),
    completed: state.journal.length,
    days: new Set(state.journal.map(entry => entry.date)).size
  };
}
