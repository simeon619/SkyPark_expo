import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, useColorScheme, useWindowDimensions } from 'react-native';
import { AndroidSoftInputModes, KeyboardController, KeyboardGestureArea } from 'react-native-keyboard-controller';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatMessageDate } from '../../Utilis/date';
import { useTelegramTransitions } from '../../Utilis/hooksKeyboard';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import { TextRegular, TextRegularItalic } from '../../components/StyledText';
import { View } from '../../components/Themed';
import InputMessage from '../../components/utilis/simpleComponent/inputMessage';
import Colors from '../../constants/Colors';
import { useMessageStore } from '../../managementState/server/Discussion';
import ImageProfile from '../../components/utilis/simpleComponent/ImageProfile';
import { MessageInterface } from '../../managementState/server/Descriptions';
import { ArrayData } from '../../lib/SQueryClient';
import ImageRatio from '../../components/ImgRatio';
import { HOST } from '../../constants/Value';
import InstanceAudio from '../../components/InstanceAudio';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

const discussion = () => {
  const colorSheme = useColorScheme();
  const { width, height } = useWindowDimensions();
  const route = useRouter();
  const scrollViewRef = useRef<FlatList<any>>(null);

  const [messagesOfDisc, setMessagesOfDisc] = useState<MessageInterface[]>([]);
  const [infoDiscussion, setInfoDiscussion] = useState<ArrayData<MessageInterface>>();

  const { currentDiscussion, fetchMessages, messages, focusedUser, fetchDiscussion, deleteCurrentChannel } =
    useMessageStore((state) => state);

  useEffect(() => {
    if (!currentDiscussion) return;

    const discussionId = currentDiscussion._id;
    const discussionMessages = messages[discussionId]?.[infoDiscussion?.page || 1];
    setInfoDiscussion(discussionMessages);

    if (discussionMessages) {
      updateMessagesAndInfoDiscussion(discussionId);
    }
  }, [messages]);

  async function updateMessagesAndInfoDiscussion(discussionId: string) {
    setMessagesOfDisc(() => {
      let updatedMessages = [];
      const page = infoDiscussion?.totalPages || 1;
      for (let i = 1; i <= page; i++) {
        const items = messages[discussionId][i]?.items || [];
        updatedMessages.push(...items);
      }
      return updatedMessages;
    });
  }

  useEffect(() => {
    if (currentDiscussion) {
      fetchMessages({ discussion: currentDiscussion, page: 1 });
    }
  }, [currentDiscussion]);

  useEffect(() => {
    fetchDiscussion(focusedUser?.account?._id);
    return () => {
      deleteCurrentChannel();
    };
  }, [focusedUser]);

  const loadMoreMessages = () => {
    if (!currentDiscussion || !infoDiscussion?.hasNextPage) return;

    const nextPage = infoDiscussion.nextPage || 1;
    fetchMessages({ discussion: currentDiscussion, page: nextPage });
  };

  useFocusEffect(
    useCallback(() => {
      KeyboardController.setInputMode(AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE);

      return () => KeyboardController.setDefaultMode();
    }, [])
  );

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollToIndex({ index, animated: true });
  };
  useCallback(() => {
    scrollViewRef.current?.scrollToIndex({ index: 0, animated: true });
  }, [messages]);

  const { height: telegram } = useTelegramTransitions();

  const flatListStyle = useAnimatedStyle(
    () => ({
      transform: [
        { translateY: telegram.value },
        ...[
          {
            rotate: '180deg',
          },
        ],
      ],
      flex: 1,
    }),
    []
  );
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: 'white', marginTop: top }}>
      <KeyboardGestureArea style={{ flex: 1 }} interpolator={'linear'} showOnSwipeUp={true}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: Colors[colorSheme ?? 'light'].background,
            borderBottomWidth: 0.2,
            borderBottomColor: Colors[colorSheme ?? 'light'].greyDark,
            position: 'absolute',

            zIndex: 85,
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
              paddingVertical: verticalScale(2),
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                columnGap: horizontalScale(10),
                flex: 1,
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  route.back();
                }}
              >
                <Ionicons name="arrow-back" size={28} color="black" style={{ paddingHorizontal: horizontalScale(7) }} />
              </TouchableOpacity>

              <ImageProfile size={moderateScale(50)} image={focusedUser?.profile.imgProfile[0]?.url} />
              <View>
                <TextRegular style={{ fontSize: moderateScale(15) }} numberOfLines={1}>
                  {focusedUser?.account.name}
                </TextRegular>
                <TextRegular
                  numberOfLines={1}
                  style={{
                    color: Colors[colorSheme ?? 'light'].messageColourLight,
                  }}
                >
                  En ligne
                </TextRegular>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                // columnGap: horizontalScale(1),
                alignItems: 'center',
              }}
            >
              <Ionicons name="ios-call" size={24} color="black" style={{ paddingHorizontal: horizontalScale(10) }} />
              <Ionicons
                name="ios-videocam"
                size={24}
                color="black"
                style={{ paddingHorizontal: horizontalScale(10) }}
              />
            </View>
          </View>
        </View>
        <Animated.View style={[flatListStyle]}>
          <View
            style={{
              transform: [
                {
                  rotate: '180deg',
                },
              ],
            }}
          >
            <View
              style={{
                height: verticalScale(80),
                width,
              }}
            />
            <View style={{ height, width }}>
              <FlatList
                ref={scrollViewRef}
                scrollEventThrottle={500}
                ListHeaderComponent={listerHeaderComponent}
                inverted={true}
                keyboardShouldPersistTaps="always"
                maxToRenderPerBatch={1}
                onEndReachedThreshold={0.7}
                onEndReached={loadMoreMessages}
                data={messagesOfDisc}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ListFooterComponent={listFooterComponent}
              />
            </View>
          </View>
        </Animated.View>
      </KeyboardGestureArea>
      <InputMessage telegram={telegram} />
    </View>
  );
};
const keyExtractor = (item: any) => item._id;
const renderItem = ({ item }: { item: any }) => {
  return <MessageItem item={item} />;
};

const listerHeaderComponent = () => {
  return <View style={{ height: verticalScale(10) }} />;
};

const listFooterComponent = () => {
  return <View style={{ height: verticalScale(150) }} />;
};

const MessageItem = memo(({ item }: { item: any }) => {
  const owner = Math.random() >= 0.5;
  item = { ...item, owner };

  console.log({ item });

  return (
    <TouchableWithoutFeedback
      // onPress={(e) => {}}
      onLongPress={() => {}}
      style={[
        {
          padding: moderateScale(5),
          margin: moderateScale(10),
          maxWidth: '80%',
          flexDirection: 'column',
          elevation: 99,
        },
        item?.owner
          ? {
              alignSelf: 'flex-end',
            }
          : {
              alignSelf: 'flex-start',
            },
      ]}
    >
      <View
        style={{
          flexDirection: 'column',
          // overflow: "hidden",
          backgroundColor: '#0000',
        }}
      >
        {item?.text ? (
          <View
            style={[
              item?.owner
                ? {
                    // borderTopLeftRadius: 10,
                    borderTopLeftRadius: moderateScale(25),
                    borderBottomLeftRadius: moderateScale(25),
                    borderBottomRightRadius: moderateScale(25),
                    backgroundColor: '#7285E5',
                  }
                : {
                    borderTopRightRadius: moderateScale(25),
                    backgroundColor: '#ECECEC',

                    borderBottomLeftRadius: moderateScale(25),
                    borderBottomRightRadius: moderateScale(25),
                  },
            ]}
          >
            <TextRegular
              style={{
                fontSize: moderateScale(15),
                color: item?.owner ? '#fef' : '#000',
                padding: moderateScale(7),
              }}
            >
              {item?.text}
            </TextRegular>
          </View>
        ) : (
          item?.files?.map((file: any, i: any) => {
            let type = 'image';
            if (file.extension === 'jpeg' || file.extension === 'jpg' || file.extension === 'png') {
              type = 'image';
            } else if (file.extension === 'm4a' || file.extension === 'mp3') {
              type = 'audio';
            }
            if (type === 'image') return <ImageRatio uri={HOST + file.url} key={i} ratio={2.5} />;
            if (type === 'audio') return <InstanceAudio voiceUrl={file.url} key={i} />;
          })
        )}
      </View>
      <TextRegularItalic
        style={{
          color: 'grey',
          textAlign: item?.owner ? 'right' : 'left',
          backgroundColor: '#0000',
          fontSize: moderateScale(12),
        }}
      >
        {formatMessageDate(item?.__createdAt)}
      </TextRegularItalic>
    </TouchableWithoutFeedback>
  );
});

export default React.memo(discussion);
