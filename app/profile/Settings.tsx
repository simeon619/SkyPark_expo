import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, TouchableOpacity, useColorScheme, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { pickImage } from '../../Utilis/functions/media/media';
import { horizontalScale, moderateScale, shadow, verticalScale } from '../../Utilis/metrics';
import { TextExtraLight, TextLight, TextMedium } from '../../components/StyledText';
import { ScrollView, View } from '../../components/Themed';
import ImageProfile from '../../components/utilis/simpleComponent/ImageProfile';
import Colors from '../../constants/Colors';
import { LARGE_PIC_USER } from '../../constants/Value';
import { useAuthStore } from '../../managementState/server/auth';
import { usePatchUser } from '../../managementState/server/updateUser';
import ImageBanner from '../../components/utilis/simpleComponent/ImageBanner';
import BottomSheet, { BottomSheetTextInput } from '@gorhom/bottom-sheet';
const icon = {
	email: require('../../assets/images/email.png'),
	building: require('../../assets/images/building.svg'),
	location: require('../../assets/images/location.svg'),
	telephone: require('../../assets/images/telephone.png'),
} as const;

type EditType = 'email' | 'telephone' | 'location' | 'building' | 'name';
const Settings = () => {
	const { width, height } = useWindowDimensions();
	const colorScheme = useColorScheme();
	const [indexModal, setIndexModal] = useState(-1);
	const [textModal, setTextModal] = useState('');
	const [serviceModal, setServiceModal] = useState<EditType>('building');
	const [firstRender, setFirstRender] = useState(false);
	const { profile, account, address } = useAuthStore((state) => state);
	const { setUpdateInfo } = usePatchUser();

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
				<TextExtraLight numberOfLines={1} style={{ fontSize: moderateScale(16), color: 'black' }}>
					{value}
				</TextExtraLight>
				<Feather
					name="edit"
					size={24}
					color="black"
					onPress={() => {
						setFirstRender(() => true);
						setIndexModal(0);
						setTextModal(value);
						setServiceModal(service);
					}}
				/>
			</View>
		);
	};
	const Stiker = ({ key, value }: { key: string; value: string }) => {
		return (
			<View lightColor="#0000" darkColor="#0000" style={{ flex: 1, alignItems: 'center' }}>
				<View
					lightColor="#EDEDED"
					darkColor="#EDEDED"
					style={{
						position: 'absolute',
						bottom: -30,
						borderRadius: 99,
						borderColor: '#fff',
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
	const bottomSheetRef = useRef<BottomSheet>(null);

	// variables
	const snapPoints = useMemo(() => ['20%'], []);

	const handleSheetChanges = useCallback((index: number) => {
		if (index === -1) {
			setIndexModal(-1);
		}
	}, []);
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
			<StatusBar backgroundColor="#fff0" />
			<View
				lightColor="#EDEDED"
				darkColor="#EDEDED"
				style={{
					width,
					height: height * 0.4,
					borderBottomLeftRadius: moderateScale(40),
					borderBottomRightRadius: moderateScale(40),
					justifyContent: 'center',
					alignItems: 'center',
					gap: verticalScale(10),
				}}
			>
				<TouchableOpacity
					style={{
						position: 'absolute',
						top: 0,
						right: 0,
						left: 0,
						zIndex: 2,
						// paddingVertical: verticalScale(5),
						backgroundColor: '#EDEDED66',
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
					}}
					onPress={async () => {
						try {
							let images = await pickImage({ numberImages: 1 });
							let pre = images?.map((item) => {
								return item;
							});

							if (images && images.length !== 0 && profile?._id) {
								setUpdateInfo({ banner: pre });
							}
						} catch (error) {
							console.error(error);
						}
					}}
				>
					<View
						style={{
							position: 'absolute',
							top: 10,
							// right: 10,
							borderRadius: 99,
							padding: 10,
							left: 10,
							zIndex: 2,
							paddingVertical: verticalScale(5),
							backgroundColor: '#EDEDED66',
							flex: 1,
							justifyContent: 'center',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						<TextMedium>change la banniere</TextMedium>
						<MaterialIcons name="camera" size={24} color="black" />
					</View>
					<ImageBanner image={profile?.banner[0]?.url} sizeHeight={height * 0.16} />
				</TouchableOpacity>

				<TouchableOpacity
					style={{
						zIndex: 2,
						backgroundColor: '#EDEDED00',
						overflow: 'hidden',
					}}
					onPress={async () => {
						try {
							let images = await pickImage({ numberImages: 1 });
							let pre = images?.map((item) => {
								return item;
							});

							if (images && images.length !== 0 && profile?._id) {
								setUpdateInfo({ imgProfile: pre });
							}
						} catch (error) {
							console.error(error);
						}
					}}
				>
					<View
						style={{
							position: 'absolute',
							bottom: 0,
							right: 0,
							left: 0,
							zIndex: 2,
							backgroundColor: '#EDEDED00',
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
							overflow: 'hidden',
						}}
					>
						<MaterialIcons
							name="camera"
							size={24}
							color="black"
							style={{
								backgroundColor: '#EDEDED60',
								paddingHorizontal: 20,
								paddingVertical: 3,
								borderRadius: 25,
							}}
						/>
					</View>
					<ImageProfile image={profile?.imgProfile[0]?.url} size={LARGE_PIC_USER + 7} />
				</TouchableOpacity>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'baseline',
						justifyContent: 'space-between',
						backgroundColor: '#EDEDED00',
						rowGap: 5,
					}}
				>
					<TextLight
						style={{
							fontSize: moderateScale(20),
							color: Colors[colorScheme ?? 'light'].greyDark,
							paddingHorizontal: horizontalScale(10),
						}}
					>
						Salut {account?.name}
					</TextLight>
					<Feather
						name="edit"
						size={22}
						color="black"
						onPress={() => {
							setFirstRender(() => true);
							setIndexModal(0);
							setTextModal(account?.name as string);
							setServiceModal('name');
						}}
					/>
				</View>
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
				<Image
					source={require('../../assets/images/Vector2.svg')}
					style={{ width: 375, height: 272 }}
					contentFit="contain"
				/>
			</View>
			{firstRender && (
				<BottomSheet
					ref={bottomSheetRef}
					index={indexModal}
					snapPoints={snapPoints}
					enablePanDownToClose
					detached={true}
					bottomInset={height * 0.2}
					backdropComponent={() => (
						<>
							{indexModal !== -1 && (
								<View
									style={{
										backgroundColor: '#0009',
										top: 0,
										bottom: 0,
										left: 0,
										right: 0,
										position: 'absolute',
									}}
								/>
							)}
						</>
					)}
					onChange={handleSheetChanges}
					style={{
						marginHorizontal: 24,
					}}
				>
					<BottomSheetTextInput
						autoFocus={true}
						placeholder={'service'}
						value={textModal}
						onChangeText={(text) => setTextModal(text)}
						style={{
							borderWidth: 1,
							height: verticalScale(50),
							fontSize: moderateScale(16),
							width: '90%',
							borderColor: '#1111',
							paddingLeft: 10,
							borderRadius: 10,
							paddingVertical: 5,
							alignSelf: 'center',
						}}
					/>
					<TouchableOpacity
						style={{
							marginTop: 10,
							marginLeft: 20,
							backgroundColor: 'green',
							padding: 5,
							alignSelf: 'center',
							borderRadius: 99,
						}}
						onPress={() => {
							if (serviceModal === 'building') {
								setUpdateInfo({ city: textModal });
							}

							if (serviceModal === 'location') {
								setUpdateInfo({ etage: textModal });
							}

							if (serviceModal === 'email') {
								setUpdateInfo({ email: textModal });
							}

							if (serviceModal === 'telephone') {
								setUpdateInfo({ telephone: textModal });
							}

							if (serviceModal === 'name') {
								if (textModal.length > 2 && textModal.length < 20) {
									setUpdateInfo({ name: textModal });
								}
							}

							setFirstRender(() => false);
							setIndexModal(-1);
							bottomSheetRef.current?.close();
						}}
					>
						<Text style={{ color: 'white', fontSize: moderateScale(16) }}>Appliquer</Text>
					</TouchableOpacity>
				</BottomSheet>
			)}
		</SafeAreaView>
	);
};

export default Settings;
