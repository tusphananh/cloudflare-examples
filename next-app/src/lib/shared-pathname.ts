import { LocaleCode } from '@/constants';
import { createNavigation } from 'next-intl/navigation';

const localePrefix = 'always';

export const { Link, usePathname, redirect, getPathname } = createNavigation({
  locales: Object.values(LocaleCode),
  defaultLocale: LocaleCode.vi,
  localePrefix,
});
