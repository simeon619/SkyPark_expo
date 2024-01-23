import {
	View,
	useColorScheme,
	ImageBackground,
	RefreshControl,
	FlatList,
	ActivityIndicator,
	Image,
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
import { LARGE_PIC_USER } from '../../constants/Value';
import { PostInterface } from '../../managementState/server/Descriptions';
import { PostType } from '../../types/PostType';
import PostText from '../../components/post/PostText';
import PostMedia from '../../components/post/PostMedia';
import PostSurvey from '../../components/post/PostSurvey';

const OtherProfile = ({ route }: { route: any }) => {
	const { user } = route.params as { user: AccountDBtype };
	const { primaryColour } = useToggleStore((state) => state);
	const { getList, hasMore, listForum, loading, page, clearList } = useListpostOtherAccount();

	const colorScheme = useColorScheme();

	useEffect(() => {
		fetchData(1);
		return () => {
			clearList();
		};
	}, []);

	const mapToArray = Array.from(listForum.values());

	const handleLoadMore = async () => {
		if (hasMore) {
			await fetchData(page);
		}
	};
	const fetchData = async (page: number) => {
		try {
			getList({ page, accountId: user._id });
		} catch (error) {
			console.error(error);
		} finally {
		}
	};
	const HeaderComponent = () => {
		return (
			<>
				<View style={{ flex: 1 }}>
					<View style={{ flex: 1, alignItems: 'center' }}>
						{/* <TextSemiBold style={{ textAlign: 'left' }}> Mes activites </TextSemiBold> */}
						<ImageBackground
							source={require('../../assets/images/profileBanner.jpg')}
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
								<ImageProfile size={LARGE_PIC_USER - 5} image={user.profile?.imgProfile[0]?.url} />
								<TextSemiBold>{user?.name} </TextSemiBold>
								<TextThinItalic>
									padiezd {user.address?.room} - Etage {user.address?.etage}{' '}
								</TextThinItalic>
							</View>
						</ImageBackground>
						<View style={{ height: verticalScale(90) }} />
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
								<TextMedium>recupecration des posts</TextMedium>
							) : (
								<Image
									source={require('../../assets/images/postNotFound.png')}
									style={{ width: '100%', height: verticalScale(300) }}
								/>
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
				refreshControl={<RefreshControl refreshing={loading} onRefresh={() => fetchData(1)} />}
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

export default OtherProfile;
const keyExtractor = (_item: ByAccountResult, index: number) => index.toString();
