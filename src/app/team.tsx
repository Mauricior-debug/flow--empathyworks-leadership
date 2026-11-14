import { Image } from 'expo-image';
import { photos } from '../data/images';
import { Body, Card, Eyebrow, H1, StackScreen } from '../components/ui';

export default function Team() {
  return (
    <StackScreen title="The team">
      <Eyebrow>People behind the philosophy</Eyebrow>
      <H1>Leadership credibility built in the real world</H1>
      <Image source={photos.steveNeil} style={{ width: '100%', height: 220, borderRadius: 16 }} contentFit="cover" contentPosition="top" accessibilityLabel="Steve Robertson and Neil Lavis working together" />
      <Card>
        <Image source={photos.steveSuit} style={{ width: '100%', height: 180, borderRadius: 12 }} contentFit="cover" accessibilityLabel="Steve Robertson" />
        <H1>Steve Robertson</H1>
        <Body muted>Founder and Director</Body>
        <Body>Former Prison Governor and senior public-service leader.</Body>
        <Body>Postgraduate study in Humanitarian Leadership, University of Cambridge.</Body>
      </Card>
      <Card>
        <Image source={photos.avNeil} style={{ width: 72, height: 72, borderRadius: 36 }} contentFit="cover" accessibilityLabel="Neil Lavis" />
        <H1>Neil Lavis</H1>
        <Body muted>Senior Consultant</Body>
        <Body>Former Prison Governor and experienced senior public-service leader.</Body>
      </Card>
      <Card>
        <H1>Between them</H1>
        <Body>Leadership of HMP Guys Marsh, HMP Swansea and HMP Leyhill.</Body>
        <Body>National leadership responsibilities during the COVID-19 pandemic.</Body>
        <Body>International leadership of HM Cayman Islands Prison Service.</Body>
      </Card>
    </StackScreen>
  );
}
