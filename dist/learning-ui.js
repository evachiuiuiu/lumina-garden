import { ZH_CREATORS } from './learning-zh.js';
import { EN_CREATORS } from './learning-en.js';

export const CREATORS = [...ZH_CREATORS, ...EN_CREATORS];

export const NEEDS = [
  { id: 'clarity', label: '釐清願望' },
  { id: 'action', label: '開始行動' },
  { id: 'selftalk', label: '對自己溫柔' },
  { id: 'flexibility', label: '放鬆執著' },
];

const NEED_ICONS = { all: 'spark', clarity: 'compass', action: 'seed', selftalk: 'heart', flexibility: 'leaf' };
const LANGUAGES = [{ id: 'all', label: '全部' }, { id: 'zh', label: '中文' }, { id: 'en', label: '英文' }];

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
    <ul class="learning-tags" aria-label="分享主題">${creator.tags.map(tag => `<li>${text(tag)}</li>`).join('')}</ul>
    <div class="learning-practice-preview">
      <div class="learning-practice-meta"><span>${icon('edit')}LUMINA 原創練習</span><span>${text(practice.minutes)} 分鐘</span></div>
      <h3>${text(practice.title)}</h3>
      <p>${text(practice.summary)}</p>
      <button type="button" class="btn btn-primary learning-start" data-action="practice" data-id="${text(creator.id)}" aria-label="開始練習：${text(practice.title)}">開始練習${icon('arrow')}</button>
    </div>
    <details class="learning-sources">
      <summary><span>來源與方法</span><span class="learning-source-toggle">${text(creator.sources.length)} 個來源${icon('plus')}</span></summary>
      <div class="learning-source-content">
        <p class="learning-approach">${text(creator.approachNote)}</p>
        <ul class="learning-source-list">${creator.sources.map(source => {
          const href = sourceUrl(source.url);
          const label = href
            ? `<a href="${text(href)}" target="_blank" rel="noopener noreferrer" aria-label="${text(source.label)}（開啟新分頁）"><span>${text(source.label)}</span>${icon('arrow')}</a>`
            : `<span class="learning-source-label">${text(source.label)}</span>`;
          return `<li><span class="learning-source-access">${text(source.access)}</span>${label}<p>${text(source.note)}</p></li>`;
        }).join('')}</ul>
        <p class="learning-verified">資料查核 <time datetime="${text(creator.verifiedAt)}">${text(creator.verifiedAt)}</time> · 連結於新分頁開啟</p>
      </div>
    </details>
  </article>`;
}

export function renderLearningView({ language = 'all', need = 'all' } = {}, { esc, icon }) {
  const text = value => esc(String(value ?? ''));
  const chosenLanguage = LANGUAGES.some(item => item.id === language) ? language : 'all';
  const chosenNeed = NEEDS.some(item => item.id === need) ? need : 'all';
  const creators = CREATORS.filter(creator => (chosenLanguage === 'all' || creator.languageCode === chosenLanguage) && (chosenNeed === 'all' || creator.needs.includes(chosenNeed)));
  const needs = [{ id: 'all', label: '全部靈感' }, ...NEEDS];

  return `<main id="main" class="learning-view">
    <section class="learning-hero" aria-labelledby="learning-title">
      <div class="learning-hero-copy">
        <p class="eyebrow">THE INSPIRATION LIBRARY</p>
        <h1 id="learning-title">借一點靈感，<br><em>長出自己的答案</em></h1>
        <p class="learning-intro">從中文與英文創作者的公開分享裏，選一個適合此刻的方向。讀一點，寫一點，帶走今天做得到的一小步。</p>
      </div>
      <aside class="learning-hero-note" aria-label="給此刻的你">
        <div class="learning-emblem" aria-hidden="true">${icon('leaf')}</div>
        <div><p class="learning-note-eyebrow">ROOM TO GROW</p><p class="learning-note-title">別人的方法，<br>可以成為你的靈感。</p><p class="learning-note-copy">每次 3–5 分鐘，找到適合自己的節奏。</p></div>
      </aside>
    </section>
    <section class="learning-browser" aria-label="探索創作者與練習">
      <div class="learning-filter-panel">
        <div class="learning-filter-heading"><h2>此刻，你需要哪一點支持？</h2><button type="button" class="text-button learning-reset" data-action="learn-reset">重設篩選</button></div>
        <div class="learning-needs" role="group" aria-label="按照當下需要篩選">${needs.map(item => `<button type="button" class="learning-need${item.id === chosenNeed ? ' is-active' : ''}" data-action="learn-need" data-need="${text(item.id)}" aria-pressed="${item.id === chosenNeed}" aria-controls="learning-results">${icon(NEED_ICONS[item.id])}<span>${text(item.label)}</span></button>`).join('')}</div>
        <div class="learning-filter-footer">
          <div class="learning-language-filter"><span class="learning-filter-caption">來源語言</span><div class="learning-languages" role="group" aria-label="按照來源語言篩選">${LANGUAGES.map(item => `<button type="button" class="learning-language${item.id === chosenLanguage ? ' is-active' : ''}" data-action="learn-language" data-language="${text(item.id)}" aria-pressed="${item.id === chosenLanguage}" aria-controls="learning-results">${text(item.label)}</button>`).join('')}</div></div>
          <p class="learning-result-count" role="status" aria-live="polite">找到 <strong>${text(creators.length)}</strong> 位創作者</p>
        </div>
      </div>
      <div id="learning-results" class="learning-grid">${creators.length ? creators.map(creator => renderCreator(creator, { esc, icon })).join('') : `<div class="learning-empty">${icon('compass')}<h2>換個方向，也許就有靈感。</h2><p>暫時沒有符合這個組合的創作者。可以看看其他語言，或重新選擇此刻的需要。</p><button type="button" class="btn btn-light" data-action="learn-reset">看看全部靈感${icon('arrow')}</button></div>`}</div>
    </section>
    <aside class="learning-context" aria-label="關於這些練習">
      <span class="learning-context-icon" aria-hidden="true">${icon('book')}</span>
      <div><h2>把方法留作靈感，把選擇留給自己。</h2><p>這裏的練習由 LUMINA 原創，參考創作者的公開主題，並非作者課程或官方合作，也不代表作者背書。練習用來整理方向與行動，不保證特定結果。</p><p>來源已標示閱讀方式；部分免費資源需要電郵領取，書籍及其他課程可能收費。</p></div>
    </aside>
  </main>`;
}

export function renderPracticeModal(creator, { wishes = [], selectedId = '' } = {}, { esc, icon }) {
  if (!creator?.practice) return '';
  const text = value => esc(String(value ?? ''));
  const practice = creator.practice;
  const active = (Array.isArray(wishes) ? wishes : []).filter(wish => wish && !wish.archived);
  const selected = active.some(wish => wish.id === selectedId) ? selectedId : '';
  const canCreate = active.length < 6;
  const firstSource = sourceUrl(creator.sources?.[0]?.url);

  return `<div class="modal-wrap learning-practice-modal">
    <p class="modal-eyebrow">LUMINA 原創練習 · ${text(practice.minutes)} 分鐘</p>
    <h2 id="dialog-title">${text(practice.title)}</h2>
    <p class="modal-description">${text(practice.summary)}</p>
    <p class="practice-credit">${icon('book')}<span>靈感取自 ${text(creator.name)} 的公開主題${firstSource ? ` <a href="${text(firstSource)}" target="_blank" rel="noopener noreferrer" aria-label="查看 ${text(creator.name)} 的來源（開啟新分頁）">查看來源${icon('arrow')}</a>` : ''}</span></p>
    <ol class="practice-steps" role="list">${practice.steps.map((step, index) => `<li><span class="practice-step-number" aria-hidden="true">${text(String(index + 1).padStart(2, '0'))}</span><div><h3>${text(step.title)}</h3><p>${text(step.body)}</p></div></li>`).join('')}</ol>
    <p class="practice-closing">${text(practice.closing)}</p>
    <form id="practice-form" data-creator="${text(creator.id)}">
      <div class="form-field">
        <label for="practice-reflection"><span>留一段自己的答案</span><span class="optional">選填 · 最多 1,000 字</span></label>
        <p class="practice-question" id="practice-reflection-prompt">${text(practice.reflectionPrompt)}</p>
        <textarea class="form-input" id="practice-reflection" name="reflection" rows="4" maxlength="1000" placeholder="${text(practice.reflectionPlaceholder)}" aria-describedby="practice-reflection-prompt"></textarea>
      </div>
      <div class="form-field">
        <label for="practice-action"><span>我想試的一小步</span><span class="optional">必填 · 最多 240 字</span></label>
        <textarea class="form-input" id="practice-action" name="action" rows="3" maxlength="240" required placeholder="${text(practice.actionExample)}" aria-describedby="practice-action-hint"></textarea>
        <p class="field-hint" id="practice-action-hint">寫下由你能決定、今天做得到的事。可以很小，也可以再調整。</p>
      </div>
      <div class="form-field">
        <label for="practice-wish">想把這一步放在哪裏？</label>
        <select class="form-input practice-wish-select" id="practice-wish" name="wishId" aria-describedby="practice-wish-hint">
          <option value=""${selected === '' ? ' selected' : ''}>只存靈感筆記</option>
          ${active.map(wish => `<option value="${text(wish.id)}"${wish.id === selected ? ' selected' : ''}>${text(wish.title)}</option>`).join('')}
          ${canCreate ? '<option value="new">建立新心願</option>' : ''}
        </select>
        <p class="field-hint" id="practice-wish-hint">選擇心願可把這一步帶進花園；若今天已記錄完成，這次想法會留作之後參考。${canCreate ? '' : '花園已有六顆心願，可以選現有心願或只存筆記。'}</p>
      </div>
      <div class="practice-growth-note">${icon('info')}<p>寫下或存好想法不會增加成長。在生活裏完成小行動，再回到花園記錄，心願才會長大。</p></div>
      <p class="form-error" id="form-error" role="alert"></p>
      <div class="modal-actions practice-actions"><button class="btn btn-outline" type="submit" name="intent" value="save">存成靈感筆記</button><button class="btn btn-primary" type="submit" name="intent" value="use">存好並帶進花園${icon('arrow')}</button></div>
    </form>
  </div>`;
}

export function renderPracticeNotes(notes, { esc, icon, prettyDate }) {
  const text = value => esc(String(value ?? ''));
  const entries = (Array.isArray(notes) ? notes : []).filter(note => note && typeof note === 'object');
  return `<section class="practice-notes" id="practice-notes" aria-labelledby="practice-notes-title">
    <div class="practice-notes-heading"><div><p class="eyebrow">IDEAS TO GROW WITH</p><h2 id="practice-notes-title">靈感筆記 <span class="practice-notes-count">${text(entries.length)}</span></h2><p>這裏保留練習時的想法與小步驟。</p></div><span class="practice-notes-mark" aria-hidden="true">${icon('book')}</span></div>
    ${entries.length ? `<div class="practice-notes-grid">${entries.map(note => {
      const creator = CREATORS.find(item => item.id === note.creatorId);
      const date = String(note.createdAt ?? '');
      const dateLabel = prettyDate(date) || '未標示日期';
      return `<article class="practice-note">
        <div class="practice-note-meta"><span>${text(note.creatorName || creator?.name || '我的靈感')}</span><time datetime="${text(date)}">${text(dateLabel)}</time></div>
        <h3>${text(note.practiceTitle || creator?.practice.title || '給自己的小練習')}</h3>
        ${note.reflection ? `<p class="practice-note-reflection">${text(note.reflection)}</p>` : ''}
        <div class="practice-note-action"><span>練習時寫下的一步</span><p>${text(note.action || '先讓這份靈感留在這裏，準備好了再決定下一步。')}</p></div>
        <div class="practice-note-status">${icon('seed')}靈感記錄${note.wishId ? '<span>已連結心願</span>' : ''}</div>
      </article>`;
    }).join('')}</div>` : `<div class="practice-notes-empty">${icon('edit')}<p>還沒有靈感筆記。到靈感書房選一個練習，把對自己有用的發現留在這裏。</p></div>`}
  </section>`;
}
