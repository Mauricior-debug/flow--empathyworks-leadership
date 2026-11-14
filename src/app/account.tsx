import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image } from 'expo-image';
import { photoSource } from '../data/images';
import { isPlus, saveProfile, setMembership, signOut } from '../store/logic';
import { useApp } from '../store/store';
import { Body, Button, Chip, Field, H1, StackScreen } from '../components/ui';

export default function Account() {
  const { data, user, run, set, sheet } = useApp();
  const [first, setFirst] = useState(user?.first || '');
  const [last, setLast] = useState(user?.last || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [job, setJob] = useState(user?.job || '');
  const [org, setOrg] = useState(user?.org || '');
  const [linkedin, setLinkedin] = useState(user?.linkedin || '');
  const [showJob, setShowJob] = useState(user?.showJob ?? true);
  if (!user) return null;
  const photo = photoSource(user.photo);
  const plus = user.membership === 'plus';
  return (
    <StackScreen
      title="Account"
      footer={<Button label="Save profile" onPress={() => run(saveProfile(data, { first: first.trim(), last: last.trim(), bio, job, org, linkedin, showJob }), 'Profile saved.')} />}
    >
      <H1>Your account</H1>
      {photo ? <Image source={photo} style={{ width: 88, height: 88, borderRadius: 44 }} contentFit="cover" /> : null}
      <Button
        label={photo ? 'Change photo' : 'Add a photo'}
        kind="secondary"
        onPress={async () => {
          const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!permission.granted) {
            sheet({ title: 'Photo access', message: 'Allow photo access in your phone settings if you want a profile picture.', confirmLabel: 'Close', cancelLabel: '' });
            return;
          }
          const picked = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.5, allowsEditing: true, aspect: [1, 1] });
          if (!picked.canceled && picked.assets[0]?.base64) {
            run(saveProfile(data, { photo: 'data:image/jpeg;base64,' + picked.assets[0].base64 }), 'Photo saved on this phone.');
          }
        }}
      />
      <Body muted>{user.email}</Body>
      <Body>Membership: {isPlus(user) ? 'Leadership Plus' : 'Leadership Essentials'}{user.role === 'admin' ? ' · Team' : ''}</Body>
      <Body muted>Switch Essentials and Plus here to see the gates. It stays on this phone.</Body>
      <Chip
        label={plus ? 'Viewing as Plus' : 'Viewing as Essentials'}
        on={plus}
        onPress={() => run(setMembership(data, plus ? 'essentials' : 'plus', plus ? null : 'month'), plus ? 'Switched to Essentials.' : 'Switched to Plus. No card was charged.')}
      />
      <Field label="First name" value={first} onChangeText={setFirst} />
      <Field label="Last name" value={last} onChangeText={setLast} />
      <Field label="About me" value={bio} onChangeText={setBio} multiline />
      <Field label="Job" value={job} onChangeText={setJob} />
      <Field label="Organisation" value={org} onChangeText={setOrg} />
      <Chip label={showJob ? 'Job shown to members' : 'Job hidden from members'} on={showJob} onPress={() => setShowJob(!showJob)} />
      <Field label="LinkedIn" value={linkedin} onChangeText={setLinkedin} autoCapitalize="none" placeholder="https://www.linkedin.com/in/…" />
      <Button label="How others see this" kind="secondary" onPress={() => router.push('/profile?id=' + user.id)} />
      <Button
        label="Sign out"
        kind="secondary"
        onPress={() =>
          sheet({
            title: 'Sign out?',
            message: 'You can sign in again on this phone.',
            confirmLabel: 'Sign out',
            onConfirm: () => {
              set(signOut(data));
              router.replace('/welcome');
            },
          })
        }
      />
      <Button label="Delete account" kind="danger" onPress={() => router.push('/delete-account')} />
    </StackScreen>
  );
}
