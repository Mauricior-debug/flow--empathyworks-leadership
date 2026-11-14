import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { photos } from '../data/images';
import { TAGLINE } from '../data/content';
import { DEMO } from '../store/seed';
import { signInPassword } from '../store/logic';
import { useApp } from '../store/store';
import { useTheme } from '../theme/Theme';
import { Body, Button, Eyebrow, H1, Hairline } from '../components/ui';

export default function Welcome() {
  const insets = useSafeAreaInsets();
  const { data, run } = useApp();
  const { c, font, body } = useTheme();
  const enter = (email: string, password: string) => {
    const result = signInPassword(data, email, password);
    if (!run(result)) return;
    const user = result.data.people.find((p) => p.id === result.data.sessionUserId);
    router.replace(user && !user.onboarded ? '/onboarding' : '/(tabs)/home');
  };
  return (
    <View style={{ flex: 1, backgroundColor: c.page }}>
      <Image
        source={photos.hero}
        style={{ width: '100%', height: 300 + insets.top }}
        contentFit="cover"
        contentPosition="center"
        accessibilityLabel="A hand watering a young seedling, with the EmpathyWorks logo"
      />
      <Hairline />
      <View style={{ flex: 1, paddingHorizontal: 22, paddingTop: 22, paddingBottom: insets.bottom + 16, gap: 16 }}>
        <Eyebrow>EmpathyWorks Leadership</Eyebrow>
        <H1>{TAGLINE}</H1>
        <Body muted>
          Daily reflection, the Leadership Mirror, Leadership Articles, the Leadership Diagnostic and monthly workshops. Leadership Essentials is free. Leadership Plus goes further.
        </Body>
        <View style={{ marginTop: 'auto', gap: 10 }}>
          <Button label="Get started free" onPress={() => router.push('/create-account')} />
          <Button label="Sign in" kind="secondary" onPress={() => router.push('/sign-in')} />
          <Button label="Continue as Jordan Hale, Plus demo" kind="quiet" onPress={() => enter(DEMO.jordan.email, DEMO.jordan.password)} />
        </View>
      </View>
    </View>
  );
}
