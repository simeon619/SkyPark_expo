import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, useColorScheme, useWindowDimensions } from 'react-native';
import { AndroidSoftInputModes, KeyboardController } from 'react-native-keyboard-controller';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatMessageDate } from '../../Utilis/date';
import { useTelegramTransitions } from '../../Utilis/hooksKeyboard';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import { TextRegular, TextRegularItalic } from '../../components/StyledText';
import { View } from '../../components/Themed';
import InputMessage from '../../components/utilis/simpleComponent/inputMessage';
import Colors from '../../constants/Colors';
import { useMessageStore } from '../../managementState/server/Discussion';
import ImageProfile from '../../components/utilis/simpleComponent/ImageProfile';

const discussion = () => {
  const colorSheme = useColorScheme();
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(1);
  const { focusedUser, messages, fetcMessages, fetchDiscussion, currentDiscussion, DeleteCurentChannel } =
    useMessageStore((state) => state);

  useEffect(() => {
    if (!currentDiscussion) return;
    fetcMessages({ discussion: currentDiscussion, page: 1 });
  }, [currentDiscussion]);

  useEffect(() => {
    fetchDiscussion(focusedUser?.account?._id);

    return () => {
      DeleteCurentChannel();
    };
  }, []);

  // const loadMoreMessages = () => {

  // };

  const loadMoreMessages = useCallback(() => {
    console.log('MARDI ESTTTT  VZHDZVUZ', messages);

    if (currentDiscussion && messages?.hasNextPage && messages.nextPage) {
      fetcMessages({ discussion: currentDiscussion, page: messages.nextPage });
    }

    setPage((prev) => prev + 1);
  }, [page]);

  useEffect(() => {
    KeyboardController.setInputMode(AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE);
    return () => {
      KeyboardController.setDefaultMode();
    };
  }, []);

  const route = useRouter();
  const scrollViewRef = useRef<FlatList<any>>(null);
  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollToIndex({ index, animated: true });
  };
  useLayoutEffect(() => {
    scrollViewRef.current?.scrollToOffset({
      offset: -1,
      animated: true,
    });
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  // const messages = [
  //   {
  //     date: 1688202465,
  //     text: "Salut ! J'espère que ta journée se passe bien. As-tu des projets intéressants ?",
  //     owner: false,
  //     status: {
  //       send: 1688202465,
  //       received: 1688202466,
  //       seen: 1688202467,
  //     },
  //   },
  //   {
  //     date: 1688202468,
  //     text: 'Bonjour ! Comment ça va ?',
  //     owner: true,
  //     status: {
  //       send: 1688202468,
  //       received: 1688202469,
  //       seen: 1688202470,
  //     },
  //   },
  //   {
  //     date: 1688207428,
  //     text: 'Bonjour ! Comment ça va ?',
  //     owner: true,
  //     status: {
  //       send: 1688202468,
  //       received: 1688202469,
  //       seen: 1688202470,
  //     },
  //   },

  //   {
  //     date: 1688202471,
  //     text: "Hey, qu'est-ce que tu deviens ?",
  //     owner: false,
  //     status: {
  //       send: 1688202471,
  //       received: 1688202472,
  //       seen: 1688202473,
  //     },
  //   },
  //   {
  //     date: 1688292800,
  //     text: "Salutations ! Quels sont tes plans pour aujourd'hui ?",
  //     owner: true,
  //     status: {
  //       send: 1688202474,
  //       received: 1688202475,
  //       seen: 1688202476,
  //     },
  //   },
  //   {
  //     date: 1688202477,
  //     text: 'Coucou ! Tu es disponible pour une discussion ?',
  //     owner: false,
  //     status: {
  //       send: 1688202477,
  //       received: 1688202478,
  //       seen: 1688202479,
  //     },
  //   },
  //   {
  //     date: 1688202480,
  //     text: "Salut, j'espère que tu passes une excellente journée !",
  //     owner: true,
  //     status: {
  //       send: 1688202480,
  //       received: 1688202481,
  //       seen: 1688202482,
  //     },
  //   },
  // ];

  const { height: telegram } = useTelegramTransitions();

  // const fakeView = useAnimatedStyle(
  //   () => ({
  //     height: Math.abs(telegram.value),
  //   }),
  //   []
  // );
  const scrollViewStyle = useAnimatedStyle(
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
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', marginTop: top }}>
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
            <Ionicons name="ios-videocam" size={24} color="black" style={{ paddingHorizontal: horizontalScale(10) }} />
          </View>
        </View>
      </View>
      <Animated.View style={[flatListStyle, !currentDiscussion && { opacity: 0 }]}>
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
          {/* <Animated.View style={fakeView} /> */}
          <FlatList
            ref={scrollViewRef}
            ListHeaderComponent={() => <View style={{ height: verticalScale(50) }} />}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: [
                    {
                      rotateX: '180deg',
                    },
                  ],
                }}
              >
                <TextRegular
                  style={{
                    color: Colors[colorSheme ?? 'light'].messageColourLight,
                    fontSize: moderateScale(16),
                    backgroundColor: '#bfea',
                    borderRadius: 10,
                    padding: 5,
                  }}
                >
                  envoyez un message a {focusedUser?.account.name}
                </TextRegular>
              </View>
            )}
            inverted={true}
            keyboardShouldPersistTaps="always"
            onEndReachedThreshold={0.2}
            onEndReached={loadMoreMessages}
            automaticallyAdjustKeyboardInsets={true}
            showsVerticalScrollIndicator={false}
            data={messages?.items}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <MessageItem item={item} />}
            ListFooterComponent={() => <View style={{ height: verticalScale(100) }} />}
          />
        </View>
      </Animated.View>
      <InputMessage telegram={telegram} />
    </SafeAreaView>
  );
};

const MessageItem = memo(({ item }: { item: any }) => {
  console.log('🚀 ~ file: discussion.tsx:400 ~ MessageItem ~ item:', item);
  const owner = Math.random() >= 0.5;
  item = { ...item, owner };
  return (
    <View>
      <TouchableOpacity
        onPress={(e) => {}}
        onLongPress={() => {}}
        style={[
          {
            padding: moderateScale(5),
            margin: moderateScale(10),
            maxWidth: '80%',
            flexDirection: 'column',
            // gap: 4,
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
            <></>
            //   item?.files?.map((file :any, i :any) => {
            //     let type = "image";
            //     if (
            //       file.extension === "jpeg" ||
            //       file.extension === "jpg" ||
            //       file.extension === "png"
            //     ) {
            //       type = "image";
            //     } else if (
            //       file.extension === "m4a" ||
            //       file.extension === "mp3"
            //     ) {
            //       type = "audio";
            //     }
            //     if (type === "image")
            //       return (
            //         <View key={i}></View>
            //         // <ImageRatio uri={HOST + file.url} key={i} ratio={2} />
            //         // <Image
            //         //   key={file}
            //         //   contentFit="contain"
            //         //   source={{ uri: HOST + file }}
            //         //   style={{
            //         //     width: "100%",
            //         //     height: undefined,
            //         //     aspectRatio: 3 / 2,
            //         //   }}
            //         //   onLoad={handleImageLoad}
            //         // />
            //         // <ImageScall
            //         //   width={Dimensions.get("window").width} // height will be calculated automatically
            //         //   source={{ uri: HOST + file }}
            //         // />
            //       );
            //     if (type === "audio")
            //       return <InstanceAudio voiceUrl={file.url} key={i} />;
            //   })
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
      </TouchableOpacity>
    </View>
  );
});

export default React.memo(discussion);
