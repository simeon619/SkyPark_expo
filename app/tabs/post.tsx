import { BlurView } from 'expo-blur';

import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { horizontalScale, shadow, verticalScale } from '../../Utilis/metrics';
import { View } from '../../components/Themed';
import SurveyForm from '../../components/form/SurveyForm';
import DefaultForm from '../../components/form/defaultForm';
import ImageProfile from '../../components/utilis/simpleComponent/ImageProfile';
import Colors from '../../constants/Colors';
import { SMALL_PIC_USER } from '../../constants/Value';
import { useBlurSurvey } from '../../managementState/client/preference';
import { useAuthStore } from '../../managementState/server/auth';
import ActionButtonForm from '../../components/utilis/ActionButtonForm';

import ForumForm from '../../components/form/forumForm';

import InputWithTag from '../../components/InputWithTag';
import { useInputPost } from '../../managementState/client/postInput';

const PostTabScreen = () => {
	const colorScheme = useColorScheme();

	const { blurSurvey } = useBlurSurvey((state) => state);
	const { setText, text } = useInputPost();

	const profile = useAuthStore((state) => state.profile);
	return (
		<SafeAreaView
			style={{
				flex: 1,
				backgroundColor: Colors[colorScheme ?? 'light'].background,
			}}
		>
			<BlurView style={[{ zIndex: blurSurvey }, StyleSheet.absoluteFill]} />
			<ActionButtonForm />
			<View
				style={[
					{
						borderRadius: 25,
						backgroundColor: Colors[colorScheme ?? 'light'].background,
						marginHorizontal: horizontalScale(15),
						marginTop: verticalScale(3),
						paddingTop: verticalScale(15),
						...shadow(5),
						overflow: 'hidden',
					},
				]}
			>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'flex-start',
					}}
				>
					<TouchableOpacity
						onPress={() => {}}
						style={{
							alignSelf: 'center',
						}}
					>
						<ImageProfile image={profile?.imgProfile[0]?.url} size={SMALL_PIC_USER + 10} />
					</TouchableOpacity>
					<InputWithTag offset={65} sizeInputWidth={0.7} setText={setText} text={text} />
				</View>
				<DefaultForm />
				<SurveyForm />
				<ForumForm />
			</View>
		</SafeAreaView>
	);
};

export default PostTabScreen;
