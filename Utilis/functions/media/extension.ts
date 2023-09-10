//write function who determine typefile with args extension and return type

export const getTypeFile = (extension: string | undefined) => {
  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'png':
      return 'image';
    case 'wav':
    case 'mp3':
    case 'm4a':
      return 'audio';
    case 'mp4':
      return 'video';
    default:
      return '';
  }
};
