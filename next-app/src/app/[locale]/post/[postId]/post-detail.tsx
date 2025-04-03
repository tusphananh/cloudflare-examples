'use client';

import PostCard from '@/components/card/post-card';
import Loading from '@/components/loading/loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import usePostSocket from '@/hooks/usePostSocket';
import { axiosGateWay } from '@/lib/axios-gateway';

import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';

export default function PostDetail(props: { postId: string }) {
  const { postId } = props;

  const { isLoading, data } = useQuery({
    queryKey: ['postId'],
    queryFn: async () =>
      (
        await axiosGateWay.get('/post', {
          params: {
            id: postId,
          },
        })
      ).data,
  });

  const [comments, setComment] = useState<any[]>([]);

  const refInput = useRef<HTMLInputElement>(null);
  const socket = usePostSocket(postId, {
    onMessage: (comment: any) => {
      const data = JSON.parse(comment.data);

      if (data.type === 'message') {
        setComment((prev) => [...prev, data]);
      }
    },
  });

  const onSend = () => {
    if (!refInput.current?.value) return;

    const val = refInput.current.value;
    socket?.send(
      JSON.stringify({
        type: 'message',
        message: val,
      }),
    );

    refInput.current.value = '';
  };

  if (isLoading) {
    return <Loading className="m-auto" />;
  }

  return (
    <div>
      <PostCard
        post={{
          id: postId,
          ...data,
        }}
      />
      <div className="flex gap-4">
        <Input ref={refInput} />
        <Button onClick={onSend}>Send</Button>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {comments.map((comment, index) => (
          <div key={index} className="p-4 border-b">
            <div className="flex gap-4 items-center">
              <img
                width={24}
                height={24}
                className="rounded-full"
                src={comment.user.imageUrl}
              />
              <span>
                {comment.user.firstName} {comment.user.lastName}
              </span>
            </div>
            <p className="text-sm text-white/80 mt-2">{comment.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
