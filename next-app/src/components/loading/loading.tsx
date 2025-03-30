import { twMerge } from 'tailwind-merge';
import './loading.css';

export default function Loading({ className }: { className?: string }) {
  return (
    <div className={twMerge('loader', className)}>
      <div className="light"></div>
      <div className="black_overlay"></div>
    </div>
  );
}
