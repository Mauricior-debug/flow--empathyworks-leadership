import { Image } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';
import { photos, wordmark } from '../data/images';
import { PILLARS, TAGLINE } from '../data/content';
import { Body, Button, Card, Eyebrow, H1, StackScreen } from '../components/ui';

export default function About() {
  return (
    <StackScreen title="About">
      <Image source={photos.hero} style={{ width: '100%', height: 200, borderRadius: 16 }} contentFit="cover" accessibilityLabel="A hand watering a young seedling" />
      <View style={{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: 10, alignSelf: 'flex-start' }}>
        <Image source={wordmark} style={{ width: 220, height: 58 }} contentFit="contain" accessibilityLabel="EmpathyWorks Leadership Consultancy" />
      </View>
      <Eyebrow>About EmpathyWorks</Eyebrow>
      <H1>{TAGLINE}</H1>
      <Body muted>Leadership matters most when things are difficult. We help people lead with greater confidence, clarity and effectiveness, bringing humanity and accountability together without compromising performance.</Body>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {PILLARS.map(([title, line]) => (
          <Card key={title} style={{ width: '47%' }}>
            <Body>{title}</Body>
            <Body muted>{line}</Body>
          </Card>
        ))}
      </View>
      <Body>Good leadership is both human and accountable.</Body>
      <Button label="Book a Leadership Conversation" onPress={() => router.push('/book?kind=discovery')} />
      <Button label="Meet the team" kind="secondary" onPress={() => router.push('/team')} />
      <Button label="What are you facing?" kind="quiet" onPress={() => router.push('/guide')} />
    </StackScreen>
  );
}
