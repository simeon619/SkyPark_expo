import { View, TouchableOpacity, useColorScheme } from 'react-native';
import React from 'react';
import { moderateScale, shadow, verticalScale } from '../../Utilis/metrics';
import { icons } from '../../Utilis/data';
import useToggleStore, { useTypeForm } from '../../managementState/client/preference';
import { Image } from 'expo-image';
import Animated from 'react-native-reanimated';
import Colors from '../../constants/Colors';

const ActionButtonForm = ({ indexForumHide }: { indexForumHide?: number }) => {
	const { IconName, switchForm } = useTypeForm((state) => state);
	const { primaryColour } = useToggleStore((state) => state);
	const colorScheme = useColorScheme();
	return (
		<Animated.View
			style={{
				marginHorizontal: verticalScale(50),
				marginTop: verticalScale(5),
				// borderColor: Colors[colorScheme ?? 'light'].grey,
				borderRadius: moderateScale(15),
				// borderWidth: 1,
				backgroundColor: 'white',
				paddingVertical: verticalScale(5),
				...shadow(5),
				// overflow: 'hidden',
			}}
		>
			<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
				{icons.map((icon, index) => {
					return (
						<View key={index}>
							{indexForumHide !== index && (
								<TouchableOpacity
									onPress={() => switchForm(icon.name)}
									style={{
										borderColor: Colors[colorScheme ?? 'light'].grey,
									}}
								>
									<Image
										source={icon.url}
										style={{
											width: 30,
											aspectRatio: 1,
											tintColor: IconName === icon.name ? primaryColour : '#000000',
										}}
										transition={200}
									/>
								</TouchableOpacity>
							)}
						</View>
					);
				})}
			</View>
		</Animated.View>
	);
};

export default ActionButtonForm;
