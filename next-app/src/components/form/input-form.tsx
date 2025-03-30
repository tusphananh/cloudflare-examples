import { Input, InputProps } from '@/components/ui/input';
import { BaseForm, IControlledFormProps } from './base-form';

interface InputFormProps extends InputProps, IControlledFormProps {
  name: string;
}

export const InputForm = (props: InputFormProps) => {
  const { control, label, description, name, optional, ...rest } = props;

  return (
    <BaseForm
      control={control}
      name={name}
      label={label}
      description={description}
      optional={optional}
      render={(field) => <Input {...field} {...rest} />}
    />
  );
};
