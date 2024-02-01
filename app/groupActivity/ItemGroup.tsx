import { Image } from 'expo-image';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	View,
	useColorScheme,
	useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { horizontalScale, moderateScale, shadow, verticalScale } from '../../Utilis/metrics';
import { TextLight, TextMedium } from '../../components/StyledText';
import HeaderHome from '../../components/utilis/HeaderHome';
import Colors from '../../constants/Colors';
import { LARGE_PIC_USER, SMALL_PIC_USER } from '../../constants/Value';
import useToggleStore, { useBlurSurvey } from '../../managementState/client/preference';
import { ImageBackground } from 'react-native';
import { useListPostActivity } from '../../managementState/server/activityUser/groupActivity';
import AcitivityIndex from '../../components/post/AcitivityIndex';
import BottomSheet from '@gorhom/bottom-sheet';
import ActionButtonForm from '../../components/utilis/ActionButtonForm';
import ImageProfile from '../../components/utilis/simpleComponent/ImageProfile';
import InputWithTag from '../../components/InputWithTag';
import { useInputPost } from '../../managementState/client/postInput';
import { useAuthStore } from '../../managementState/server/auth';
import { BlurView } from 'expo-blur';
import DefaultFormActivity from '../../components/form/DefaultFormActivity';
import SurveyFormActivity from '../../components/form/SurveyFormActivity';

const ItemGroup = ({ route }: { route: any }) => {
	const item = route.params as any as { pic: string; banner: string; name: string; id: string };
	const { getList, listPostActivity, loading } = useListPostActivity();
	const colorScheme = useColorScheme();
	const { height } = useWindowDimensions();
	const { primaryColour } = useToggleStore((state) => state);
	const bottomSheetRef = useRef<BottomSheet>(null);
	const [firstRender, setFirstRender] = useState(false);
	const [indexModal, setIndexModal] = useState(-1);
	const { setText, text } = useInputPost();

	const profile = useAuthStore((state) => state.profile);
	// variables
	const snapPoints = useMemo(() => ['98%'], []);

	const handleSheetChanges = useCallback((index: number) => {
		if (index === -1) {
			setIndexModal(-1);
		}
	}, []);
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<HeaderHome />
			<View style={{ flex: 1, backgroundColor: '#0000' }}>
				<View style={{ width: '100%', height: height * 0.25 }}>
					<ImageBackground
						source={{ uri: item.banner }}
						style={{ width: '100%', height: height * 0.15 }}
					>
						<View
							style={{
								position: 'absolute',
								bottom: -(height * 0.09),
								borderRadius: moderateScale(20),
								...shadow(5),
								width: '90%',
								height: height * 0.15,
								alignSelf: 'center',
								backgroundColor: Colors[colorScheme ?? 'light'].grey,
							}}
						>
							<Image
								source={{ uri: item.pic }}
								style={{
									width: moderateScale(LARGE_PIC_USER - 10),
									aspectRatio: 1,
									position: 'absolute',
									zIndex: 100,
									alignSelf: 'center',
									top: -LARGE_PIC_USER / 2,
									borderRadius: 999,
								}}
							/>
							<TextMedium
								style={{
									fontSize: moderateScale(18),
									textAlign: 'center',
									paddingTop: verticalScale(LARGE_PIC_USER) * 0.5,
									marginBottom: verticalScale(7),
								}}
							>
								{item.name}
							</TextMedium>
							<TouchableOpacity>
								<TextLight
									style={{
										textAlign: 'center',
										backgroundColor: Colors[colorScheme ?? 'light'].grey,
										borderTopColor: '#0002',
										borderTopWidth: 1,
										fontSize: moderateScale(15),
										color: primaryColour,
									}}
								>
									Quitter le groupe
								</TextLight>
							</TouchableOpacity>
						</View>
					</ImageBackground>
					<TouchableOpacity
						onPress={() => {
							setFirstRender(() => true);
							setIndexModal(0);
						}}
						style={{ position: 'absolute', top: 10, right: 10, borderRadius: 90 }}
					>
						<TextMedium
							style={{
								textAlign: 'center',
								backgroundColor: '#fff',
								borderTopColor: '#0002',
								borderTopWidth: 1,
								fontSize: moderateScale(15),
								color: '#000',
								paddingHorizontal: 10,
								borderRadius: 90,
							}}
						>
							Postez
						</TextMedium>
					</TouchableOpacity>
				</View>
				<AcitivityIndex
					DATA={listPostActivity}
					loadindGetData={loading}
					loadData={getList}
					activityId={item.id}
				/>
			</View>
			{firstRender && (
				<BottomSheet
					ref={bottomSheetRef}
					index={indexModal}
					snapPoints={snapPoints}
					enablePanDownToClose
					detached={true}
					bottomInset={height * 0.05}
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
						marginHorizontal: 10,
					}}
				>
					<>
						<ActionButtonForm indexForumHide={1} />
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'flex-start',
								marginTop: 10,
							}}
						>
							<TouchableOpacity
								style={{
									alignSelf: 'center',
								}}
							>
								<ImageProfile image={profile?.imgProfile[0]?.url} size={SMALL_PIC_USER + 10} />
							</TouchableOpacity>
							<InputWithTag offset={65} sizeInputWidth={0.7} setText={setText} text={text} />
						</View>
						<DefaultFormActivity
							activityId={item.id}
							showModal={setIndexModal}
							modalRef={bottomSheetRef}
						/>
						<SurveyFormActivity
							activityId={item.id}
							showModal={setIndexModal}
							modalRef={bottomSheetRef}
						/>
					</>
				</BottomSheet>
			)}
		</SafeAreaView>
	);
};

export default ItemGroup;
