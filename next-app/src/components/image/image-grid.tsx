import { IImage } from '@/interfaces';
import { getKey } from '@/utils';
import { SetStateAction } from 'react';
import AnimatedCheck from '../check/animated-check';
import Loading from '../loading/loading';
import PreviewImage from './preview-image';

export default function ImageGrid({
  images,
  loading,
  onChange,
  selected,
}: {
  images?: Partial<IImage>[];
  selected: Partial<IImage>[];
  onChange: (value: SetStateAction<Partial<IImage>[]>) => void;
  loading?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-4">
      {loading && (
        <div className="rounded-md flex justify-center items-center w-24 h-24">
          <Loading />
        </div>
      )}
      {images?.map((image) => {
        const checked = selected.some((v) => v.id === image.id);
        return (
          <div key={getKey('image', image.id!)} className="relative">
            <AnimatedCheck
              className="absolute top-[5%] left-1 z-10"
              checked={selected.some((v) => v.id === image.id)}
              onChange={() => {
                const newSelected = checked
                  ? selected.filter((v) => v.id !== image.id)
                  : [...selected, image];
                onChange(newSelected);
              }}
            />
            <PreviewImage
              width={1920}
              height={1080}
              alt="preview-image"
              src={image.url!}
              previewOptions={{
                height: 100,
                width: 100,
                className: 'w-24 h-24',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
