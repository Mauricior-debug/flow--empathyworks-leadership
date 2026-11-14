import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { AppHeader } from '../../components/header';
import { signOut } from '../../store/logic';
import { useApp } from '../../store/store';
import { isPlus } from '../../store/logic';
import { useTheme } from '../../theme/Theme';
import type { ThemeChoice } from '../../store/types';
import type { IconName } from '../../components/icons';
import { Body, Button, Card, Chip, H1, RowLink, TabScreen } from '../../components/ui';

export default function Menu() {
  const { data, user, set, sheet } = useApp();
  const { c, font, display } = useTheme();
  if (!user) return null;
  const plus = isPlus(user);
  const groups: { title: string; items: { icon: IconName; title: string; detail: string; href: string; locked?: boolean }[] }[] = [
    {
      title: 'Your leadership',
      items: [
        { icon: 'home', title: 'Home', detail: 'Today', href: '/(tabs)/home' },
        { icon: 'sun', title: 'Daily reflection', detail: 'Two minutes', href: '/daily' },
        { icon: 'book', title: 'Leadership Mirror', detail: 'Once a week', href: '/mirror' },
        { icon: 'book', title: 'Journal', detail: 'Private', href: '/journal' },
        { icon: 'check', title: 'To-do list', detail: 'Date, time, reminder', href: '/todos' },
        { icon: 'calendar', title: 'My calendar', detail: 'Calls, workshops, to-dos', href: '/calendar' },
        { icon: 'bolt', title: 'Challenges', detail: plus ? 'This week' : 'Plus', href: '/challenge', locked: !plus },
        { icon: 'chart', title: 'Surveys', detail: 'Diagnostic and culture', href: '/surveys' },
      ],
    },
    {
      title: 'Your programmes',
      items: [
        ...(user.coaching || user.role === 'admin' ? [{ icon: 'star' as IconName, title: 'Coaching hub', detail: 'Session, notes, blueprint', href: '/coaching' }] : []),
        { icon: 'cap', title: 'Academy', detail: '12 modules', href: '/academy' },
        ...(user.orgPortal || user.role === 'admin' ? [{ icon: 'users' as IconName, title: 'Organisation', detail: user.org || 'Portal', href: '/organisation' }] : []),
        ...(user.role === 'admin' ? [{ icon: 'lock' as IconName, title: 'Manage the app', detail: 'Team demo', href: '/admin' }] : []),
      ],
    },
    {
      title: 'Connect and learn',
      items: [
        { icon: 'book', title: 'Leadership Articles', detail: 'Five essays, in full', href: '/library?type=Article' },
        { icon: 'layers', title: 'Resources', detail: 'Library', href: '/library' },
        { icon: 'users', title: 'Community', detail: plus ? 'Posts' : 'Plus', href: '/(tabs)/community', locked: !plus },
        { icon: 'chat', title: 'Messages', detail: 'Team, and members on Plus', href: '/messages' },
        { icon: 'send', title: 'Ask a consultant', detail: plus ? 'One question a week' : 'Plus', href: '/ask', locked: !plus },
        { icon: 'cap', title: 'Workshops', detail: 'Upcoming and booked', href: '/workshops' },
        { icon: 'calendar', title: 'Appointments', detail: 'Optional', href: '/appointments' },
      ],
    },
    {
      title: 'EmpathyWorks',
      items: [
        { icon: 'star', title: 'Membership', detail: plus ? 'Leadership Plus' : 'Leadership Essentials', href: '/membership' },
        { icon: 'layers', title: 'Programmes', detail: 'Coaching, Academy, organisations', href: '/programmes' },
        { icon: 'users', title: 'Account', detail: 'Profile, sign out, delete', href: '/account' },
        { icon: 'bolt', title: "What's new", detail: 'Recent changes', href: '/whats-new' },
        { icon: 'send', title: 'Send feedback', detail: 'The team reads it here', href: '/feedback' },
        { icon: 'chat', title: 'Help and support', detail: 'Questions', href: '/help' },
        { icon: 'info', title: 'About us', detail: 'The consultancy', href: '/about' },
        { icon: 'mail', title: 'Contact the team', detail: 'info@leadershipconsultant.co.uk', href: '/contact' },
      ],
    },
  ];
  const themes: ThemeChoice[] = ['auto', 'light', 'dark'];
  const labels: Record<ThemeChoice, string> = { auto: 'Match phone', light: 'Light', dark: 'Dark' };
  return (
    <TabScreen>
      <AppHeader />
      <View style={{ paddingHorizontal: 20, gap: 6 }}>
        <View style={{ alignSelf: 'center', width: 42, height: 4, borderRadius: 4, backgroundColor: c.line }} />
        <H1>Menu</H1>
        <Body muted>{user.first} {user.last}</Body>
      </View>
      {groups.map((group) => (
        <View key={group.title} style={{ paddingHorizontal: 20, gap: 4 }}>
          <Text style={{ color: c.spruce, fontFamily: display, fontSize: font(18) }}>{group.title}</Text>
          <Card>
            {group.items.map((item) => (
              <RowLink key={item.title} icon={item.icon} title={item.title} detail={item.detail} locked={item.locked} onPress={() => router.push(item.href)} />
            ))}
          </Card>
        </View>
      ))}
      <View style={{ paddingHorizontal: 20, gap: 10 }}>
        <Text style={{ color: c.ink, fontFamily: display, fontSize: font(22) }}>Appearance</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {themes.map((theme) => (
            <View key={theme} style={{ flex: 1 }}>
              <Chip label={labels[theme]} on={data.theme === theme} onPress={() => set({ ...data, theme })} />
            </View>
          ))}
        </View>
        <Chip label={data.big ? 'Larger text on' : 'Larger text'} on={data.big} onPress={() => set({ ...data, big: !data.big })} />
        <Button
          label="Sign out"
          kind="secondary"
          onPress={() =>
            sheet({
              title: 'Sign out of this phone?',
              message: 'Your reflections stay on the phone. You can sign in again.',
              confirmLabel: 'Sign out',
              onConfirm: () => {
                set(signOut(data));
                router.replace('/welcome');
              },
            })
          }
        />
      </View>
    </TabScreen>
  );
}
