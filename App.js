import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { AuthProvider } from './src/contexts/auth';
import Routes from './src/routes/routes';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Routes />
        <StatusBar style="auto" />
      </AuthProvider>
    </NavigationContainer>
  );
}