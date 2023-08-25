// import {
//   View,
//   Text,
//   Pressable,
//   BackHandler,
//   useWindowDimensions,
//   ActivityIndicator,
//   useColorScheme,
// } from 'react-native';
// import React, { useCallback, useEffect, useRef, useState } from 'react';

// import { Ionicons } from '@expo/vector-icons';
// import Colors from '../../constants/Colors';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import PostHeader from '../../components/postDetail/PostHeader';
// import { FlatList, RefreshControl } from 'react-native-gesture-handler';
// import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
// import { TextLight, TextMedium } from '../../components/StyledText';
// import { TextInput } from 'react-native';
// import {
//   AccountInterface,
//   MessageInterface,
//   PostInterface,
//   ProfileInterface,
// } from '../../managementState/server/Descriptions';
// import TextComponent from '../../components/postDetail/TextComponent';
// import MediaComponent from '../../components/postDetail/MediaComponent';
// import PostFooter from '../../components/post/PostFooter';
// import { pickImage } from '../../Utilis/functions/media/media';
// import { useCommentPostStore } from '../../managementState/server/post/commentStore';
// import useToggleStore, { usePostInSchema } from '../../managementState/client/preference';
// import { useAuthStore } from '../../managementState/server/auth';
// import { PostType } from '../../types/PostType';
// import CommentText from '../../components/comment/CommentText';
// import PostMedia from '../../components/post/PostMedia';
// import { useFocusEffect } from '@react-navigation/native';
// import { id } from 'date-fns/locale';
// import { NavigationProps } from '../../types/navigation';
// // use zustand for prevent re-render

// type userSchema = {
//   account: AccountInterface;
//   profile: ProfileInterface;
// };
// const CommentPost = ({ navigation, route }: NavigationProps) => {
//   // const { id } = useLocalSearchParams<{ id: string }>();
//   const [comment, setComment] = useState('');

//   // const { checkPostIdIn, clearPostIdIn } = usePostInSchema((state) => state);

//   // useEffect(() => {
//   //   let back = checkPostIdIn(id);

//   //   if (back) {
//   //     route.back();
//   //   }
//   //   return () => {
//   //     clearPostIdIn();
//   //   };
//   // });

//   const params = route.params as any as { dataPost: string; infoUser: string; messageUser: string; id: string };
//   const { commentList, setCommentList, loadingComment, getComments } = useCommentPostStore((state) => state);
//   const { account } = useAuthStore((state) => state);
//   const id = params.id;
//   const post = JSON.parse(params.dataPost as string) as PostInterface;
//   const user = JSON.parse(params.infoUser as string) as userSchema;
//   const message = JSON.parse(params.messageUser as string) as MessageInterface;
//   const { height } = useWindowDimensions();

//   const inputRef = useRef<TextInput>(null);
//   const [isInputFocused, setInputFocused] = useState(false);

//   const { primaryColour } = useToggleStore((state) => state);

//   useEffect(() => {
//     if (isInputFocused) {
//       inputRef.current?.focus();
//     }
//   }, [isInputFocused]);

//   useEffect(() => {
//     getComments(id);
//   }, []);
//   const colorScheme = useColorScheme();
//   const handleFocus = () => {
//     setInputFocused(true);
//   };

//   const handleBlur = () => {
//     setInputFocused(false);
//   };

//   useFocusEffect(() => {
//     const backAction = () => {
//       if (inputRef.current && inputRef.current.isFocused()) {
//         inputRef.current.blur();
//         return true;
//       }
//       return false;
//     };
//     const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
//     return () => backHandler.remove();
//   });

//   async function handlePickImage() {
//     let image = await pickImage({ numberImages: 1 });
//     if (!image) return;
//     image.map((item) => {
//       item.uri;
//     });
//   }

//   function handleComment(): void {
//     setCommentList({ accountId: account?._id, postId: post._id, type: '1', value: comment });
//   }

//   const handleLoadMore = () => {
//     if (commentList?.hasNextPage) {
//       getComments(id, commentList.nextPage || 1);
//     }
//   };
//   useFocusEffect(() => {
//     const backAction = () => {
//       if (inputRef.current && inputRef.current.isFocused()) {
//         inputRef.current.blur();
//         return true;
//       }
//       return false;
//     };
//     const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
//     return () => backHandler.remove();
//   });

//   const ListFooterComponent = useCallback(() => {
//     return (
//       <>
//         <View style={{ height: height * 0.05 }} />
//         {loadingComment ? <ActivityIndicator size="large" /> : null}
//         <View style={{ height: height * 0.05 }} />
//       </>
//     );
//   }, []);

//   const listHeaderComponent = useCallback(() => {
//     return (
//       <>
//         <TextComponent message={message} />
//         {post.type === '2' && (
//           <MediaComponent caption={message?.text} media={message?.files} navigation={navigation} route={route} />
//         )}
//         <PostFooter stat={post.statPost} />
//       </>
//     );
//   }, []);

//   return (
//     <SafeAreaView style={{ paddingHorizontal: horizontalScale(10), backgroundColor: '#fff', flex: 1 }}>
//       <PostHeader data={post} user={user} message={message} navigation={navigation} route={route} />
//       <FlatList
//         data={commentList?.items}
//         renderItem={renderItem}
//         keyExtractor={keyExtractor}
//         ListHeaderComponent={listHeaderComponent}
//         showsVerticalScrollIndicator={false}
//         stickyHeaderHiddenOnScroll={true}
//         // refreshControl={<RefreshControl refreshing={loadingComment} onRefresh={() => getComments(post._id)} />}
//         // scrollEventThrottle={20}
//         // onEndReached={handleLoadMore}
//         // maxToRenderPerBatch={5}
//         // removeClippedSubviews={true}
//         // onEndReachedThreshold={0.6}
//         ListFooterComponent={ListFooterComponent}
//       />
//       <View style={{ backgroundColor: '#fff', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             marginBottom: verticalScale(5),
//             borderBottomColor: isInputFocused ? primaryColour : Colors[colorScheme ?? 'light'].greyDark,
//             borderBottomWidth: 1,
//           }}
//         >
//           <Pressable onPress={handleFocus}>
//             <TextLight style={{ fontSize: moderateScale(15), marginLeft: horizontalScale(10), flex: 1 }}>
//               {isInputFocused ? 'En reponse a' : 'Répondre a'}{' '}
//               <TextLight style={{ color: primaryColour }}>@{user.account.name}</TextLight>
//             </TextLight>
//           </Pressable>
//           <Ionicons
//             name="camera-outline"
//             style={{}}
//             size={moderateScale(28)}
//             color={primaryColour}
//             onPress={handlePickImage}
//           />
//         </View>

//         {isInputFocused && (
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'center',
//               alignItems: 'center',
//               marginBottom: verticalScale(5),
//             }}
//           >
//             <TextInput
//               ref={inputRef}
//               multiline={true}
//               onFocus={handleFocus}
//               value={comment}
//               onChangeText={setComment}
//               onBlur={handleBlur}
//               style={{
//                 fontSize: moderateScale(15),
//                 maxHeight: height * 0.1,
//                 fontFamily: 'Light',
//                 flex: 1,
//                 paddingHorizontal: horizontalScale(10),
//                 paddingVertical: verticalScale(5),
//                 borderBottomColor: '#0002',
//               }}
//               placeholder="Votre commentaire ici"
//             />
//             <Ionicons
//               name="send"
//               onPress={handleComment}
//               style={{}}
//               size={24}
//               color={!!comment ? primaryColour : Colors[colorScheme ?? 'light'].greyDark}
//             />
//           </View>
//         )}
//       </View>
//       {/* </ScrollView> */}
//     </SafeAreaView>
//   );
// };
// const keyExtractor = (item: PostInterface, index: number) => index.toString();

// const renderItem = ({ item }: { item: PostInterface }) => {
//   switch (item.type) {
//     case PostType.TEXT:
//       return <CommentText dataPost={item} />;
//     case PostType.T_MEDIA:
//       return <PostMedia dataPost={item} />;
//     // case PostType.SURVEY:
//     //   return <PostSurvey dataPost={item} />;
//     // case PostType.GROUP_JOIN:
//     //   return <PostJoined dataPost={item} />;
//     default:
//       return <TextMedium style={{ fontSize: moderateScale(40) }}>pas encore gerer</TextMedium>;
//   }
// };

// export default CommentPost;
