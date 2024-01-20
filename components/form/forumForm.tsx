import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Animated, {
  BounceInDown,
  BounceOutDown,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import Colors from '../../constants/Colors';
import { FileType } from '../../lib/SQueryClient';
import useToggleStore, { useTypeForm } from '../../managementState/client/preference';
import { useAuthStore } from '../../managementState/server/auth';
import { useThreadPostStore } from '../../managementState/server/post/postThread';
import ImageRatio from '../ImgRatio';
import { TextLight, TextMedium, TextRegular } from '../StyledText';
import { ScrollView, View } from '../Themed';
import ImageProfile from '../utilis/simpleComponent/ImageProfile';
import { useListUserStore } from '../../managementState/server/Listuser';

const ForumForm = ({ text, setText }: { text: string; setText: React.Dispatch<React.SetStateAction<string>> }) => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  interface ImageItem {
    uri: string;
  }

  const [contenu, setContenu] = useState<string>('');
  const [images, setImages] = useState<ImageItem[]>();
  const [prepareImage, setPrepareImage] = useState<FileType[]>();
  const { primaryColour, primaryColourLight } = useToggleStore((state) => state);
  const { width, height } = useWindowDimensions();
  const [mention, setMention] = useState('');
  const [correspondance, setCorrespondance] = useState('');
  const refInput = React.useRef<TextInput>(null);
  const { IconName } = useTypeForm((state) => state);
  const { listAccount } = useListUserStore();
  const { publishPost } = useThreadPostStore((state) => state);

  const hideForm = useAnimatedStyle(() => {
    return {
      display: IconName == 'Annonce' ? 'flex' : 'none',
      opacity: withTiming(IconName == 'Annonce' ? 1 : 0),
    };
  }, [IconName]);

  const { account } = useAuthStore((state) => state);
  const size = useSharedValue(100);
  const [heightInput, setHeightInput] = useState(40);
  const replaceWord = () => {
    const regexDernierMotArobase = /@\w+\b/g;
    const motMatches = contenu.match(regexDernierMotArobase);
    console.log('🚀 ~ replaceWord ~ motMatches:', motMatches);
    if (motMatches && mention) {
      const lastWord = motMatches.pop()!;
      const newtext = contenu.replace(lastWord, mention);
      setContenu(newtext);
    }
  };

  const filteredAccount = useMemo(() => {
    if (!correspondance) {
      return listAccount;
    }
    return listAccount.filter((acc) => {
      return acc?.account.name.toLowerCase().includes(correspondance.substring(2, correspondance.length).toLowerCase());
    });
  }, [listAccount, correspondance]);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(size.value > 0 ? width * 0.6 : 0, { duration: 450, easing: Easing.inOut(Easing.ease) }), // size.value > 0 ? width * 0.6 : 0,
      height: size.value * filteredAccount.length,
      opacity: withTiming(size.value > 0 ? 1 : 0, { duration: 250, easing: Easing.inOut(Easing.ease) }), // size.value > 0 ? 1 : 0,
    };
  });
  useEffect(() => {
    if (!startAnimation && !contenu) {
      return;
    }
    const regex = /\s@[\w]*\S$/i;
    replaceWord();
    if (regex.test(contenu)) {
      let coresp = contenu.match(regex)!;
      setCorrespondance(coresp[0]);
      startAnimation(40);
    } else {
      startAnimation(0);
    }
  }, [contenu]);
  const startAnimation = (newSize: number) => {
    size.value = withTiming(newSize, { duration: 250, easing: Easing.inOut(Easing.ease) });
  };
  const onTextChange = (value: string) => {
    setContenu(() => {
      return value.startsWith('@') ? ' ' + value.trimStart() : value;
    });
  };
  const pickGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
        base64: true,
        selectionLimit: 4,
        allowsMultipleSelection: true,
      });

      if (result && !result?.canceled && result.assets) {
        setImages((prevImage) => {
          if (prevImage) {
            return [
              ...result.assets.map((asset) => ({
                uri: asset.uri,
              })),
              ...prevImage,
            ];
          }
          return result.assets.map((asset) => ({
            uri: asset.uri,
          }));
        });

        result.assets.forEach((asset) => {
          let base64 = asset.base64;
          let fileName = asset.uri?.split('/').pop();
          let ext = fileName?.split('.').pop();
          let type = asset.type === 'image' ? `image/${ext}` : `video/${ext}`;
          let uri: string = asset.uri;
          if (base64 && fileName) {
            const preparedImage: FileType = {
              buffer: base64,
              encoding: 'base64',
              fileName,
              size: 1500,
              type,
              uri,
            };
            setPrepareImage((prevPrepareImage) => {
              if (prevPrepareImage && prevPrepareImage.length > 1) {
                return [preparedImage, ...prevPrepareImage];
              }
              return [preparedImage];
            });
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  function deleteImage(uri: string) {
    setImages((prevImage) => {
      return prevImage?.filter((image) => image.uri !== uri);
    });
    setPrepareImage((prevPrepareImage) => {
      return prevPrepareImage?.filter((image) => image?.uri !== uri);
    });
  }
  const showToast = () => {
    ToastAndroid.show('Titre obligatoire', ToastAndroid.LONG);
  };

  async function handlePost() {
    if (!text) {
      showToast();
      return;
    }
    let type = prepareImage?.length === 0 ? '1' : '2';
    publishPost({ accountId: account?._id, type: type, files: prepareImage, value: contenu, theme: text }, 'Thread');
    setPrepareImage([]);
    setImages([]);
    setText('');
    navigation.goBack();
  }

  return (
    <>
      <Animated.View
        entering={BounceInDown}
        exiting={BounceOutDown}
        style={[
          {
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'space-between',
            // borderTopColor: "#0003",
            // borderTopWidth: 1,
            paddingVertical: moderateScale(10),

            backgroundColor: '#0000',
          },
          hideForm,
        ]}
      >
        <View
          style={{
            borderTopColor: '#0002',
            borderTopWidth: 1,
            borderBottomColor: '#0002',
            borderBottomWidth: 1,
            paddingVertical: verticalScale(10),
            marginHorizontal: horizontalScale(10),
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: Colors[colorScheme ?? 'light'].lightGrey,
              borderRadius: 20,
              paddingHorizontal: 10,
              alignSelf: 'flex-start',
            }}
            onPress={() => pickGallery()}
          >
            <TextLight
              style={{
                color: primaryColour,
                marginVertical: verticalScale(5),
              }}
            >
              Attach media
            </TextLight>
          </TouchableOpacity>
          <ScrollView
            contentContainerStyle={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 10,
            }}
            horizontal
            showsHorizontalScrollIndicator={true}
          >
            {images?.map((image, index) => {
              return (
                <Pressable
                  onPress={() => {
                    //@ts-ignore
                    navigation.navigate('ViewerImage', { uri: image.uri, caption: '' });
                  }}
                  key={index}
                  style={{
                    maxWidth: width / 2,
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                  }}
                >
                  <Pressable
                    onPress={() => {
                      deleteImage(image.uri);
                    }}
                    style={{
                      position: 'absolute',
                      top: 3,
                      zIndex: 8,
                      right: 3,
                      backgroundColor: '#000a',
                      borderRadius: 20,
                      padding: 2,
                      alignSelf: 'flex-start',
                    }}
                  >
                    <AntDesign name="close" size={20} color="white" />
                  </Pressable>
                  <ImageRatio ratio={5} uri={image.uri} />
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View
          style={{
            backgroundColor: 'white',
            paddingVertical: verticalScale(16),
            paddingHorizontal: horizontalScale(10),
          }}
        >
          <TextInput
            multiline={true}
            numberOfLines={2}
            onContentSizeChange={(e) => {
              setHeightInput(e.nativeEvent.contentSize.height);
            }}
            ref={refInput}
            value={contenu}
            onChangeText={onTextChange}
            textAlignVertical="bottom"
            placeholder={'contenu de votre sujet (facultatif)'}
            style={{
              fontSize: moderateScale(15),
              height: heightInput,
              maxHeight: height * 0.3,
              //   width: width * 0.7,
              fontFamily: 'Light',
              borderWidth: 1,
              borderColor: '#1113',
              paddingHorizontal: horizontalScale(20),
              paddingVertical: verticalScale(10),
              borderRadius: moderateScale(50),
            }}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            handlePost();
          }}
          style={{
            backgroundColor: primaryColourLight,
            paddingHorizontal: horizontalScale(10),
            paddingVertical: verticalScale(5),
            borderRadius: moderateScale(50),
            marginHorizontal: horizontalScale(10),
          }}
        >
          <TextRegular
            style={{
              color: Colors[colorScheme ?? 'light'].overLay,
              textAlign: 'center',
            }}
          >
            Valider
          </TextRegular>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ paddingVertical: verticalScale(10), marginHorizontal: horizontalScale(10) }}
          onPress={() => {}}
        >
          <TextRegular
            style={{
              color: primaryColour,
              paddingVertical: verticalScale(1),
              textAlign: 'center',
            }}
          >
            Annuler
          </TextRegular>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        style={[
          {
            position: 'absolute',
            zIndex: 99,
            top: Math.min(50 + heightInput, height * 0.3),
            left: 70,
            backgroundColor: '#fff9',
            borderWidth: 1,
            borderColor: primaryColourLight,
            borderRadius: 10,
            padding: 5,
          },
          animatedStyle,
        ]}
      >
        {filteredAccount?.map((acc, i) => {
          return (
            <TouchableOpacity
              key={i}
              onPress={() => setMention(`@${acc?.account.name}`)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingVertical: 3,
              }}
            >
              <ImageProfile size={0} image={undefined} />
              <ImageProfile size={25} image={acc?.profile.imgProfile[0]?.url} />
              <TextMedium
                style={{ fontSize: moderateScale(15), color: Colors[colorScheme ?? 'light'].text, paddingLeft: 5 }}
                key={i}
                numberOfLines={1}
              >
                {acc?.account.name}
              </TextMedium>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </>
  );
};

export default ForumForm;
