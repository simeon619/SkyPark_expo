import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, TouchableOpacity, useColorScheme, useWindowDimensions } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Animated, { BounceInDown, BounceOutDown, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import Colors from '../../constants/Colors';
import useToggleStore, { useTypeForm } from '../../managementState/client/preference';
import ImageRatio from '../ImgRatio';
import { TextLight, TextRegular } from '../StyledText';
import { ScrollView, View } from '../Themed';
type imagePrepareShema =
  | {
      buffer: string;
      fileName: string;
      encoding: 'base64';
      type: string;
      size: number;
      uri: string;
    }
  | undefined;
const DefaultForm = () => {
  const colorScheme = useColorScheme();
  //   const isExpanded = useSharedValue(true);
  interface ImageItem {
    uri: string;
  }
  const [images, setImages] = useState<ImageItem[]>();
  const [prepareImage, setPrepareImage] = useState<imagePrepareShema[]>();
  const { primaryColour, primaryColourLight } = useToggleStore((state) => state);
  const { width } = useWindowDimensions();
  const { IconName } = useTypeForm((state) => state);
  const hideForm = useAnimatedStyle(() => {
    return {
      display: IconName !== 'Post' ? 'flex' : 'flex',
      opacity: withTiming(IconName !== 'Post' ? 1 : 1),
    };
  }, [IconName]);

  const data = [
    { label: 'Post---Neighborhodd', value: '2' },
    { label: 'Post---Building', value: '3' },
  ];
  const [value, setValue] = useState<string>();
  const [isFocus, setIsFocus] = useState(false);

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
          let uri = asset.uri;

          if (base64 && fileName) {
            const preparedImage: imagePrepareShema = {
              buffer: base64,
              encoding: 'base64',
              fileName,
              size: 1500,
              type,
              uri,
            };
            setPrepareImage((prevPrepareImage) => {
              if (prevPrepareImage) {
                return [preparedImage, ...prevPrepareImage];
              }
              return [preparedImage];
            });
          }
        });
      }
    } catch (error) {
      console.log(error);
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
  const router = useRouter();
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
                    router.push({ pathname: 'modal/ViewerImage', params: { uri: image.uri } });
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
          <Dropdown
            style={[
              {
                // height: 50,
                borderColor: primaryColourLight,
                borderWidth: 0.5,
                borderRadius: 20,
                paddingHorizontal: 8,
              },
              isFocus && { borderColor: primaryColourLight },
            ]}
            placeholderStyle={{
              fontSize: 16,
              fontFamily: 'Thin',
            }}
            selectedTextStyle={{
              fontSize: 16,
              fontFamily: 'Thin',
            }}
            iconStyle={{
              width: 20,
              height: 20,
            }}
            data={data}
            maxHeight={200}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'select Categorie' : '...'}
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setValue(item.value);
              setIsFocus(false);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={{
                  marginRight: 5,
                }}
                color={isFocus ? primaryColourLight : 'black'}
                name="Safety"
                size={20}
              />
            )}
          />
        </View>

        <TouchableOpacity
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
    </>
  );
};

export default DefaultForm;
