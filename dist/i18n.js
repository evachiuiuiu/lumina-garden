import { toSimplified } from './zh-hans.js';
export { toSimplified };
export const LOCALE_KEY='lumina.locale.v1';
export const LOCALES=['zh-Hant','zh-Hans','en'];
const listeners=new Set();
let locale='zh-Hant';
try { const saved=globalThis.localStorage?.getItem(LOCALE_KEY); if(LOCALES.includes(saved))locale=saved; } catch {}
export function getLocale(){return locale;}
export function t(hant,english,hans){
  if(locale==='en')return String(english ?? hant ?? '');
  if(locale==='zh-Hans')return hans===undefined?toSimplified(hant):String(hans);
  return String(hant ?? '');
}
function updateDocument(){
  if(typeof document==='undefined')return;
  document.documentElement.lang=locale;
  document.title=t('LUMINA｜微光日常','LUMINA · Little by Little');
  const description=document.querySelector('meta[name="description"]');
  if(description)description.content=t('為想靠近的生活，留一點微光。用書寫、靈感練習與日常小行動，記住每一步。','Make room for what matters. Reflect, find inspiration, and keep a little record of everyday steps.');
  const skip=document.querySelector('.skip-link');
  if(skip)skip.textContent=t('跳到主要內容','Skip to content');
}
export function setLocale(next){
  if(!LOCALES.includes(next))return false;
  if(locale===next)return true;
  locale=next;
  try{globalThis.localStorage?.setItem(LOCALE_KEY,locale);}catch{}
  updateDocument();
  for(const listener of [...listeners])listener(locale);
  return true;
}
export function onLocaleChange(callback){
  listeners.add(callback);
  return ()=>listeners.delete(callback);
}
updateDocument();

