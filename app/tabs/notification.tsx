import { AntDesign } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	View as ViewNatif,
	useWindowDimensions,
	FlatList,
	TouchableOpacity,
} from 'react-native';
import { MagicModalPortal, NewConfigProps, magicModal } from 'react-native-magic-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { iconsDetailNotif } from '../../Utilis/data';
import { formatPostDate } from '../../Utilis/date';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import { TextLight, TextMedium } from '../../components/StyledText';
import { View } from '../../components/Themed';
import { useListNotification } from '../../managementState/server/activityUser/notification';
import { NotificationType } from '../../types/PostType';
import ImageProfile from '../../components/utilis/simpleComponent/ImageProfile';
import { useNavigation } from '@react-navigation/native';

const NotificationTabScreen = () => {
	const [blur, setBlur] = useState(0);
	const { getList, listNotification } = useListNotification();
	const navigation = useNavigation();
	useEffect(() => {
		getList();
	}, []);
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<BlurView style={[{ zIndex: blur }, StyleSheet.absoluteFill]} />
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					paddingVertical: verticalScale(10),
					paddingHorizontal: horizontalScale(10),
				}}
			>
				<View>
					<TextMedium style={{ fontSize: moderateScale(21) }}>Notifications</TextMedium>
				</View>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						columnGap: horizontalScale(16),
					}}
				>
					<TouchableOpacity
						onPress={() => {
							// magicModal.show(() => <SettingsNotif />, confModal);
						}}
					>
						<Image
							source={require('../../assets/icon/Settings.png')}
							style={{ width: moderateScale(22), aspectRatio: 1 }}
						/>
					</TouchableOpacity>
					<Image
						source={require('../../assets/icon/search.png')}
						style={{ width: moderateScale(22), aspectRatio: 1 }}
					/>
				</View>
			</View>
			<View style={{ paddingHorizontal: horizontalScale(10), flex: 1 }}>
				<FlatList
					data={listNotification}
					keyExtractor={(item) => item.id.toString()}
					renderItem={({ item }) => (
						<ItemNotification item={item} setBlur={setBlur} navigation={navigation} />
					)}
				/>
			</View>
			<MagicModalPortal />
		</SafeAreaView>
	);
};

const ItemNotification = ({
	item,
	setBlur,
	navigation,
}: {
	item: NotificationType;
	setBlur: any;
	navigation: any;
}) => {
	const { width } = useWindowDimensions();

	const setActionType = (
		action: string,
		stats: { like: number; share: number; comment: number }
	) => {
		if (action === 'like') {
			stats['like'];
			return `et ${stats['like']} voisins ont like ton post`;
		}
		if (action === 'shared') {
			return `et ${stats['share']} voisins ont partagé ton post`;
		}
		if (action === 'comment') {
			return `et ${stats['comment']} voisins ont commenté ton post`;
		}
		if (action === 'post') {
			return `a ajoutez une nouvelle photo`;
		}
		return 'a une interraction sur ton post';
	};
	const confModal: NewConfigProps = {
		useNativeDriver: true,
		animationIn: 'slideInUp',
		animationOut: 'slideOutDown',
		animationInTiming: 600,
		animationOutTiming: 600,
		backdropTransitionOutTiming: 500,
		backdropColor: 'black',
		backdropOpacity: 0,
		useNativeDriverForBackdrop: true,
		onModalHide() {
			setBlur(0);
		},
		onModalShow() {
			setBlur(1);
		},
	};

	const DetailNotif = ({ item }: { item: any }) => {
		return (
			<LinearGradient
				colors={['#FFA7A933', '#fefefe33']}
				locations={[0, 0.4]}
				style={{
					position: 'absolute',
					left: horizontalScale(1),
					zIndex: 99,
					right: horizontalScale(1),
					bottom: verticalScale(80),
					padding: moderateScale(10),
					borderRadius: 10,
				}}
			>
				<ViewNatif
					style={{
						alignItems: 'center',
						overflow: 'hidden',
					}}
				>
					<ViewNatif
						style={{
							width: '20%',
							alignItems: 'center',
							height: 3,
							borderRadius: 5,
							backgroundColor: 'grey',
							marginBottom: verticalScale(9),
						}}
					/>
					<Image
						source={{ uri: item.user.pic }}
						style={{
							width: moderateScale(70),
							aspectRatio: 1,
							borderRadius: moderateScale(500),
							paddingVertical: verticalScale(10),
						}}
					/>
					<ViewNatif style={{ paddingVertical: verticalScale(10) }}>
						<ViewNatif style={{ width: width * 0.7 }}>
							<TextLight style={{ textAlign: 'center', fontSize: moderateScale(15) }}>
								<TextMedium>{item.user.name}</TextMedium>{' '}
								<TextLight>{setActionType(item.action, item.statPostTrigger)}</TextLight>
							</TextLight>
						</ViewNatif>
					</ViewNatif>
					<ViewNatif
						style={{ width: '102%', alignItems: 'center', height: 1, backgroundColor: '#0002' }}
					/>
					<ViewNatif
						style={{
							flex: 1,
							rowGap: verticalScale(10),
							paddingLeft: horizontalScale(60),
							columnGap: horizontalScale(10),
							paddingVertical: verticalScale(10),
						}}
					>
						{iconsDetailNotif.map((item, key) => {
							return (
								<ViewNatif
									key={key}
									style={{
										width,
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'flex-start',
										paddingVertical: verticalScale(5),
										columnGap: horizontalScale(15),
									}}
								>
									<Image source={item.url} style={{ width: moderateScale(23), aspectRatio: 1 }} />
									<TextLight style={{ fontSize: moderateScale(16) }}>{item.name}</TextLight>
								</ViewNatif>
							);
						})}
					</ViewNatif>
				</ViewNatif>
			</LinearGradient>
		);
	};
	const dataPost = JSON.stringify({
		...item.post,
		message: item.messagePost,
	});
	const infoUser = JSON.stringify({
		account: {
			_id: item.accountPost._id,
			name: item.accountPost.name,
			profile: { ...item.profilePost },
			status: item.accountPost.status,
			telephone: item.accountPost.telephone,
			userTarg: item.accountPost.userTarg,
		},
		profile: {
			_id: item.profilePost._id,
			banner: item.profilePost.banner,
			imgProfile: item.profilePost.imgProfile,
		},
	});
	const messageUser = JSON.stringify({ ...item.messagePost });
	return (
		<View
			style={{
				flex: 1,
				flexDirection: 'row',
				alignItems: 'center',
				paddingVertical: verticalScale(10),
				justifyContent: 'space-between',
			}}
		>
			<TouchableOpacity
				onPress={() => {
					navigation.push(`DetailPost`, { dataPost, infoUser, messageUser, id: item.post._id });
				}}
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					columnGap: horizontalScale(10),
				}}
			>
				<ImageProfile image={item.user.pic} size={50} />
				<View>
					<View style={{ width: width * 0.7 }}>
						<TextLight>
							<TextMedium>{item.user.name}</TextMedium>{' '}
							<TextLight>{setActionType(item.action, item.statPostTrigger)}</TextLight>
						</TextLight>
					</View>
					<TextLight>
						{
							//@ts-ignore
							formatPostDate(item.createdAt)
						}
					</TextLight>
				</View>
			</TouchableOpacity>
			<TouchableOpacity
				style={{ flex: 1 }}
				onPress={() => {
					magicModal.show(() => <DetailNotif item={item} />, {
						...confModal,
					});
				}}
			>
				<AntDesign name="ellipsis1" size={24} color="black" />
			</TouchableOpacity>
		</View>
	);
};

export default NotificationTabScreen;
