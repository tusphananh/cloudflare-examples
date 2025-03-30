import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { getKey } from '@/utils';
import { ReactNode } from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { BaseForm, IControlledFormProps } from './base-form';

interface IToggleGroupFormProps extends IControlledFormProps {
  items: {
    value: string;
    label: ReactNode;
  }[];
  onChange?: (
    field: ControllerRenderProps<FieldValues, string>,
    value: string[],
  ) => void;
  itemClassName?: string;
  variant?: 'default' | 'outline';
}

export default function ToggleGroupForm(props: IToggleGroupFormProps) {
  const {
    control,
    label,
    description,
    name,
    optional,
    items,
    onChange,
    variant,
    itemClassName,
    containerClassName,
    className,
    ...rest
  } = props;

  return (
    <BaseForm
      control={control}
      name={name}
      label={label}
      description={description}
      optional={optional}
      containerClassName={containerClassName}
      render={(field) => (
        <div className="space-y-4">
          <ToggleGroup
            size={'sm'}
            onValueChange={(value) => {
              if (onChange) {
                onChange(field, value);
              } else {
                field.onChange(value);
              }
            }}
            value={field.value}
            type="multiple"
            className={twMerge('flex justify-between', className)}
            {...rest}
          >
            {items.map((item, index) => {
              return (
                <ToggleGroupItem
                  key={getKey('toggle-group', item.value, index)}
                  value={item.value}
                  className={itemClassName}
                  variant={variant}
                >
                  {item.label}
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>
      )}
    />
  );
}
