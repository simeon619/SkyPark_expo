import { Image } from 'expo-image';
import { moderateScale } from '../../../Utilis/metrics';
import { HOST } from '../../../constants/Value';
import useToggleStore from '../../../managementState/client/preference';

const ImageProfile = ({ imgProfile, size }: { imgProfile: string | undefined; size: number }) => {
  const { primaryColourLight } = useToggleStore((state) => state);

  console.log({ imgProfile });

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
      source={!!imgProfile ? { uri: HOST + imgProfile } : require('../../../assets/icon/user.png')}
      contentFit="cover"
      transition={250}
    />
  );
};

export default ImageProfile;
