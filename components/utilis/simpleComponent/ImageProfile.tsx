import { Image } from 'expo-image';
import { moderateScale } from '../../../Utilis/metrics';
import { HOST } from '../../../constants/Value';
import useToggleStore from '../../../managementState/client/preference';

const ImageProfile = ({ size, image }: { size: number; image: string | undefined }) => {
  const { primaryColourLight } = useToggleStore((state) => state);

  return (
    <Image
      style={{
        width: moderateScale(size),
        aspectRatio: 1,
        marginHorizontal: moderateScale(5),
        borderRadius: size / 2,
        borderColor: primaryColourLight,
        borderWidth: 2,
      }}
      source={!!image ? { uri: HOST + image } : require('../../../assets/icon/user.png')}
      cachePolicy={'none'}
      contentFit="cover"
      transition={250}
    />
  );
};

export default ImageProfile;
