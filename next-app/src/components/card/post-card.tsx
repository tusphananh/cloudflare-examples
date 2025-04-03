'use client';

import Heart from '@/components/button/heart';
import { MessageCircle, Share } from 'lucide-react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import PreviewImage from '../image/preview-image';

const images = [
  'https://preview.redd.it/i1z7kignbbla1.jpg?width=640&crop=smart&auto=webp&s=b009a6a10be3fbe72c828c84b4970c6dda16ce43',
  'https://preview.redd.it/does-anyone-other-than-me-know-where-this-cat-is-from-lol-v0-img24gu05lfb1.jpg?width=1080&crop=smart&auto=webp&s=c3f0a1639fc3a21e04864423c108302d5a36ff8b',
  'https://cdn-useast1.kapwing.com/static/templates/crying-cat-meme-template-full-719a53dc.webp',
  'https://www.meowbox.com/cdn/shop/articles/Screen_Shot_2024-03-15_at_10.53.41_AM.png?v=1710525250',
];

export default function PostCard(props: {
  post: {
    id: string;
    title: string;
    content: string;
    user: {
      firstName: string;
      lastName: string;
      imageUrl: string;
    };
  };
}) {
  const { post } = props;
  return (
    <div key={`content-${post.id}`} className="mb-10">
      <div className="flex gap-4 items-center mb-2">
        <img
          width={24}
          height={24}
          className="rounded-full"
          src={post.user.imageUrl}
        />
        <span>
          {post.user.firstName} {post.user.lastName}
        </span>
      </div>

      <p className={twMerge('text-xl font-bold mb-4')}>{post.title}</p>
      <div className="text-sm  prose prose-sm dark:prose-invert">
        <div className="w-full aspect-square">
          <PreviewImage
            src={images[Math.floor(Math.random() * images.length)]}
            alt="preview-image"
            previewDialogClassName="size-full"
            height={1080}
            width={1920}
            previewOptions={{
              height: 500,
              width: 500,
              className: 'size-full sm:max-h-full',
            }}
          />
        </div>
        <p className="mt-8 text-white/60">{post.content}</p>
      </div>
      <div className="flex justify-between items-center text-white/60 mt-4">
        <Heart />
        <Link href={'/post/' + post.id}>
          <MessageCircle />
        </Link>
        <Share />
      </div>
    </div>
  );
}
