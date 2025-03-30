import { AppRoutes } from '@/constants';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Bell, ChartNoAxesGantt, Home, Plus, User } from 'lucide-react';

export default function BottomNavBar() {
  const items = [
    {
      name: 'Home',
      icon: <Home />,
      link: AppRoutes.HOME,
    },
    {
      name: 'Posts',
      icon: <ChartNoAxesGantt />,
      link: AppRoutes.POSTS,
    },
    {
      name: 'Create',
      icon: <Plus />,
      link: AppRoutes.CREATE,
    },
    {
      name: 'Notifications',
      icon: <Bell />,
      link: AppRoutes.NOTIFICATIONS,
    },
    {
      name: 'Account',
      icon: (
        <div key="account">
          <SignedOut>
            <SignInButton>
              <User />
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      ),
    },
  ];

  return (
    <div className="gap-4 fixed bottom-0 w-full p-4 bg-background px-8 flex h-[var(--bottom-nav-h)] z-20">
      <div className="w-full flex justify-between max-w-xl mx-auto">
        {items.map((item) => {
          if (item.link) {
            return (
              <a
                key={item.name}
                href={item.link}
                className="flex flex-col items-center justify-center "
              >
                {item.icon}
              </a>
            );
          }

          return item.icon;
        })}
      </div>
    </div>
  );
}
