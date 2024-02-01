import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import React from 'react';
import {
	Pressable,
	TouchableOpacity,
	useColorScheme,
	useWindowDimensions,
	View,
} from 'react-native';
import Colors from '../../constants/Colors';
import { SMALL_PIC_USER } from '../../constants/Value';
import useToggleStore from '../../managementState/client/preference';
import { useAuthStore } from '../../managementState/server/auth';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import { TextThin } from '../StyledText';
import ImageProfile from './simpleComponent/ImageProfile';

const HeaderHome = () => {
	const { width } = useWindowDimensions();
	const colorScheme = useColorScheme();
	const { primaryColour } = useToggleStore((state) => state);

	const { profile } = useAuthStore((state) => state);
	const navigation = useNavigation();

	return (
		<>
			<View
				style={{
					width,
					backgroundColor: primaryColour,
					// backgroundColor: "blue",
					paddingHorizontal: horizontalScale(10),
					flexDirection: 'row',
					alignItems: 'center',
					paddingVertical: verticalScale(5),
				}}
			>
				<TouchableOpacity
					onPress={() => {
						//@ts-ignore
						navigation.navigate('Profile');
					}}
				>
					<Image
						source={require('../../assets/icon/menu.png')}
						style={{
							height: moderateScale(28),
							aspectRatio: 1,
							marginTop: 3,
							tintColor: Colors[colorScheme ?? 'light'].overLay,
							transform: [{ rotate: '180deg' }],
							// backgroundColor: "red",
						}}
					/>
				</TouchableOpacity>

				<Pressable
					onPress={() => {
						//@ts-ignore
						navigation.navigate('Search');
					}}
					style={{
						flex: 1,
						flexDirection: 'row',
						alignItems: 'center',
						height: moderateScale(28),
						borderBottomWidth: 1,
						gap: horizontalScale(10),
						marginHorizontal: horizontalScale(15),
						borderBottomColor: Colors[colorScheme ?? 'light'].overLay,
						backgroundColor: primaryColour,
						paddingHorizontal: horizontalScale(10),
						paddingVertical: verticalScale(5),
					}}
				>
					<Image
						source={require('../../assets/icon/search.png')}
						style={{
							width: moderateScale(22),
							aspectRatio: 1,
							tintColor: Colors[colorScheme ?? 'light'].overLay,
						}}
						transition={200}
					/>
					<TextThin
						style={{
							color: Colors[colorScheme ?? 'light'].overLay,
							fontSize: moderateScale(16),
						}}
					>
						Search
					</TextThin>
				</Pressable>
				<TouchableOpacity
					onPress={() => {
						//@ts-ignoree
						navigation.navigate('ProfileSettings');
					}}
				>
					<ImageProfile image={profile?.imgProfile[0]?.url} size={SMALL_PIC_USER + 2} />
				</TouchableOpacity>
			</View>
			{/* <ActionButtonForm /> */}
		</>
	);
};
export default HeaderHome;
