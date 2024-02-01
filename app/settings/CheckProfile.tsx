import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Text,
	TouchableOpacity,
	useColorScheme,
	useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getMyStringValue, setStringValue } from '../../Utilis/functions/localStorage';
import { horizontalScale, moderateScale, shadow, verticalScale } from '../../Utilis/metrics';
import { TextExtraLight, TextLight, TextRegular } from '../../components/StyledText';
import { ScrollView, View } from '../../components/Themed';
import ImageProfile from '../../components/utilis/simpleComponent/ImageProfile';
import Colors from '../../constants/Colors';
import { LARGE_PIC_USER } from '../../constants/Value';
import { useAuthStore } from '../../managementState/server/auth';
import { NavigationStackProps } from '../../types/navigation';
import { executeWithLimit } from '../../Utilis/functions/utlisSquery';
import { useListNotification } from '../../managementState/server/activityUser/notification';
const CheckProfile = ({ navigation }: NavigationStackProps) => {
	const { width, height } = useWindowDimensions();
	const getList = useListNotification((s) => s.getList);
	const colorScheme = useColorScheme();
	const [loading, setLoading] = useState(true);
	const setEvent = useAuthStore((state) => state.setEvent);
	const { profile, account, address } = useAuthStore((state) => state);

	useEffect(() => {
		const checkIsFirstTime = async () => {
			executeWithLimit(setEvent, 25 * 1000);
			executeWithLimit(getList, 25 * 1000);
			const value = await getMyStringValue(profile?._id);
			if (value) {
				navigation.replace('Bottomtabs');
			} else {
				await setStringValue(profile?._id, profile?._id || '88888');
				setLoading(false);
			}
		};

		checkIsFirstTime();
	}, []);
	const icon = {
		email: require('../../assets/images/email.png'),
		building: require('../../assets/images/building.svg'),
		location: require('../../assets/images/location.svg'),
		telephone: require('../../assets/images/telephone.png'),
	} as const;

	const infoProfile = ({ service, value }: { service: keyof typeof icon; value: string }) => {
		return (
			<View
				lightColor="#0000"
				darkColor="#0000"
				style={{
					flexDirection: 'row',
					alignSelf: 'flex-end',
					alignItems: 'center',
					gap: horizontalScale(15),
					marginVertical: verticalScale(15),
				}}
			>
				<Image source={icon[service]} style={{ width: horizontalScale(25), aspectRatio: 1 }} />
				<TextExtraLight numberOfLines={1} style={{ fontSize: moderateScale(16) }}>
					{value}
				</TextExtraLight>
				<Feather name="edit" size={24} color="black" />
			</View>
		);
	};
	const Stiker = ({ key, value }: { key: string; value: string }) => {
		return (
			<View lightColor="#0000" darkColor="#0000" style={{ flex: 1, alignItems: 'center' }}>
				<View
					lightColor="#EDEDED"
					darkColor="#0000"
					style={{
						position: 'absolute',
						bottom: -30,
						borderRadius: 99,
						borderColor: Colors[colorScheme ?? 'light'].background,
						borderWidth: 5,
						height: verticalScale(60),
						width: horizontalScale(60),
						justifyContent: 'center',
					}}
				>
					<Text
						style={{
							fontSize: moderateScale(20),
							fontWeight: '900',
							color: '#000',
							textAlign: 'center',
						}}
					>
						{value}
					</Text>
				</View>
				<View lightColor="#0000" darkColor="#0000" style={{ bottom: -55, flex: 1 }}>
					<TextLight
						style={{
							fontSize: moderateScale(17),
							color: Colors[colorScheme ?? 'light'].primaryColour,
							textShadowColor: 'rgba(0, 0, 0, 0.25)',
							textShadowOffset: { width: 0, height: 6 },
							textShadowRadius: 10,
							// letterSpacing: 2,
						}}
					>
						{key}
					</TextLight>
				</View>
			</View>
		);
	};

	function next(): void {
		navigation.replace('Bottomtabs');
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
			<StatusBar backgroundColor="#EDEDED" />
			{loading ? (
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].primaryColour} />
				</View>
			) : (
				<>
					<View
						lightColor="#EDEDED"
						style={{
							width,
							height: height * 0.35,
							borderBottomLeftRadius: moderateScale(40),
							borderBottomRightRadius: moderateScale(40),
							justifyContent: 'center',
							alignItems: 'center',
							gap: verticalScale(10),
						}}
					>
						<View
							style={{
								backgroundColor: '#0000',
							}}
							// onPress={async () => {
							// 	try {
							// 		let images = await pickImage({ numberImages: 1 });
							// 		let pre = images?.map((item) => {
							// 			return item;
							// 		});

							// 		if (images && images.length !== 0 && profile?._id) {
							// 			setProfile({ imgProfile: pre });
							// 		}
							// 	} catch (error) {
							// 		console.error(error);
							// 	}
							// }}
						>
							<ImageProfile image={profile?.imgProfile[0]?.url} size={LARGE_PIC_USER + 5} />
						</View>
						<TextLight
							style={{
								fontSize: moderateScale(20),
								color: Colors[colorScheme ?? 'light'].greyDark,
							}}
						>
							Bienvenue {account?.name}
						</TextLight>
						<TextLight
							style={{
								fontSize: moderateScale(17),
								backgroundColor: Colors[colorScheme ?? 'light'].primaryColourLight,
								...shadow(10),
								color: Colors[colorScheme ?? 'light'].primaryColour,
								paddingVertical: verticalScale(2),
								paddingHorizontal: horizontalScale(9),
								borderRadius: 40,
							}}
						>
							{account?.status}
						</TextLight>
						<View
							lightColor="#0000"
							darkColor="#0000"
							style={{
								position: 'absolute',
								zIndex: 80,
								bottom: 0,
								flexDirection: 'row',
								justifyContent: 'center',
							}}
						>
							{Stiker({ key: 'porte', value: String(address?.etage ?? '00') })}
							{Stiker({ key: 'building', value: String(address?.etage ?? '00') })}
							{Stiker({ key: 'padiezd', value: String(address?.room ?? '00') })}
						</View>
					</View>
					<ScrollView
						lightColor="#EDEDED"
						darkColor="#EDEDED"
						style={{
							height: height * 0.35,
							zIndex: -1,
							borderTopLeftRadius: moderateScale(40),
							borderTopRightRadius: moderateScale(40),
							marginTop: verticalScale(5),
							paddingTop: verticalScale(70),
							paddingHorizontal: horizontalScale(20),
							columnGap: verticalScale(10),
						}}
					>
						{infoProfile({ service: 'email', value: account?.email ?? '' })}
						{infoProfile({ service: 'telephone', value: account?.telephone ?? '' })}
						{infoProfile({ service: 'location', value: address?.city ?? '' })}
						{infoProfile({ service: 'building', value: address?.description ?? '' })}
					</ScrollView>
					<View
						lightColor="#0000"
						darkColor="#0000"
						style={{
							position: 'absolute',
							bottom: verticalScale(-90),
							justifyContent: 'flex-end',
						}}
					>
						<TouchableOpacity
							onPress={() => next()}
							style={{
								// alignSelf: 'center',
								backgroundColor: Colors[colorScheme ?? 'light'].primaryColour,
								paddingVertical: verticalScale(5),
								paddingHorizontal: horizontalScale(30),
								borderRadius: 20,
								marginTop: verticalScale(45),
								alignSelf: 'flex-end',
								zIndex: 99,
								position: 'absolute',
								top: verticalScale(45),
								right: horizontalScale(35),
								// ...style,
							}}
						>
							<TextRegular
								style={{
									fontSize: moderateScale(15),
									color: Colors[colorScheme ?? 'light'].overLay,
									textTransform: 'capitalize',
								}}
							>
								Continuer
							</TextRegular>
						</TouchableOpacity>
						<Image
							source={require('../../assets/images/Vector2.svg')}
							style={{ width: 375, height: 272 }}
							contentFit="contain"
						/>
					</View>
				</>
			)}
		</SafeAreaView>
	);
};

export default CheckProfile;
