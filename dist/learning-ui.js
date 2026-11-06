import { t, onLocaleChange } from './i18n.js';
import { ZH_CREATORS } from './learning-zh.js';
import { EN_CREATORS } from './learning-en.js';

// The data modules register their locale listeners before this module. These
// live bindings are therefore refreshed before the application's render pass.
export let CREATORS;
export let NEEDS;
let LANGUAGES;
function refreshLearningCopy() {
  CREATORS = [...ZH_CREATORS, ...EN_CREATORS];
  NEEDS = [
    { id: 'clarity', label: t('釐清願望', 'Clarify a wish') },
    { id: 'action', label: t('開始行動', 'Take a step') },
    { id: 'selftalk', label: t('對自己溫柔', 'Be kind to yourself') },
    { id: 'flexibility', label: t('放鬆執著', 'Make room for possibilities') },
  ];
  // This filter describes the language of the linked sources, not the UI.
  LANGUAGES = [
    { id: 'all', label: t('全部', 'All') },
    { id: 'zh', label: t('中文', 'Chinese') },
    { id: 'en', label: t('英文', 'English') },
  ];
}
refreshLearningCopy();
onLocaleChange(refreshLearningCopy);

const NEED_ICONS = { all: 'spark', clarity: 'compass', action: 'seed', selftalk: 'heart', flexibility: 'leaf' };

function sourceUrl(value) {
  try {
    const url = new URL(String(value));
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

function renderCreator(creator, { esc, icon }) {
  const text = value => esc(String(value ?? ''));
  const tr = (hant, english, hans) => text(t(hant, english, hans));
  const practice = creator.practice;
  return `<article class="learning-card" aria-labelledby="creator-${text(creator.id)}">
    <div class="learning-card-top">
      <div class="learning-monogram" aria-hidden="true">${text(creator.initials)}</div>
      <div class="learning-identity">
        <p class="learning-card-meta"><span>${text(creator.language)}</span><span>${text(creator.kind)}</span></p>
        <h2 id="creator-${text(creator.id)}">${text(creator.name)}</h2>
      </div>
    </div>
    <p class="learning-card-description">${text(creator.description)}</p>
    <ul class="learning-tags" aria-label="${tr('分享主題', 'Topics')}">${creator.tags.map(tag => `<li>${text(tag)}</li>`).join('')}</ul>
    <div class="learning-practice-preview">
      <div class="learning-practice-meta"><span>${icon('edit')}${tr('LUMINA 原創練習', 'A LUMINA practice')}</span><span>${text(practice.minutes)} ${tr('分鐘', 'min')}</span></div>
      <h3>${text(practice.title)}</h3>
      <p>${text(practice.summary)}</p>
      <button type="button" class="btn btn-primary learning-start" data-action="practice" data-id="${text(creator.id)}" aria-label="${text(t('開始練習：', 'Begin practice: ') + practice.title)}">${tr('開始練習', 'Begin practice')}${icon('arrow')}</button>
    </div>
    <details class="learning-sources">
      <summary><span>${tr('來源與方法', 'Sources and approach')}</span><span class="learning-source-toggle">${text(creator.sources.length)} ${tr('個來源', creator.sources.length === 1 ? 'source' : 'sources')}${icon('plus')}</span></summary>
      <div class="learning-source-content">
        <p class="learning-approach">${text(creator.approachNote)}</p>
        <ul class="learning-source-list">${creator.sources.map(source => {
          const href = sourceUrl(source.url);
          const label = href
            ? `<a href="${text(href)}" target="_blank" rel="noopener noreferrer" aria-label="${text(source.label + t('（開啟新分頁）', ' (opens in a new tab)'))}"><span>${text(source.label)}</span>${icon('arrow')}</a>`
            : `<span class="learning-source-label">${text(source.label)}</span>`;
          return `<li><span class="learning-source-access">${text(source.access)}</span>${label}<p>${text(source.note)}</p></li>`;
        }).join('')}</ul>
        <p class="learning-verified">${tr('資料查核', 'Sources checked')} <time datetime="${text(creator.verifiedAt)}">${text(creator.verifiedAt)}</time> · ${tr('連結於新分頁開啟', 'Links open in a new tab')}</p>
      </div>
    </details>
  </article>`;
}

export function renderLearningView({ language = 'all', need = 'all' } = {}, { esc, icon }) {
  const text = value => esc(String(value ?? ''));
  const tr = (hant, english, hans) => text(t(hant, english, hans));
  const chosenLanguage = LANGUAGES.some(item => item.id === language) ? language : 'all';
  const chosenNeed = NEEDS.some(item => item.id === need) ? need : 'all';
  const creators = CREATORS.filter(creator => (chosenLanguage === 'all' || creator.languageCode === chosenLanguage) && (chosenNeed === 'all' || creator.needs.includes(chosenNeed)));
  const needs = [{ id: 'all', label: t('全部靈感', 'All inspiration') }, ...NEEDS];

  return `<main id="main" class="learning-view">
    <section class="learning-hero" aria-labelledby="learning-title">
      <div class="learning-hero-copy">
        <p class="eyebrow">${tr('靈感書房', 'THE INSPIRATION LIBRARY')}</p>
        <h1 id="learning-title">${tr('借一點靈感，', 'A little inspiration,')}<br><em>${tr('長出自己的答案', 'a path of your own.')}</em></h1>
        <p class="learning-intro">${tr('從中文與英文創作者的公開分享裏，選一個適合此刻的方向。讀一點，寫一點，帶走今天做得到的一小步。', 'Explore ideas shared by Chinese- and English-language creators. Read a little, write a little, and take one small step into your day.')}</p>
      </div>
      <aside class="learning-hero-note" aria-label="${tr('給此刻的你', 'For you, right now')}">
        <div class="learning-emblem" aria-hidden="true">${icon('leaf')}</div>
        <div><p class="learning-note-eyebrow">${tr('留一點成長空間', 'ROOM TO GROW')}</p><p class="learning-note-title">${tr('別人的方法，', 'Someone else’s ideas,')}<br>${tr('可以成為你的靈感。', 'your own inspiration.')}</p><p class="learning-note-copy">${tr('每次 3–5 分鐘，找到適合自己的節奏。', 'Take 3–5 minutes and find a pace that feels right.')}</p></div>
      </aside>
    </section>
    <section class="learning-browser" aria-label="${tr('探索創作者與練習', 'Explore creators and practices')}">
      <div class="learning-filter-panel">
        <div class="learning-filter-heading"><h2>${tr('此刻，你需要哪一點支持？', 'What would help you today?')}</h2><button type="button" class="text-button learning-reset" data-action="learn-reset">${tr('重設篩選', 'Reset filters')}</button></div>
        <div class="learning-needs" role="group" aria-label="${tr('按照當下需要篩選', 'Filter by what you need')}">${needs.map(item => `<button type="button" class="learning-need${item.id === chosenNeed ? ' is-active' : ''}" data-action="learn-need" data-need="${text(item.id)}" aria-pressed="${item.id === chosenNeed}" aria-controls="learning-results">${icon(NEED_ICONS[item.id])}<span>${text(item.label)}</span></button>`).join('')}</div>
        <div class="learning-filter-footer">
          <div class="learning-language-filter"><span class="learning-filter-caption">${tr('來源語言', 'Source language')}</span><div class="learning-languages" role="group" aria-label="${tr('按照來源語言篩選', 'Filter by source language')}">${LANGUAGES.map(item => `<button type="button" class="learning-language${item.id === chosenLanguage ? ' is-active' : ''}" data-action="learn-language" data-language="${text(item.id)}" aria-pressed="${item.id === chosenLanguage}" aria-controls="learning-results">${text(item.label)}</button>`).join('')}</div></div>
          <p class="learning-result-count" role="status" aria-live="polite">${t(`找到 <strong>${text(creators.length)}</strong> 位創作者`, `<strong>${text(creators.length)}</strong> ${creators.length === 1 ? 'creator' : 'creators'}`)}</p>
        </div>
      </div>
      <div id="learning-results" class="learning-grid">${creators.length ? creators.map(creator => renderCreator(creator, { esc, icon })).join('') : `<div class="learning-empty">${icon('compass')}<h2>${tr('換個方向，也許就有靈感。', 'Try another direction.')}</h2><p>${tr('暫時沒有符合這個組合的創作者。可以看看其他語言，或重新選擇此刻的需要。', 'No creators match this combination yet. Try another source language or choose a different kind of support.')}</p><button type="button" class="btn btn-light" data-action="learn-reset">${tr('看看全部靈感', 'Explore all inspiration')}${icon('arrow')}</button></div>`}</div>
    </section>
    <aside class="learning-context" aria-label="${tr('關於這些練習', 'About these practices')}">
      <span class="learning-context-icon" aria-hidden="true">${icon('book')}</span>
      <div><h2>${tr('把方法留作靈感，把選擇留給自己。', 'Take the inspiration. Keep your own choices.')}</h2><p>${tr('這裏的練習由 LUMINA 原創，參考創作者的公開主題，並非作者課程或官方合作，也不代表作者背書。練習用來整理方向與行動，不保證特定結果。', 'These original LUMINA practices draw on themes the creators have shared publicly. They are not the creators’ courses, official collaborations or endorsements. They offer space to reflect and plan actions, without promising a particular outcome.')}</p><p>${tr('來源已標示閱讀方式；部分免費資源需要電郵領取，書籍及其他課程可能收費。', 'Each source shows how to access it. Some free resources require email signup; books and other courses may be paid.')}</p></div>
    </aside>
  </main>`;
}

export function renderPracticeModal(creator, { wishes = [], selectedId = '' } = {}, { esc, icon }) {
  if (!creator?.practice) return '';
  const text = value => esc(String(value ?? ''));
  const tr = (hant, english, hans) => text(t(hant, english, hans));
  const practice = creator.practice;
  const active = (Array.isArray(wishes) ? wishes : []).filter(wish => wish && !wish.archived);
  const selected = active.some(wish => wish.id === selectedId) ? selectedId : '';
  const canCreate = active.length < 6;
  const firstSource = sourceUrl(creator.sources?.[0]?.url);
  const credit = t(`靈感取自 ${creator.name} 的公開主題`, `Inspired by themes shared publicly by ${creator.name}`);

  return `<div class="modal-wrap learning-practice-modal">
    <p class="modal-eyebrow">${tr('LUMINA 原創練習', 'A LUMINA practice')} · ${text(practice.minutes)} ${tr('分鐘', 'min')}</p>
    <h2 id="dialog-title">${text(practice.title)}</h2>
    <p class="modal-description">${text(practice.summary)}</p>
    <p class="practice-credit">${icon('book')}<span>${text(credit)}${firstSource ? ` <a href="${text(firstSource)}" target="_blank" rel="noopener noreferrer" aria-label="${tr(`查看 ${creator.name} 的來源（開啟新分頁）`, `View ${creator.name}’s source (opens in a new tab)`)}">${tr('查看來源', 'View source')}${icon('arrow')}</a>` : ''}</span></p>
    <ol class="practice-steps" role="list">${practice.steps.map((step, index) => `<li><span class="practice-step-number" aria-hidden="true">${text(String(index + 1).padStart(2, '0'))}</span><div><h3>${text(step.title)}</h3><p>${text(step.body)}</p></div></li>`).join('')}</ol>
    <p class="practice-closing">${text(practice.closing)}</p>
    <form id="practice-form" data-creator="${text(creator.id)}">
      <div class="form-field">
        <label for="practice-reflection"><span>${tr('留一段自己的答案', 'A few words of your own')}</span><span class="optional">${tr('選填 · 最多 1,000 字', 'Optional · up to 1,000 characters')}</span></label>
        <p class="practice-question" id="practice-reflection-prompt">${text(practice.reflectionPrompt)}</p>
        <textarea class="form-input" id="practice-reflection" name="reflection" rows="4" maxlength="1000" placeholder="${text(practice.reflectionPlaceholder)}" aria-describedby="practice-reflection-prompt"></textarea>
      </div>
      <div class="form-field">
        <label for="practice-action"><span>${tr('我想試的一小步', 'One small step I want to try')}</span><span class="optional">${tr('必填 · 最多 240 字', 'Required · up to 240 characters')}</span></label>
        <textarea class="form-input" id="practice-action" name="action" rows="3" maxlength="240" required placeholder="${text(practice.actionExample)}" aria-describedby="practice-action-hint"></textarea>
        <p class="field-hint" id="practice-action-hint">${tr('寫下由你能決定、今天做得到的事。可以很小，也可以再調整。', 'Choose something within your control that you can do today. It can be small, and you can adjust it later.')}</p>
      </div>
      <div class="form-field">
        <label for="practice-wish">${tr('想把這一步放在哪裏？', 'Where would you like this step to go?')}</label>
        <select class="form-input practice-wish-select" id="practice-wish" name="wishId" aria-describedby="practice-wish-hint">
          <option value=""${selected === '' ? ' selected' : ''}>${tr('只存靈感筆記', 'Save a note only')}</option>
          ${active.map(wish => `<option value="${text(wish.id)}"${wish.id === selected ? ' selected' : ''}>${text(wish.title)}</option>`).join('')}
          ${canCreate ? `<option value="new">${tr('建立新心願', 'Create a new wish')}</option>` : ''}
        </select>
        <p class="field-hint" id="practice-wish-hint">${tr('選擇心願可把這一步帶進花園；若今天已記錄完成，這次想法會留作之後參考。', 'Choose a wish to bring this step into your garden. If you have already recorded an action today, the idea will stay in your notes for another time.')}${canCreate ? '' : ` ${tr('花園已有六顆心願，可以選現有心願或只存筆記。', 'Your six spaces are full. Choose an existing wish or save a note only.')}`}</p>
      </div>
      <div class="practice-growth-note">${icon('info')}<p>${tr('寫下或存好想法不會增加成長。在生活裏完成小行動，再回到花園記錄，心願才會長大。', 'Writing or saving an idea does not add growth. Take the small action in your day, then return to record it and help your wish grow.')}</p></div>
      <p class="form-error" id="form-error" role="alert"></p>
      <div class="modal-actions practice-actions"><button class="btn btn-outline" type="submit" name="intent" value="save">${tr('存成靈感筆記', 'Save as a note')}</button><button class="btn btn-primary" type="submit" name="intent" value="use">${tr('存好並帶進花園', 'Save and use')}${icon('arrow')}</button></div>
    </form>
  </div>`;
}

export function renderPracticeNotes(notes, { esc, icon, prettyDate }) {
  const text = value => esc(String(value ?? ''));
  const tr = (hant, english, hans) => text(t(hant, english, hans));
  const entries = (Array.isArray(notes) ? notes : []).filter(note => note && typeof note === 'object');
  return `<section class="practice-notes" id="practice-notes" aria-labelledby="practice-notes-title">
    <div class="practice-notes-heading"><div><p class="eyebrow">${tr('讓靈感陪你前行', 'IDEAS TO GROW WITH')}</p><h2 id="practice-notes-title">${tr('靈感筆記', 'Inspiration notes')} <span class="practice-notes-count">${text(entries.length)}</span></h2><p>${tr('這裏保留練習時的想法與小步驟。', 'A place for your reflections and the steps you want to try.')}</p></div><span class="practice-notes-mark" aria-hidden="true">${icon('book')}</span></div>
    ${entries.length ? `<div class="practice-notes-grid">${entries.map(note => {
      const creator = CREATORS.find(item => item.id === note.creatorId);
      const date = String(note.createdAt ?? '');
      const dateLabel = prettyDate(date) || t('未標示日期', 'Date not recorded');
      // Standard creator/practice labels follow the UI language. Authored
      // reflections and actions remain exactly as the person saved them.
      const creatorName = creator?.name || note.creatorName || t('我的靈感', 'My inspiration');
      const practiceTitle = creator?.practice.title || note.practiceTitle || t('給自己的小練習', 'A little practice for myself');
      return `<article class="practice-note">
        <div class="practice-note-meta"><span>${text(creatorName)}</span><time datetime="${text(date)}">${text(dateLabel)}</time></div>
        <h3>${text(practiceTitle)}</h3>
        ${note.reflection ? `<p class="practice-note-reflection">${text(note.reflection)}</p>` : ''}
        <div class="practice-note-action"><span>${tr('練習時寫下的一步', 'The step you chose')}</span><p>${text(note.action || t('先讓這份靈感留在這裏，準備好了再決定下一步。', 'Keep this idea here for now. Choose your next step when you are ready.'))}</p></div>
        <div class="practice-note-status">${icon('seed')}${tr('靈感記錄', 'Reflection saved')}${note.wishId ? `<span>${tr('已連結心願', 'Linked to a wish')}</span>` : ''}</div>
      </article>`;
    }).join('')}</div>` : `<div class="practice-notes-empty">${icon('edit')}<p>${tr('還沒有靈感筆記。到靈感書房選一個練習，把對自己有用的發現留在這裏。', 'No inspiration notes yet. Choose a practice in the library and keep the discoveries that matter to you.')}</p></div>`}
  </section>`;
}
