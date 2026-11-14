import 'react-native-gesture-handler';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, useFonts as useInter } from '@expo-google-fonts/inter';
import { Newsreader_500Medium, useFonts as useNews } from '@expo-google-fonts/newsreader';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { mark } from '../data/images';
import { AppChrome, AppProvider, useApp } from '../store/store';
import { ThemeProvider, useMode, useTheme } from '../theme/Theme';

function Splash() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F4F4F2', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Image source={mark} style={{ width: 72, height: 72 }} contentFit="contain" />
      <Text style={{ color: '#152456', fontSize: 22 }}>EmpathyWorks</Text>
    </View>
  );
}

function RootStack() {
  const { ready, data } = useApp();
  const mode = useMode(data?.theme || 'auto');
  const [inter] = useInter({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold });
  const [news] = useNews({ Newsreader_500Medium });
  const fonts = inter && news;
  if (!ready || !fonts) return <Splash />;
  return (
    <ThemeProvider mode={mode} big={!!data?.big} fonts>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <ThemedStack mode={mode} />
      <AppChrome />
    </ThemeProvider>
  );
}

function ThemedStack({ mode }: { mode: 'light' | 'dark' }) {
  const { c } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: c.page }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: mode === 'dark' ? '#111112' : '#F4F4F2' },
        }}
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <RootStack />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
