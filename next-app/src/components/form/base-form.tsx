import { JSX, ReactNode } from 'react';
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldValues,
  useController,
} from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export interface IControlledFormProps {
  control: Control<any, any>;
  label?: string;
  description?: string | ReactNode;
  name: string;
  optional?: boolean;
  containerClassName?: string;
  className?: string;
}

export interface IBaseFormProps extends IControlledFormProps {
  render: (field: ControllerRenderProps<FieldValues, string>) => JSX.Element;
}

export const BaseForm = (props: IBaseFormProps) => {
  const { control, label, description, name, optional, containerClassName } =
    props;

  const controller = useController({ name, control });

  const error = controller.fieldState?.error?.message;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className={twMerge('w-full', containerClassName)}>
          {label && (
            <span className="flex items-center">
              <span
                className={twMerge(
                  'mb-2 ml-1 text-sm font-medium dark:text-neutral-200/80',
                  error ? 'text-red-500' : 'text-zinc-700',
                )}
              >
                {label}
              </span>
              {optional && (
                <span className="mb-2 text-xs font-light text-neutral-400 dark:text-neutral-200/80">
                  &nbsp;( Optional )
                </span>
              )}
            </span>
          )}
          {props.render(field)}
          {description && (
            <div className="ml-1 mt-2 truncate text-xs text-zinc-400">
              {description}
            </div>
          )}
          {error && (
            <p className="ml-1 mt-2 truncate text-xs text-red-500">{error}</p>
          )}
        </div>
      )}
    />
  );
};
