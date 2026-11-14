import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { ARTICLES, FREE_ARTICLE } from '../data/content';
import { photos } from '../data/images';
import { isPlus, toggleSaved } from '../store/logic';
import { useApp } from '../store/store';
import { useTheme } from '../theme/Theme';
import { Body, Button, Card, Eyebrow, H1, H2, Rich, StackScreen } from '../components/ui';

export default function Article() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data, user, set } = useApp();
  const { c, font, body } = useTheme();
  const article = ARTICLES.find((a) => a.id === id) || ARTICLES[0];
  if (!user || !article) return null;
  const locked = article.id !== FREE_ARTICLE && !isPlus(user);
  const saved = (data.saved[user.id] || []).includes(article.id);
  const next = ARTICLES[(ARTICLES.findIndex((a) => a.id === article.id) + 1) % ARTICLES.length];
  return (
    <StackScreen title="Article">
      <Image source={photos[article.img]} style={{ width: '100%', height: 220, borderRadius: 16 }} contentFit="cover" contentPosition="top" accessibilityLabel={article.n} />
      <Eyebrow>{article.topic}</Eyebrow>
      <H1>{article.n}</H1>
      <Body muted>EmpathyWorks Leadership Consultancy · {article.mins} min read</Body>
      <Button label={saved ? 'Saved' : 'Save'} kind="secondary" onPress={() => set(toggleSaved(data, article.id))} />
      {locked ? (
        <Card style={{ backgroundColor: c.sunriseSoft }}>
          <H2>Part of Leadership Plus</H2>
          <Body>{article.ex}</Body>
          <Body muted>The full essay is on this phone for Plus members. Essentials can read “Why compassion and accountability belong together”.</Body>
          <Button label="See Leadership Plus" onPress={() => router.push('/membership')} />
        </Card>
      ) : (
        <View style={{ gap: 14 }}>
          {article.blocks.map((block, i) => {
            if (block.t === 'h') return <H2 key={i}>{block.x.replace(/<[^>]+>/g, '')}</H2>;
            if (block.t === 'q' || block.t === 'big') {
              return (
                <Text key={i} style={{ color: c.navy, fontFamily: body, fontSize: font(block.t === 'big' ? 22 : 18), lineHeight: font(28) }}>
                  {block.x.replace(/<[^>]+>/g, '')}
                </Text>
              );
            }
            return <Rich key={i} text={block.x} />;
          })}
          {article.refs?.length ? (
            <Card>
              <H2>References and further reading</H2>
              {article.refs.map((ref) => (
                <Rich key={ref} text={ref} size={15} />
              ))}
            </Card>
          ) : null}
        </View>
      )}
      <Card>
        <H2>About EmpathyWorks</H2>
        <Body>
          EmpathyWorks Leadership Consultancy helps people lead well in hard places. We support leaders, teams and organisations to strengthen leadership capability, develop people and build compassionate, accountable workplace cultures.
        </Body>
        <Button label="Book a conversation" onPress={() => router.push('/book')} />
      </Card>
      <Text style={{ color: c.spruce, fontFamily: body, fontSize: font(16) }} onPress={() => router.push('/article?id=' + next.id)}>
        Read next · {next.n}
      </Text>
    </StackScreen>
  );
}
