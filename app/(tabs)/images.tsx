import { Image } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const divideImage = async (uri: string): Promise<string[]> => {
  // Fetch image dimensions
  const { width: originalWidth, height: originalHeight } = await new Promise<{ width: number; height: number }>((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      (error) => reject(error)
    );
  });
  console.log(originalHeight, originalWidth)
  const rows = 4; // Number of rows
  const cols = 5; // Number of columns
  const croppedImages: string[] = [];

  const pieceWidth = originalWidth * 2 / cols; // Width of each piece
  const pieceHeight = originalHeight * 2 / rows; // Height of each piece

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Calculate crop dimensions
      const cropData: ImageManipulator.ActionCrop = {
        originX: col * pieceWidth,
        originY: row * pieceHeight,
        width: pieceWidth,
        height: pieceHeight,
      };

      // Crop the image
      const croppedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ crop: cropData }], // Crop operation
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );

      croppedImages.push(croppedImage.uri); // Store the cropped image URI
    }
  }

  return croppedImages; // Array of cropped image URIs
};
export default divideImage;