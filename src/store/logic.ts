import {
  BOOK_TYPES,
  DEMO_CODE,
  MOD_MSG,
  SLOTS,
  ZOOM,
  respectful,
} from '../data/content';
import { iso, monday, monthKey, uid } from './dates';
import type { AppData, Membership, Person, PlanInterval, PostKind, Result, ThemeChoice } from './types';

export function me(data: AppData): Person | null {
  return data.people.find((p) => p.id === data.sessionUserId) || null;
}

export function byId(data: AppData, id: string): Person | undefined {
  return data.people.find((p) => p.id === id);
}

export function fullName(p: Person): string {
  return (p.first + ' ' + p.last).trim();
}

export function isPlus(p: Person | null): boolean {
  if (!p) return false;
  if (p.role === 'admin') return true;
  return p.membership === 'plus';
}

export function emailOk(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function ok(data: AppData, error?: string): Result {
  return error ? { data, error } : { data };
}

function patchPerson(data: AppData, id: string, patch: Partial<Person>): AppData {
  return { ...data, people: data.people.map((p) => (p.id === id ? { ...p, ...patch } : p)) };
}

export function signInPassword(data: AppData, email: string, password: string): Result {
  const person = data.people.find((p) => p.email.toLowerCase() === email.trim().toLowerCase() && p.password);
  if (!person || person.password !== password) return ok(data, 'That email and password do not match an account on this phone.');
  return ok({ ...data, sessionUserId: person.id, pendingCodeEmail: null });
}

export function beginCode(data: AppData, email: string): Result {
  const person = data.people.find((p) => p.email.toLowerCase() === email.trim().toLowerCase() && p.password);
  if (!person) return ok(data, 'We cannot find that account on this phone.');
  return ok({ ...data, pendingCodeEmail: person.email });
}

export function signInCode(data: AppData, code: string): Result {
  const email = data.pendingCodeEmail;
  if (!email) return ok(data, 'Enter your email first.');
  if (code.trim() !== DEMO_CODE) return ok(data, 'That code is not right. On this phone the code is ' + DEMO_CODE + '.');
  const person = data.people.find((p) => p.email === email);
  if (!person) return ok(data, 'We cannot find that account on this phone.');
  return ok({ ...data, sessionUserId: person.id, pendingCodeEmail: null });
}

export function resetPassword(data: AppData, email: string, password: string, again: string): Result {
  if (password.length < 8) return ok(data, 'Use at least 8 characters.');
  if (password !== again) return ok(data, 'Those passwords do not match.');
  const person = data.people.find((p) => p.email.toLowerCase() === email.trim().toLowerCase() && p.password);
  if (!person) return ok(data, 'We cannot find that account on this phone.');
  return ok(patchPerson(data, person.id, { password }));
}

export type NewAccount = {
  first: string;
  last: string;
  email: string;
  password: string;
  org: string;
  job: string;
  phone: string;
};

export function createAccount(data: AppData, input: NewAccount): Result {
  const first = input.first.trim();
  const last = input.last.trim();
  const email = input.email.trim().toLowerCase();
  if (!first || !last) return ok(data, 'Add your first and last name.');
  if (!emailOk(email)) return ok(data, 'Enter a valid email address.');
  if (input.password.length < 8) return ok(data, 'Use at least 8 characters.');
  if (!input.org.trim() || !input.job.trim() || !input.phone.trim()) return ok(data, 'Add your organisation, job and phone.');
  if (data.people.some((p) => p.email.toLowerCase() === email)) return ok(data, 'That email already has an account on this phone.');
  const id = uid('u');
  const person: Person = {
    id,
    first,
    last,
    email,
    password: input.password,
    org: input.org.trim(),
    job: input.job.trim(),
    phone: input.phone.trim(),
    bio: '',
    linkedin: '',
    showJob: true,
    membership: 'essentials',
    interval: null,
    role: 'member',
    onboarded: false,
    coaching: false,
    orgPortal: false,
  };
  return ok({ ...data, people: [...data.people, person], sessionUserId: id });
}

export function finishOnboarding(data: AppData): AppData {
  const user = me(data);
  if (!user) return data;
  return patchPerson(data, user.id, { onboarded: true });
}

export function signOut(data: AppData): AppData {
  return { ...data, sessionUserId: null, pendingCodeEmail: null };
}

export function deleteAccount(data: AppData, typed: string): Result {
  const user = me(data);
  if (!user) return ok(data, 'Sign in first.');
  if (typed.trim() !== 'DELETE') return ok(data, 'Type DELETE to confirm.');
  const id = user.id;
  return ok({
    ...signOut(data),
    people: data.people.filter((p) => p.id !== id),
    daily: data.daily.filter((d) => d.userId !== id),
    mirrors: data.mirrors.filter((d) => d.userId !== id),
    journal: data.journal.filter((d) => d.userId !== id),
    todos: data.todos.filter((d) => d.userId !== id),
    appointments: data.appointments.filter((d) => d.userId !== id),
    bookings: data.bookings.filter((d) => d.userId !== id),
    posts: data.posts.filter((p) => p.authorId !== id).map((p) => ({
      ...p,
      likes: p.likes.filter((x) => x !== id),
      comments: p.comments.filter((c) => c.authorId !== id),
    })),
    threads: data.threads
      .map((t) => ({ ...t, memberIds: t.memberIds.filter((x) => x !== id), messages: t.messages.filter((m) => m.senderId !== id) }))
      .filter((t) => t.team || t.memberIds.length > 1),
    asks: data.asks.filter((a) => a.userId !== id),
  });
}

export function saveProfile(data: AppData, patch: Partial<Person>): Result {
  const user = me(data);
  if (!user) return ok(data, 'Sign in first.');
  if (patch.bio && !respectful(patch.bio)) return ok(data, MOD_MSG);
  if (patch.linkedin && patch.linkedin.trim() && !/^https:\/\//.test(patch.linkedin.trim())) {
    return ok(data, 'LinkedIn links start with https://');
  }
  return ok(patchPerson(data, user.id, patch));
}

export function setTheme(data: AppData, theme: ThemeChoice): AppData {
  return { ...data, theme };
}

export function setBig(data: AppData, big: boolean): AppData {
  return { ...data, big };
}

export function setPush(data: AppData, on: boolean, hideAsk = false): AppData {
  return { ...data, pushOn: on, pushAskHidden: hideAsk || data.pushAskHidden || on };
}

export function hideGetStarted(data: AppData): AppData {
  return { ...data, getStartedHidden: true };
}

export function setMembership(data: AppData, membership: Membership, interval: PlanInterval | null): Result {
  const user = me(data);
  if (!user) return ok(data, 'Sign in first.');
  return ok(patchPerson(data, user.id, { membership, interval: membership === 'plus' ? interval || 'month' : null }));
}

export function saveDaily(
  data: AppData,
  input: { mood: number; showing: string[]; line: string; note: string },
): Result {
  const user = me(data);
  if (!user) return ok(data, 'Sign in first.');
  if (!respectful(input.line + ' ' + input.note)) return ok(data, MOD_MSG);
  const date = iso();
  const row = { userId: user.id, date, ...input };
  const rest = data.daily.filter((d) => !(d.userId === user.id && d.date === date));
  return ok({ ...data, daily: [...rest, row] });
}

export function saveMirror(
  data: AppData,
  input: { answers: Record<string, number>; present: number | null; word: string; done: boolean },
): Result {
  const user = me(data);
  if (!user) return ok(data, 'Sign in first.');
  if (input.word && !respectful(input.word)) return ok(data, MOD_MSG);
  const week = monday(iso());
  const rest = data.mirrors.filter((m) => !(m.userId === user.id && m.week === week));
  return ok({ ...data, mirrors: [...rest, { userId: user.id, week, ...input }] });
}

export function saveJournal(
  data: AppData,
  input: { id?: string; body: string; mood: number | null; forSession: boolean },
): Result {
  const user = me(data);
  if (!user) return ok(data, 'Sign in first.');
  if (!input.body.trim()) return ok(data, 'Write a few words first.');
  if (!respectful(input.body)) return ok(data, MOD_MSG);
  if (input.id) {
    return ok({
      ...data,
      journal: data.journal.map((j) =>
        j.id === input.id && j.userId === user.id ? { ...j, body: input.body.trim(), mood: input.mood, forSession: input.forSession } : j,
      ),
    });
  }
  return ok({
    ...data,
    journal: [
      { id: uid('j'), userId: user.id, at: new Date().toISOString(), body: input.body.trim(), mood: input.mood, forSession: input.forSession },
      ...data.journal,
    ],
  });
}

export function deleteJournal(data: AppData, id: string): AppData {
  const user = me(data);
  if (!user) return data;
  return { ...data, journal: data.journal.filter((j) => !(j.id === id && j.userId === user.id)) };
}

export function toggleSaved(data: AppData, itemId: string): AppData {
  const user = me(data);
  if (!user) return data;
  const cur = data.saved[user.id] || [];
  const next = cur.includes(itemId) ? cur.filter((x) => x !== itemId) : [...cur, itemId];
  return { ...data, saved: { ...data.saved, [user.id]: next } };
}

export function setChallenge(data: AppData, status: 'accepted' | 'done' | 'skipped', note = ''): Result {
  const user = me(data);
  if (!user) return ok(data, 'Sign in first.');
  if (!isPlus(user)) return ok(data, 'The weekly challenge is part of Leadership Plus.');
  if (note && !respectful(note)) return ok(data, MOD_MSG);
  const week = monday(iso());
  const rest = data.challenges.filter((c) => !(c.userId === user.id && c.week === week));
  return ok({ ...data, challenges: [...rest, { userId: user.id, week, status, note }] });
}

export function saveModule(
  data: AppData,
  index: number,
  patch: { reflections?: string[]; exercise?: string; application?: string; done?: boolean },
): Result {
  const user = me(data);
  if (!user) return ok(data, 'Sign in first.');
  const text = [...(patch.reflections || []), patch.exercise || '', patch.application || ''].join(' ');
  if (text.trim() && !respectful(text)) return ok(data, MOD_MSG);
  const existing = data.academy.find((a) => a.userId === user.id && a.index === index);
  const row = {
    userId: user.id,
    index,
    reflections: patch.reflections || existing?.reflections || ['', '', ''],
    exercise: patch.exercise ?? existing?.exercise ?? '',
    application: patch.application ?? existing?.application ?? '',
    done: patch.done ?? existing?.done ?? false,
  };
  const rest = data.academy.filter((a) => !(a.userId === user.id && a.index === index));
  return ok({ ...data, academy: [...rest, row] });
}

export function saveSurvey(data: AppData, which: 'leadership' | 'culture', answers: Record<string, number>): Result {
  const user = me(data);
  if (!user) return ok(data, 'Sign in first.');
  const rest = data.surveys.filter((s) => !(s.userId === user.id && s.which === which));
  return ok({ ...data, surveys: [...rest, { userId: user.id, which, date: iso(), answers }] });
}

export function savePlanner(data: AppData, note: { issue: string; good: string; they: string; opening: string }): Result {
  const user = me(data);
  if (!user) return ok(data, 'Sign in first.');
  if (!respectful(Object.values(note).join(' '))) return ok(data, MOD_MSG);
  const rest = data.planners.filter((p) => p.userId !== user.id);
  return ok({ ...data, planners: [...rest, { userId: user.id, ...note }] });
}

export function saveTodo(
  data: AppData,
  input: { id?: string; title: string; date: string; time: string; reminder: boolean },
): Result {
  const user = me(data);
  if (!user) return ok(data, 'Sign in first.');
  if (!input.title.trim()) return ok(data, 'Add what you need to do.');
  if (!input.date) return ok(data, 'Add a date.');
  if (!respectful(input.title)) return ok(data, MOD_MSG);
  if (input.id) {
    return ok({
      ...data,
      todos: data.todos.map((t) => (t.id === input.id && t.userId === user.id ? { ...t, ...input, title: input.title.trim() } : t)),
    });
  }
  return ok({
    ...data,
    todos: [{ id: uid('td'), userId: user.id, title: input.title.trim(), date: input.date, time: input.time, reminder: input.reminder, done: false }, ...data.todos],
  });
}

export function toggleTodo(data: AppData, id: string): AppData {
  const user = me(data);
  if (!user) return data;
  return { ...data, todos: data.todos.map((t) => (t.id === id && t.userId === user.id ? { ...t, done: !t.done } : t)) };
}

export function deleteTodo(data: AppData, id: string): AppData {
  const user = me(data);
  if (!user) return data;
  return { ...data, todos: data.todos.filter((t) => !(t.id === id && t.userId === user.id)) };
}

export function bookAppointment(data: AppData, kind: string, withKey: 'steve' | 'neil', date: string, slot: string): Result {
  const user = me(data);
  if (!user) return ok(data, 'Sign in first.');
  const spec = BOOK_TYPES.find((t) => t.id === kind);
  if (!spec) return ok(data, 'Choose a type of conversation.');
  if (spec.plus && !isPlus(user)) return ok(data, 'The monthly consultation is part of Leadership Plus.');
  if (kind === 'coaching' && !user.coaching && user.role !== 'admin') return ok(data, 'Coaching check-ins are for coaching members.');
  if (kind === 'consult' && !user.orgPortal && user.role !== 'admin') return ok(data, 'Organisational consultations are for organisation members.');
  if (date <= iso() || !SLOTS.includes(slot)) return ok(data, 'Choose a free slot on a coming weekday.');
  if (parseDate(date) - parseDate(iso()) > 60 * 86400000) return ok(data, 'Choose a day in the next 60 days.');
  const taken = data.appointments.some((a) => a.withKey === withKey && a.date === date && a.slot === slot && a.status === 'confirmed');
  if (taken) return ok(data, 'That time has just been taken.');
  if (kind === 'monthly') {
    const mine = data.appointments.some(
      (a) => a.userId === user.id && a.kind === 'monthly' && a.status === 'confirmed' && monthKey(a.date) === monthKey(date),
    );
    if (mine) return ok(data, 'You already have a monthly consultation this calendar month.');
  }
  const row = {
    id: uid('ap'),
    userId: user.id,
    kind,
    withKey,
    date,
    slot,
    status: 'confirmed' as const,
    zoom: ZOOM,
  };
  return ok({ ...data, appointments: [...data.appointments, row] });
}

function parseDate(s: string) {
  return new Date(s.slice(0, 10) + 'T12:00:00').getTime();
}

export function cancelAppointment(data: AppData, id: string): AppData {
  const user = me(data);
  if (!user) return data;
  return {
    ...data,
    appointments: data.appointments.map((a) => (a.id === id && (a.userId === user.id || user.role === 'admin') ? { ...a, status: 'cancelled' } : a)),
  };
}

export function bookWorkshop(data: AppData, workshopId: string, practice: boolean): Result {
  const user = me(data);
  if (!user) return ok(data, 'Sign in first.');
  const ws = data.workshops.find((w) => w.id === workshopId);
  if (!ws) return ok(data, 'That workshop is no longer listed.');
  const active = data.bookings.filter((b) => b.workshopId === workshopId && b.status === 'booked');
  if (active.length >= ws.places) return ok(data, 'This workshop is full.');
  if (data.bookings.some((b) => b.userId === user.id && b.workshopId === workshopId && b.status === 'booked')) {
    return ok(data, 'You are already booked.');
  }
  if (isPlus(user)) {
    const sameMonth = data.bookings.some((b) => {
      if (b.userId !== user.id || b.status !== 'booked') return false;
      const other = data.workshops.find((w) => w.id === b.workshopId);
      return other && monthKey(other.date) === monthKey(ws.date);
    });
    if (sameMonth) return ok(data, 'Leadership Plus includes one workshop in each calendar month.');
  } else if (!practice) {
    return ok(data, 'Essentials books this workshop for £35. Confirm the practice booking.');
  }
  return ok({
    ...data,
    bookings: [...data.bookings, { id: uid('bk'), userId: user.id, workshopId, status: 'booked', practice: !isPlus(user) }],
  });
}

export function cancelBooking(data: AppData, workshopId: string): AppData {
  const user = me(data);
  if (!user) return data;
  return {
    ...data,
    bookings: data.bookings.map((b) => (b.userId === user.id && b.workshopId === workshopId ? { ...b, status: 'cancelled' } : b)),
  };
}

export function requestWorkshop(data: AppData, topic: string, when: string, notes: string): Result {
  const user = me(data);
  if (!user) return ok(data, 'Sign in first.');
  if (!topic.trim()) return ok(data, 'Say what the workshop is about.');
  if (!respectful(topic + notes)) return ok(data, MOD_MSG);
  return ok({
    ...data,
    requests: [{ id: uid('rq'), userId: user.id, topic: topic.trim(), when: when.trim(), notes: notes.trim(), at: new Date().toISOString() }, ...data.requests],
  });
}

export function addPost(data: AppData, kind: PostKind, body: string, image?: Post['image']): Result {
  const user = me(data);
  if (!user) return ok(data, 'Sign in first.');
  if (!isPlus(user)) return ok(data, 'The community is part of Leadership Plus.');
  if (!body.trim()) return ok(data, 'Write something first.');
  if (!respectful(body)) return ok(data, MOD_MSG);
  const post: import('./types').Post = {
    id: uid('p'),
    authorId: user.id,
    kind,
    body: body.trim(),
    image,
    at: new Date().toISOString(),
    likes: [],
    comments: [],
  };
  return ok({ ...data, posts: [post, ...data.posts] });
}

type Post = import('./types').Post;

export function toggleLike(data: AppData, postId: string): AppData {
  const user = me(data);
  if (!user) return data;
  return {
    ...data,
    posts: data.posts.map((p) => {
      if (p.id !== postId) return p;
      const likes = p.likes.includes(user.id) ? p.likes.filter((id) => id !== user.id) : [...p.likes, user.id];
      return { ...p, likes };
    }),
  };
}

export function addComment(data: AppData, postId: string, body: string): Result {
  const user = me(data);
  if (!user) return ok(data, 'Sign in first.');
  if (!isPlus(user)) return ok(data, 'Commenting is part of Leadership Plus.');
  if (!body.trim()) return ok(data, 'Write a comment first.');
  if (!respectful(body)) return ok(data, MOD_MSG);
  return ok({
    ...data,
    posts: data.posts.map((p) =>
      p.id === postId
        ? { ...p, comments: [...p.comments, { id: uid('c'), authorId: user.id, body: body.trim(), at: new Date().toISOString(), likes: [] }] }
        : p,
    ),
  });
}

export function appreciateComment(data: AppData, postId: string, commentId: string): AppData {
  const user = me(data);
  if (!user) return data;
  return {
    ...data,
    posts: data.posts.map((p) =>
      p.id !== postId
        ? p
        : {
            ...p,
            comments: p.comments.map((c) => {
              if (c.id !== commentId) return c;
              const likes = c.likes.includes(user.id) ? c.likes.filter((id) => id !== user.id) : [...c.likes, user.id];
              return { ...c, likes };
            }),
          },
    ),
  };
}

export function report(data: AppData, target: string, reason: string): Result {
  const user = me(data);
  if (!user) return ok(data, 'Sign in first.');
  return ok({ ...data, reports: [{ id: uid('rp'), reporterId: user.id, target, reason, at: new Date().toISOString() }, ...data.reports] });
}

export function blockPerson(data: AppData, blockedId: string): AppData {
  const user = me(data);
  if (!user || user.id === blockedId) return data;
  if (data.blocks.some((b) => b.blockerId === user.id && b.blockedId === blockedId)) return data;
  return { ...data, blocks: [...data.blocks, { blockerId: user.id, blockedId }] };
}

export function unblock(data: AppData, blockedId: string): AppData {
  const user = me(data);
  if (!user) return data;
  return { ...data, blocks: data.blocks.filter((b) => !(b.blockerId === user.id && b.blockedId === blockedId)) };
}

export function sendMessage(data: AppData, threadId: string, body: string): Result {
  const user = me(data);
  if (!user) return ok(data, 'Sign in first.');
  const thread = data.threads.find((t) => t.id === threadId);
  if (!thread) return ok(data, 'That conversation is not on this phone.');
  if (!thread.team && !isPlus(user) && user.role !== 'admin') return ok(data, 'Messages with members are part of Leadership Plus.');
  if (!body.trim()) return ok(data, 'Write a message first.');
  if (!respectful(body)) return ok(data, MOD_MSG);
  return ok({
    ...data,
    threads: data.threads.map((t) =>
      t.id === threadId ? { ...t, messages: [...t.messages, { id: uid('m'), senderId: user.id, body: body.trim(), at: new Date().toISOString() }] } : t,
    ),
  });
}

export function openMemberThread(data: AppData, otherId: string): Result {
  const user = me(data);
  if (!user) return ok(data, 'Sign in first.');
  if (!isPlus(user)) return ok(data, 'Messages with members are part of Leadership Plus.');
  const other = byId(data, otherId);
  if (!other) return ok(data, 'That member is not on this phone.');
  const existing = data.threads.find((t) => !t.team && t.memberIds.includes(user.id) && t.memberIds.includes(otherId));
  if (existing) return ok(data);
  const thread = {
    id: uid('th'),
    title: fullName(other),
    memberIds: [user.id, otherId],
    team: false,
    messages: [],
  };
  return ok({ ...data, threads: [thread, ...data.threads] });
}

export function askConsultant(data: AppData, question: string): Result {
  const user = me(data);
  if (!user) return ok(data, 'Sign in first.');
  if (!isPlus(user)) return ok(data, 'A question to a consultant is part of Leadership Plus.');
  if (!question.trim()) return ok(data, 'Write your question.');
  if (!respectful(question)) return ok(data, MOD_MSG);
  const week = monday(iso());
  const already = data.asks.some((a) => a.userId === user.id && monday(a.askedAt.slice(0, 10)) === week);
  if (already) return ok(data, 'You have already asked your question for this week.');
  const id = uid('ask');
  const asked: import('./types').Ask = {
    id,
    userId: user.id,
    question: question.trim(),
    askedAt: new Date().toISOString(),
    answer: null,
    answeredAt: null,
    from: 'Steve Robertson',
  };
  return ok({ ...data, asks: [asked, ...data.asks] });
}

export function answerAsk(data: AppData, id: string, answer: string): Result {
  if (!answer.trim()) return ok(data, 'Write an answer.');
  if (!respectful(answer)) return ok(data, MOD_MSG);
  return ok({
    ...data,
    asks: data.asks.map((a) => (a.id === id ? { ...a, answer: answer.trim(), answeredAt: new Date().toISOString(), from: 'Steve Robertson' } : a)),
  });
}

export function saveBlueprint(data: AppData, note: { leader: string; behaviours: string; help: string }): Result {
  const user = me(data);
  if (!user) return ok(data, 'Sign in first.');
  if (!respectful(Object.values(note).join(' '))) return ok(data, MOD_MSG);
  const rest = data.blueprints.filter((b) => b.userId !== user.id);
  return ok({ ...data, blueprints: [...rest, { userId: user.id, ...note }] });
}

export function setObjectiveProgress(data: AppData, id: string, progress: number): AppData {
  return { ...data, objectives: data.objectives.map((o) => (o.id === id ? { ...o, progress } : o)) };
}

export function setAction(data: AppData, id: string, patch: { done?: boolean; checkIn?: string }): Result {
  if (patch.checkIn && !respectful(patch.checkIn)) return ok(data, MOD_MSG);
  return ok({ ...data, actions: data.actions.map((a) => (a.id === id ? { ...a, ...patch } : a)) });
}

export function sendFeedback(data: AppData, body: string): Result {
  const user = me(data);
  if (!user) return ok(data, 'Sign in first.');
  if (!body.trim()) return ok(data, 'Write a few words first.');
  if (!respectful(body)) return ok(data, MOD_MSG);
  return ok({ ...data, feedback: [{ id: uid('fb'), userId: user.id, body: body.trim(), at: new Date().toISOString() }, ...data.feedback] });
}

export function sendContact(data: AppData, name: string, email: string, message: string): Result {
  if (!name.trim() || !emailOk(email) || !message.trim()) return ok(data, 'Add your name, a valid email and a message.');
  if (!respectful(message)) return ok(data, MOD_MSG);
  return ok({
    ...data,
    contacts: [{ id: uid('ct'), name: name.trim(), email: email.trim(), message: message.trim(), at: new Date().toISOString() }, ...data.contacts],
  });
}

export function markRead(data: AppData, id: string): AppData {
  const user = me(data);
  if (!user) return data;
  const cur = data.reads[user.id] || [];
  if (cur.includes(id)) return data;
  return { ...data, reads: { ...data.reads, [user.id]: [...cur, id] } };
}

export function markAllRead(data: AppData): AppData {
  const user = me(data);
  if (!user) return data;
  const ids = visibleNotices(data, user.id).map((n) => n.id);
  return { ...data, reads: { ...data.reads, [user.id]: ids } };
}

export function visibleNotices(data: AppData, userId: string) {
  return data.notices
    .filter((n) => n.userId === 'all' || n.userId === userId)
    .slice()
    .sort((a, b) => (a.at < b.at ? 1 : -1));
}

export function unreadCount(data: AppData, userId: string): number {
  const read = new Set(data.reads[userId] || []);
  return visibleNotices(data, userId).filter((n) => !read.has(n.id)).length;
}

export function communityBadge(data: AppData, userId: string): number {
  const seen = data.communitySeen[userId];
  const blocked = new Set(data.blocks.filter((b) => b.blockerId === userId).map((b) => b.blockedId));
  return data.posts.filter((p) => p.authorId !== userId && !blocked.has(p.authorId) && (!seen || p.at > seen)).length;
}

export function seeCommunity(data: AppData): AppData {
  const user = me(data);
  if (!user) return data;
  return { ...data, communitySeen: { ...data.communitySeen, [user.id]: new Date().toISOString() } };
}

export function announce(data: AppData, title: string, body: string): Result {
  const user = me(data);
  if (!user || user.role !== 'admin') return ok(data, 'Only the team demo can post an announcement.');
  if (!title.trim() || !body.trim()) return ok(data, 'Add a title and a message.');
  if (!respectful(title + body)) return ok(data, MOD_MSG);
  const id = uid('n');
  return ok({
    ...data,
    announcements: [{ id: uid('an'), title: title.trim(), body: body.trim(), at: new Date().toISOString() }, ...data.announcements],
    notices: [{ id, userId: 'all', title: title.trim(), body: body.trim(), at: new Date().toISOString(), href: '/notifications' }, ...data.notices],
  });
}

export function setArticlePublished(data: AppData, id: string, published: boolean): AppData {
  return { ...data, articlePublished: { ...data.articlePublished, [id]: published } };
}

export function adminMembership(data: AppData, personId: string, membership: Membership): AppData {
  const user = me(data);
  if (!user || user.role !== 'admin') return data;
  return patchPerson(data, personId, { membership, interval: membership === 'plus' ? 'month' : null });
}

export function setPrefs(data: AppData, prefs: AppData['prefs'][string]): AppData {
  const user = me(data);
  if (!user) return data;
  return { ...data, prefs: { ...data.prefs, [user.id]: prefs } };
}

export function threadFor(data: AppData, otherId: string): string | undefined {
  const user = me(data);
  if (!user) return;
  return data.threads.find((t) => !t.team && t.memberIds.includes(user.id) && t.memberIds.includes(otherId))?.id;
}

export function freeSlots(data: AppData, withKey: 'steve' | 'neil', date: string): string[] {
  if (date <= iso()) return [];
  const day = new Date(date + 'T12:00:00').getDay();
  if (day === 0 || day === 6) return [];
  if (parseDate(date) - parseDate(iso()) > 60 * 86400000) return [];
  const taken = new Set(
    data.appointments.filter((a) => a.withKey === withKey && a.date === date && a.status === 'confirmed').map((a) => a.slot),
  );
  return SLOTS.filter((s) => !taken.has(s));
}

export function upcomingWorkshops(data: AppData, today = iso()) {
  return data.workshops.filter((w) => w.date >= today).sort((a, b) => (a.date < b.date ? -1 : 1));
}
