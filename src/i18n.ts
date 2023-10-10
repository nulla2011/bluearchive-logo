import i18next from 'i18next';
import en from './locales/en.json';
import zh from './locales/zh.json';

const lang = ['zh', 'zh-CN', 'zh-TW'].includes(navigator.language) ? 'zh' : 'en';
i18next.init({
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
  el.textContent = i18next.t(key);
});
