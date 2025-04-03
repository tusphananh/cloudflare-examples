import PostDetail from './post-detail';

interface IPostDetailPageProps {
  params: Promise<{ postId: string }>;
}

export default async function PostDetailPage(props: IPostDetailPageProps) {
  const { postId } = await props.params;

  return (
    <div className="mx-auto p-8 max-w-md">
      <PostDetail postId={postId} />
    </div>
  );
}
