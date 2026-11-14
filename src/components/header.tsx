import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { unreadCount } from '../store/logic';
import { useApp } from '../store/store';
import { useTheme } from '../theme/Theme';
import { Icon } from './icons';
import { Hairline, Press, Wordmark } from './ui';

export function AppHeader() {
  const { data, user } = useApp();
  const { c, font, semibold } = useTheme();
  const unread = user ? unreadCount(data, user.id) : 0;
  const pill = user?.membership === 'plus' ? 'Plus' : 'Essentials';
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: c.card }}>
        <Press label="Menu" onPress={() => router.push('/(tabs)/menu')} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="menu" color={c.ink} />
        </Press>
        <Wordmark />
        <Press
          label={pill + ' membership'}
          onPress={() => router.push('/membership')}
          style={{ borderWidth: 1, borderColor: c.line, backgroundColor: c.sunk, borderRadius: 999, paddingHorizontal: 10, minHeight: 36, justifyContent: 'center' }}
        >
          <Text style={{ color: c.muted, fontFamily: semibold, fontSize: font(12) }}>{pill}</Text>
        </Press>
        <Press label={unread ? unread + ' unread notifications' : 'Notifications'} onPress={() => router.push('/notifications')} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="bell" color={c.ink} />
          {unread ? (
            <View style={{ position: 'absolute', top: 2, right: 0, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: c.sunrise, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }}>
              <Text style={{ color: '#fff', fontSize: 11, fontFamily: semibold }}>{unread}</Text>
            </View>
          ) : null}
        </Press>
      </View>
      <Hairline />
    </View>
  );
}
