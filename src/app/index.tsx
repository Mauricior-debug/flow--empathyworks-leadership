import { Redirect } from 'expo-router';
import { useApp } from '../store/store';

export default function Index() {
  const { ready, user } = useApp();
  if (!ready) return null;
  if (!user) return <Redirect href="/welcome" />;
  if (!user.onboarded) return <Redirect href="/onboarding" />;
  return <Redirect href="/(tabs)/home" />;
}
