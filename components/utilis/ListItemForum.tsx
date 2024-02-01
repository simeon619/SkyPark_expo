import { AntDesign } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { formatPostDate } from '../../Utilis/date';
import { horizontalScale, moderateScale, shadow } from '../../Utilis/metrics';
import { TextLight } from '../StyledText';
import { View } from '../Themed';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ByAccountResult } from '../../managementState/server/byAccount';
import { useFavouritesStore } from '../../managementState/server/activityUser/favourites';

const ItemForum = ({ item }: { item: ByAccountResult }) => {
	const navigation = useNavigation();
	const { setListPostFavourites, removePostFavourites, ownfavoritres } = useFavouritesStore();

	const [isFavorite, setisFavorite] = useState(false);

	const toggleFavorite = () => {
		if (ownfavoritres.includes(item._id)) {
			setisFavorite(false);
			removePostFavourites({ id: item._id });
		} else {
			setListPostFavourites({ id: item._id });
			setisFavorite(true);
		}
	};
	useMemo(() => setisFavorite(ownfavoritres.includes(item._id)), [ownfavoritres, item._id]);
	return (
		<Pressable
			onPress={() => {
				// @ts-ignore
				navigation.navigate('PageForum', { forumData: item });
			}}
		>
			<View
				style={{
					...shadow(5),
					marginVertical: 10,
					marginHorizontal: horizontalScale(5),
					paddingHorizontal: horizontalScale(15),
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						width: '100%',
					}}
				>
					<View style={{ flex: 1, padding: moderateScale(2) }}>
						<TextLight>{item.theme}</TextLight>
					</View>
					<AntDesign
						name="star"
						size={24}
						color={isFavorite ? 'orange' : '#aaae'}
						style={{ marginRight: horizontalScale(10) }}
						onPress={() => {
							toggleFavorite();
						}}
					/>
				</View>
				<View
					style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
				>
					<View>
						<TextLight style={{ color: '#aaae' }}>
							il ya {formatPostDate(+item.message.__createdAt)}
						</TextLight>
					</View>
					<View>
						<TextLight style={{ color: '#aaae' }}>
							{item.statPost.comments} {item.statPost.comments <= 1 ? 'response' : 'responses'}
						</TextLight>
					</View>
				</View>
			</View>
		</Pressable>
	);
};

export default ItemForum;
