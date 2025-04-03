'use client';

import { Button } from '@/components/ui/button';

import Loading from '@/components/loading/loading';
import { axiosGateWay } from '@/lib/axios-gateway';
import { useAuth } from '@clerk/nextjs';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import CreatePostForm from './create-post.form';

export function CreatePostPage() {
  const methods = useForm({
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const auth = useAuth();

  const router = useRouter();

  const mutation = useMutation({
    onSuccess({ data }: any) {
      if (data?.id) {
        router.push(`post/${data.id}`);
      }
    },
    mutationFn: async (post: any) => {
      const token = await auth.getToken();

      return axiosGateWay.post(
        '/post',
        {
          value: {
            ...post,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
  });

  const onSubmit = () => {
    const { title, content } = methods.getValues();
    mutation.mutate({
      title,
      content,
    });
  };

  return (
    <div className="flex flex-col size-full max-w-md gap-8 mx-auto">
      <CreatePostForm methods={methods} />
      {mutation.isLoading ? (
        <Loading />
      ) : (
        <Button onClick={onSubmit}>Submit</Button>
      )}
    </div>
  );
}
