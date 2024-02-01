import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, useWindowDimensions } from 'react-native';
import { moderateScale } from '../../Utilis/metrics';
import { PostType } from '../../types/PostType';
import { TextMedium } from '../StyledText';
import { View } from '../Themed';
import PostMedia from './PostMedia';
import PostSurvey from './PostSurvey';
import PostText from './PostText';
import { HistoriqueType } from '../../managementState/server/activityUser/Historique';
import { ItemActivity } from '../utilis/ItemsActivity';
import { useNavigation } from '@react-navigation/native';

const PostIndexHistorique = ({
	DATA,
	loadData,
	loadindGetData,
}: {
	DATA: HistoriqueType[];
	loadData: () => void;
	loadindGetData: boolean;
}) => {
	const navigation = useNavigation();

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			loadData();
		} catch (error) {
			console.error(error);
		} finally {
		}
	};
	const ListFooterComponent = useCallback(() => {
		return (
			<>
				<View style={{ height: height * 0.05 }} />
				{loadindGetData ? <ActivityIndicator size="small" /> : null}
				<View style={{ height: height * 0.05 }} />
			</>
		);
	}, []);

	const { height } = useWindowDimensions();
	return (
		<FlatList
			data={DATA}
			renderItem={({ item }) => <RenderItem item={item} navigation={navigation} />}
			keyExtractor={keyExtractor}
			scrollEventThrottle={500}
			// refreshControl={<RefreshControl refreshing={loadindGetData} onRefresh={() => {}} />}
			showsVerticalScrollIndicator={false}
			removeClippedSubviews={true}
			onEndReachedThreshold={0.6}
			ListFooterComponent={ListFooterComponent}
		/>
	);
};
const actionMode = (mode: 'like' | 'create' | 'shared' | 'listen', value: string) => {
	if (mode === 'listen') {
		return value === 'true' ? 'rejoint' : 'quitter';
	} else if (mode === 'create') {
		return 'creer';
	} else if (mode === 'shared') {
		return 'partagez';
	} else if (mode === 'like') {
		return value === 'true' ? 'like' : 'dislike';
	}
};
const RenderItem = ({ item, navigation }: { item: HistoriqueType; navigation: any }) => {
	let renderedItem = null;
	if (item.mode === 'listen') {
		renderedItem = (
			<View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
				<TextMedium>
					Vous avez {actionMode(item.mode, item.value)} le groupe {item.activity.name}
				</TextMedium>
				<ItemActivity item={item.activity} navigation={navigation} />
			</View>
		);
	} else {
		switch (item.post.type) {
			case PostType.TEXT:
				renderedItem = (
					<View>
						<TextMedium>Vous avez {actionMode(item.mode, item.value)} ce post</TextMedium>
						<PostText dataPost={item.post} />
					</View>
				);
				break;
			case PostType.T_MEDIA:
				renderedItem = (
					<View>
						<TextMedium>Vous avez {actionMode(item.mode, item.value)} ce post</TextMedium>
						<PostMedia dataPost={item.post} />
					</View>
				);
				break;
			case PostType.SURVEY:
				renderedItem = (
					<View>
						<TextMedium>Vous avez {actionMode(item.mode, item.value)} ce post</TextMedium>
						<PostSurvey dataPost={item.post} />
					</View>
				);
				break;
			default:
				renderedItem = (
					<TextMedium style={{ fontSize: moderateScale(25), textAlign: 'center' }}>
						pas encore géré
					</TextMedium>
				);
		}
	}

	return renderedItem;
};

const keyExtractor = (item: HistoriqueType) => item.id;
export default PostIndexHistorique;
