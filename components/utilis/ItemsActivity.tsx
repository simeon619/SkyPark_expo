import { Image } from 'expo-image';
import React, { useEffect, useMemo } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, useColorScheme } from 'react-native';
import { formatPostDate } from '../../Utilis/date';
import { horizontalScale, moderateScale, shadow, verticalScale } from '../../Utilis/metrics';
import Colors from '../../constants/Colors';
import { HOST, MEDIUM_PIC_USER, SMALL_PIC_USER } from '../../constants/Value';
import useToggleStore from '../../managementState/client/preference';
import { TextLight, TextMedium } from '../StyledText';
import { View } from '../Themed';
import ShadowImage from './ShadowImage';
import { useNavigation } from '@react-navigation/native';
import {
	GroupeType,
	upDownGroup,
	useGroupActivity,
} from '../../managementState/server/activityUser/groupActivity';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const ItemsActivity = ({ text = '' }: { text: string }) => {
	const { getGroupe, listGroupe, loadingGroupe } = useGroupActivity();
	const navigation = useNavigation();
	const filteredGroup = useMemo(
		() =>
			listGroupe
				? listGroupe?.filter((item) => item?.name?.toLowerCase().includes(text.toLowerCase()))
				: [],
		[text, listGroupe]
	);

	useEffect(() => {
		if (listGroupe.length > 0) return;
		getGroupe();
	}, [listGroupe]);
	return (
		// <></>
		<View style={{ paddingHorizontal: horizontalScale(10), marginTop: verticalScale(25) }}>
			{loadingGroupe && (
				<SkeletonPlaceholder>
					<SkeletonPlaceholder.Item>
						<SkeletonPlaceholder.Item
							height={verticalScale(35)}
							width={'95%'}
							borderRadius={moderateScale(20)}
						/>
						<SkeletonPlaceholder.Item
							height={25}
							alignSelf="center"
							width={200}
							borderRadius={99}
							marginVertical={moderateScale(5)}
						/>
						<SkeletonPlaceholder.Item
							height={20}
							alignSelf="center"
							width={150}
							borderRadius={99}
							marginVertical={moderateScale(10)}
						/>
					</SkeletonPlaceholder.Item>
				</SkeletonPlaceholder>
			)}
			{filteredGroup.map((item, index) => {
				return <ItemActivity key={index} item={item} navigation={navigation} />;
			})}
		</View>
	);
};
export default ItemsActivity;

export const ItemActivity = ({ item, navigation }: { item: GroupeType; navigation: any }) => {
	const colorScheme = useColorScheme();
	const { primaryColour } = useToggleStore((state) => state);
	return (
		<View
			lightColor={'#efefef'}
			style={{
				...shadow(1),
				marginBottom: verticalScale(25),
				padding: moderateScale(20),
				borderRadius: moderateScale(20),
			}}
		>
			<View
				lightColor={'#efefef'}
				style={{
					marginBottom: verticalScale(MEDIUM_PIC_USER / 2),
				}}
			>
				<ShadowImage
					ratioHeight={2.8}
					ratioWidth={100}
					children={
						<Image
							source={{ uri: HOST + item.poster.imgProfile[0]?.url }}
							style={{ width: '100%', height: '100%' }}
						/>
					}
				/>
				<Image
					source={{ uri: HOST + item.poster.imgProfile[0]?.url }}
					style={{
						width: moderateScale(MEDIUM_PIC_USER),
						aspectRatio: 1,
						position: 'absolute',
						bottom: -MEDIUM_PIC_USER / 2 + 10,
						alignSelf: 'center',
						borderColor: 'white',
						borderTopWidth: 2,
						borderLeftWidth: 2,
						borderRightWidth: 2,
						borderRadius: MEDIUM_PIC_USER,
					}}
				/>
			</View>
			<View
				lightColor={'#efefef'}
				style={{
					alignItems: 'center',
				}}
			>
				<TouchableWithoutFeedback
					onPress={() => {
						//@ts-ignore
						navigation.navigate('ItemGroup', {
							name: item.name,
							pic: HOST + item.poster.imgProfile[0]?.url,
							banner: HOST + item.poster.imgProfile[0]?.url,
							id: item._id,
						});
					}}
				>
					<TextMedium style={{ fontSize: moderateScale(16), textAlign: 'center' }}>
						{item.name}
					</TextMedium>
				</TouchableWithoutFeedback>
				<TextLight
					style={{
						fontSize: moderateScale(14),
						textAlign: 'center',
						color: Colors[colorScheme ?? 'light'].greyDark,
						marginTop: verticalScale(5),
					}}
				>
					Derniere activite : {formatPostDate(item.__updatedAt)}
				</TextLight>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: Colors[colorScheme ?? 'light'].lightGrey,
					}}
				>
					{item.listAccount?.map((user, index) => (
						<Image
							key={index}
							source={{ uri: HOST + user.profile.imgProfile[0]?.url }}
							style={[
								{
									width: moderateScale(SMALL_PIC_USER + 5),
									aspectRatio: 1,
									borderRadius: 50,
									borderColor: 'white',
									borderWidth: 2,
								},
								index !== 0 && { marginLeft: -horizontalScale(15) },
							]}
						/>
					))}
				</View>
				<TextLight
					style={{
						fontSize: moderateScale(15),
						textAlign: 'center',
						color: Colors[colorScheme ?? 'light'].greyDark,
					}}
				>
					Groupe open / {item.listAccount?.length} Membre{item.listAccount?.length > 1 ? 's' : ''}
				</TextLight>
				<TouchableOpacity
					onPress={() => {
						upDownGroup({ id: item._id });
					}}
					style={{
						alignSelf: 'center',
						borderColor: primaryColour,
						borderWidth: 1,
						borderRadius: 50,
						paddingHorizontal: horizontalScale(10),
					}}
				>
					<TextLight
						style={{ fontSize: moderateScale(16), textAlign: 'center', color: primaryColour }}
					>
						{item.listen ? 'Desabonner' : 'Abonner'}
					</TextLight>
				</TouchableOpacity>
			</View>
		</View>
	);
};
