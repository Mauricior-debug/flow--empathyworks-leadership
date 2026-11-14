import { Image, type ImageSource } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, type ReactNode } from 'react';
import {
  AccessibilityInfo,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { rainbow, useTheme } from '../theme/Theme';
import { Icon, type IconName } from './icons';

let reduceMotion = false;
AccessibilityInfo.isReduceMotionEnabled().then((v) => {
  reduceMotion = v;
}).catch(() => {});

export function Hairline() {
  return (
    <View style={{ flexDirection: 'row', height: 3 }}>
      {rainbow.map((color) => (
        <View key={color} style={{ flex: 1, backgroundColor: color }} />
      ))}
    </View>
  );
}

export function Press({
  onPress,
  disabled,
  style,
  children,
  label,
  haptic,
}: {
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  label?: string;
  haptic?: boolean;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const flat = StyleSheet.flatten(style) || {};
  const fills = flat.width != null || flat.flex != null || flat.flexGrow != null || flat.flexBasis != null;
  const outer: ViewStyle = {
    flex: flat.flex,
    flexGrow: flat.flexGrow,
    flexBasis: flat.flexBasis,
    width: flat.width,
    alignSelf: flat.alignSelf,
    minWidth: flat.minWidth,
    maxWidth: flat.maxWidth,
  };
  return (
    <Animated.View style={[fills ? outer : null, anim]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        disabled={disabled}
        onPressIn={() => {
          if (!reduceMotion) scale.value = withSpring(0.975, { damping: 18, stiffness: 380 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 16, stiffness: 260 });
        }}
        onPress={() => {
          if (haptic) Haptics.selectionAsync().catch(() => {});
          onPress?.();
        }}
        style={({ pressed }) => [
          style,
          fills ? { width: '100%', flex: undefined, flexGrow: undefined, flexBasis: undefined } : null,
          pressed && reduceMotion ? { opacity: 0.72 } : null,
          disabled ? { opacity: 0.45 } : null,
        ]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

export function Button({
  label,
  onPress,
  kind = 'primary',
  disabled,
  icon,
}: {
  label: string;
  onPress?: () => void;
  kind?: 'primary' | 'secondary' | 'quiet' | 'danger';
  disabled?: boolean;
  icon?: IconName;
}) {
  const { c, font, semibold, body } = useTheme();
  const bg = kind === 'primary' ? c.spruce : 'transparent';
  const color = kind === 'primary' ? c.spruceInk : kind === 'danger' ? c.bad : kind === 'quiet' ? c.spruce : c.ink;
  const border = kind === 'secondary' ? c.line : 'transparent';
  return (
    <Press
      label={label}
      onPress={onPress}
      disabled={disabled}
      haptic={kind === 'primary'}
      style={{
        minHeight: 52,
        borderRadius: 14,
        backgroundColor: bg,
        borderWidth: kind === 'secondary' ? 1 : 0,
        borderColor: border,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 18,
        flexDirection: 'row',
        gap: 8,
      }}
    >
      {icon ? <Icon name={icon} color={color} size={18} /> : null}
      <Text style={{ color, fontFamily: kind === 'quiet' ? body : semibold, fontSize: font(17) }}>{label}</Text>
    </Press>
  );
}

export function Field({
  label,
  hint,
  error,
  multiline,
  ...input
}: TextInputProps & { label: string; hint?: string; error?: string; multiline?: boolean }) {
  const { c, font, body, medium } = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: c.ink, fontFamily: medium, fontSize: font(15) }}>{label}</Text>
      <TextInput
        {...input}
        multiline={multiline}
        placeholderTextColor={c.muted}
        style={{
          minHeight: multiline ? 120 : 52,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: error ? c.bad : c.line,
          backgroundColor: c.card,
          color: c.ink,
          fontFamily: body,
          fontSize: font(17),
          paddingHorizontal: 14,
          paddingVertical: multiline ? 12 : 0,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
      />
      {error ? <Text style={{ color: c.bad, fontSize: font(14), fontFamily: body }}>{error}</Text> : null}
      {!error && hint ? <Text style={{ color: c.muted, fontSize: font(14), fontFamily: body, lineHeight: font(20) }}>{hint}</Text> : null}
    </View>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  const { c, font, semibold } = useTheme();
  return (
    <Text
      style={{
        color: c.spruce,
        fontFamily: semibold,
        fontSize: font(13),
        letterSpacing: 0.6,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </Text>
  );
}

export function H1({ children }: { children: ReactNode }) {
  const { c, font, display } = useTheme();
  return (
    <Text style={{ color: c.ink, fontFamily: display, fontSize: font(34), lineHeight: font(40), letterSpacing: -0.4 }}>{children}</Text>
  );
}

export function H2({ children }: { children: ReactNode }) {
  const { c, font, display } = useTheme();
  return <Text style={{ color: c.ink, fontFamily: display, fontSize: font(26), lineHeight: font(32) }}>{children}</Text>;
}

export function Body({ children, muted, style }: { children: ReactNode; muted?: boolean; style?: object }) {
  const { c, font, body } = useTheme();
  return (
    <Text style={[{ color: muted ? c.muted : c.ink, fontFamily: body, fontSize: font(17), lineHeight: font(25) }, style]}>{children}</Text>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const { c } = useTheme();
  return (
    <View style={[{ backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, padding: 16, gap: 10 }, style]}>
      {children}
    </View>
  );
}

export function PhotoCard({
  source,
  eyebrow,
  title,
  subtitle,
  onPress,
  height = 220,
  position = 'center',
}: {
  source: ImageSource;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  height?: number;
  position?: string;
}) {
  const { font, semibold, display, body } = useTheme();
  return (
    <Press onPress={onPress} label={title} style={{ borderRadius: 18, overflow: 'hidden' }}>
      <View style={{ height }}>
        <Image source={source} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={position as 'center'} accessibilityIgnoresInvertColors />
        <LinearGradient colors={['rgba(0,0,0,0.05)', 'rgba(8,12,20,0.72)']} style={StyleSheet.absoluteFill} />
        <View style={{ flex: 1, justifyContent: 'flex-end', padding: 18, gap: 4 }}>
          {eyebrow ? (
            <Text style={{ color: '#F4F4F2', fontFamily: semibold, fontSize: font(12), letterSpacing: 0.6, textTransform: 'uppercase' }}>{eyebrow}</Text>
          ) : null}
          <Text style={{ color: '#FFFFFF', fontFamily: display, fontSize: font(28), lineHeight: font(32) }}>{title}</Text>
          {subtitle ? <Text style={{ color: '#F4F4F2', fontFamily: body, fontSize: font(15), lineHeight: font(21) }}>{subtitle}</Text> : null}
        </View>
      </View>
    </Press>
  );
}

export function Chip({
  label,
  on,
  onPress,
  color,
}: {
  label: string;
  on?: boolean;
  onPress?: () => void;
  color?: string;
}) {
  const { c, font, medium } = useTheme();
  return (
    <Press
      onPress={onPress}
      label={label}
      style={{
        minHeight: 40,
        paddingHorizontal: 14,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: on ? color || c.spruce : c.line,
        backgroundColor: on ? color || c.spruceSoft : c.card,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: on ? c.ink : c.muted, fontFamily: medium, fontSize: font(15) }}>{label}</Text>
    </Press>
  );
}

export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <Card>
      <H2>{title}</H2>
      <Body muted>{body}</Body>
    </Card>
  );
}

export function StackScreen({
  title,
  children,
  footer,
  scroll = true,
}: {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  scroll?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const { c, font, semibold } = useTheme();
  const body = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: 20, gap: 18, paddingBottom: (footer ? 24 : insets.bottom + 28) }}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={{ flex: 1 }}>{children}</View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: c.page, paddingTop: insets.top }}>
      <View style={{ minHeight: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, gap: 4 }}>
        <Press
          label="Back"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/home'))}
          style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="back" color={c.ink} />
        </Press>
        {title ? (
          <Text style={{ flex: 1, color: c.ink, fontFamily: semibold, fontSize: font(17) }} numberOfLines={1}>
            {title}
          </Text>
        ) : (
          <View style={{ flex: 1 }} />
        )}
      </View>
      <Hairline />
      {body}
      {footer ? (
        <View style={{ padding: 16, paddingBottom: insets.bottom + 12, gap: 8, backgroundColor: c.page, borderTopWidth: 1, borderTopColor: c.line }}>
          {footer}
        </View>
      ) : null}
    </View>
  );
}

export function TabScreen({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const { c } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: c.page, paddingTop: insets.top }}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: insets.bottom + 108, gap: 22 }}>
        {children}
      </ScrollView>
    </View>
  );
}

export function Progress({ value }: { value: number }) {
  const { c } = useTheme();
  return (
    <View style={{ height: 6, borderRadius: 99, backgroundColor: c.sunk, overflow: 'hidden' }}>
      <View style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, height: '100%', backgroundColor: c.spruce }} />
    </View>
  );
}

export function RowLink({
  icon,
  title,
  detail,
  onPress,
  locked,
}: {
  icon: IconName;
  title: string;
  detail?: string;
  onPress?: () => void;
  locked?: boolean;
}) {
  const { c, font, semibold, body } = useTheme();
  return (
    <Press onPress={onPress} label={title} style={{ minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 }}>
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: c.spruceSoft, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={18} color={c.spruce} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: c.ink, fontFamily: semibold, fontSize: font(16) }}>{title}</Text>
        {detail ? <Text style={{ color: c.muted, fontFamily: body, fontSize: font(14), lineHeight: font(19) }}>{detail}</Text> : null}
      </View>
      {locked ? <Icon name="lock" size={16} color={c.muted} /> : (
        <View style={{ transform: [{ scaleX: -1 }] }}>
          <Icon name="back" size={16} color={c.muted} />
        </View>
      )}
    </Press>
  );
}

export function Wordmark({ height = 28 }: { height?: number }) {
  const { c, font, semibold, medium } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
      <Image source={require('../../assets/mark.png')} style={{ width: height, height, flexShrink: 0 }} contentFit="contain" accessibilityIgnoresInvertColors />
      <View style={{ minWidth: 0, flexShrink: 1 }}>
        <Text style={{ fontFamily: semibold, fontSize: font(16), letterSpacing: -0.3 }} numberOfLines={1}>
          <Text style={{ color: c.navy }}>Empathy</Text>
          <Text style={{ color: c.works }}>Works</Text>
        </Text>
        <Text style={{ color: c.navy, fontFamily: medium, fontSize: font(11) }} numberOfLines={1}>
          Leadership Consultancy
        </Text>
      </View>
    </View>
  );
}

export function FadeIn({ children }: { children: ReactNode }) {
  const opacity = useSharedValue(reduceMotion ? 1 : 0.35);
  useEffect(() => {
    opacity.value = withTiming(1, { duration: reduceMotion ? 0 : 700 });
  }, [opacity]);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={style}>{children}</Animated.View>;
}

export function richParts(input: string): { t: string; em?: boolean }[] {
  const decoded = input
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ');
  const parts: { t: string; em?: boolean }[] = [];
  const re = /<em>(.*?)<\/em>/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(decoded))) {
    if (m.index > last) parts.push({ t: decoded.slice(last, m.index) });
    parts.push({ t: m[1], em: true });
    last = m.index + m[0].length;
  }
  if (last < decoded.length) parts.push({ t: decoded.slice(last) });
  return parts.length ? parts : [{ t: decoded }];
}

export function Rich({ text, size = 17 }: { text: string; size?: number }) {
  const { c, font, body } = useTheme();
  return (
    <Text style={{ color: c.ink, fontFamily: body, fontSize: font(size), lineHeight: font(size + 9) }}>
      {richParts(text).map((p, i) => (
        <Text key={i} style={p.em ? { fontStyle: 'italic' } : undefined}>
          {p.t}
        </Text>
      ))}
    </Text>
  );
}
