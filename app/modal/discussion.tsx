import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import React, { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  TextInput,
  TouchableOpacity,
  View as ViewNatif,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { AndroidSoftInputModes, KeyboardController } from 'react-native-keyboard-controller';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatMessageDate } from '../../Utilis/date';
import { useTelegramTransitions } from '../../Utilis/hooksKeyboard';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import { TextRegular, TextRegularItalic } from '../../components/StyledText';
import { View } from '../../components/Themed';
import Colors from '../../constants/Colors';
import { Message } from '../../types/messageType';

const TRESHOLD_SLIDE = 100;

const discussion = () => {
  const inputRef = useRef<TextInput>(null);
  const colorSheme = useColorScheme();
  const { width } = useWindowDimensions();
  const [text, setText] = useState('');
  useEffect(() => {
    KeyboardController.setInputMode(AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE);
    return () => {
      KeyboardController.setDefaultMode();
    };
  }, []);
  const [duration, setDuration] = useState(0);
  const [args, setArgs] = useState(0);
  const { control, getValues, handleSubmit } = useForm({ mode: 'onBlur' });

  const [pathVoiceNote, setPathVoiceNote] = useState<string | null | undefined>('');
  const route = useRouter();

  const params = useGlobalSearchParams();
  const [recording, setRecording] = useState<Audio.Recording>();

  const regex = new RegExp(/[^\s\r\n]/g);

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording, status } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      recording.setOnRecordingStatusUpdate((T) => {
        setDuration(T.durationMillis);
      });
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }
  useEffect(() => {
    if (args !== 0) {
      stopRecording();
    }
  }, [args]);

  const stopRecording = useCallback(async () => {
    const status = await recording?.getStatusAsync();
    console.log('Stopping recording..', status);

    if (recording && status?.isRecording) {
      try {
        await recording.stopAndUnloadAsync();
      } catch (error: any) {
        if (error.message.includes('Stop encountered an error: recording not stopped')) {
          await recording._cleanupForUnloadedRecorder({
            canRecord: false,
            durationMillis: 0,
            isRecording: false,
            isDoneRecording: false,
          });
          console.log(`recorderStop() error : ${error}`);
        } else if (
          error.message.includes('Cannot unload a Recording that has already been unloaded.') ||
          error.message.includes('Error: Cannot unload a Recording that has not been prepared.')
        ) {
          console.log(`recorderStop() error : ${error}`);
        } else {
          console.error(`recorderStop(): ${error}`);
        }
      }
      console.log('recorder stopped');
      // await recording.de;
    } else {
      console.log("🚀 ~ file: discussion.tsx:159 ~ stopRecording ~  '':", '');
    }

    setRecording(undefined);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    await recording?._cleanupForUnloadedRecorder({
      canRecord: false,
      durationMillis: 0,
      isRecording: false,
      isDoneRecording: false,
    });
    const uri = recording?.getURI();
    console.log('Recording stopped and stored at', uri);
    if (uri) sendAudio(uri);
  }, []);
  const sendAudio = useCallback(async (pathVoiceNote: string) => {
    if (pathVoiceNote) {
      let name = pathVoiceNote.split('/').pop();
      // let base64 = await RNFS.readFile(uri, "base64");
      const fileInfo: any = await FileSystem.getInfoAsync(pathVoiceNote, {
        size: true,
      });
      const base64 = await FileSystem.readAsStringAsync(pathVoiceNote, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setPathVoiceNote(null);
      console.log('audio send');
    }
    resetAudio();
  }, []);

  const chooseImage = useCallback(async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      base64: true,
      selectionLimit: 2,
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      let fileImages = result.assets
        .filter((f) => f.base64 !== null)
        .map((asset) => {
          // const fileInfo: any = await FileSystem.getInfoAsync(asset.uri, {
          //   size: true,
          // });
          let fileName = asset.uri?.split('/').pop();
          let ext = fileName?.split('.').pop();
          let type = asset.type === 'image' ? `image/${ext}` : 'video/' + ext;

          return {
            buffer: asset.base64,
            fileName,
            encoding: 'base64',
            type,
            size: 1500,
          };
        });
    } else {
      Alert.prompt('You did not select any image.');
    }
  }, []);

  const heightAnim = useSharedValue(0);
  const handleContentSizeChange = useCallback((event: any) => {
    const newHeight = Math.min(Math.max(event.nativeEvent.contentSize.height, 30), verticalScale(110));

    heightAnim.value = withTiming(newHeight, { duration: 0 });
  }, []);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: heightAnim.value,
      // maxHeight: verticalScale(),
    };
  });
  const scrollViewRef = useRef<FlashList<any>>(null);
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

  const x = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = x.value;
      ctx.uid = Math.floor(Math.random() * 150000) + 1;
    },
    onActive: (event, ctx) => {
      if (Math.abs(x.value) > TRESHOLD_SLIDE) {
        x.value = withSpring(0, { velocity: 0, stiffness: 300 });
      } else {
        const updatedValue = ctx.startX + event.translationX;
        if (Math.abs(updatedValue) > TRESHOLD_SLIDE) {
          // runOnJS(callMyFunction)(ctx.uid);
          runOnJS(setArgs)(ctx.uid);
          x.value = withSpring(0, { velocity: 0, stiffness: 300 });
        } else {
          x.value = withSpring(updatedValue, { velocity: 0, stiffness: 300 });
        }
      }
    },
    onEnd: (_) => {
      x.value = withSpring(0, { velocity: 0, stiffness: 300 });
    },
  });

  useEffect(() => {
    return () => {
      resetAudio();
    };
  }, []);
  const voiceNoteMoveX = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        },
      ],
    };
  }, []);

  const resetAudio = useCallback(async () => {
    if (recording && (await recording.getStatusAsync()).isRecording) {
      await recording.stopAndUnloadAsync();
      setRecording(undefined);
      await recording._cleanupForUnloadedRecorder({
        canRecord: false,
        durationMillis: 0,
        isRecording: false,
        isDoneRecording: false,
      });
      console.log('reset audio');
    }
    setPathVoiceNote(null);
    console.log('reset');
  }, []);

  function formatDuration(durationMillis: number) {
    const totalSeconds = Math.floor(durationMillis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // const insets = useSafeAreaInsets();
  const messages = [
    {
      date: 1688202465,
      text: "Salut ! J'espère que ta journée se passe bien. As-tu des projets intéressants ?",
      owner: false,
      status: {
        send: 1688202465,
        received: 1688202466,
        seen: 1688202467,
      },
    },
    {
      date: 1688202468,
      text: 'Bonjour ! Comment ça va ?',
      owner: true,
      status: {
        send: 1688202468,
        received: 1688202469,
        seen: 1688202470,
      },
    },
    {
      date: 1688207428,
      text: 'Bonjour ! Comment ça va ?',
      owner: true,
      status: {
        send: 1688202468,
        received: 1688202469,
        seen: 1688202470,
      },
    },

    {
      date: 1688202471,
      text: "Hey, qu'est-ce que tu deviens ?",
      owner: false,
      status: {
        send: 1688202471,
        received: 1688202472,
        seen: 1688202473,
      },
    },
    {
      date: 1688292800,
      text: "Salutations ! Quels sont tes plans pour aujourd'hui ?",
      owner: true,
      status: {
        send: 1688202474,
        received: 1688202475,
        seen: 1688202476,
      },
    },
    {
      date: 1688202477,
      text: 'Coucou ! Tu es disponible pour une discussion ?',
      owner: false,
      status: {
        send: 1688202477,
        received: 1688202478,
        seen: 1688202479,
      },
    },
    {
      date: 1688202480,
      text: "Salut, j'espère que tu passes une excellente journée !",
      owner: true,
      status: {
        send: 1688202480,
        received: 1688202481,
        seen: 1688202482,
      },
    },
  ];
  const AnimatedViewInput = Animated.createAnimatedComponent(ViewNatif);
  const { height: telegram } = useTelegramTransitions();
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
  const viewInputStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: telegram.value }],
      backgroundColor: Colors[colorSheme ?? 'light'].lightGrey,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
      marginHorizontal: 10,
      overflow: 'hidden',
      borderRadius: 84,
      paddingVertical: 7,
      marginBottom: 2,
    }),
    []
  );
  const fakeView = useAnimatedStyle(
    () => ({
      height: Math.abs(telegram.value),
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

            <Image
              source={require('../../assets/images/user2.png')}
              style={{
                width: moderateScale(45),
                aspectRatio: 1,
                borderRadius: 99,
                alignSelf: 'center',
              }}
            />
            <View>
              <TextRegular style={{ fontSize: moderateScale(15) }} numberOfLines={1}>
                Andy sandy
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

      <Animated.ScrollView showsVerticalScrollIndicator={false} style={scrollViewStyle}>
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
          <Animated.View style={fakeView} />
          {messages.map((message, index) => (
            <MessageItem key={index} item={message} />
          ))}
        </View>
      </Animated.ScrollView>

      <AnimatedViewInput style={viewInputStyle}>
        {duration > 0 && (
          <MaterialIcons
            name="fiber-manual-record"
            size={27}
            color={Math.floor(duration) % 2 === 0 ? '#f00' : '#f005'}
          />
        )}
        <Animated.View
          style={[
            animatedStyles,
            {
              alignSelf: 'center',
              alignItems: 'flex-start',
              flex: 10,
              height: 30,
            },
          ]}
        >
          {duration > 0 ? (
            <View
              style={{
                width: width - horizontalScale(140),
                flexDirection: 'row',
                alignItems: 'baseline',
                gap: horizontalScale(15),
              }}
            >
              <TextRegular
                style={{
                  fontSize: moderateScale(17),
                  color: Colors[colorSheme ?? 'light'].overLay,
                }}
              >
                {formatDuration(duration)}
              </TextRegular>
              <TextRegular
                style={{
                  fontSize: moderateScale(14),
                  color: Colors[colorSheme ?? 'light'].overLay,
                }}
              >
                Slide to send
              </TextRegular>
            </View>
          ) : (
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }: { field: any }) => (
                <TextInput
                  ref={inputRef}
                  placeholder={'Write something...'}
                  placeholderTextColor={Colors[colorSheme ?? 'light'].greyDark}
                  onChange={onChange}
                  value={value}
                  multiline={true}
                  scrollEnabled={true}
                  onContentSizeChange={handleContentSizeChange}
                  style={{
                    fontSize: moderateScale(17),
                    color: Colors[colorSheme ?? 'light'].text,
                    fontFamily: 'Thin',
                    marginHorizontal: horizontalScale(15),
                    width: '100%',
                    // height: "100%",
                  }}
                />
              )}
            />
          )}
        </Animated.View>
        <View
          style={{
            flexDirection: 'row',
            // flex: 1,
            backgroundColor: '#0000',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: horizontalScale(5),
          }}
        >
          {!(duration > 0) && (
            <TouchableOpacity
              onPress={() => {
                if (!text) {
                  chooseImage();
                }
              }}
              style={{}}
            >
              <Ionicons name="add-circle" size={28} color={Colors[colorSheme ?? 'light'].greyDark} />
            </TouchableOpacity>
          )}
          <View
            style={{
              backgroundColor: '#0000',
            }}
          >
            {text && regex.test(text) ? (
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  if (text && regex.test(text)) {
                    setText('');
                  }
                }}
              >
                <Ionicons name="send" size={27} color={Colors[colorSheme ?? 'light'].messageColourLight} />
              </TouchableOpacity>
            ) : (
              <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View
                  style={[
                    // { flex: 1 },
                    voiceNoteMoveX,
                    duration > 0 && {
                      position: 'absolute',
                      top: verticalScale(-70),
                      width: horizontalScale(90),
                      height: verticalScale(90),
                      backgroundColor: '#000',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 99,
                    },
                  ]}
                >
                  <TouchableOpacity
                    // delayPressOut={50}
                    style={[
                      {
                        justifyContent: 'center',
                        alignItems: 'center',
                        // flex: 1,
                      },
                    ]}
                    onLongPress={() => {
                      // canSend.value = true;
                      startRecording();
                    }}
                    onPress={() => {
                      resetAudio();
                    }}
                  >
                    <MaterialIcons
                      name={duration > 0 ? 'stop' : 'keyboard-voice'}
                      size={duration > 0 ? 47 : 27}
                      style={{ paddingHorizontal: horizontalScale(8) }}
                      color={duration > 0 ? 'red' : Colors[colorSheme ?? 'light'].messageColourLight}
                    />
                  </TouchableOpacity>
                </Animated.View>
              </PanGestureHandler>
            )}
          </View>
        </View>
      </AnimatedViewInput>
    </SafeAreaView>
  );
};
const MessageItem = memo(({ item }: { item: Message }) => {
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
          {formatMessageDate(item?.date)}
        </TextRegularItalic>
      </TouchableOpacity>
    </View>
  );
});
export default React.memo(discussion);
