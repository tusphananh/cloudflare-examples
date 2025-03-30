import { LocaleCode, LocaleList } from '@/constants';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: LocaleList,

  // Used when no locale matches
  defaultLocale: LocaleCode.vi,
});
