import React, { useEffect, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from '../../components/Themed';
import Colors from '../../constants/Colors';

import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import {
	ScrollView,
	TextInput,
	TouchableOpacity,
	useColorScheme,
	useWindowDimensions,
} from 'react-native';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import useToggleStore from '../../managementState/client/preference';
import useFindThem, {
	ActivityPost,
	Post,
	UserProfile,
} from '../../managementState/server/FindThem';
import { TextMedium } from '../../components/StyledText';
import ImageProfile from '../../components/utilis/simpleComponent/ImageProfile';
import { MaterialIcons } from '@expo/vector-icons';
import { ByAccountResult } from '../../managementState/server/byAccount';

const Search = () => {
	const { width } = useWindowDimensions();
	const colorScheme = useColorScheme();
	const [value, setValue] = React.useState('');
	const { primaryColour } = useToggleStore((state) => state);
	const { getList, listAccount, listForum, listPost, listActivity } = useFindThem((state) => state);

	useMemo(() => {
		getList({ value });
	}, [value]);

	const navigation = useNavigation();
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
			<View
				style={{
					width,
					backgroundColor: primaryColour,
					// backgroundColor: "blue",
					paddingHorizontal: horizontalScale(10),
					flexDirection: 'row',
					alignItems: 'center',
					paddingVertical: verticalScale(5),
				}}
			>
				<TouchableOpacity
					onPress={() => {
						//@ts-ignore
						navigation.navigate('Profile');
					}}
				>
					<Image
						source={require('../../assets/icon/menu.png')}
						style={{
							height: moderateScale(28),
							aspectRatio: 1,
							marginTop: 3,
							tintColor: Colors[colorScheme ?? 'light'].overLay,
							transform: [{ rotate: '180deg' }],
							// backgroundColor: "red",
						}}
					/>
				</TouchableOpacity>

				<TextInput
					placeholder="Search..."
					placeholderTextColor={Colors[colorScheme ?? 'light'].overLay}
					onChangeText={(text) => setValue(text)}
					autoFocus
					style={{
						flex: 1,
						flexDirection: 'row',
						alignItems: 'center',
						height: moderateScale(28),
						borderBottomWidth: 1,
						gap: horizontalScale(10),
						marginHorizontal: horizontalScale(15),
						borderBottomColor: Colors[colorScheme ?? 'light'].overLay,
						backgroundColor: primaryColour,
						paddingHorizontal: horizontalScale(10),
						fontSize: moderateScale(17),
						color: 'white',
						paddingVertical: verticalScale(5),
					}}
				/>
			</View>
			<ScrollView
				keyboardShouldPersistTaps="handled"
				style={{ flex: 1, marginLeft: horizontalScale(50) }}
			>
				{listAccount && listAccount.length > 0 && (
					<TextMedium style={{ color: '#000a', fontSize: moderateScale(16) }}>Account</TextMedium>
				)}
				{listAccount && listAccount.map((item) => <ItemSearchAccount key={item._id} item={item} />)}

				{listActivity && listActivity.length > 0 && (
					<TextMedium style={{ color: '#000a', fontSize: moderateScale(16) }}>Activity</TextMedium>
				)}
				{listActivity &&
					listActivity.map((item) => <ItemSearchActivity key={item._id} item={item} />)}

				{listPost && listPost.length > 0 && (
					<TextMedium style={{ color: '#000a', fontSize: moderateScale(16) }}>Post</TextMedium>
				)}
				{listPost && listPost.map((item) => <ItemSearchPost key={item._id} item={item} />)}

				{listForum && listForum.length > 0 && (
					<TextMedium style={{ color: '#000a', fontSize: moderateScale(16) }}>Forum</TextMedium>
				)}
				{listForum && listForum.map((item) => <ItemSearchForum key={item._id} item={item} />)}
			</ScrollView>
		</SafeAreaView>
	);
};
const ItemSearchPost = ({ item }: { item: Post }) => {
	const navigation = useNavigation();
	const { width } = useWindowDimensions();

	const dataPost = JSON.stringify(item);
	const infoUser = JSON.stringify({
		account: item.message.account,
		profile: item.message.account?.profile,
	});
	const messageUser = JSON.stringify({ ...item.message });
	return (
		<TouchableOpacity
			onPress={() => {
				//@ts-ignore
				navigation.push(`DetailPost`, { dataPost, infoUser, messageUser, id: item._id });
			}}
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				paddingBottom: verticalScale(10),
				borderBottomWidth: 1,
				borderBottomColor: '#1111',
			}}
		>
			<View style={{ flexDirection: 'row', alignItems: 'center', gap: horizontalScale(5) }}>
				<MaterialIcons name="post-add" size={24} color="black" />
				<TextMedium
					numberOfLines={2}
					style={{
						color: 'black',
						fontSize: moderateScale(14),
						width: width - horizontalScale(100),
					}}
				>
					{item.message.text}
				</TextMedium>
			</View>
		</TouchableOpacity>
	);
};

const ItemSearchForum = ({ item }: { item: ByAccountResult }) => {
	const navigation = useNavigation();
	const { width } = useWindowDimensions();
	// { forumData: ByAccountResult }

	return (
		<TouchableOpacity
			onPress={() => {
				//@ts-ignore
				navigation.push(`PageForum`, { forumData: item });
			}}
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				paddingBottom: verticalScale(10),
				borderBottomWidth: 1,
				borderBottomColor: '#1111',
			}}
		>
			<View style={{ flexDirection: 'row', alignItems: 'center', gap: horizontalScale(5) }}>
				<MaterialIcons name="post-add" size={24} color="black" />
				<TextMedium
					numberOfLines={2}
					style={{
						color: 'black',
						fontSize: moderateScale(14),
						width: width - horizontalScale(100),
					}}
				>
					{item.message.text}
				</TextMedium>
			</View>
		</TouchableOpacity>
	);
};

const ItemSearchAccount = ({ item }: { item: UserProfile }) => {
	const navigation = useNavigation();
	return (
		<TouchableOpacity
			onPress={() => {
				//@ts-ignore
				navigation.navigate('OtherProfile', { user: item });
			}}
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				paddingBottom: verticalScale(10),
				borderBottomWidth: 1,
				borderBottomColor: '#1111',
			}}
		>
			<View style={{ flexDirection: 'row', alignItems: 'center', gap: horizontalScale(5) }}>
				<ImageProfile image={item.profile.imgProfile[0]?.url} size={33} />
				<TextMedium
					style={{
						color: 'black',
						fontSize: moderateScale(14),
					}}
				>
					{item.name}
				</TextMedium>
			</View>
		</TouchableOpacity>
	);
};

const ItemSearchActivity = ({ item }: { item: ActivityPost }) => {
	const navigation = useNavigation();
	return (
		<TouchableOpacity
			onPress={() => {
				//@ts-ignore
				navigation.navigate('Profile');
			}}
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				paddingBottom: verticalScale(10),
				borderBottomWidth: 1,
				borderBottomColor: '#1111',
			}}
		>
			<View style={{ flexDirection: 'row', alignItems: 'center', gap: horizontalScale(5) }}>
				<ImageProfile image={item.poster.imgProfile[0]?.url} size={33} />
				<TextMedium
					style={{
						color: 'black',
						fontSize: moderateScale(14),
					}}
				>
					{item.name}
				</TextMedium>
			</View>
		</TouchableOpacity>
	);
};

export default Search;
