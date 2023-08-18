import React, { useEffect, useRef, useState } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import {
  AccountInterface,
  ProfileInterface,
  PostInterface,
  MessageInterface,
} from '../../managementState/server/Descriptions';
import PostHeader from '../../components/postDetail/PostHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextComponent from '../../components/postDetail/TextComponent';
import MediaComponent from '../../components/postDetail/MediaComponent';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import { ScrollView, Text } from '../../components/Themed';
import { BackHandler, Pressable, TextInput, View, useColorScheme, useWindowDimensions } from 'react-native';
import { TextBold, TextLight } from '../../components/StyledText';
import { Ionicons } from '@expo/vector-icons';

import useToggleStore from '../../managementState/client/preference';
import Colors from '../../constants/Colors';

type userSchema = {
  account: AccountInterface;
  profile: ProfileInterface;
};
const detailPost = () => {
  const params = useLocalSearchParams();
  const post = JSON.parse(params.dataPost as string) as PostInterface;
  const user = JSON.parse(params.infoUser as string) as userSchema;
  const message = JSON.parse(params.messageUser as string) as MessageInterface;
  const { height } = useWindowDimensions();

  const inputRef = useRef<TextInput>(null);
  const [isInputFocused, setInputFocused] = useState(false);
  const [comment, setComment] = useState('');

  const { primaryColour } = useToggleStore((state) => state);

  useEffect(() => {
    if (isInputFocused) {
      inputRef.current?.focus();
    }
  }, [isInputFocused]);
  const colorScheme = useColorScheme();
  const handleFocus = () => {
    setInputFocused(true);
  };

  const handleBlur = () => {
    setInputFocused(false);
  };

  useFocusEffect(() => {
    const backAction = () => {
      if (inputRef.current && inputRef.current.isFocused()) {
        inputRef.current.blur();
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  });

  function handlePickImage(): void {}

  return (
    <SafeAreaView style={{ paddingHorizontal: horizontalScale(10), backgroundColor: '#fff', flex: 1 }}>
      <PostHeader data={post} user={user} />
      <ScrollView keyboardShouldPersistTaps="always">
        <TextComponent data={post} message={message} user={user} />
        {post.type === '2' && <MediaComponent caption={message?.text} media={message?.files} />}
      </ScrollView>
      <View style={{ backgroundColor: '#fff' }}>
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
            <TextLight style={{ fontSize: moderateScale(15), marginLeft: horizontalScale(10), flex: 1 }}>
              {isInputFocused ? 'En reponse a' : 'Répondre a'}{' '}
              <TextLight style={{ color: primaryColour }}>@{user.account.name}</TextLight>
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
              value={comment}
              onChangeText={setComment}
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
            <Ionicons name="send" style={{}} size={24} color={Colors[colorScheme ?? 'light'].greyDark} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default detailPost;
