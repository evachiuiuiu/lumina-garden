import { t } from './i18n.js';
// LUMINA's little glass conservatory. All artwork is local, scalable SVG.
let serial = 0;
const esc = (value = '') => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const safeColor = value => /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(String(value)) ? value : '#dce6ad';
const clampLevel = level => Math.max(0, Math.min(4, Math.floor(Number(level) || 0)));

function plantDefinitions(prefix, color) {
  return `<linearGradient id="${prefix}-leaf" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b7d6ae"/><stop offset=".5" stop-color="#6fa68b"/><stop offset="1" stop-color="#345c50"/></linearGradient>
  <linearGradient id="${prefix}-stem" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#527a54"/><stop offset=".6" stop-color="#b9c98e"/><stop offset="1" stop-color="#678d63"/></linearGradient>
  <radialGradient id="${prefix}-petal" cx=".35" cy=".2" r=".85"><stop stop-color="#ffffe8"/><stop offset=".35" stop-color="${color}"/><stop offset="1" stop-color="${color}" stop-opacity=".57"/></radialGradient>
  <radialGradient id="${prefix}-aura"><stop stop-color="${color}" stop-opacity=".2"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`;
}

function flower(category, prefix, color) {
  const kind = String(category);
  if (/love|romance|relationship/.test(kind)) {
    return `<g class="plant-blossom" transform="translate(61 36)"><circle r="29" fill="url(#${prefix}-aura)"/>${[-72,0,72,144,216].map(a=>`<path d="M0 9C-27 5-25-27-10-26C-3-26 1-19 0-12C4-26 24-25 24-11C24 2 7 9 0 9Z" transform="rotate(${a}) scale(.7)" fill="url(#${prefix}-petal)" stroke="${color}" stroke-opacity=".45" stroke-width=".8"/>`).join('')}<circle r="7" fill="#f1df9b"/><path d="M-3-1C0-7 6-4 4 1C2 6-5 4-3-1" fill="none" stroke="#90895f" stroke-width="1.2"/></g>`;
  }
  if (/travel|explor/.test(kind)) {
    return `<g class="plant-blossom" transform="translate(61 34)"><circle r="35" fill="url(#${prefix}-aura)"/>${[0,72,144,216,288].map(a=>`<path d="M0 4C-9-4-10-16-3-28C-1-19 10-14 7-6C6-1 3 3 0 4Z" fill="url(#${prefix}-petal)" stroke="${color}" stroke-opacity=".5" stroke-width=".6" transform="rotate(${a})"/>`).join('')}<circle r="5" fill="#f9e4b4"/><circle r="2" fill="#fff9d6"/></g>`;
  }
  if (/wealth|money|abundance|finance/.test(kind)) {
    return `<g class="plant-blossom" transform="translate(61 35)"><circle r="34" fill="url(#${prefix}-aura)"/>${Array.from({length:12},(_,i)=>`<ellipse cx="0" cy="-15" rx="5.3" ry="15" fill="url(#${prefix}-petal)" stroke="${color}" stroke-width=".5" transform="rotate(${i*30})"/>`).join('')}<circle r="10" fill="#a19d5e"/><circle r="7.4" fill="#e6d7a3"/><g fill="#fff4c8"><circle cx="-3" cy="-3" r="1"/><circle cx="3" cy="-2" r="1"/><circle cx="0" cy="3" r="1"/></g></g>`;
  }
  if (/health|well|peace|body/.test(kind)) {
    return `<g class="plant-blossom" transform="translate(61 38)"><circle r="34" fill="url(#${prefix}-aura)"/><path d="M0 13C-28 7-30-14-23-22C-10-19-1-8 0 13Z" fill="url(#${prefix}-petal)"/><path d="M0 13C28 7 30-14 23-22C10-19 1-8 0 13Z" fill="url(#${prefix}-petal)"/><path d="M0 13C-16 0-13-20 0-33C13-20 16 0 0 13Z" fill="url(#${prefix}-petal)" stroke="#fffbe6" stroke-opacity=".5"/><path d="M-24 0Q-15 17 0 13Q15 17 24 0" fill="none" stroke="${color}" stroke-width="2"/><circle cy="9" r="4" fill="#f5e5b1"/></g>`;
  }
  return `<g class="plant-blossom" transform="translate(61 35)"><circle r="34" fill="url(#${prefix}-aura)"/>${Array.from({length:7},(_,i)=>`<path d="M0 3C-11-2-14-19-5-25C4-32 14-19 9-9C7-3 3 1 0 3Z" fill="url(#${prefix}-petal)" stroke="${color}" stroke-opacity=".65" stroke-width=".7" transform="rotate(${i*360/7})"/>`).join('')}<circle r="6.8" fill="#f1e5b4"/><circle r="3.2" fill="#a6a171"/><path d="M-9 1L-13 0M9 1L13 0M0-9V-12" stroke="#fff8d9" stroke-width="1"/></g>`;
}

function plantBody(category, level, color, prefix) {
  const l = clampLevel(level);
  if (l === 0) return `<g class="plant-seed"><ellipse cx="60" cy="122" rx="17" ry="5" fill="#091e1b" opacity=".45"/><ellipse cx="60" cy="113" rx="23" ry="20" fill="url(#${prefix}-aura)"/><path d="M60 119C43 116 44 99 60 90C76 99 77 116 60 119Z" fill="url(#${prefix}-petal)" stroke="${color}" stroke-width="1"/><path d="M60 92V117" stroke="#fffbe5" stroke-opacity=".65"/><circle cx="66" cy="99" r="2" fill="#fff9d5"/></g>`;
  const leaves = `<path d="M59 106C38 105 27 91 27 82C43 80 58 92 59 106Z" fill="url(#${prefix}-leaf)" stroke="#a7cba1" stroke-opacity=".3" stroke-width=".7"/><path d="M60 95C78 94 90 82 91 71C75 71 62 80 60 95Z" fill="url(#${prefix}-leaf)" stroke="#a7cba1" stroke-opacity=".3" stroke-width=".7"/><path d="M31 85L56 103M86 76L63 92" fill="none" stroke="#d6deac" stroke-width=".7" opacity=".45"/>`;
  if (l === 1) return `<g class="plant-sprout"><ellipse cx="60" cy="126" rx="17" ry="4" fill="#091e1b" opacity=".4"/><path d="M60 125Q56 112 60 94" fill="none" stroke="url(#${prefix}-stem)" stroke-width="3" stroke-linecap="round"/><path d="M60 109C44 111 32 98 32 88C48 88 57 97 60 109Z" fill="url(#${prefix}-leaf)"/><path d="M60 101C75 102 86 90 87 80C73 80 63 89 60 101Z" fill="url(#${prefix}-leaf)"/><path d="M36 92L57 106M83 85L62 99" stroke="#d5e4b1" stroke-opacity=".4" stroke-width=".7"/></g>`;
  const stem = `<path d="M59 125C54 99 65 78 61 ${l===2?'58':'42'}" fill="none" stroke="url(#${prefix}-stem)" stroke-width="3.5" stroke-linecap="round"/>`;
  const topLeaves = `<path d="M62 79C45 77 37 66 38 55C53 57 62 66 62 79Z" fill="url(#${prefix}-leaf)"/><path d="M63 69C77 69 85 59 86 49C74 48 65 57 63 69Z" fill="url(#${prefix}-leaf)"/><path d="M42 59L60 76M82 53L64 67" stroke="#c9dca8" stroke-opacity=".4" stroke-width=".7"/>`;
  const bud = `<g class="plant-bud"><ellipse cx="61" cy="40" rx="24" ry="27" fill="url(#${prefix}-aura)"/><path d="M61 52C45 47 47 28 61 20C75 28 77 47 61 52Z" fill="url(#${prefix}-petal)" stroke="${color}" stroke-opacity=".65" stroke-width=".9"/><path d="M61 22Q54 38 61 50" stroke="#fffad6" stroke-opacity=".7" fill="none"/><path d="M61 52L49 43L54 53L61 57L68 53L74 43Z" fill="#81aa78"/></g>`;
  return `<g class="plant-grown"><ellipse cx="60" cy="126" rx="21" ry="5" fill="#0b201b" opacity=".45"/>${stem}<g class="plant-leaves">${leaves}${topLeaves}</g>${l===3?bud:l===4?flower(category,prefix,color):`<path d="M61 60C53 53 55 44 61 39C68 46 69 54 61 60Z" fill="url(#${prefix}-leaf)"/>`}</g>`;
}

/** Small, fully self-contained SVG plant. Level 0 seed; 4 flowering. */
export function plantIcon(category = 'custom', level = 1, color = '#d9df9a') {
  const prefix = `lumina-icon-${++serial}`;
  const c = safeColor(color);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" aria-hidden="true" class="plant-icon"><defs>${plantDefinitions(prefix,c)}</defs>${plantBody(category,level,c,prefix)}</svg>`;
}

function fern(x, y, scale = 1, flip = false, opacity = 1) {
  return `<g transform="translate(${x} ${y}) scale(${flip?-scale:scale} ${scale})" opacity="${opacity}"><path d="M0 0Q4-38 33-72" fill="none" stroke="#8aa17a" stroke-width="1.6"/><g fill="#3d7465" stroke="#74967a" stroke-width=".5">${[0,1,2,3,4].map(i=>{const px=4+i*4.5,py=-12-i*10;return `<path d="M${px} ${py}Q${px-29+i*3} ${py-3} ${px-25+i*3} ${py-19}Q${px-10} ${py-17} ${px} ${py}Z"/><path d="M${px} ${py}Q${px+18-i*1.5} ${py-2} ${px+25-i*2} ${py-15}Q${px+11} ${py-17} ${px} ${py}Z"/>`;}).join('')}</g></g>`;
}

function star(x,y,size=3,opacity=.7) {
  return `<path class="ambient-star" d="M${x-size} ${y}Q${x} ${y} ${x} ${y-size*1.55}Q${x} ${y} ${x+size} ${y}Q${x} ${y} ${x} ${y+size*1.55}Q${x} ${y} ${x-size} ${y}Z" fill="#e0e3bd" opacity="${opacity}"/>`;
}

/** Interactive conservatory, with six planting positions. */
export function gardenScene(plants = [], options = {}) {
  const prefix = `lumina-world-${++serial}`;
  const list = Array.isArray(plants) ? plants.slice(0,6) : [];
  const slots = [{x:354,y:366,s:1.12},{x:544,y:366,s:1.12},{x:255,y:414,s:1.18},{x:645,y:414,s:1.18},{x:369,y:463,s:1.25},{x:532,y:463,s:1.25}];
  const seeds = slots.map((slot,i)=> {
    const p=list[i];
    const active=p && String(p.id)===String(options.activeId);
    if (!p) return `<g class="garden-slot garden-empty" data-empty-slot="${i}" role="button" tabindex="0" aria-label="${t('種下一個新心願','Plant a new wish')}" transform="translate(${slot.x} ${slot.y})"><ellipse class="plot-ring" cy="0" rx="37" ry="14" fill="#152e28" fill-opacity=".28" stroke="#b5c59a" stroke-opacity=".3" stroke-width="1" stroke-dasharray="3 5"/><ellipse cy="-1" rx="25" ry="8" fill="#96b897" opacity=".04"/><path d="M-5-1H5M0-6V4" stroke="#d7dfb5" stroke-opacity=".7" stroke-width="1.2"/><ellipse cy="-17" rx="46" ry="39" fill="transparent"/></g>`;
    const c=safeColor(p.color);
    const local=`${prefix}-p${i}`;
    return `<g class="garden-slot garden-plant${active?' is-active':''}" data-plant-id="${esc(p.id)}" role="button" tabindex="0" aria-label="${esc(p.title||t('我的心願','My wish'))}, ${[t('種子','Seed'),t('萌芽','Sprout'),t('展葉','Leaves'),t('含苞','Bud'),t('綻放','Bloom')][clampLevel(p.level)]}" transform="translate(${slot.x} ${slot.y})"><defs>${plantDefinitions(local,c)}</defs><ellipse class="plant-ground-glow" cy="-8" rx="65" ry="42" fill="url(#${local}-aura)" opacity="${active?1:.4}"/><ellipse class="plot-ring" rx="37" ry="14" fill="#214039" fill-opacity=".5" stroke="${c}" stroke-opacity="${active?.85:.3}" stroke-width="${active?1.5:.8}"/><ellipse cy="-1" rx="30" ry="10" fill="#567460" opacity=".2"/><g transform="translate(${-60*slot.s} ${-126*slot.s}) scale(${slot.s})">${plantBody(p.category,p.level,c,local)}</g><ellipse cy="-54" rx="47" ry="70" fill="transparent"/>${active?`<circle cy="20" r="2.3" fill="${c}"/>`:''}</g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 620" class="garden-world" role="group" aria-label="${t('心願花園，選擇花朵查看願望，或選擇空位種下心願','Your garden. Select a plant to see your wish, or an empty space to plant a new one.')}">
  <defs>
    <radialGradient id="${prefix}-air"><stop stop-color="#9fae83" stop-opacity=".13"/><stop offset=".65" stop-color="#638876" stop-opacity=".05"/><stop offset="1" stop-color="#638876" stop-opacity="0"/></radialGradient>
    <radialGradient id="${prefix}-halo"><stop stop-color="#e8edbc" stop-opacity=".14"/><stop offset=".55" stop-color="#b4d4a1" stop-opacity=".04"/><stop offset="1" stop-color="#accb9d" stop-opacity="0"/></radialGradient>
    <linearGradient id="${prefix}-glass" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="#d1e7ce" stop-opacity=".09"/><stop offset=".52" stop-color="#93bc9c" stop-opacity=".015"/><stop offset="1" stop-color="#8ebda3" stop-opacity=".1"/></linearGradient>
    <linearGradient id="${prefix}-rim" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d2d3aa" stop-opacity=".85"/><stop offset=".36" stop-color="#9fb894" stop-opacity=".3"/><stop offset=".62" stop-color="#d5d9b5" stop-opacity=".65"/><stop offset="1" stop-color="#78977e" stop-opacity=".22"/></linearGradient>
    <linearGradient id="${prefix}-rock" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#3a5b4a"/><stop offset=".45" stop-color="#1e3d33"/><stop offset="1" stop-color="#132e28" stop-opacity=".4"/></linearGradient>
    <radialGradient id="${prefix}-moss" cx=".5" cy=".28" r=".75"><stop stop-color="#6e8b61"/><stop offset=".45" stop-color="#42694f"/><stop offset="1" stop-color="#2b4b3b"/></radialGradient>
    <linearGradient id="${prefix}-water" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#527d6e"/><stop offset=".6" stop-color="#214d43"/><stop offset="1" stop-color="#92bca3" stop-opacity=".5"/></linearGradient>
    <radialGradient id="${prefix}-lamp"><stop stop-color="#ffefb4" stop-opacity=".28"/><stop offset="1" stop-color="#f4df9e" stop-opacity="0"/></radialGradient>
    <filter id="${prefix}-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
    <pattern id="${prefix}-soil" width="24" height="17" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r=".8" fill="#bed0a0" opacity=".12"/><path d="M15 11l3-1" stroke="#c7d4ad" stroke-width=".7" opacity=".1"/></pattern>
  </defs>
  <style>
    .garden-slot {cursor:pointer;outline:none;}
    .garden-slot:focus-visible .plot-ring {stroke:#f4f1ca;stroke-width:2.7;stroke-dasharray:none;}
    .garden-slot:hover .plot-ring {stroke:#ecedc7;stroke-opacity:.9;}
    .garden-slot:hover .plant-ground-glow {opacity:1;}
    .garden-slot .plot-ring {transition:stroke .2s,stroke-opacity .2s;}
  </style>
  <ellipse cx="450" cy="300" rx="370" ry="280" fill="url(#${prefix}-air)"/>
  <ellipse cx="450" cy="265" rx="250" ry="235" fill="url(#${prefix}-halo)"/>
  <g class="garden-constellation" stroke="#a6b797" stroke-width=".6" stroke-opacity=".2"><path d="M173 167L217 115L266 144L315 92" fill="none"/><path d="M682 123L724 164L758 143" fill="none"/><circle cx="217" cy="115" r="2" fill="#e4e7bd"/><circle cx="266" cy="144" r="1.6" fill="#e4e7bd"/><circle cx="724" cy="164" r="1.5" fill="#e4e7bd"/></g>
  ${star(173,167,4,.7)}${star(315,92,3,.5)}${star(682,123,4,.6)}${star(758,143,2,.7)}${star(119,287,3,.5)}${star(789,331,3,.5)}${star(283,70,2,.55)}${star(602,70,2,.5)}
  <g class="garden-moon"><circle cx="450" cy="93" r="27" fill="none" stroke="#cccf9b" stroke-opacity=".16"/><path d="M458 72C444 73 436 82 436 93C436 105 444 114 456 116C438 122 423 109 425 93C425 79 440 69 458 72Z" fill="#e2e3b7" opacity=".8"/><circle cx="450" cy="94" r="47" fill="url(#${prefix}-halo)"/></g>
  <ellipse cx="450" cy="540" rx="235" ry="27" fill="#071d18" opacity=".36" filter="url(#${prefix}-soft)"/>
  <path d="M151 414C159 482 266 513 364 528L420 559L451 550L492 560L554 528C660 514 739 477 749 417Z" fill="url(#${prefix}-rock)"/>
  <path d="M180 444L257 473L296 511L330 492L375 526M446 494L420 549M576 475L548 520L516 543M702 444L658 477L651 499" fill="none" stroke="#69816a" stroke-opacity=".13" stroke-width="1.1"/>
  <path d="M323 493C333 518 324 537 340 550M574 492C564 521 580 532 567 548M414 517Q404 538 409 549" stroke="#8d9b70" stroke-opacity=".26" stroke-width="1.3" fill="none"/>
  <ellipse cx="450" cy="418" rx="303" ry="96" fill="#233e32"/>
  <ellipse cx="450" cy="410" rx="298" ry="93" fill="url(#${prefix}-moss)"/>
  <ellipse cx="450" cy="410" rx="298" ry="93" fill="url(#${prefix}-soil)"/>
  <path d="M156 423C209 476 341 495 452 496C560 496 684 474 742 424" fill="none" stroke="#a1b386" stroke-opacity=".28" stroke-width="2"/>
  <path d="M182 399C224 437 300 453 369 456C430 461 450 445 451 423C454 400 478 390 524 390C600 388 673 412 716 435" fill="none" stroke="#b6b88c" stroke-opacity=".2" stroke-width="15"/>
  <path d="M182 399C224 437 300 453 369 456C430 461 450 445 451 423C454 400 478 390 524 390C600 388 673 412 716 435" fill="none" stroke="#d9d3ab" stroke-opacity=".12" stroke-width="1"/>
  <g class="garden-glass"><path d="M194 405V333C194 190 302 126 450 126C598 126 706 190 706 333V405C652 449 247 449 194 405Z" fill="url(#${prefix}-glass)"/>
    <path d="M194 405V333C194 190 302 126 450 126C598 126 706 190 706 333V405" fill="none" stroke="url(#${prefix}-rim)" stroke-width="1.8"/>
    <path d="M269 427V325C269 196 345 126 450 126C555 126 632 196 632 325V427M358 438V319C358 196 396 126 450 126C505 126 543 196 543 319V438M450 126V442" fill="none" stroke="url(#${prefix}-rim)" stroke-width="1"/>
    <path d="M210 258C326 292 580 292 690 258M194 338C312 375 591 375 706 338M194 405C300 451 604 451 706 405" fill="none" stroke="url(#${prefix}-rim)" stroke-width="1"/>
    <path d="M228 265C245 217 280 189 318 172L305 273ZM279 329L299 234L314 217L296 334Z" fill="#f4f8df" opacity=".028"/>
    <path d="M594 175Q635 196 656 237" fill="none" stroke="#edf3d6" stroke-opacity=".17" stroke-width="2" stroke-linecap="round"/>
    <circle cx="450" cy="126" r="4" fill="#b8bf93"/><path d="M450 121V112" stroke="#b8bf93" stroke-width="1.2"/>
  </g>
  <g class="garden-rear-flora">
    ${fern(199,386,.75,false,.8)}${fern(704,386,.72,true,.8)}
    <path d="M290 340Q285 284 262 265M292 341Q305 297 323 284" fill="none" stroke="#658868" stroke-width="1.5" opacity=".75"/>
    <g fill="#75977b" opacity=".6"><ellipse cx="272" cy="281" rx="6" ry="13" transform="rotate(-40 272 281)"/><ellipse cx="286" cy="310" rx="6" ry="12" transform="rotate(-35 286 310)"/><ellipse cx="310" cy="302" rx="5" ry="11" transform="rotate(34 310 302)"/></g>
    <path d="M603 342Q611 297 635 268M606 340Q591 308 581 300" fill="none" stroke="#658868" stroke-width="1.5" opacity=".75"/>
    <g fill="#75977b" opacity=".6"><ellipse cx="627" cy="283" rx="6" ry="12" transform="rotate(40 627 283)"/><ellipse cx="614" cy="312" rx="6" ry="12" transform="rotate(35 614 312)"/><ellipse cx="588" cy="308" rx="5" ry="10" transform="rotate(-34 588 308)"/></g>
  </g>
  <g class="garden-pool"><ellipse cx="449" cy="379" rx="49" ry="17" fill="#1d4337"/><ellipse cx="449" cy="375" rx="46" ry="15" fill="url(#${prefix}-water)" stroke="#b0c098" stroke-opacity=".38" stroke-width="1"/><path d="M421 371Q438 367 455 370M443 381Q462 383 477 375" stroke="#c6d5ae" stroke-opacity=".3" fill="none" stroke-width=".7"/><ellipse cx="429" cy="377" rx="7" ry="2.3" fill="#8eab83"/><path d="M429 377L426 374" stroke="#325c4e" stroke-width=".6"/></g>
  ${seeds}
  <g class="garden-lamps"><g transform="translate(188 428)"><ellipse cy="-7" rx="42" ry="39" fill="url(#${prefix}-lamp)"/><path d="M-5 0V-20Q0-24 5-20V0Z" fill="#d8ca92" fill-opacity=".12" stroke="#c4c192" stroke-opacity=".7" stroke-width=".9"/><path d="M0-17V-5" stroke="#f6e2a4" stroke-width="2.6" stroke-linecap="round"/><path d="M-8 1H8M-6-21H6" stroke="#b5b18c" stroke-width="1.2"/></g><g transform="translate(714 430)"><ellipse cy="-7" rx="42" ry="39" fill="url(#${prefix}-lamp)"/><path d="M-5 0V-20Q0-24 5-20V0Z" fill="#d8ca92" fill-opacity=".12" stroke="#c4c192" stroke-opacity=".7" stroke-width=".9"/><path d="M0-17V-5" stroke="#f6e2a4" stroke-width="2.6" stroke-linecap="round"/><path d="M-8 1H8M-6-21H6" stroke="#b5b18c" stroke-width="1.2"/></g></g>
  ${fern(238,466,.55,false,.9)}${fern(667,463,.55,true,.9)}
  <g fill="#9bad80" opacity=".5"><ellipse cx="288" cy="472" rx="8" ry="3"/><ellipse cx="602" cy="479" rx="9" ry="3"/><ellipse cx="314" cy="491" rx="5" ry="2"/><ellipse cx="586" cy="498" rx="6" ry="2"/></g>
  <g class="garden-fireflies" fill="#e8e4ac">${[[252,235,1.3],[643,255,1.4],[394,273,1.2],[508,236,1.1],[338,200,.9],[567,303,1.4],[177,345,1.1],[726,309,1.2],[305,412,.9],[582,433,1.1],[476,298,1.1]].map(([x,y,r],i)=>`<g class="ambient-firefly" style="--i:${i}"><circle cx="${x}" cy="${y}" r="${r*5}" opacity=".035"/><circle cx="${x}" cy="${y}" r="${r}" opacity=".7"/></g>`).join('')}</g>
  <path d="M423 586H477" stroke="#bdc5a0" stroke-opacity=".3" stroke-width=".6"/><circle cx="450" cy="586" r="2" fill="#c8cca4" opacity=".65"/>
  </svg>`;
}
