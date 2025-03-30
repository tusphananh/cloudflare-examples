import Resizer from 'react-image-file-resizer';

interface IFlexibleImageVariantOptions {
  width: number;
  height: number;
  blur?: number;
}

export const getBase64 = (file: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const getPublicVariant = (variants?: string[] | null) => {
  const publicVariant = variants?.find((variant) => variant.includes('public'));
  return publicVariant;
};

export const convertImageToUploadFile = (image?: any) => {
  if (!image) {
    return undefined;
  }

  const publicVariant = getPublicVariant(image.variants);
  return {
    uid: String(image.id),
    name: image.filename,
    status: 'done',
    url: publicVariant,
    thumbUrl: publicVariant,
  };
};

export const getCustomCloudflareUrl = (
  url: string,
  options: IFlexibleImageVariantOptions,
) => {
  if (!url.startsWith('imagedelivery.net')) {
    return url;
  }

  const { width, height, blur } = options;
  const query = [];

  if (width) {
    query.push(`w=${width}`);
  }
  if (height) {
    query.push(`h=${height}`);
  }

  if (blur) {
    query.push(`blur=${blur}`);
  }
  return url + '/' + query.join(',');
};

export function resizeImage(file: File, maxWidth: number, maxHeight: number) {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      maxWidth,
      maxHeight,
      'JPEG',
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      'blob',
    );
  });
}

export const getAvatarUrl = (user: { firstName: string; lastName: string }) => {
  return 'https://robohash.org/' + user.firstName + user.lastName;
};
