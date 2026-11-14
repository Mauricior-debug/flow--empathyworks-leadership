import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from '../../components/icons';
import { Press } from '../../components/ui';
import { communityBadge } from '../../store/logic';
import { useApp } from '../../store/store';
import { useTheme } from '../../theme/Theme';

export const unstable_settings = {
  initialRouteName: 'home',
};

const ITEMS: { name: string; label: string; icon: IconName }[] = [
  { name: 'home', label: 'Home', icon: 'home' },
  { name: 'reflect', label: 'Reflect', icon: 'sun' },
  { name: 'learn', label: 'Learn', icon: 'layers' },
  { name: 'community', label: 'Community', icon: 'users' },
  { name: 'menu', label: 'Menu', icon: 'menu' },
];

export default function TabsLayout() {
  const { c, font, semibold } = useTheme();
  const insets = useSafeAreaInsets();
  const { data, user } = useApp();
  const badge = user ? communityBadge(data, user.id) : 0;
  return (
    <Tabs
      screenOptions={{ headerShown: false, animation: 'shift' as const }}
      tabBar={({ state, navigateToTab }) => (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: c.card,
            borderTopWidth: 1,
            borderTopColor: c.line,
            paddingBottom: insets.bottom,
            paddingTop: 6,
          }}
        >
          {ITEMS.map((item) => {
            const route = state.routes.find((entry) => entry.name === item.name);
            const on = state.routes[state.index]?.name === item.name;
            return (
              <View key={item.name} style={{ flex: 1, minWidth: 0 }}>
                <Press
                  label={item.label}
                  onPress={() => {
                    if (route) navigateToTab(route.key);
                  }}
                  style={{ minHeight: 56, alignItems: 'center', justifyContent: 'center', gap: 2, paddingVertical: 4 }}
                >
                  <View style={{ minWidth: 56, alignItems: 'center', backgroundColor: on ? c.spruceSoft : 'transparent', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 }}>
                    <Icon name={item.icon} color={on ? c.spruce : c.muted} size={22} />
                    {item.name === 'community' && badge > 0 ? (
                      <View style={{ position: 'absolute', top: -2, right: 2, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: c.sunrise, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 }}>
                        <Text style={{ color: '#fff', fontSize: 10, fontFamily: semibold }}>{badge}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text numberOfLines={1} style={{ color: on ? c.spruce : c.muted, fontFamily: semibold, fontSize: font(11), textAlign: 'center' }}>
                    {item.label}
                  </Text>
                </Press>
              </View>
            );
          })}
        </View>
      )}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="reflect" options={{ title: 'Reflect' }} />
      <Tabs.Screen name="learn" options={{ title: 'Learn' }} />
      <Tabs.Screen name="community" options={{ title: 'Community' }} />
      <Tabs.Screen name="menu" options={{ title: 'Menu' }} />
    </Tabs>
  );
}
