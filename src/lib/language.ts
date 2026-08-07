import { Language } from '../types';

/**
 * Returns localized string from an object with properties like titleEn, titleHi, titleOr
 */
export function getLangText(
  item: any,
  keyPrefix: string,
  currentLang: Language,
  defaultFallback = ''
): string {
  if (!item) return defaultFallback;

  if (currentLang === 'hi') {
    const hiVal = item[`${keyPrefix}Hi`];
    if (hiVal && typeof hiVal === 'string' && hiVal.trim().length > 0) {
      return hiVal;
    }
  }

  if (currentLang === 'or') {
    const orVal = item[`${keyPrefix}Or`];
    if (orVal && typeof orVal === 'string' && orVal.trim().length > 0) {
      return orVal;
    }
  }

  const enVal = item[`${keyPrefix}En` as keyof typeof item] || item[keyPrefix];
  if (enVal && typeof enVal === 'string' && enVal.trim().length > 0) {
    return enVal;
  }

  return defaultFallback;
}
