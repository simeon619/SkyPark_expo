import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
	Pressable,
	ToastAndroid,
	TouchableOpacity,
	useColorScheme,
	useWindowDimensions,
} from 'react-native';

import Animated, {
	BounceInDown,
	BounceOutDown,
	useAnimatedStyle,
	withTiming,
} from 'react-native-reanimated';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import Colors from '../../constants/Colors';
import { FileType } from '../../lib/SQueryClient';
import useToggleStore, { useTypeForm } from '../../managementState/client/preference';
import { useAuthStore } from '../../managementState/server/auth';
import { useThreadPostStore } from '../../managementState/server/post/postThread';
import ImageRatio from '../ImgRatio';
import { TextLight, TextRegular } from '../StyledText';
import { ScrollView, View } from '../Themed';
import InputWithTag from '../InputWithTag';

const ForumForm = ({
	text,
	setText,
}: {
	text: string;
	setText: React.Dispatch<React.SetStateAction<string>>;
}) => {
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
	const { IconName } = useTypeForm((state) => state);
	const { publishPost } = useThreadPostStore((state) => state);

	const hideForm = useAnimatedStyle(() => {
		return {
			display: IconName == 'Annonce' ? 'flex' : 'none',
			opacity: withTiming(IconName == 'Annonce' ? 1 : 0),
		};
	}, [IconName]);

	const { account } = useAuthStore((state) => state);

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
		publishPost(
			{ accountId: account?._id, type: type, files: prepareImage, value: contenu, theme: text },
			'Thread'
		);
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
					<InputWithTag
						key={2}
						offset={195}
						sizeInputWidth={0.8}
						text={contenu}
						setText={setContenu}
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
		</>
	);
};

export default ForumForm;
