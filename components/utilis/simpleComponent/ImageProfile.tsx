import { Image } from 'expo-image';
import { moderateScale } from '../../../Utilis/metrics';
import { HOST } from '../../../constants/Value';
import useToggleStore from '../../../managementState/client/preference';
import { useEffect, useState } from 'react';

const ImageProfile = ({ size, image }: { size: number; image: string | undefined }) => {
	const { primaryColourLight } = useToggleStore((state) => state);

	const [url, setUrl] = useState<string>(HOST + image);

	useEffect(() => {
		setUrl(HOST + image);
	});

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
			source={!!image ? { uri: url } : require('../../../assets/icon/user.png')}
			contentFit="cover"
		/>
	);
};

export default ImageProfile;
