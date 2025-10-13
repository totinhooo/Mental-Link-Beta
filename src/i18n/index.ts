import en from './en.json';
import es from './es.json';

type Locales = 'en' | 'es' | 'es-mx' | 'es-co' | string;

const catalog: Record<string, any> = {
  en,
  es
};

const STORAGE_KEY = 'mental-link-lang';

export const getPersistedLang = (): string => {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v || 'es';
  } catch {
    return 'es';
  }
};

export const setPersistedLang = (lang: string) => {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {}
};

export const t = (key: string, lang?: Locales): string => {
  const effective = lang || getPersistedLang();
  const parts = key.split('.');
  let node: any = catalog[effective] || catalog['es'];
  for (const p of parts) {
    if (!node) return key;
    node = node[p];
  }
  return typeof node === 'string' ? node : key;
};

export default t;
