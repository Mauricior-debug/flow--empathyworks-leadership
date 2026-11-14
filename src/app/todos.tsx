import { useState } from 'react';
import { fmt } from '../store/dates';
import { deleteTodo, saveTodo, toggleTodo } from '../store/logic';
import { useApp } from '../store/store';
import { Body, Button, Card, Chip, Field, H1, StackScreen } from '../components/ui';

export default function Todos() {
  const { data, user, run, set, sheet } = useApp();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reminder, setReminder] = useState(true);
  if (!user) return null;
  const mine = data.todos.filter((t) => t.userId === user.id);
  return (
    <StackScreen title="To-do list">
      <H1>To-do list</H1>
      <Body muted>A date, a time, and a reminder that shows under the bell.</Body>
      <Field label="What" value={title} onChangeText={setTitle} />
      <Field label="Date" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
      <Field label="Time" value={time} onChangeText={setTime} placeholder="09:30" />
      <Chip label={reminder ? 'Reminder on' : 'Reminder off'} on={reminder} onPress={() => setReminder(!reminder)} />
      <Button
        label="Add to-do"
        onPress={() => {
          if (run(saveTodo(data, { title, date, time, reminder }), 'Added.')) {
            setTitle('');
            setDate('');
            setTime('');
          }
        }}
      />
      {mine.map((todo) => (
        <Card key={todo.id}>
          <Body>{todo.done ? 'Done · ' : ''}{todo.title}</Body>
          <Body muted>{fmt(todo.date)}{todo.time ? ' · ' + todo.time : ''}{todo.reminder ? ' · Reminder' : ''}</Body>
          <Button label={todo.done ? 'Mark open' : 'Mark done'} kind="secondary" onPress={() => set(toggleTodo(data, todo.id))} />
          <Button
            label="Delete"
            kind="danger"
            onPress={() =>
              sheet({
                title: 'Delete this to-do?',
                confirmLabel: 'Delete',
                danger: true,
                onConfirm: () => set(deleteTodo(data, todo.id)),
              })
            }
          />
        </Card>
      ))}
    </StackScreen>
  );
}
