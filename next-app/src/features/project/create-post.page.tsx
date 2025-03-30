'use client';

import { Button } from '@/components/ui/button';

import Loading from '@/components/loading/loading';
import { getConfig } from '@/config';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import CreatePostForm from './create-post.form';

const config = getConfig();

export function CreatePostPage() {
  const methods = useForm({
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (post: any) => {
      return axios.post(config.apiGateWayUrl + '/api/post', {
        value: {
          ...post,
        },
      });
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
