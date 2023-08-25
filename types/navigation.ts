import type { StackScreenProps } from '@react-navigation/stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  ViewerImage: { uri: string; caption: string | undefined };
  Profile: undefined;
  Discussion: undefined;
  CheckProfile: undefined;
  GroupActivity: undefined;
  ItemGroup: { name: string; pic: string; banner: string; id: string };
  DetailPost: {};
  Forum: undefined;
  Login: undefined;
  Signup: undefined;
  Bottomtabs: undefined;
};

type BottomTabParamList = {
  HomeTab: undefined;
  DiscussionsTab: undefined;
  PostTab: undefined;
  UserTab: undefined;
  NotificationTab: undefined;
};

// type Props = StackScreenProps<RootStackParamList>;

// export type NavigationProps = CompositeScreenProps<
//   BottomTabScreenProps<BottomTabParamList>,
//   StackScreenProps<RootStackParamList>
// >;

export type NavigationStackProps = StackScreenProps<RootStackParamList>;
export type NavigationTabProps = BottomTabScreenProps<BottomTabParamList>;
