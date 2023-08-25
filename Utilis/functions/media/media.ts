import { PrepareImageType } from './../../../types/MediaType';
import * as ImagePicker from 'expo-image-picker';

/**
 * Picks a specified number of images from the image library and returns an array of prepared images.
 *
 * @param {Object} options - The options for picking the images.
 * @param {number} options.numberImages - The number of images to pick.
 * @return {Promise<Array<{ PrepareImage: PrepareImageType; uri: string }> | undefined>} - The array of prepared images or undefined if no images were selected.
 * @throws {Error} - If there is an error picking the images.
 */
export const pickImage = async ({
  numberImages,
}: {
  numberImages: number;
}): Promise<{ PrepareImage: PrepareImageType; uri: string }[] | undefined> => {
  let images = [];

  try {
    // if(ImagePicker.launchCameraAsync)
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      selectionLimit: numberImages,
      allowsMultipleSelection: true,
      // allowsEditing: true,
      // videoMaxDuration : 60 * 2, // 2 minutes
      quality: 1,
      base64: true,
      presentationStyle: ImagePicker.UIImagePickerPresentationStyle.OVER_FULL_SCREEN,
    });

    if (!result || result.canceled) {
      throw new Error('Image selection canceled.');
      //   return;
    }

    const { assets, canceled } = result;

    images = assets.map(({ base64, uri, type, fileSize }) => {
      const fileName = uri.split('/').pop();
      const ext = fileName?.split('.').pop();
      const fileType = type === 'image' ? `image/${ext}` : `video/${ext}`;

      return {
        PrepareImage: {
          buffer: base64 || '',
          encoding: 'base64' as const,
          fileName: fileName || 'NaN',
          size: fileSize || 10,
          type: fileType,
        },
        uri,
      };
    });
  } catch (error) {
    throw new Error(`Error picking image: ${error}`);
  }

  let filtImage = images.some((image) => {
    image.PrepareImage.buffer === '';
  });

  if (!filtImage) return images;

  return undefined;
};
