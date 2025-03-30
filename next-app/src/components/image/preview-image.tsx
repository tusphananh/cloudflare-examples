import PreviewItemDialog from '@/components/ui/preview-item';
import { twMerge } from 'tailwind-merge';
import DynamicImage, { IDynamicImageProps } from './dynamic-image';

export default function PreviewImage(
  props: IDynamicImageProps & {
    previewOptions: {
      width: IDynamicImageProps['width'];
      height: IDynamicImageProps['height'];
      className?: IDynamicImageProps['className'];
    };
    previewDialogClassName?: string;
  },
) {
  const { className, previewDialogClassName, ...rest } = props;
  const { className: triggerClassName, ...restTriggerProps } =
    props.previewOptions;

  return (
    <PreviewItemDialog
      trigger={
        <DynamicImage
          {...rest}
          {...restTriggerProps}
          className={twMerge(
            'overflow-hidden sm:max-h-72 rounded-sm h-full',
            triggerClassName,
          )}
          containerClassName="h-full"
          imageClassName="object-cover"
        />
      }
      className={previewDialogClassName}
    >
      <DynamicImage
        {...rest}
        className={twMerge(
          className,
          'm-auto max-h-full max-w-full overflow-hidden',
        )}
        imageClassName="object-cover w-auto h-auto max-h-full max-w-full"
      />
    </PreviewItemDialog>
  );
}
