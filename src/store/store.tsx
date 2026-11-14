import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/Theme';
import { seed } from './seed';
import * as L from './logic';
import type { AppData, Membership, Person, PlanInterval, PostKind, ThemeChoice } from './types';

const KEY = 'empathyworks-phone-v1';

type Sheet = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm?: () => void;
};

type Api = {
  ready: boolean;
  data: AppData;
  user: Person | null;
  toast: (message: string) => void;
  sheet: (sheet: Sheet) => void;
  closeSheet: () => void;
  run: (result: { data: AppData; error?: string }, success?: string) => boolean;
  set: (next: AppData | ((current: AppData) => AppData)) => void;
};

const Ctx = createContext<Api | null>(null);

type Chrome = {
  toastMsg: string | null;
  sheet: Sheet | null;
  closeSheet: () => void;
};

const ChromeCtx = createContext<Chrome | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [sheet, setSheet] = useState<Sheet | null>(null);

  useEffect(() => {
    let live = true;
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!live) return;
        if (!raw) {
          setData(seed());
          return;
        }
        try {
          const parsed = JSON.parse(raw) as AppData;
          if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.people)) setData(seed());
          else setData(parsed);
        } catch {
          setData(seed());
        }
      })
      .catch(() => setData(seed()));
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (!data) return;
    AsyncStorage.setItem(KEY, JSON.stringify(data)).catch(() => {});
  }, [data]);

  const toast = useCallback((message: string) => {
    setToastMsg(message);
  }, []);

  const set = useCallback((next: AppData | ((current: AppData) => AppData)) => {
    setData((current) => {
      const base = current ?? seed();
      return typeof next === 'function' ? next(base) : next;
    });
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 2800);
    return () => clearTimeout(t);
  }, [toastMsg]);

  const api = useMemo<Api>(() => {
    const current = data || seed();
    return {
      ready: !!data,
      data: current,
      user: data ? L.me(data) : null,
      toast,
      sheet: setSheet,
      closeSheet: () => setSheet(null),
      set,
      run: (result, success) => {
        setData(result.data);
        if (result.error) {
          toast(result.error);
          return false;
        }
        if (success) toast(success);
        return true;
      },
    };
  }, [data, toast, set]);

  const chrome = useMemo<Chrome>(
    () => ({ toastMsg, sheet, closeSheet: () => setSheet(null) }),
    [toastMsg, sheet],
  );

  return (
    <Ctx.Provider value={api}>
      <ChromeCtx.Provider value={chrome}>{children}</ChromeCtx.Provider>
    </Ctx.Provider>
  );
}

export function AppChrome() {
  const chrome = useContext(ChromeCtx);
  if (!chrome) return null;
  return (
    <>
      <Toast message={chrome.toastMsg} />
      <SheetView sheet={chrome.sheet} onClose={chrome.closeSheet} />
    </>
  );
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('Store missing');
  return v;
}

function Toast({ message }: { message: string | null }) {
  const insets = useSafeAreaInsets();
  const { c, font, medium } = useTheme();
  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withTiming(message ? 1 : 0, { duration: 180 });
  }, [message, opacity]);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  if (!message) return null;
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: 16,
          right: 16,
          top: insets.top + 8,
          backgroundColor: c.ink,
          borderRadius: 14,
          paddingHorizontal: 16,
          paddingVertical: 14,
          zIndex: 50,
        },
        style,
      ]}
    >
      <Text style={{ color: c.page, fontFamily: medium, fontSize: font(15), lineHeight: font(21) }}>{message}</Text>
    </Animated.View>
  );
}

function SheetView({ sheet, onClose }: { sheet: Sheet | null; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const { c, font, display, body, semibold } = useTheme();
  const y = useSharedValue(40);
  useEffect(() => {
    y.value = sheet ? withSpring(0, { damping: 20, stiffness: 240 }) : 40;
  }, [sheet, y]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  if (!sheet) return null;
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40, justifyContent: 'flex-end' }}>
      <Pressable accessibilityLabel="Close" onPress={onClose} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(12,16,24,0.46)' }} />
      <Animated.View
        style={[
          {
            backgroundColor: c.card,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            paddingBottom: insets.bottom + 16,
            gap: 12,
          },
          style,
        ]}
      >
        <View style={{ alignSelf: 'center', width: 40, height: 4, borderRadius: 4, backgroundColor: c.line }} />
        <Text style={{ color: c.ink, fontFamily: display, fontSize: font(26), lineHeight: font(32) }}>{sheet.title}</Text>
        {sheet.message ? (
          <ScrollView style={{ maxHeight: 320 }} keyboardShouldPersistTaps="handled">
            <Text style={{ color: c.muted, fontFamily: body, fontSize: font(16), lineHeight: font(23) }}>{sheet.message}</Text>
          </ScrollView>
        ) : null}
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            sheet.onConfirm?.();
            onClose();
          }}
          style={{
            minHeight: 52,
            borderRadius: 14,
            backgroundColor: sheet.danger ? c.bad : c.spruce,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: sheet.danger ? '#fff' : c.spruceInk, fontFamily: semibold, fontSize: font(17) }}>{sheet.confirmLabel || 'Continue'}</Text>
        </Pressable>
        {sheet.cancelLabel === '' ? null : (
          <Pressable accessibilityRole="button" onPress={onClose} style={{ minHeight: 48, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: c.ink, fontFamily: semibold, fontSize: font(16) }}>{sheet.cancelLabel || 'Not now'}</Text>
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}

export function usePlus() {
  const { user } = useApp();
  return L.isPlus(user);
}

export function replyFor(question: string) {
  return (
    'Thank you for trusting us with this. You asked: “' +
    question.trim() +
    '”. Name the standard in one sentence, stay curious about what the other person is carrying, and decide your opening line before you walk in. Compassion and accountability belong in the same conversation. If it would help, bring the line to your next call.'
  );
}

export type { Membership, PlanInterval, PostKind, ThemeChoice };
