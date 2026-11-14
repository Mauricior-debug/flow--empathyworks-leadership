import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { AppHeader } from '../../components/header';
import { photos } from '../../data/images';
import { ARTICLES, TAGLINE, challengeFor } from '../../data/content';
import { fmtDay, greeting, iso, monday } from '../../store/dates';
import { isPlus } from '../../store/logic';
import { useApp } from '../../store/store';
import { useTheme } from '../../theme/Theme';
import { Body, Button, Card, Eyebrow, FadeIn, H1, PhotoCard, Press, Progress, TabScreen } from '../../components/ui';
import { Icon } from '../../components/icons';

export default function Home() {
  const { data, user, set } = useApp();
  const { c, font, semibold, body, display } = useTheme();
  if (!user) return null;
  const today = iso();
  const week = monday(today);
  const daily = data.daily.find((d) => d.userId === user.id && d.date === today);
  const mirror = data.mirrors.find((m) => m.userId === user.id && m.week === week);
  const challenge = challengeFor(week);
  const log = data.challenges.find((x) => x.userId === user.id && x.week === week);
  const plus = isPlus(user);
  const monthly = data.appointments.some((a) => a.userId === user.id && a.kind === 'monthly' && a.status === 'confirmed' && a.date.slice(0, 7) === today.slice(0, 7));
  const published = ARTICLES.filter((a) => data.articlePublished[a.id] !== false);
  const article = published[new Date().getDate() % published.length] || published[0];
  const steps = [
    { id: 'intro', title: 'Introduce yourself', detail: 'Say hello in the community.', done: data.posts.some((p) => p.authorId === user.id), href: '/(tabs)/community' },
    { id: 'consult', title: 'Book a consultation', detail: 'Optional. Talk with the team.', done: data.appointments.some((a) => a.userId === user.id && a.status === 'confirmed'), href: '/book' },
    { id: 'ws', title: "Book this month's workshop", detail: 'Learn with other leaders, live.', done: data.bookings.some((b) => b.userId === user.id && b.status === 'booked'), href: '/workshops' },
    { id: 'diag', title: 'Take the Leadership Diagnostic', detail: 'See where you are now.', done: data.surveys.some((s) => s.userId === user.id && s.which === 'leadership'), href: '/survey?which=leadership' },
  ];
  const done = steps.filter((s) => s.done).length;
  const openTodos = data.todos.filter((t) => t.userId === user.id && !t.done).length;
  const nextAppt = data.appointments.filter((a) => a.userId === user.id && a.status === 'confirmed' && a.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0];
  const tiles = [
    ['To-do list', openTodos ? openTodos + ' to do' : 'Plan your week', '/todos', 'check'],
    ['Journal', data.journal.filter((j) => j.userId === user.id).length + ' entries', '/journal', 'book'],
    ['Resources', (data.saved[user.id] || []).length + ' saved', '/library', 'layers'],
    ['Surveys', 'Diagnostic and culture', '/surveys', 'chart'],
    ['Appointments', nextAppt ? 'Next ' + nextAppt.date.slice(8) + ' ' + nextAppt.slot : 'Book a time', '/appointments', 'calendar'],
    ['Community', plus ? data.posts.length + ' posts' : 'Plus', '/(tabs)/community', 'users'],
    ['Workshops', data.workshops.filter((w) => w.date >= today).length + ' coming up', '/workshops', 'cap'],
  ] as const;

  return (
    <TabScreen>
      <AppHeader />
      <View style={{ paddingHorizontal: 20, gap: 8 }}>
        <Eyebrow>{fmtDay(today)}</Eyebrow>
        <FadeIn>
          <H1>
            {greeting()}, {user.first}
          </H1>
        </FadeIn>
        <Body muted>{TAGLINE}</Body>
      </View>

      {!data.pushAskHidden ? (
        <View style={{ paddingHorizontal: 20 }}>
          <Card>
            <Text style={{ color: c.ink, fontFamily: semibold, fontSize: font(18) }}>Never miss a thing</Text>
            <Body muted>Turn on notifications for announcements, workshop reminders, your to-dos and messages. They stay inside the app.</Body>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Button label="Turn on" onPress={() => set({ ...data, pushOn: true, pushAskHidden: true })} />
              </View>
              <View style={{ flex: 1 }}>
                <Button label="Not now" kind="secondary" onPress={() => set({ ...data, pushAskHidden: true })} />
              </View>
            </View>
          </Card>
        </View>
      ) : null}

      <View style={{ paddingHorizontal: 20, gap: 14 }}>
        <PhotoCard
          source={photos.hiker}
          eyebrow="Daily reflection"
          title={daily ? 'Done for today' : 'How are you showing up?'}
          subtitle={daily ? 'You can edit it until the end of the day.' : 'Two minutes.'}
          height={230}
          onPress={() => router.push('/daily')}
        />
        <PhotoCard
          source={photos.reflective}
          eyebrow="The Leadership Mirror"
          title={mirror?.done ? 'This week is complete' : 'Your week, held up'}
          subtitle="Six themes. Two statements each. Come back as the week unfolds."
          height={200}
          position="top"
          onPress={() => router.push('/mirror')}
        />
        <Press onPress={() => router.push('/challenge')} label="This week's challenge" style={{ borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: c.line, backgroundColor: c.card }}>
          <Image source={photos.steveNeil} style={{ width: '100%', height: 96 }} contentFit="cover" contentPosition="top" />
          <View style={{ padding: 16, gap: 6, marginTop: -8 }}>
            <Eyebrow>This week’s challenge</Eyebrow>
            <Text style={{ color: c.ink, fontFamily: display, fontSize: font(26), lineHeight: font(32) }}>{challenge.title}</Text>
            <Body muted>{plus ? (log?.status === 'done' ? 'Completed' : log?.status === 'accepted' ? 'In progress' : 'Plus · accept, complete or skip') : 'Part of Leadership Plus'}</Body>
          </View>
        </Press>
        {plus ? (
          <Card style={{ borderColor: c.spruce }}>
            <Eyebrow>Leadership Plus</Eyebrow>
            <Text style={{ color: c.ink, fontFamily: display, fontSize: font(24), lineHeight: font(30) }}>
              {monthly ? 'Your call this month is booked' : 'Book the monthly call'}
            </Text>
            <Body muted>Thirty minutes with Steve Robertson or Neil Lavis. One each calendar month.</Body>
            <Button label={monthly ? 'See appointments' : 'Choose a time'} onPress={() => router.push(monthly ? '/appointments' : '/book?kind=monthly')} />
          </Card>
        ) : null}
      </View>

      {!data.getStartedHidden && done < 4 ? (
        <View style={{ paddingHorizontal: 20 }}>
          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Eyebrow>Get started</Eyebrow>
              <Text style={{ color: c.muted, fontFamily: body, fontSize: font(14) }}>{done} of 4</Text>
            </View>
            <Progress value={done / 4} />
            {steps.map((step, i) => (
              <Press key={step.id} onPress={() => router.push(step.href)} label={step.title} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 8 }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: step.done ? c.spruce : c.sunk, alignItems: 'center', justifyContent: 'center' }}>
                  {step.done ? <Icon name="check" size={16} color={c.spruceInk} /> : <Text style={{ color: c.ink, fontFamily: semibold }}>{i + 1}</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: c.ink, fontFamily: semibold, fontSize: font(16) }}>{step.title}{step.id === 'consult' ? ' (optional)' : ''}</Text>
                  <Text style={{ color: c.muted, fontFamily: body, fontSize: font(14) }}>{step.detail}</Text>
                </View>
              </Press>
            ))}
            <Button label="Hide this" kind="quiet" onPress={() => set({ ...data, getStartedHidden: true })} />
          </Card>
        </View>
      ) : null}

      {article ? (
        <View style={{ paddingHorizontal: 20 }}>
          <Press onPress={() => router.push('/article?id=' + article.id)} label={article.n} style={{ borderRadius: 18, overflow: 'hidden', backgroundColor: c.card, borderWidth: 1, borderColor: c.line }}>
            <View style={{ flexDirection: 'row' }}>
              <Image source={photos.steveSuit} style={{ width: 118, height: 140 }} contentFit="cover" contentPosition="center" accessibilityLabel="Steve Robertson" />
              <View style={{ flex: 1, padding: 14, gap: 6, justifyContent: 'center' }}>
                <Eyebrow>Leadership Articles</Eyebrow>
                <Text style={{ color: c.ink, fontFamily: semibold, fontSize: font(16), lineHeight: font(21) }}>{article.n}</Text>
                <Text style={{ color: c.muted, fontFamily: body, fontSize: font(13) }}>{article.mins} min read</Text>
              </View>
            </View>
          </Press>
        </View>
      ) : null}

      <View style={{ paddingHorizontal: 20, gap: 10 }}>
        <Text style={{ color: c.ink, fontFamily: display, fontSize: font(22) }}>Your leadership</Text>
        <View style={{ gap: 10 }}>
          {Array.from({ length: Math.ceil(tiles.length / 2) }, (_, row) => {
            const pair = tiles.slice(row * 2, row * 2 + 2);
            return (
              <View key={pair[0][0]} style={{ flexDirection: 'row', gap: 10 }}>
                {pair.map((tile) => (
                  <View key={tile[0]} style={{ flex: 1, minWidth: 0 }}>
                    <Press
                      onPress={() => router.push(tile[2])}
                      label={tile[0]}
                      style={{
                        flex: 1,
                        backgroundColor: c.card,
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: c.line,
                        padding: 14,
                        gap: 6,
                        minHeight: 108,
                      }}
                    >
                      <Icon name={tile[3]} color={c.spruce} />
                      <Text style={{ color: c.ink, fontFamily: semibold, fontSize: font(16), lineHeight: font(21) }} numberOfLines={2}>
                        {tile[0]}
                      </Text>
                      <Text style={{ color: c.muted, fontFamily: body, fontSize: font(13), lineHeight: font(18) }} numberOfLines={2}>
                        {tile[1]}
                      </Text>
                    </Press>
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      </View>
    </TabScreen>
  );
}
