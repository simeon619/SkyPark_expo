import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	useWindowDimensions,
	useColorScheme,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { horizontalScale, moderateScale, verticalScale } from '../Utilis/metrics';
import { Portal } from '@gorhom/portal';
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import ImageProfile from './utilis/simpleComponent/ImageProfile';
import { TextMedium } from './StyledText';
import Colors from '../constants/Colors';
import { formTextPlaceholder } from '../constants/Value';
import useToggleStore, { useTypeForm } from '../managementState/client/preference';
import { useListUserStore } from '../managementState/server/Listuser';
import { useFocusEffect } from '@react-navigation/native';
type NumberBetweenZeroAndOne = 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;
const InputWithTag = ({
	text,
	setText,
	offset,
	sizeInputWidth,
}: {
	text: string;
	setText: React.Dispatch<React.SetStateAction<string>>;
	offset: number;
	sizeInputWidth: NumberBetweenZeroAndOne;
}) => {
	const colorScheme = useColorScheme();
	const [heightInput, setHeightInput] = useState(40);
	const refInput = useRef<TextInput>(null);
	const [correspondance, setCorrespondance] = useState('');
	const [mention, setMention] = useState('');
	const { IconName } = useTypeForm((state) => state);
	const { primaryColourLight } = useToggleStore((state) => state);
	const { listAccount, getListAccount } = useListUserStore();
	const size = useSharedValue(100);
	const { width, height } = useWindowDimensions();
	const filteredAccount = useMemo(() => {
		if (!correspondance) {
			return listAccount;
		}
		const lowerCorrespondance = correspondance.substring(2, correspondance.length).toLowerCase();
		return listAccount.filter((acc) => {
			const lowerName = acc?.account.name.toLowerCase();
			const lowerUsername = acc?.account.userTarg.toLowerCase();
			return (
				lowerName?.includes(lowerCorrespondance) || lowerUsername?.includes(lowerCorrespondance)
			);
		});
	}, [listAccount, correspondance]);
	const animatedStyle = useAnimatedStyle(() => {
		return {
			width: withTiming(size.value > 0 ? width * 0.7 : 0, {
				duration: 450,
				easing: Easing.inOut(Easing.ease),
			}),
			height: size.value * filteredAccount.length,
			opacity: withTiming(size.value > 0 ? 1 : 0, {
				duration: 250,
				easing: Easing.inOut(Easing.ease),
			}), // size.value > 0 ? 1 : 0,
		};
	});
	useMemo(() => {
		const regexDernierMotArobase = /@\w+\b/g;
		const motMatches = text.match(regexDernierMotArobase);
		if (motMatches) {
			const lastWord = motMatches.pop()!;
			const newtext = text.replace(lastWord, mention + ' ');
			setText(newtext);
		}
	}, [mention]);
	useEffect(() => {
		const regex = /\s@[\w-]*\S$/i;
		if (!startAnimation) {
			return;
		}
		if (regex.test(text)) {
			let coresp = text.match(regex)!;

			setCorrespondance(coresp[0]);
			startAnimation(40);
		} else {
			startAnimation(0);
		}
	}, [text]);
	useEffect(() => {
		getListAccount();
	}, []);
	const startAnimation = (newSize: number) => {
		size.value = withTiming(newSize, { duration: 250, easing: Easing.inOut(Easing.ease) });
	};
	useCallback(() => {
		useFocusEffect(() => {
			refInput.current?.focus();
		});
	}, []);

	const onTextChange = (value: string) => {
		setText(() => {
			return value.startsWith('@') ? ' ' + value.trimStart() : value;
		});
	};

	return (
		<>
			<TextInput
				multiline={true}
				numberOfLines={2}
				onContentSizeChange={(e) => {
					setHeightInput(e.nativeEvent.contentSize.height);
				}}
				ref={refInput}
				value={text}
				onChangeText={onTextChange}
				textAlignVertical="bottom"
				placeholder={formTextPlaceholder(IconName)}
				style={{
					fontSize: moderateScale(15),
					height: heightInput,
					maxHeight: height * 0.3,
					width: width * sizeInputWidth,
					fontFamily: 'Light',
					borderWidth: 1,
					borderColor: '#1113',
					paddingHorizontal: horizontalScale(20),
					paddingVertical: verticalScale(10),
					borderRadius: moderateScale(50),
					alignSelf: 'center',
				}}
			/>
			<Portal>
				<Animated.View
					style={[
						{
							position: 'absolute',
							zIndex: 99,
							top: Math.min(offset + heightInput, height * 0.3),
							left: 80,
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
								onPress={() => setMention(`@${acc?.account.userTarg}`)}
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
									style={{
										fontSize: moderateScale(14),
										color: 'blue',
										paddingLeft: 5,
										width: width * 0.5,
									}}
									numberOfLines={1}
								>
									@{acc?.account.userTarg}{' '}
									<TextMedium
										style={{
											fontSize: moderateScale(10),
											color: Colors[colorScheme ?? 'light'].text,
										}}
									>
										{acc?.account.name}
									</TextMedium>
								</TextMedium>
							</TouchableOpacity>
						);
					})}
				</Animated.View>
			</Portal>
		</>
	);
};

export default InputWithTag;
