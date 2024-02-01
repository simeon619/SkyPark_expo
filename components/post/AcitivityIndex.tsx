import {
	View,
	Text,
	useWindowDimensions,
	ActivityIndicator,
	FlatList,
	RefreshControl,
} from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { PostInterface } from '../../managementState/server/Descriptions';
import { ArrayData } from '../../lib/SQueryClient';
import { PostType } from '../../types/PostType';
import PostText from './PostText';
import PostMedia from './PostMedia';
import PostSurvey from './PostSurvey';
import { TextMedium } from '../StyledText';
import { moderateScale } from '../../Utilis/metrics';

const AcitivityIndex = ({
	DATA,
	loadData,
	loadindGetData,
	activityId,
}: {
	DATA: ArrayData<PostInterface>;
	loadData: ({ activityId, page }: { activityId: string; page: number }) => Promise<any>;
	loadindGetData: boolean;
	activityId: string;
}) => {
	useEffect(() => {
		fetchData();
	}, []);
	const fetchData = async () => {
		try {
			await loadData({ activityId: activityId, page: 1 });
		} catch (error) {
			console.error(error);
		} finally {
		}
	};
	const { height } = useWindowDimensions();
	const handleLoadMore = async () => {
		if (DATA?.hasNextPage) {
			await loadData({ activityId: activityId, page: DATA?.nextPage || 1 });
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
	return (
		<FlatList
			data={DATA?.items}
			// estimatedItemSize={150}
			renderItem={renderItem}
			keyExtractor={keyExtractor}
			refreshControl={<RefreshControl refreshing={loadindGetData} onRefresh={() => fetchData()} />}
			scrollEventThrottle={500}
			onEndReached={() => handleLoadMore()}
			showsVerticalScrollIndicator={false}
			removeClippedSubviews={true}
			onEndReachedThreshold={0.6}
			ListFooterComponent={ListFooterComponent}
		/>
	);
};
const renderItem = ({ item }: { item: PostInterface }) => {
	switch (item.type) {
		case PostType.TEXT:
			return <PostText key={item._id} dataPost={item} />;
		case PostType.T_MEDIA:
			return <PostMedia key={item._id} dataPost={item} />;

		case PostType.SURVEY: {
			return <PostSurvey key={item._id} dataPost={item} />;
		}
		// case PostType.GROUP_JOIN:
		//   return <PostJoined dataPost={item} />;
		default:
			return (
				<TextMedium style={{ fontSize: moderateScale(25), textAlign: 'center' }}>
					pas encore gerer
				</TextMedium>
			);
	}
};
const keyExtractor = (_item: PostInterface, index: number) => index.toString();

export default AcitivityIndex;
