import { init, t } from 'i18next';
import en from './locales/en.json';
import zh from './locales/zh.json';

const lang = ['zh', 'zh-CN', 'zh-cn'].includes(navigator.language) ? 'zh' : 'en';
init({
  lng: lang,
  resources: {
    en: {
      translation: en,
    },
    zh: {
      translation: zh,
    },
  },
});

document.querySelectorAll('.i18n').forEach((el) => {
  const key = el.getAttribute('data-i18n')!;
  el.textContent = t(key);
});
