import LangSwitcher from '../i18n/lang-switcher';

export default function TopNavBar() {
  return (
    <div className="gap-4 fixed top-0 w-full p-4 bg-background px-8 flex h-[var(--top-nav-h)] z-20">
      <LangSwitcher />
    </div>
  );
}
