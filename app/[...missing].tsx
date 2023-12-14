import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View } from '../components/Themed';
import { Link } from '@react-navigation/native';
const Stack = createStackNavigator();
export default function NotFoundScreen() {
  return (
    <>
      <Stack.Navigator children={null} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn't exist.</Text>

        <Link to="/tabs" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
