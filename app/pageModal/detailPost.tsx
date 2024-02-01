import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigationState } from '@react-navigation/native';
import {
	ActivityIndicator,
	BackHandler,
	FlatList,
	Pressable,
	RefreshControl,
	TextInput,
	TouchableOpacity,
	View,
	useColorScheme,
	useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { pickImage } from '../../Utilis/functions/media/media';
import { horizontalScale, moderateScale, shadow, verticalScale } from '../../Utilis/metrics';
import { TextLight, TextMedium } from '../../components/StyledText';
import CommentText from '../../components/comment/CommentText';
import PostFooter from '../../components/post/PostFooter';
import PostMedia from '../../components/post/PostMedia';
import PostSurvey from '../../components/post/PostSurvey';
import MediaComponent from '../../components/postDetail/MediaComponent';
import PostHeader from '../../components/postDetail/PostHeader';
import TextComponent from '../../components/postDetail/TextComponent';
import SurveyComponent from '../../components/utilis/SurveyComponent';
import Colors from '../../constants/Colors';
import useToggleStore from '../../managementState/client/preference';
import {
	AccountInterface,
	MessageInterface,
	PostInterface,
	ProfileInterface,
} from '../../managementState/server/Descriptions';
import { useAuthStore } from '../../managementState/server/auth';
import { useCommentPostStore } from '../../managementState/server/post/commentStore';
import { useSurveyStore } from '../../managementState/server/post/surveyStore';
import { PostType } from '../../types/PostType';
import { NavigationStackProps } from '../../types/navigation';

type userSchema = {
	account: AccountInterface;
	profile: ProfileInterface;
};

// const regex = new RegExp(/[^\s\r\n]/g);
const DetailPost = ({ navigation, route }: NavigationStackProps) => {
	const params = route.params as any as {
		dataPost: string;
		infoUser: string;
		messageUser: string;
		id: string;
		commentable: boolean;
	};
	const post = JSON.parse(params.dataPost as string) as PostInterface;
	const user = JSON.parse(params.infoUser as string) as userSchema;
	const message = JSON.parse(params.messageUser as string) as MessageInterface;
	const id = params.id;
	const commentable = params.commentable;
	console.log({ post, user, message, id, commentable });

	const inputRef = useRef<TextInput>(null);
	const navigationState = useNavigationState((state) => state);

	const { setComment, loadingComment, getComments, commentList } = useCommentPostStore(
		(state) => state
	);
	const { account } = useAuthStore((state) => state);
	const { primaryColour } = useToggleStore((state) => state);
	const { listSurvey } = useSurveyStore((state) => state);

	const [data, setData] = useState<PostInterface[]>([]);

	const [isInputFocused, setInputFocused] = useState(Boolean(commentable));
	const [text, setText] = useState('');

	const { height } = useWindowDimensions();
	const colorScheme = useColorScheme();

	useEffect(() => {
		if (isInputFocused) {
			inputRef.current?.focus();
		}
	}, [isInputFocused]);

	useEffect(() => {
		getData(1);
	}, [navigationState.index]);

	useEffect(() => {
		if (commentList?.[id]?.items) {
			setData(commentList?.[id]?.items || []);
		}
	}, [id, commentList?.[id]]);

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

	const getData = async (nbrPage: number) => {
		await getComments(id, nbrPage);
		// setCommentList((prev) => {
		//   return mergeArrayData(prev, data);
		// });
	};

	const handleFocus = () => {
		setInputFocused(true);
	};

	const handleBlur = () => {
		setInputFocused(false);
	};

	async function handlePickImage() {
		let image = await pickImage({ numberImages: 1 });
		if (!image) return;
		image.map((item) => {
			item.uri;
		});
	}

	function handleComment(): void {
		setComment({ accountId: account?._id, postId: id, type: '1', value: text });
		getData(1);
		setText('');
		setInputFocused(false);
	}

	const handleLoadMore = () => {
		if (!!commentList && commentList[id]?.nextPage) {
			getData(commentList[id]?.nextPage || 1);
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

	const listHeaderComponent = useCallback(() => {
		return (
			<>
				<PostHeader data={post} user={user} message={message} />
				{post.type !== '3' && <TextComponent message={message} />}
				{post.type === '2' && <MediaComponent caption={message?.text} media={message?.files} />}
				<SurveyComponent dataSurvey={listSurvey.get(id)} question={message?.text} postId={id} />
				<PostFooter data={post} user={user} message={message} />
			</>
		);
	}, []);
	const renderItem = ({ item }: { item: PostInterface }) => {
		switch (item.type) {
			case PostType.TEXT:
				return <CommentText dataPost={item} postParent={user.account.name} />;
			case PostType.T_MEDIA:
				return <PostMedia dataPost={item} />;
			case PostType.SURVEY:
				return <PostSurvey dataPost={item} />;
			default:
				return <></>;
		}
	};

	return (
		<SafeAreaView
			style={{
				paddingHorizontal: horizontalScale(10),
				backgroundColor: Colors[colorScheme ?? 'light'].background,
				flex: 1,
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					paddingVertical: verticalScale(5),
					borderBottomColor: '#ccc5',
					borderBottomWidth: 1,
					columnGap: horizontalScale(10),
				}}
			>
				<TouchableOpacity
					style={{ marginLeft: horizontalScale(1) }}
					onPress={() => navigation.goBack()}
				>
					<Ionicons name="arrow-back" size={24} color={Colors[colorScheme ?? 'light'].greyDark} />
				</TouchableOpacity>
				<TextLight style={{ fontSize: moderateScale(20), textAlign: 'center' }}>
					Commentaires
				</TextLight>
			</View>
			<FlatList
				data={data}
				renderItem={renderItem}
				keyExtractor={keyExtractor}
				ListHeaderComponent={listHeaderComponent}
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
			<View
				style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
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
							<TextLight style={{ color: primaryColour }}>@{user?.account?.name}</TextLight>
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

export default DetailPost;
