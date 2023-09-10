import { Ionicons } from '@expo/vector-icons';

import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { FlatList, Pressable, TouchableOpacity, useColorScheme, useWindowDimensions } from 'react-native';
import { AndroidSoftInputModes, KeyboardController, KeyboardGestureArea } from 'react-native-keyboard-controller';
import Animated, { FadeInDown, FadeInUp, FadeOutUp, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatMessageDate } from '../../Utilis/date';
import { useTelegramTransitions } from '../../Utilis/hooksKeyboard';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';

import { MessageWithFileAndStatus, getMessages } from '../../Utilis/models/Chat/messageReposotory';
import { UserSchema } from '../../Utilis/models/Chat/userRepository';
import ImageRatio from '../../components/ImgRatio';
import { TextRegular, TextRegularItalic } from '../../components/StyledText';
import { View } from '../../components/Themed';
import ImageProfile from '../../components/utilis/simpleComponent/ImageProfile';
import InputMessage from '../../components/utilis/simpleComponent/inputMessage';
import Colors from '../../constants/Colors';
import eventEmitter, { EventMessageType } from '../../managementState/event';
import { useAuthStore } from '../../managementState/server/auth';
import { NavigationStackProps } from '../../types/navigation';
import { useTempMsgStore } from '../../managementState/client/tempMessage';
import InstanceAudio from '../../components/InstanceAudio';
import { TouchableWithoutFeedback } from 'react-native';
import { getTypeFile } from '../../Utilis/functions/media/extension';

type Action = { type: 'addMessage' | 'updateMessage'; messages: MessageWithFileAndStatus[] };

const Discussion = ({ route, navigation }: NavigationStackProps) => {
  const colorSheme = useColorScheme();

  const user = route.params as any as { data: UserSchema };
  const discussions = user.data.ID_Conversation || '';
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const itemsPerPage = 10;
  const { width, height } = useWindowDimensions();

  const { messages, setMsg } = useTempMsgStore((state) => state);

  const scrollViewRef = useRef<FlatList<any>>(null);
  // const messagesArray = Object.values(messagesOfDisc);
  const messagesArray = useMemo(() => {
    if (messages && messages[discussions]) {
      return Object.values(messages[discussions]).sort((a, b) => {
        return b.Horodatage - a.Horodatage;
      });
    }
    return [];
  }, [messages]);

  useEffect(() => {
    fetchMessages();
  }, [pageNumber]);

  useEffect(() => {
    const handleMessageReceived = async () => {
      const messages = await getMessages(1, 1, user.data.ID_Conversation);
      if (messages && discussions) {
        setMsg({ [discussions]: messages });
      }
    };

    eventEmitter.on(EventMessageType.receiveMessage + user.data.ID_Conversation, handleMessageReceived);

    return () => {
      eventEmitter.removeListener(EventMessageType.receiveMessage + user.data.ID_Conversation, handleMessageReceived);
    };
  }, []);

  const fetchMessages = async () => {
    if (!hasMoreMessages) {
      return;
    }
    const newMessages = await getMessages(pageNumber, itemsPerPage, user.data.ID_Conversation);
    if (newMessages.length === 0) {
      setHasMoreMessages(false);
      return;
    }
    if (discussions && newMessages.length !== 0) {
      setMsg({ [discussions]: newMessages });
    }
  };
  const loadMoreMessages = () => {
    setPageNumber(pageNumber + 1);
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
  // useCallback(() => {
  //   scrollViewRef.current?.scrollToIndex({ index: 0, animated: true });
  // }, [messages]);

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
                  navigation.goBack();
                }}
              >
                <Ionicons name="arrow-back" size={28} color="black" style={{ paddingHorizontal: horizontalScale(7) }} />
              </TouchableOpacity>

              <ImageProfile size={moderateScale(50)} image={user.data.Url_Pic} />
              <View>
                <TextRegular style={{ fontSize: moderateScale(15) }} numberOfLines={1}>
                  {user.data.Nom_Utilisateur}
                </TextRegular>
                <TextRegular
                  numberOfLines={1}
                  style={{
                    color: Colors[colorSheme ?? 'light'].messageColourLight,
                  }}
                >
                  en ligne a {formatMessageDate(user.data.Last_Seen)}
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
                scrollEventThrottle={150}
                ListHeaderComponent={listerHeaderComponent}
                inverted={true}
                keyboardShouldPersistTaps="always"
                onEndReachedThreshold={0.9}
                onEndReached={loadMoreMessages}
                data={messagesArray}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ListFooterComponent={listFooterComponent}
              />

              {/* <FlatList data={[]} renderItem={renderItem} /> */}
            </View>
          </View>
        </Animated.View>
      </KeyboardGestureArea>
      <InputMessage telegram={telegram} accountId={user.data.ID_Utilisateur} />
    </View>
  );
};
const keyExtractor = (item: MessageWithFileAndStatus) => item.ID_Message;
const renderItem = ({ item }: { item: MessageWithFileAndStatus }) => {
  return <MessageItem item={item} />;
};

const listerHeaderComponent = () => {
  return <View style={{ height: verticalScale(10) }} />;
};

const listFooterComponent = () => {
  return <View style={{ height: verticalScale(150) }} />;
};

const MessageItem = ({ item }: { item: MessageWithFileAndStatus }) => {
  const { account } = useAuthStore((state) => state);

  let right = item?.ID_Expediteur !== account?._id;

  const whatIconStatus = ({
    send,
    received,
    seen,
  }: {
    send: number | null | undefined;
    received: number | null | undefined;
    seen: number | null | undefined;
  }) => {
    if (received && seen) {
      return <Ionicons name="checkmark-done-outline" size={16} color="blue" />;
    } else if (received) {
      return <Ionicons name="checkmark-done-outline" size={16} color="grey" />;
    } else if (send) {
      return <Ionicons name="checkmark-outline" size={16} color="grey" />;
    } else return <Ionicons name="remove-circle-outline" size={16} color="grey" />;
  };
  return (
    <Animated.View entering={FadeInUp}>
      <Pressable
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
          right
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
          {item?.Contenu_Message ? (
            <View
              style={[
                right
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
                  color: right ? '#fef' : '#000',
                  padding: moderateScale(7),
                }}
              >
                {item?.Contenu_Message}
              </TextRegular>
            </View>
          ) : (
            item?.files?.map((file, i) => {
              if (getTypeFile(file.extension) === 'image')
                return <ImageRatio uri={file.uri} url={file.url} key={i} ratio={2.5} />;
              if (getTypeFile(file.extension) === 'audio')
                return <InstanceAudio voiceUrl={file.url} voiceUri={file.uri} key={i} />;
            })
          )}
        </View>
        <TextRegularItalic
          style={{
            color: 'grey',
            textAlign: right ? 'right' : 'left',
            backgroundColor: '#0000',
            fontSize: moderateScale(12),
          }}
        >
          {whatIconStatus({
            received: item?.Date_Reçu,
            seen: item?.Date_Lu,
            send: item?.Date_Envoye,
          })}
          {formatMessageDate(item?.Horodatage || 0)}
        </TextRegularItalic>
      </Pressable>
    </Animated.View>
  );
};

export default Discussion;
