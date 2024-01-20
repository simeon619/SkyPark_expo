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
import { PostForumType } from '../../managementState/server/forum';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextLight, TextMedium } from '../../components/StyledText';
import { horizontalScale, moderateScale, shadow, verticalScale } from '../../Utilis/metrics';
import HeaderHome from '../../components/utilis/HeaderHome';
import { formatPostDate } from '../../Utilis/date';
import useToggleStore from '../../managementState/client/preference';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useFocusEffect } from '@react-navigation/native';
import { pickImage } from '../../Utilis/functions/media/media';
import { useCommentPostStore } from '../../managementState/server/post/commentStore';
import { PostInterface } from '../../managementState/server/Descriptions';
import { PostType } from '../../types/PostType';
import CommentText from '../../components/comment/CommentText';
import PostMedia from '../../components/post/PostMedia';
import PostSurvey from '../../components/post/PostSurvey';

const PageForum = ({ route }: any) => {
  const { forumData } = route.params as { forumData: PostForumType };
  const inputRef = useRef<TextInput>(null);
  const [text, setText] = useState('');
  const [isInputFocused, setInputFocused] = useState(false);
  const { setComment, loadingComment, getComments, commentList } = useCommentPostStore((state) => state);
  const [data, setData] = useState<PostInterface[]>([]);

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
  const { primaryColour } = useToggleStore((state) => state);

  async function handlePickImage() {
    let image = await pickImage({ numberImages: 1 });
    if (!image) return;
    image.map((item) => {
      item.uri;
    });
  }
  useEffect(() => {
    if (commentList?.[forumData._id]?.items) {
      setData(commentList?.[forumData._id]?.items || []);
    }
  }, [forumData._id, commentList?.[forumData._id]]);
  function handleComment(): void {
    setComment({ accountId: forumData.message.account._id, postId: forumData._id, type: '1', value: text });
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
        <TextMedium style={{ fontSize: 14, color: '#1119' }}>{forumData.message.text}</TextMedium>
        <View
          style={{
            alignItems: 'center',
            marginVertical: 7,
            padding: moderateScale(10),
            borderTopWidth: 3,
            // borderColor: '#1114',
            borderTopColor: primaryColour,
            borderRadius: 10,
            ...shadow(5),
            backgroundColor: 'white',
          }}
        >
          <TextLight style={{ fontSize: 14 }}>
            Ce sujet a {forumData.comments.length} commentaires et la dernier activite date de{' '}
            {
              //@ts-ignore
              formatPostDate(+forumData.__updatedAt)
            }
            cree par {forumData.message.account.name}
          </TextLight>
        </View>
      </>
    );
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* <Text>{JSON.stringify(forumData)}</Text> */}
      <HeaderHome />
      <TextMedium style={{ fontSize: 16, paddingHorizontal: horizontalScale(10) }}>{forumData.theme}</TextMedium>
      <View style={{ flex: 1, paddingHorizontal: horizontalScale(10) }}>
        <View style={{ flex: 1 }}>
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
        </View>

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
              borderBottomColor: isInputFocused ? primaryColour : Colors[colorScheme ?? 'light'].greyDark,
              borderBottomWidth: 1,
            }}
          >
            <Pressable onPress={handleFocus}>
              <TextLight style={{ fontSize: moderateScale(15), flex: 1, marginVertical: verticalScale(5) }}>
                {isInputFocused ? 'En reponse a' : 'Répondre a'}{' '}
                <TextLight style={{ color: primaryColour }}>@user1</TextLight>
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
      </View>
    </SafeAreaView>
  );
};
const keyExtractor = (item: PostInterface) => item._id;

export default PageForum;
