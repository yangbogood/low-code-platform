import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入语言包
import zhCN from './locales/zh-CN.json';
import enUS from './locales/en-US.json';

// 语言资源
const resources = {
  'zh-CN': {
    translation: zhCN,
  },
  'en-US': {
    translation: enUS,
  },
};

// 初始化 i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh-CN', // 默认语言
    debug: process.env.NODE_ENV === 'development',

    // 语言检测配置
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false, // React 已经处理了 XSS
    },

    // 命名空间配置
    defaultNS: 'translation',
    ns: ['translation'],

    // 语言切换时的处理
    saveMissing: true,
    missingKeyHandler: (lng, _ns, key) => {
      console.warn(`Missing translation for key: ${key} in language: ${lng}`);
    },
  });

export default i18n;
