'use client';

import PreviewImage from '@/components/image/preview-image';
import Loading from '@/components/loading/loading';
import { axiosGateWay } from '@/lib';
import { getKey } from '@/utils';
import { useQuery } from '@tanstack/react-query';

const images = [
  'https://preview.redd.it/i1z7kignbbla1.jpg?width=640&crop=smart&auto=webp&s=b009a6a10be3fbe72c828c84b4970c6dda16ce43',
  'https://preview.redd.it/does-anyone-other-than-me-know-where-this-cat-is-from-lol-v0-img24gu05lfb1.jpg?width=1080&crop=smart&auto=webp&s=c3f0a1639fc3a21e04864423c108302d5a36ff8b',
  'https://cdn-useast1.kapwing.com/static/templates/crying-cat-meme-template-full-719a53dc.webp',
  'https://www.meowbox.com/cdn/shop/articles/Screen_Shot_2024-03-15_at_10.53.41_AM.png?v=1710525250',
];

export default function Home() {
  const data = useQuery({
    queryKey: ['posts'],
    queryFn: async () => (await axiosGateWay.get('post')).data,
  });

  if (data.isLoading) {
    return <Loading />;
  }

  return (
    <div className="mx-auto max-w-md gap-12 flex flex-col">
      {data.data.map((post: any) => {
        return (
          <div key={getKey('post', post.id)} className="">
            <h1>{post.id}</h1>
            <h1>{post.value.title}</h1>
            <h1>{post.value.content}</h1>
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
          </div>
        );
      })}
    </div>
  );
}
