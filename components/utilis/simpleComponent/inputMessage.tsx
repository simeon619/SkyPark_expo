import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import React, { useCallback, useEffect, useState } from 'react';
import { View as ViewNatif, useColorScheme } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { horizontalScale, moderateScale, verticalScale } from '../../../Utilis/metrics';
import Colors from '../../../constants/Colors';
import { useMessageStore } from '../../../managementState/server/Discussion';
import { TextLight } from '../../StyledText';
import { View } from '../../Themed';
import { InputTextMessage } from '../../register/input';

const InputMessage = ({ telegram }: { telegram: SharedValue<number> }) => {
  // let recording = new Audio.Recording();

  // const [text, setText] = useState('');
  const colorScheme = useColorScheme();
  const [duration, setDuration] = useState(0);

  const [recording, setRecording] = useState<Audio.Recording>();
  const [pathVoiceNote, setPathVoiceNote] = useState<string | null | undefined>('');
  const [recordStoped, setRecordStoped] = useState(false);
  const [heightInput, setHeightInput] = useState(40);

  const AnimatedViewInput = Animated.createAnimatedComponent(ViewNatif);
  const { sendMessage, focusedUser } = useMessageStore((state) => state);

  const { bottom } = useSafeAreaInsets();

  const viewInputStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: telegram.value }],
      backgroundColor: Colors[colorScheme ?? 'light'].background,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 7,
      marginBottom: bottom,
    }),
    [telegram.value]
  );

  useEffect(() => {
    return () => {
      async () => {
        await resetAudio();
      };
    };
  }, []);

  const sendAudio = useCallback(async (pathVoiceNote: string | null | undefined) => {
    if (pathVoiceNote) {
      // let base64 = await RNFS.readFile(uri, "base64");
      // const fileInfo = await FileSystem.getInfoAsync(pathVoiceNote, {
      //   size: true,
      // });
      const base64 = await FileSystem.readAsStringAsync(pathVoiceNote, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileName = pathVoiceNote.split('/').pop() || '';
      const ext = fileName?.split('.').pop();
      const fileType = `audio/${ext}`;

      await sendMessage({
        accountId: focusedUser?.account?._id,
        files: [{ buffer: base64, type: fileType, fileName, size: 10, encoding: 'base64' }],
      });
    }
    let status = await recording?.getStatusAsync();
    await resetAudio();
  }, []);

  const resetAudio = async () => {
    await recording?.stopAndUnloadAsync();
    // setRecording(undefined);
    await recording?._cleanupForUnloadedRecorder({
      canRecord: false,
      durationMillis: 0,
      isRecording: false,
      isDoneRecording: false,
    });
    setPathVoiceNote(null);
    setRecording(undefined);
    setDuration(0);
  };

  async function startRecording() {
    setRecording(undefined);
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRerecording = new Audio.Recording();
      setRecording(newRerecording);

      await newRerecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);

      await newRerecording.startAsync();

      newRerecording.setOnRecordingStatusUpdate((T) => {
        setDuration(T.durationMillis);
      });
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }
  const stopRecording = async () => {
    // await recording.pre
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    // await recording?._cleanupForUnloadedRecorder({
    //   canRecord: false,
    //   durationMillis: 5,
    //   isRecording: true,
    //   isDoneRecording: true,
    // });
    await recording?.stopAndUnloadAsync();

    // if (recording) {
    //   try {

    //     await recording._cleanupForUnloadedRecorder({
    //       canRecord: false,
    //       durationMillis: 5,
    //       isRecording: false,
    //       isDoneRecording: true,
    //     });
    //   } catch (error: any) {
    //     if (error.message.includes('Stop encountered an error: recording not stopped')) {
    //       await recording._cleanupForUnloadedRecorder({
    //         canRecord: false,
    //         durationMillis: 5,
    //         isRecording: false,
    //         isDoneRecording: true,
    //       });
    //     } else if (
    //       error.message.includes('Cannot unload a Recording that has already been unloaded.') ||
    //       error.message.includes('Error: Cannot unload a Recording that has not been prepared.')
    //     ) {
    //     } else {
    //       console.error(`recorderStop(): ${error}`);
    //     }
    //   }
    //   // await recording.de;
    // } else {
    // }
    const uri = recording?.getURI();
    setPathVoiceNote(uri);
  };

  function formatDuration(durationMillis: number) {
    const totalSeconds = Math.floor(durationMillis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return (
    <AnimatedViewInput style={viewInputStyle}>
      {!(duration > 0) && <InputTextMessage startRecording={startRecording} placeholder="Ecrivez votre message" />}
      {duration > 0 && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: horizontalScale(20),
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              (async () => {
                await resetAudio();
              })();
            }}
          >
            <TextLight>Annuler</TextLight>
          </TouchableWithoutFeedback>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: horizontalScale(5),
              backgroundColor: '#0003',
              paddingVertical: verticalScale(8),
              borderRadius: horizontalScale(90),
              flex: 1,
              marginHorizontal: horizontalScale(10),
              justifyContent: 'space-around',
            }}
          >
            <MaterialIcons
              name="fiber-manual-record"
              size={20}
              color={Math.floor(duration) % 2 === 0 ? '#f00' : '#f005'}
            />
            <TextLight>Enregistrement</TextLight>
            <TextLight style={{ paddingHorizontal: horizontalScale(5) }}>{formatDuration(duration)}</TextLight>
          </View>
          {Boolean(pathVoiceNote) ? (
            <Ionicons
              name="send"
              size={moderateScale(25)}
              color={Colors[colorScheme ?? 'light'].messageColourLight}
              onPress={() => {
                (async () => {
                  await sendAudio(pathVoiceNote);
                })();
              }}
            />
          ) : (
            <Ionicons
              name="stop"
              size={moderateScale(30)}
              color={Colors[colorScheme ?? 'light'].messageColourLight}
              onPress={() => {
                (async () => {
                  await stopRecording();
                })();
              }}
            />
          )}
        </View>
      )}
    </AnimatedViewInput>
  );
};

export default InputMessage;
