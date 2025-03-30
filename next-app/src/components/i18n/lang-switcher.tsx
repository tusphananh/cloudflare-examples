'use client';

import { LocaleCode } from '@/constants';
import { Link, usePathname } from '@/lib/shared-pathname';
import { useLocale } from 'next-intl';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

interface Option {
  country: string;
  code: string;
  flag: string;
}

const LangSwitcher = () => {
  const pathname = usePathname();

  const options: Option[] = [
    { country: 'English', code: LocaleCode.en, flag: '🇺🇸' },
    { country: 'Tiếng Việt', code: LocaleCode.vi, flag: '🇻🇳' },
  ];

  const currentLocale = useLocale();

  return (
    <ToggleGroup
      type="single"
      value={currentLocale}
      className="border h-11 px-1 gap-1"
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.code}
          value={option.code}
          className="rounded-md"
        >
          <Link
            className="relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm"
            href={pathname}
            locale={option.code}
          >
            {option.flag}
          </Link>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default LangSwitcher;
