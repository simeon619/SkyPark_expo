import {
	View,
	useColorScheme,
	ImageBackground,
	RefreshControl,
	FlatList,
	ActivityIndicator,
	Image,
	TouchableOpacity,
} from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import useToggleStore from '../../managementState/client/preference';
import { StatusBar } from 'expo-status-bar';
import { horizontalScale, moderateScale, shadow, verticalScale } from '../../Utilis/metrics';
import { TextMedium, TextSemiBold, TextThinItalic } from '../../components/StyledText';
import {
	AccountDBtype,
	ByAccountResult,
	useListpostOtherAccount,
} from '../../managementState/server/byAccount';
import ImageProfile from '../../components/utilis/simpleComponent/ImageProfile';
import { HOST, LARGE_PIC_USER } from '../../constants/Value';
import { PostInterface } from '../../managementState/server/Descriptions';
import { PostType } from '../../types/PostType';
import PostText from '../../components/post/PostText';
import PostMedia from '../../components/post/PostMedia';
import PostSurvey from '../../components/post/PostSurvey';
import { useFindAccountByTag } from '../../managementState/server/FindThem';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { createDiscussion } from '../../managementState/server/Listuser';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../managementState/server/auth';

const ProfileByTag = ({ route }: { route: any }) => {
	const { primaryColour } = useToggleStore((state) => state);
	const colorScheme = useColorScheme();
	const { userTag } = route.params as { userTag: string };
	const { getAccount } = useFindAccountByTag();
	const [user, setUser] = React.useState<AccountDBtype | null>(null);
	const { getList, hasMore, listForum, loading, page } = useListpostOtherAccount();
	const navigationState = useNavigationState((state) => state);
	const navigation = useNavigation();
	const accountId = useAuthStore.getState().account?._id;

	useEffect(() => {
		const fetchDataUser = async () => {
			let user = await getAccount({ userTag });
			fetchData(1, user?._id);
			setUser(user);
		};
		fetchDataUser();
	}, [navigationState.key]);

	const handleLoadMore = async () => {
		if (hasMore) {
			await fetchData(page, user?._id);
		}
	};

	const fetchData = async (currentPage: number, accountId: string | undefined) => {
		if (!accountId) return;
		try {
			getList({ page: currentPage, accountId });
		} catch (error) {
			console.error(error);
		}
	};

	const mapToArray = Array.from(listForum.get(user?._id || '')?.values() || []);
	async function goToDiscussion() {
		let userInfo = await createDiscussion({
			account: { _id: user?._id!, name: user?.name! },
			profile: { imgProfile: user?.profile.imgProfile! },
		});
		if (!userInfo) return;

		//@ts-ignore
		navigation.navigate('Discussion', { data: userInfo });
	}
	const HeaderComponent = () => {
		return (
			<>
				<View style={{ flex: 1 }}>
					<View style={{ flex: 1, alignItems: 'center' }}>
						<ImageBackground
							source={
								!!user?.profile?.banner[0]?.url
									? { uri: HOST + user?.profile?.banner[0]?.url }
									: require('../../assets/images/profileBanner.jpg')
							}
							style={{
								height: verticalScale(200),
								width: '100%',
							}}
						>
							<View
								style={{
									width: moderateScale(100),
									aspectRatio: 1,
									position: 'absolute',
									transform: [{ rotate: '80deg' }],
									top: -60,
									left: 20,
									backgroundColor: '#FF6B8633',
									borderRadius: 100,
								}}
							/>
							<View
								style={{
									width: moderateScale(100),
									aspectRatio: 1,
									position: 'absolute',
									top: -30,
									left: -10,
									backgroundColor: '#B2E7DA33',
									borderRadius: 100,
								}}
							/>

							<View
								style={{
									width: horizontalScale(166),
									...shadow(10),
									position: 'absolute',
									height: verticalScale(107),
									bottom: -157 / 2.3,
									borderRadius: moderateScale(20),
									backgroundColor: 'white',
									left: horizontalScale(166) / 1.5,
									alignItems: 'center',
									zIndex: -10,
								}}
							/>
							<View
								style={{
									width: horizontalScale(194),
									...shadow(10),
									position: 'absolute',
									backgroundColor: 'white',
									height: verticalScale(157),
									paddingTop: verticalScale(13),
									bottom: -157 / 3,
									borderRadius: moderateScale(20),
									left: horizontalScale(194) / 2,
									alignItems: 'center',
									zIndex: 5,
								}}
							>
								<ImageProfile size={LARGE_PIC_USER - 5} image={user?.profile?.imgProfile[0]?.url} />
								<TextSemiBold>{user?.name} </TextSemiBold>
								<TextThinItalic>
									padiezd {user?.address?.room} - Etage {user?.address?.etage}{' '}
								</TextThinItalic>
							</View>
						</ImageBackground>
						<View style={{ height: verticalScale(90) }} />
						{user?._id !== accountId && (
							<TouchableOpacity
								onPress={() => {
									goToDiscussion();
								}}
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									backgroundColor: '#EDEDED',
									paddingHorizontal: horizontalScale(10),
									paddingVertical: verticalScale(5),
									borderRadius: 40,
									...shadow(10),
									marginBottom: 10,
								}}
							>
								<TextMedium style={{ color: 'black', marginRight: 5 }}>Discuter</TextMedium>
								<Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
							</TouchableOpacity>
						)}
					</View>
				</View>
			</>
		);
	};
	return (
		<SafeAreaView
			style={{
				flex: 1,
				backgroundColor: Colors[colorScheme ?? 'light'].background,
			}}
		>
			<StatusBar backgroundColor={primaryColour} style={'light'} />
			<FlatList
				data={mapToArray}
				keyExtractor={keyExtractor}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={() => {
					return (
						<>
							{loading ? (
								<View
									style={{
										flex: 1,
										justifyContent: 'center',
										alignItems: 'center',
										height: verticalScale(300),
									}}
								>
									<TextMedium>recuperation des post...</TextMedium>
								</View>
							) : (
								<View
									style={{
										flex: 1,
										justifyContent: 'center',
										alignItems: 'center',
										height: verticalScale(300),
									}}
								>
									<TextMedium style={{ fontSize: moderateScale(18) }}>
										Aucun post pour le moment 😴
									</TextMedium>
								</View>
							)}
						</>
					);
				}}
				ListFooterComponent={() =>
					loading ? (
						<View style={{ height: verticalScale(150) }}>
							<ActivityIndicator size={'large'} />
						</View>
					) : null
				}
				contentContainerStyle={{ paddingHorizontal: horizontalScale(3) }}
				ListHeaderComponent={HeaderComponent}
				refreshControl={
					<RefreshControl refreshing={loading} onRefresh={() => fetchData(1, user?._id)} />
				}
				onEndReached={() => handleLoadMore()}
				renderItem={(item) =>
					renderItem({
						item: {
							...item.item,
							message: item.item.message._id,
							__createdAt: item.item.message.__createdAt,
						},
					})
				}
			/>
		</SafeAreaView>
	);
};

const renderItem = ({ item }: { item: PostInterface }) => {
	switch (item.type) {
		case PostType.TEXT:
			return <PostText key={item._id} dataPost={item} />;
		case PostType.T_MEDIA:
			return <PostMedia key={item._id} dataPost={item} />;

		case PostType.SURVEY: {
			return <PostSurvey key={item._id} dataPost={item} />;
		}
		// case PostType.GROUP_JOIN:
		//   return <PostJoined dataPost={item} />;
		default:
			return (
				<TextMedium style={{ fontSize: moderateScale(25), textAlign: 'center' }}>
					pas encore gerer
				</TextMedium>
			);
	}
};

export default ProfileByTag;
const keyExtractor = (_item: ByAccountResult, index: number) => index.toString();
