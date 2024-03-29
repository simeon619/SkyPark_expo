import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { horizontalScale, moderateScale } from '../../Utilis/metrics';
import { View } from '../../components/Themed';
import HeaderHome from '../../components/utilis/HeaderHome';
import TabPageItem from '../../components/utilis/TabPageItem';
import Colors from '../../constants/Colors';
import useToggleStore from '../../managementState/client/preference';
import CieGestion from '../pagePost/CieGestion';
import Neighbor from '../pagePost/Neighbor';

const Home = () => {
	const primaryColour = useToggleStore((state) => state.primaryColour);

	const colorScheme = useColorScheme();
	const Tab = createMaterialTopTabNavigator();
	const nameLocation = useToggleStore((state) => state.name);
	return (
		<SafeAreaView
			style={{
				flex: 1,
				backgroundColor: Colors[colorScheme ?? 'light'].background,
			}}
		>
			<StatusBar backgroundColor={primaryColour} style={'light'} />
			<HeaderHome />
			<View style={{ flex: 1, paddingHorizontal: horizontalScale(10) }}>
				<Tab.Navigator
					initialRouteName="Tous les voisins"
					backBehavior="order"
					initialLayout={{
						width: Dimensions.get('window').width,
					}}
					screenOptions={{
						// tabBarGap: horizontalScale(25),
						tabBarScrollEnabled: true,
						tabBarStyle: {
							backgroundColor: '#fff',
						},
						tabBarIndicatorStyle: {
							backgroundColor: primaryColour,
						},
						tabBarItemStyle: {
							width: 'auto',
							height: 'auto',
							alignItems: 'flex-start',
						},
						tabBarLabelStyle: {
							fontSize: moderateScale(80),
							height: moderateScale(7),
							fontFamily: 'Thin',
							textTransform: 'capitalize',
						},
					}}
				>
					<Tab.Screen
						name={nameLocation === 'Neighbor' ? 'Tous les voisins' : 'Building'}
						component={Neighbor}
						options={{
							tabBarLabel({ focused, children }) {
								return <TabPageItem children={children} focused={focused} />;
							},
						}}
					/>

					<Tab.Screen
						name="Compagnie de gestions"
						component={CieGestion}
						options={{
							tabBarLabel({ focused, children }) {
								return <TabPageItem children={children} focused={focused} />;
							},
						}}
					/>
				</Tab.Navigator>
			</View>
		</SafeAreaView>
	);
};

export default Home;
