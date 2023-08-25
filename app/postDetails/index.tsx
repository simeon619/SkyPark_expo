// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   AccountInterface,
//   ProfileInterface,
//   PostInterface,
//   MessageInterface,
// } from '../../managementState/server/Descriptions';

// import { SafeAreaView } from 'react-native-safe-area-context';
// import TextComponent from '../../components/postDetail/TextComponent';
// import MediaComponent from '../../components/postDetail/MediaComponent';
// import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
// import {
//   ActivityIndicator,
//   BackHandler,
//   FlatList,
//   Pressable,
//   RefreshControl,
//   TextInput,
//   View,
//   useColorScheme,
//   useWindowDimensions,
// } from 'react-native';
// import { TextLight, TextMedium } from '../../components/StyledText';
// import { Ionicons } from '@expo/vector-icons';

// import useToggleStore from '../../managementState/client/preference';
// import Colors from '../../constants/Colors';
// import { pickImage } from '../../Utilis/functions/media/media';
// import PostFooter from '../../components/post/PostFooter';
// import { useCommentPostStore } from '../../managementState/server/post/commentStore';
// import { useAuthStore } from '../../managementState/server/auth';
// import { PostType } from '../../types/PostType';
// import PostMedia from '../../components/post/PostMedia';
// import CommentText from '../../components/comment/CommentText';
// import PostHeader from '../../components/postDetail/PostHeader';
// import { NavigationProps } from '../../types/navigation';
// import { useFocusEffect } from '@react-navigation/native';

// type userSchema = {
//   account: AccountInterface;
//   profile: ProfileInterface;
// };

// const regex = new RegExp(/[^\s\r\n]/g);
// const Index = ({ navigation, route }: NavigationProps) => {
//   const params = route.params as any as { dataPost: string; infoUser: string; messageUser: string };

//   const post = JSON.parse(params.dataPost as string) as PostInterface;
//   const user = JSON.parse(params.infoUser as string) as userSchema;
//   const message = JSON.parse(params.messageUser as string) as MessageInterface;
//   const { height } = useWindowDimensions();

//   const { commentList, setCommentList, loadingComment, getComments } = useCommentPostStore((state) => state);
//   const { account } = useAuthStore((state) => state);

//   const inputRef = useRef<TextInput>(null);
//   const [isInputFocused, setInputFocused] = useState(false);
//   const [comment, setComment] = useState('');

//   const { primaryColour } = useToggleStore((state) => state);

//   useEffect(() => {
//     if (isInputFocused) {
//       inputRef.current?.focus();
//     }
//   }, [isInputFocused]);

//   useEffect(() => {
//     getComments(post._id);
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
//       getComments(post._id, commentList.nextPage || 1);
//     }
//   };

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
//           <MediaComponent caption={message?.text} media={message?.files} route={route} navigation={navigation} />
//         )}
//         <PostFooter stat={post.statPost} />
//       </>
//     );
//   }, []);
//   const renderItem = ({ item }: { item: PostInterface }) => {
//     switch (item.type) {
//       case PostType.TEXT:
//         return <CommentText dataPost={item} />;
//       case PostType.T_MEDIA:
//         return <PostMedia dataPost={item} />;
//       // case PostType.SURVEY:
//       //   return <PostSurvey dataPost={item} />;
//       // case PostType.GROUP_JOIN:
//       //   return <PostJoined dataPost={item} />;
//       default:
//         return <TextMedium style={{ fontSize: moderateScale(40) }}>pas encore gerer</TextMedium>;
//     }
//   };

//   return (
//     <SafeAreaView style={{ paddingHorizontal: horizontalScale(10), backgroundColor: '#fff', flex: 1 }}>
//       <PostHeader data={post} user={user} message={message} navigation={navigation} route={route} />
//       <FlatList
//         data={commentList?.items}
//         renderItem={renderItem}
//         keyExtractor={keyExtractor}
//         ListHeaderComponent={listHeaderComponent}
//         stickyHeaderHiddenOnScroll={true}
//         refreshControl={<RefreshControl refreshing={loadingComment} onRefresh={() => getComments(post._id)} />}
//         // scrollEventThrottle={20}
//         onEndReached={handleLoadMore}
//         // maxToRenderPerBatch={5}
//         // removeClippedSubviews={true}
//         onEndReachedThreshold={0.6}
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

// export default Index;
