import { InputForm } from '@/components/form/input-form';
import TextareaForm from '@/components/form/textarea-form';
import { IFormComponent } from '@/interfaces';

export default function CreatePostForm({ methods }: IFormComponent) {
  return (
    <div className="flex flex-col gap-8 w-full max-w-md">
      <InputForm
        name="title"
        label="Title"
        placeholder="Trekking to Volcano..."
        control={methods.control}
        className="border-none"
      />
      <TextareaForm
        name="content"
        label="Content"
        placeholder="3 days with wonderful trekking plan..."
        control={methods.control}
        className="border-none"
      />
    </div>
  );
}
