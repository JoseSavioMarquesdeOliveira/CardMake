import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { PaperProvider, IconButton } from 'react-native-paper';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { CardProvider } from '../src/contexts/CardContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <CardProvider>
      <PaperProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen 
              name="index" 
              options={{ 
                title: 'CardMake Pro',
                headerRight: () => (
                  <IconButton
                    icon="cog"
                    onPress={() => router.push('/settings')}
                  />
                ),
              }} 
            />
            <Stack.Screen name="editor" options={{ title: 'Create/Edit Card' }} />
            <Stack.Screen name="settings" options={{ title: 'Settings' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </PaperProvider>
    </CardProvider>
  );
}
