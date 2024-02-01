import {
	View,
	Text,
	TextInput,
	Pressable,
	BackHandler,
	useWindowDimensions,
	useColorScheme,
	FlatList,
	RefreshControl,
	ActivityIndicator,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { PostForumType } from '../../managementState/server/forum';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextLight, TextMedium } from '../../components/StyledText';
import { horizontalScale, moderateScale, shadow, verticalScale } from '../../Utilis/metrics';
import HeaderHome from '../../components/utilis/HeaderHome';
import { formatPostDate } from '../../Utilis/date';
import useToggleStore from '../../managementState/client/preference';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useFocusEffect, useNavigationState } from '@react-navigation/native';
import { pickImage } from '../../Utilis/functions/media/media';
import { useCommentPostStore } from '../../managementState/server/post/commentStore';
import { PostInterface } from '../../managementState/server/Descriptions';
import { PostType } from '../../types/PostType';
import CommentText from '../../components/comment/CommentText';
import PostMedia from '../../components/post/PostMedia';
import PostSurvey from '../../components/post/PostSurvey';
import Animated, {
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import MediaComponent from '../../components/utilis/MediaComponent';
import { ByAccountResult } from '../../managementState/server/byAccount';
import PostFooter from '../../components/post/PostFooter';

const PageForum = ({ route }: any) => {
	const { forumData } = route.params as { forumData: ByAccountResult };
	const inputRef = useRef<TextInput>(null);
	const navigationState = useNavigationState((state) => state);
	const [text, setText] = useState('');
	const [isInputFocused, setInputFocused] = useState(false);
	const { setComment, loadingComment, getComments, commentList } = useCommentPostStore(
		(state) => state
	);
	const [data, setData] = useState<PostInterface[]>([]);
	const { primaryColour } = useToggleStore((state) => state);

	const handleFocus = () => {
		setInputFocused(true);
	};

	const handleBlur = () => {
		setInputFocused(false);
	};
	const { height } = useWindowDimensions();
	const colorScheme = useColorScheme();
	useFocusEffect(() => {
		const backAction = () => {
			if (inputRef.current && inputRef.current.isFocused()) {
				inputRef.current.blur();
				return true;
			}
			return false;
		};
		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
		return () => {
			backHandler.remove();
		};
	});

	async function handlePickImage() {
		let image = await pickImage({ numberImages: 1 });
		if (!image) return;
		image.map((item) => {
			item.uri;
		});
	}
	useEffect(() => {
		getData(1);
	}, [navigationState.index]);
	useEffect(() => {
		if (commentList?.[forumData._id]?.items) {
			setData(commentList?.[forumData._id]?.items || []);
		}
	}, [forumData._id, commentList?.[forumData._id]]);
	function handleComment(): void {
		setComment({
			accountId: forumData.message.account._id,
			postId: forumData._id,
			type: '1',
			value: text,
		});
		getData(1);
		setText('');
		setInputFocused(false);
	}
	const getData = async (nbrPage: number) => {
		await getComments(forumData._id, nbrPage);
		// setCommentList((prev) => {
		//   return mergeArrayData(prev, data);
		// });
	};
	const handleLoadMore = () => {
		if (!!commentList && commentList[forumData._id]?.nextPage) {
			getData(commentList[forumData._id]?.nextPage || 1);
		}
	};
	const ListFooterComponent = useCallback(() => {
		return (
			<>
				<View style={{ height: height * 0.05 }} />
				{loadingComment ? <ActivityIndicator size="large" /> : null}
				<View style={{ height: height * 0.05 }} />
			</>
		);
	}, []);
	const renderItem = ({ item }: { item: PostInterface }) => {
		switch (item.type) {
			case PostType.TEXT:
				return <CommentText dataPost={item} postParent={forumData.message.account.name} />;
			case PostType.T_MEDIA:
				return <PostMedia dataPost={item} />;
			case PostType.SURVEY:
				return <PostSurvey dataPost={item} />;
			// case PostType.GROUP_JOIN:
			//   return <PostJoined dataPost={item} />;
			default:
				return <TextMedium style={{ fontSize: moderateScale(40) }}>pas encore gerer</TextMedium>;
		}
	};
	const listHeaderComponent = useCallback(() => {
		return (
			<>
				<TextMedium
					style={{
						fontSize: 14,
						color: '#1119',
						marginHorizontal: moderateScale(7),
						marginBottom: moderateScale(7),
					}}
				>
					{forumData.message.text}
				</TextMedium>
				<MediaComponent caption={forumData.message.text} media={forumData.message.files} />
				<PostFooter
					//@ts-ignore
					data={forumData}
					user={{
						account: {
							...forumData.message.account,
							profile: forumData.message.account.profile._id,
						},
						profile: forumData.message.account.profile,
					}}
					message={{ ...forumData.message, account: forumData.message.account._id }}
				/>
				<Animated.View
					style={{
						alignItems: 'center',
						margin: moderateScale(7),
						padding: moderateScale(7),
						borderTopWidth: 3,
						// borderColor: '#1114',
						borderTopColor: primaryColour,
						borderRadius: 10,
						...shadow(5),
						backgroundColor: 'white',
						marginBottom: moderateScale(7),
					}}
				>
					<TextLight style={{ fontSize: 14 }}>
						Ce sujet a {forumData.statPost.comments} commentaires cree par{' '}
						{forumData.message.account.name} il y a{' '}
						{
							//@ts-ignore
							formatPostDate(+forumData.message.__createdAt)
						}
					</TextLight>
				</Animated.View>
			</>
		);
	}, []);
	const lastContentOffset = useSharedValue(0);
	const numberLines = useSharedValue<number>(1);
	const [heightTheme, setHeightTheme] = useState(0);
	const isScrolling = useSharedValue(false);
	const estimatedHeight = useSharedValue(0);
	const translateY = useSharedValue(0);
	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			if (lastContentOffset.value > event.contentOffset.y && isScrolling.value) {
				translateY.value = 1;
				numberLines.value = 0;
			} else if (lastContentOffset.value < event.contentOffset.y && isScrolling.value) {
				translateY.value = -estimatedHeight;
				numberLines.value = 1;
			}
			lastContentOffset.value = event.contentOffset.y;
		},
		onBeginDrag: (e) => {
			isScrolling.value = true;
		},
		onEndDrag: (e) => {
			isScrolling.value = false;
		},
	});
	const hideText = useAnimatedStyle(() => {
		return {
			// transform: [{ translateY: withTiming(translateY.value, { duration: 500 }) }],
			top: withTiming(-translateY.value, { duration: 500 }),
		};
	}, [translateY.value]);

	const offsetContent = useAnimatedStyle(() => {
		return {
			top: withTiming(-translateY.value, { duration: 500 }),
		};
	}, [translateY.value]);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			{/* <Text>{JSON.stringify(forumData)}</Text> */}
			<HeaderHome />
			<Animated.View
				onLayout={(e) => {
					estimatedHeight.value = e.nativeEvent.layout.height;
					setHeightTheme(e.nativeEvent.layout.height);
				}}
				style={[
					{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
						marginHorizontal: moderateScale(25),
						paddingHorizontal: moderateScale(10),
						backgroundColor: 'white',
						borderBottomColor: primaryColour,
						borderBottomWidth: 3,
					},
					hideText,
				]}
			>
				<MaterialIcons name="post-add" size={24} color="black" />
				<Text
					numberOfLines={1}
					style={{ fontSize: 16, paddingVertical: 5, paddingHorizontal: moderateScale(10) }}
				>
					{forumData.theme}
				</Text>
			</Animated.View>
			<Animated.View
				style={{
					flex: 1,
					paddingHorizontal: horizontalScale(10),
				}}
			>
				<Animated.FlatList
					data={data}
					renderItem={renderItem}
					keyExtractor={keyExtractor}
					onScroll={scrollHandler}
					ListHeaderComponent={listHeaderComponent}
					ListFooterComponentStyle={{ backgroundColor: 'white', marginTop: verticalScale(100) }}
					stickyHeaderHiddenOnScroll={true}
					refreshControl={
						<RefreshControl
							colors={[primaryColour]}
							progressBackgroundColor={'#444'}
							refreshing={loadingComment}
							onRefresh={() => getData(1)}
						/>
					}
					scrollEventThrottle={20}
					onEndReached={handleLoadMore}
					onEndReachedThreshold={0.6}
					ListFooterComponent={ListFooterComponent}
				/>
			</Animated.View>
			<View
				style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					zIndex: 10,
					backgroundColor: Colors[colorScheme ?? 'light'].background,
					paddingHorizontal: horizontalScale(10),
					...shadow(10),
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: verticalScale(5),
						borderBottomColor: isInputFocused
							? primaryColour
							: Colors[colorScheme ?? 'light'].greyDark,
						borderBottomWidth: 1,
					}}
				>
					<Pressable onPress={handleFocus}>
						<TextLight
							style={{ fontSize: moderateScale(15), flex: 1, marginVertical: verticalScale(5) }}
						>
							{isInputFocused ? 'En reponse a' : 'Répondre a'}{' '}
							<TextLight style={{ color: primaryColour }}>
								@{forumData.message.account.name}
							</TextLight>
						</TextLight>
					</Pressable>
					<Ionicons
						name="camera-outline"
						style={{}}
						size={moderateScale(28)}
						color={primaryColour}
						onPress={handlePickImage}
					/>
				</View>

				{isInputFocused && (
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							marginBottom: verticalScale(5),
						}}
					>
						<TextInput
							ref={inputRef}
							multiline={true}
							onFocus={handleFocus}
							value={text}
							onChangeText={setText}
							onBlur={handleBlur}
							style={{
								fontSize: moderateScale(15),
								maxHeight: height * 0.1,
								fontFamily: 'Light',
								flex: 1,
								paddingHorizontal: horizontalScale(10),
								paddingVertical: verticalScale(5),
								borderBottomColor: '#0002',
							}}
							placeholder="Votre commentaire ici"
						/>
						<Ionicons
							name="send"
							onPress={handleComment}
							style={{}}
							size={24}
							color={!!text ? primaryColour : Colors[colorScheme ?? 'light'].greyDark}
						/>
					</View>
				)}
			</View>
		</SafeAreaView>
	);
};
const keyExtractor = (item: PostInterface) => item._id;

export default PageForum;
