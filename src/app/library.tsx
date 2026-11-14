import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { TOPICS, library, type LibKind } from '../data/content';
import { isPlus } from '../store/logic';
import { useApp } from '../store/store';
import { useTheme } from '../theme/Theme';
import { Body, Card, Chip, Field, StackScreen } from '../components/ui';

const TYPES: Array<LibKind | 'All'> = ['All', 'Article', 'Video', 'Podcast', 'Exercise', 'Download'];

export default function Library() {
  const params = useLocalSearchParams<{ type?: string }>();
  const { data, user } = useApp();
  const { c, font, semibold } = useTheme();
  const [q, setQ] = useState('');
  const [type, setType] = useState<LibKind | 'All'>((params.type as LibKind) || 'All');
  const [topic, setTopic] = useState('All');
  if (!user) return null;
  const plus = isPlus(user);
  const items = library().filter((item) => {
    if (type !== 'All' && item.type !== type) return false;
    if (topic !== 'All' && item.topic !== topic) return false;
    const blob = (item.title + ' ' + item.summary).toLowerCase();
    if (q.trim() && !blob.includes(q.trim().toLowerCase())) return false;
    if (item.type === 'Article' && data.articlePublished[item.id] === false) return false;
    return true;
  });
  return (
    <StackScreen title="Library">
      <Field label="Search" value={q} onChangeText={setQ} placeholder="A theme or a title" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {TYPES.map((t) => (
          <Chip key={t} label={t} on={type === t} onPress={() => setType(t)} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {['All', ...TOPICS].map((t) => (
          <Chip key={t} label={t} on={topic === t} onPress={() => setTopic(t)} />
        ))}
      </View>
      <Body muted>{items.length} items</Body>
      {items.map((item) => {
        const locked = item.access === 'plus' && !plus;
        return (
          <Card key={item.id}>
            <Text style={{ color: c.spruce, fontFamily: semibold, fontSize: font(13) }}>
              {item.type} · {item.minutes} min{locked ? ' · Plus' : item.access === 'free' ? ' · Free' : ''}
            </Text>
            <Text style={{ color: c.ink, fontFamily: semibold, fontSize: font(18), lineHeight: font(24) }}>{item.title}</Text>
            <Body muted>{item.summary}</Body>
            <Text style={{ color: c.muted, fontSize: font(13) }}>{item.topic}</Text>
            <Text
              style={{ color: c.spruce, fontFamily: semibold, fontSize: font(16) }}
              onPress={() => router.push(item.type === 'Article' ? '/article?id=' + item.id : item.id === 'L4' ? '/planner' : '/resource?id=' + item.id)}
            >
              {locked ? 'See what is included' : 'Open'}
            </Text>
          </Card>
        );
      })}
      {!items.length ? <Body muted>Nothing matches. Clear a filter and try again.</Body> : null}
    </StackScreen>
  );
}
