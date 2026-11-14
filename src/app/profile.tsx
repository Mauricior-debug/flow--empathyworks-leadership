import { router, useLocalSearchParams } from 'expo-router';
import * as Linking from 'expo-linking';
import { Image } from 'expo-image';
import { photoSource } from '../data/images';
import { byId, fullName, isPlus } from '../store/logic';
import { useApp } from '../store/store';
import { Body, Button, H1, StackScreen } from '../components/ui';

export default function Profile() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data, user } = useApp();
  const person = id ? byId(data, id) : undefined;
  if (!person || !user) return <StackScreen title="Profile"><Body>That profile is not on this phone.</Body></StackScreen>;
  const photo = photoSource(person.photo);
  return (
    <StackScreen title="Profile">
      {photo ? <Image source={photo} style={{ width: 96, height: 96, borderRadius: 48 }} contentFit="cover" /> : null}
      <H1>{fullName(person)}</H1>
      {person.teamKey ? <Body>EmpathyWorks</Body> : null}
      {person.showJob ? <Body muted>{[person.job, person.org].filter(Boolean).join(' · ')}</Body> : null}
      {person.bio ? <Body>{person.bio}</Body> : null}
      {person.linkedin ? <Button label="LinkedIn" kind="secondary" onPress={() => Linking.openURL(person.linkedin)} /> : null}
      {person.id === user.id ? (
        <Button label="Edit my profile" onPress={() => router.push('/account')} />
      ) : isPlus(user) ? (
        <Button label="Message" onPress={() => router.push('/thread?with=' + person.id)} />
      ) : (
        <Body muted>Messages with members are part of Leadership Plus.</Body>
      )}
    </StackScreen>
  );
}
