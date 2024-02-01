import { ImageBackground } from 'expo-image';
import { moderateScale } from '../../../Utilis/metrics';
import { HOST } from '../../../constants/Value';
import { useEffect, useState } from 'react';

const ImageBanner = ({ sizeHeight, image }: { sizeHeight: number; image: string | undefined }) => {
	const [url, setUrl] = useState<string>(HOST + image);

	useEffect(() => {
		setUrl(HOST + image);
	});

	return (
		<ImageBackground
			style={{
				width: '100%',
				height: moderateScale(sizeHeight),
				marginHorizontal: moderateScale(5),
				borderRadius: sizeHeight / 2,
			}}
			source={!!image ? { uri: url } : require('../../../assets/images/profileBanner.jpg')}
			// source={require('../../../assets/images/profileBanner.jpg')}
		/>
	);
};

export default ImageBanner;
