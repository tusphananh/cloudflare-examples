'use client';

import PostCard from '@/components/card/post-card';
import Loading from '@/components/loading/loading';
import { Timeline } from '@/components/ui/timeline';
import { axiosGateWay } from '@/lib/axios-gateway';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const data = useQuery({
    queryKey: ['posts'],
    queryFn: async () => (await axiosGateWay.get('/post')).data,
  });

  if (data.isLoading) {
    return <Loading className="mx-auto my-auto size-full" />;
  }

  return (
    <div className="max-w-md mx-auto pr-4">
      <Timeline
        data={data.data.map((item: any) => ({
          content: <PostCard post={item} key={`content-${item.id}`} />,
        }))}
      />
    </div>
  );
}
