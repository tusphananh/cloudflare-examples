import { Textarea, TextAreaProps } from '@/components/ui/textarea';
import { BaseForm, IControlledFormProps } from './base-form';

interface Props extends TextAreaProps, IControlledFormProps {
  name: string;
}
export default function TextareaForm(props: Props) {
  const { control, label, description, name, optional, ...rest } = props;

  return (
    <BaseForm
      control={control}
      name={name}
      label={label}
      description={description}
      optional={optional}
      render={(field) => <Textarea {...field} {...rest} />}
    />
  );
}
